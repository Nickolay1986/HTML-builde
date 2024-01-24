const fs = require('fs').promises;
const path = require('path');
const { stdout } = require('process');

const readTextFromFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    stdout.write(data);
  } catch (error) {
    console.error('Failed to read file:', error);
    process.exit(1);
  }
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