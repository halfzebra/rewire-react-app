const findRoot = require('find-root');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const prompt = require('prompt');

const cwd = process.cwd();

const root = findRoot(cwd);

const packageJsonPath = path.join(root, 'package.json');
const configOverridesPath = path.join(__dirname, 'config-overrides.js');

function clearConsole() {
  process.stdout.write(
    process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H'
  );
}

if (fs.existsSync(path.join(root, 'package.json'))) {
  clearConsole();
  console.log('Rewiring ' + root);

  const packageJsonRaw = fs.readFileSync(packageJsonPath);
  let packageJson;

  try {
    packageJson = JSON.parse(packageJsonRaw);
  } catch (error) {
    clearConsole();
    console.log(chalk.red('Rewiring Failed'));
    console.log('Failed to decode package.json in ' + cwd);
    process.exit(1);
  }

  if (!packageJson.devDependencies['react-scripts']) {
    clearConsole();
    console.log(chalk.red('Rewiring Failed'));
    console.log(
      '`react-scripts` is not found  in your "devDependencies" of package.json in ' +
        cwd
    );
    process.exit(1);
  }

  const scriptsUsingReactScripts = Object.keys(packageJson.scripts).filter(
    name => name.match(/react-scripts\s/)
  );

  if (scriptsUsingReactScripts.length === 0) {
    clearConsole();
    console.log(chalk.red('Rewiring Failed'));
    console.log('react-scripts is never used in package.json "scripts"' + cwd);
    process.exit(1);
  }

  const rewiredScripts = scriptsUsingReactScripts
    .map(scriptName => packageJson.scripts[scriptName].replace(/react-scripts\s/, 'react-app-rewired '));

  const newPackageJson = {
      ...packageJson
  }

  scriptsUsingReactScripts.forEach((scriptName) =>{
    newPackageJson.scripts[scriptName] = rewiredScripts[scriptName];
  })

  fs.copyFileSync(configOverridesPath, root);
  fs.writeFile(packageJsonPath, JSON.stringify(newPackageJson))
} else {
  clearConsole();
  console.log(chalk.red('Rewiring Failed'));
  console.log('package.json was not foind in ' + cwd);
  process.exit(1);
}
