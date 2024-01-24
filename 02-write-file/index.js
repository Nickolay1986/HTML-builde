const fs = require('fs').promises;
const path = require('path');
const { stdin, stdout } = require('process');

const absolutePath = path.join(__dirname, 'text.txt');

const writeTextToFile = async (filePath, text) => {
  try {
    await fs.appendFile(filePath, text);
  } catch (error) {
    console.error('Failed to write to file:', error);
    process.exit(1);
  }
};

const handleInput = async (data) => {
  const input = data.toString().trim();
  if (input === 'exit') {
    stdout.write('\nGoodbye! Have a nice day!\n');
    process.exit(0);
  } else {
    await writeTextToFile(absolutePath, input + '\n');
  }
};

const main = async () => {
  const fileExists = await fs
    .access(absolutePath)
    .then(() => true)
    .catch(() => false);
  if (fileExists) {
    await fs.unlink(absolutePath);
  }

  try {
    await fs.writeFile(absolutePath, '');
  } catch (error) {
    console.error('Failed to create file:', error);
    process.exit(1);
  }

  stdout.write('Hello! Enter the text...\n');
  stdin.setEncoding('utf-8');
  stdin.on('data', handleInput);
};

process.on('SIGINT', () => {
  stdout.write('\nGoodbye! Have a nice day!\n');
  process.exit(0);
});

main().catch((error) => {
  console.error('An error occurred:', error);
  process.exit(1);
});
