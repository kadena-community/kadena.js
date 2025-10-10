# Concept of project management for Pact projects

Inspired by npm package- and tsconfig project-management.

A `pact-project.json` needs to be in every package.

> When that doesn't exist, it can be made by a depending project. It'll then
> include a "source" property that points to the source files.

The `pact-project.json` has properties that'll describe the project:

- `name` (optional): is used to reference the project, or show in logs or error
  messages
- `description` (optional): description of the contents of the pact project
- `dependencies` (optional): an list of dependencies that need to be made
  available for the project to work properly
- `dependencyTree`: an list of objects that define a smart contract and its
  dependencies (recursively through `dependencies`)
  - `path`: the path to the contract that needs to be available for the
    depending project to work
  - `dependencies`: a list of object that define this contracts' dependencies.

# How should this be used

A tool can interpret the `pact-project.json` to do various tasks

## `kadena project`

- `install` make dependencies available through downloading or other mechanism
- `verify` verify that all dependencies are available
- `deploy` will check whether the target network has the contracts available,
  and deploys them where needed (new or upgrade deployment)

# Example files

There are 3 files in this project

- [`./pact-project.json`](./pact-project.json) an example of a project config
- [`./chainweb-pact-project.json`](./chainweb-pact-project.json) an example of
  what a project file could look like when the target project has no
  `pact-project.json`
- [`structure.graphql`](./structure.graphql) a formalized description of the
  contents of a `pact-project.json`
