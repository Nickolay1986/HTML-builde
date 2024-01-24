const fsPromises = require('fs/promises');
const path = require('path');

const { mkdir, rm, readdir, copyFile, readFile, writeFile } = fsPromises;
const { join, extname } = path;

const options = {
  output: join(__dirname, 'project-dist'),
  html: {
    template: join(__dirname, 'template.html'),
    components: join(__dirname, 'components'),
    output: join(__dirname, 'project-dist', 'index.html'),
  },
  assets: {
    src: join(__dirname, 'assets'),
    output: join(__dirname, 'project-dist', 'assets'),
  },
  styles: {
    src: join(__dirname, 'styles'),
    output: join(__dirname, 'project-dist', 'style.css'),
  },
};

(async () => {
  await createDirectory(options.output);
  await copyDirectory(options.assets.src, options.assets.output);
  await bundleStyles(options.styles.src, options.styles.output);
  await bundleHTML(
    options.html.template,
    options.html.components,
    options.html.output,
  );
})();

async function bundleHTML(templatePath, componentsPath, outputPath) {
  let template = await readFile(templatePath, 'utf-8');
  const components = [
    ...template.matchAll(/\{\{\s*(?<name>[a-zA-Z]+)\s*\}\}/g),
  ].map(async (match) => {
    return {
      placeholder: match[0],
      path: join(componentsPath, `${match.groups.name}.html`),
    };
  });

  for (const componentPromise of components) {
    const component = await componentPromise;
    const componentContent = await readFile(component.path, 'utf-8');
    template = template.replace(component.placeholder, componentContent);
  }

  await writeFile(outputPath, template, 'utf-8');
}

async function createDirectory(dirPath) {
  try {
    await mkdir(dirPath, { recursive: true });
  } catch (err) {
    if (err.code === 'EEXIST') {
      await rm(dirPath, { recursive: true, force: true });
      await mkdir(dirPath, { recursive: true });
    }
  }
}

async function copyDirectory(srcDirPath, destDirPath) {
  await createDirectory(destDirPath);
  const dirEntries = await readdir(srcDirPath, { withFileTypes: true });

  for (const dirEntry of dirEntries) {
    const srcPath = join(srcDirPath, dirEntry.name);
    const destPath = join(destDirPath, dirEntry.name);

    if (dirEntry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await copyFile(srcPath, destPath);
    }
  }
}

async function bundleStyles(srcDirPath, destFilePath) {
  const files = await readdir(srcDirPath);
  const cssFiles = files.filter((file) => extname(file) === '.css');

  let styleContent = '';
  for (const cssFile of cssFiles) {
    const filePath = join(srcDirPath, cssFile);
    const fileContent = await readFile(filePath, 'utf-8');
    styleContent += fileContent;
  }

  await writeFile(destFilePath, styleContent, 'utf-8');
}
