import { generateCommand } from './generate/index.js';
const SUBCOMMAND_ROOT = 'typescript';
export function typescriptCommandFactory(program, version) {
    const typescriptProgram = program
        .command(SUBCOMMAND_ROOT)
        .description(`Tool to generate and manage typescript definitions`);
    generateCommand(typescriptProgram, version);
}
