const fs = require('fs');
const path = require('path');
const { stdout } = require('process');

const readTextFromFile = (filePath) => {
  const readStream = fs.createReadStream(filePath, 'utf-8');

  readStream.on('data', (chunk) => {
    stdout.write(chunk);
  });

  return new Promise((resolve, reject) => {
    readStream.on('end', () => {
      resolve();
    });

    readStream.on('error', (error) => {
      console.error('Failed to read file:', error);
      reject(error);
    });
  });
};

const main = async () => {
  const absolutePath = path.join(__dirname, 'text.txt');
  stdout.write('Hello! Reading the text...\n');
  await readTextFromFile(absolutePath);
};

main().catch((error) => {
  console.error('An error occurred:', error);
  process.exit(1);
});
