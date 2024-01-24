const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;
const copyFile = fsPromises.copyFile;

(async function copyDirectory() {
  try {
    const targetDir = path.join(__dirname, 'files-copy');

    try {
      await fsPromises.access(targetDir);
      await fsPromises.rm(targetDir, { recursive: true });
    } catch (err) {
      console.log('directory <files-copy> was created\n');
    }

    await fsPromises.mkdir(targetDir, {
      recursive: true,
    });
    // console.log('folder created');

    const files = await fsPromises.readdir(path.join(__dirname, 'files'));
    for (const file of files) {
      const filePath = path.join(__dirname, 'files', file);
      await copyFile(filePath, path.join(targetDir, file));
      console.log(`file ${file} was copied to <files-copy>`);
    }
  } catch (err) {
    throw new Error(`Error: ${err.message}`);
  }
})();
