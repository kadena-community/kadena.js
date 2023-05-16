// the default zx log uses stderr for write output of commands, even for commands that do not generate errors or warnings.
// This can cause Rush to treat everything as a warning message. This function changes this behavior.

const customLog = (entry) => {
  switch (entry.kind) {
    case 'stderr':
      log(entry);
      break;
    case 'cmd':
      console.log(entry.cmd);
      break;
    default:
      if (entry.data) {
        process.stdout.write(entry.data);
      }
  }
};

export default customLog;
