const path = require('path')

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

async function detectFaces(imagePath) {
  const result = [];
  const verifyPath = path.join(__dirname, '../py/verify.py')
  const cmd = 'python3 ' + verifyPath + ' ' + imagePath;
  console.log(cmd)
  const regex = /\s*0|1|2\s*/;

  try {
    const stdout = await execShellCommand(cmd);
    stdout.match(regex).forEach(val => {
      result.push(parseInt(val))
    })
    return result;
  } catch (e) {
    throw new Error(e);
  }
}

async function matchFaceAgainst(testImagePath, knownImagePath, admissionNumber) {
  const result = [];
  const recogPath = path.join(__dirname, '../py/recog.py')
  const sheetPath = path.join(__dirname, '..', 'temp/csv', 'sheet.csv')
  const cmd = 'python3  '
    + recogPath + ' '
    + knownImagePath + ' '
    + testImagePath + ' '
    + sheetPath + ' '
    + admissionNumber
  const regex = /\s*0|1\s*/;
  try {
    const stdout = await execShellCommand(cmd);
    stdout.match(regex).forEach(val => {
      result.push(parseInt(val));
    })
    return result;
  } catch (e) {
    throw new Error(e);
  }
}

async function recogniseFace(testImagePath, admissionNumber) {
  const knownFaces = [
    '8667.jpg', '5667.jpg', '4562.jpg', '9411.jpg',
    '1001.jpg', '8555.jpg', '4235.jpg',
  ]
  let i = 0
  while (i < knownFaces.length
    && !matchFaceAgainst(
      testImagePath,
      path.join(__dirname, '../temp/faces', knownFaces[i]), admissionNumber)[0]) {
    i++;
  }
  return i >= knownFaces.length ? 0 : 1;

}

module.exports = {
  execShellCommand, detectFaces, recogniseFace, matchFaceAgainst
}
