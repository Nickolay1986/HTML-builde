const fs = require('fs').promises;
const path = require('path');

const readSecretFiles = async () => {
  try {
    const folderPath = path.join(__dirname, 'secret-folder');
    const results = await fs.readdir(folderPath, { withFileTypes: true });

    for (const result of results) {
      if (!result.isDirectory()) {
        const filePath = path.join(folderPath, result.name);
        const fileName = path.basename(filePath);
        const fileExt = path.extname(filePath);

        const fileStat = await fs.stat(filePath);
        const fileSize = Math.ceil(fileStat.size / 1024);

        console.log(`${fileName.replace(fileExt, '')} - ${fileExt.replace('.', '')} - ${fileSize}kb`);
      }
    }
  } catch (error) {
    console.error('Error reading secret files:', error);
    process.exit(1);
  }
};

readSecretFiles().catch((error) => {
  console.error('An error occurred:', error);
  process.exit(1);
});
