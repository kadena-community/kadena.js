import { projectPrefix } from '../constants/config.js';
import { capitalizeFirstLetter, getExistingProjects, isAlphanumeric, } from '../utils/helpers.js';
import { input, select } from '@inquirer/prompts';
// import { configQuestions } from './configQuestions.js';
// interface IProjectNameQuestion
//   extends Pick<IQuestion<TConfigOptions>, 'key' | 'prompt'> {}
// Filter the question objects where key is 'projectName'
// export const projectNameQuestion: IProjectNameQuestion[] =
//   configQuestions.filter((question) => question.key === 'projectName');
export async function askForProject() {
    const existingProjects = getExistingProjects();
    existingProjects
        .filter((v, i, a) => a.findIndex((v2) => v2.name === v.name) === i)
        .map((project) => {
        return {
            value: project.value,
            name: capitalizeFirstLetter(project.value),
        };
    });
    const projectChoice = await select({
        message: 'Select an existing network or create a new one:',
        choices: [
            ...existingProjects,
            { value: 'CREATE_NEW', name: `Don't pick from list` },
        ],
    });
    if (projectChoice === 'CREATE_NEW') {
        const projectName = await input({
            validate: function (input) {
                if (input === '') {
                    return 'Projectname cannot be empty! Please enter a projectname.';
                }
                if (!isAlphanumeric(input)) {
                    return 'Project name must be alphanumeric! Please enter a valid projectname.';
                }
                return true;
            },
            message: `Enter your project name to display (without ${projectPrefix} prefix):`,
        });
        return projectName.toLowerCase();
    }
    return projectChoice.toLowerCase();
}
export const projectNameQuestions = [
    {
        key: 'projectName',
        prompt: async () => await askForProject(),
    },
];
