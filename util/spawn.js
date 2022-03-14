const { spawn: _spawn } = require("child_process");

async function spawn(command, args, { onCreate, ...options } = {}) {
  return new Promise((resolve) => {
    const stdout = [];
    const stderr = [];
    const childProcess = _spawn(command, args, options);

    if (onCreate) onCreate(childProcess);

    childProcess.stdout.on("data", (data) => stdout.push(data));
    childProcess.stderr.on("data", (data) => stderr.push(data));
    childProcess.on("close", (code) => resolve({ code, stdout, stderr }));
  });
}

spawn.pipe = (childProcess) => {
  childProcess.stdout.pipe(process.stdout);
  childProcess.stderr.pipe(process.stderr);
};

module.exports = spawn;
