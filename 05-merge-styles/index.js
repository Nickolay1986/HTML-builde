const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;
const stylesPath = path.join(__dirname, 'styles');
const absolutePath = path.join(__dirname, 'project-dist/bundle.css');
const out = fs.createWriteStream(absolutePath);

(async function () {
  try {
    const files = await fsPromises.readdir(stylesPath);
    for (const file of files) {
      const filePath = path.join(stylesPath, file);
      const fileName = path.basename(filePath);
      const fileExt = path.extname(filePath);
      if (fileExt === '.css') {
        const input = fs.createReadStream(path.join(stylesPath, fileName));
        input.on('data', (data) => {
          out.write(data.toString() + '\n');
        });
      }
    }
  } catch (err) {
    throw new Error(`Error: ${err.message}`);
  }
})();
