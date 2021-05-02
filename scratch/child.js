function execShellCommand(cmd) {
  const exec = require("child_process").exec;
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(new Error("Something happened: \n" + stderr));
      } else {
        resolve(stdout);
      }
    });
  });
}

execShellCommand('python3 /mnt/d/Repos/classplus/py/verify.py /mnt/d/Repos/classplus/temp/image-1619944581933-211393586.jpeg').then(res => console.log(res))
