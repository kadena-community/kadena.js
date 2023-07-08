import { Box, Text, useApp, useFocusManager, useInput } from 'ink';
import React, { useEffect, useReducer, useState } from 'react';
import { deployPackage } from './deploy-package.js';
import { Input } from './Input.js';
import { Toggle, ToggleBoolean } from './Toggle.js';
import type { AppState, Project } from './types.js';

const projectReducer = (state: Project, action: Partial<Project>) => ({
  ...state,
  ...action,
});

const G = (props: React.PropsWithChildren) => <Text color="green" {...props} />;
const R = (props: React.PropsWithChildren) => <Text color="red" {...props} />;

export default function App({ defaults }: { defaults: Project }): JSX.Element {
  const { exit } = useApp();
  const { focusNext, focusPrevious } = useFocusManager();
  const [state, setState] = useState<AppState>('editing');
  const [project, set] = useReducer(projectReducer, defaults);

  useInput((input, key) => {
    if (key.upArrow) focusPrevious();
    if (key.downArrow) focusNext();
    if (key.escape) setState('canceled');
    if (key.return) {
      if (project.name === defaults.name) {
        setState('canceled');
      } else {
        setState('deploying');
        deployPackage(project).then(() => setState('done'));
      }
    }
  });

  useEffect(() => {
    const name = project.name.replace(/.*\//, '');
    set({ dir: project.dir.replace(/\/[^/]*$/, '/' + name) }); // Set dir based on package name
  }, [project.name]);

  useEffect(() => {
    const type = project.type.replace(/s?$/, 's');
    const dir = project.dir.replace(/(libs|tools)/, type);
    set({ dir });
  }, [project.type]);

  useEffect(() => {
    if (state === 'done' || state === 'canceled') exit();
  }, [state, project]);

  switch (state) {
    case 'canceled':
      return (
        <Text>
          <R>✕</R> Canceled.
        </Text>
      );
    case 'done':
      return (
        <Box flexDirection="column">
          <Text>
            <G>✔</G> Deployed <G>{project.name}</G> to <G>{project.dir}</G>
          </Text>
          <Text>
            <G>✔</G> Added to rush.json, please sort and format `projects`
          </Text>
        </Box>
      );
    default:
      return (
        <Box flexDirection="column">
          <Box flexDirection="column" borderStyle="single">
            <Box>
              <Box width={20}>
                <Text>Type</Text>
              </Box>
              <Box>
                <Toggle
                  autoFocus={true}
                  value={project.type}
                  values={['lib', 'tool']}
                  onChange={(type) => set({ type })}
                />
              </Box>
            </Box>

            <Box>
              <Box width={20}>
                <Text>Name</Text>
              </Box>
              <Box>
                <Input
                  value={project.name}
                  onChange={(name) => set({ name })}
                ></Input>
              </Box>
            </Box>

            <Box>
              <Box width={20}>
                <Text>Directory</Text>
              </Box>
              <Box>
                <Input
                  value={project.dir}
                  onChange={(dir) => set({ dir })}
                ></Input>
              </Box>
            </Box>

            <Box>
              <Box width={20}>
                <Text>Description</Text>
              </Box>
              <Box>
                <Input
                  value={project.description}
                  onChange={(description) => set({ description })}
                ></Input>
              </Box>
            </Box>

            <Box>
              <Box width={20}>
                <Text>Should publish?</Text>
              </Box>
              <Box>
                <ToggleBoolean
                  value={project.shouldPublish}
                  onChange={(shouldPublish) => set({ shouldPublish })}
                />
              </Box>
            </Box>
          </Box>

          <Box>
            <Text italic>
              [Tab] or ↑↓: switch fields, [space] or ←→: toggle values, ⏎:
              confirm & deploy new package
            </Text>
          </Box>
        </Box>
      );
  }
}
