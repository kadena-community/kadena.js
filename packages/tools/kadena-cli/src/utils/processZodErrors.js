export function processZodErrors(program, e, args) {
    program.error(`${e.errors
        .map((err) => {
        if (err.code === 'invalid_type') {
            return `${err.message} (${err.expected} was ${err.received})`;
        }
        return err.message;
    })
        .reduce((a, b) => `${a}\n${b}`)}\nReceived arguments ${JSON.stringify(args)}\n${program.helpInformation(e)}`);
}
