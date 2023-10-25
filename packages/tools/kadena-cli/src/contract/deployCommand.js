export function deployCommand(program, version) {
    program
        .command('deploy')
        .option('-n, --network <network>')
        .option('-f, --file <file>')
        .action((args) => {
        console.log(args);
    });
}
