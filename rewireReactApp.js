const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const findScriptsUsingBin = require('./lib/findScriptsUsingBin');

const root = process.cwd();

const packageJsonPath = path.join(root, 'package.json');
const configOverridesPath = path.join(__dirname, 'config-overrides.js');

function clearConsole() {
  process.stdout.write(
    process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H'
  );
}

if (!fs.existsSync(path.join(root, 'package.json'))) {
  clearConsole();
  console.log(chalk.red('Rewiring Failed'));
  console.log('package.json was not foind in ' + cwd);
  process.exit(1);
}

clearConsole();
console.log('Rewiring ' + root);

const packageJsonRaw = fs.readFileSync(packageJsonPath);
let packageJson;

try {
  packageJson = JSON.parse(packageJsonRaw);
} catch (error) {
  clearConsole();
  console.log(chalk.red('Rewiring Failed'));
  console.log('Failed to decode package.json in ' + root);
  process.exit(1);
}

if (!packageJson.dependencies['react-scripts']) {
  clearConsole();
  console.log(chalk.red('Rewiring Failed'));
  console.log(
    '`react-scripts` is not found in your "devDependencies" of package.json in ' +
      root
  );
  process.exit(1);
}

const scriptsUsingReactScripts = findScriptsUsingBin(
  packageJson.scripts,
  'react-scripts'
);

if (scriptsUsingReactScripts.length === 0) {
  clearConsole();
  console.log(chalk.red('Rewiring Failed'));
  console.log(
    '`react-scripts` is never used in package.json "scripts" ' + root
  );
  process.exit(1);
}

const rewiredScripts = scriptsUsingReactScripts.map(scriptName =>
  replaceBinInScript(
    packageJson.scripts[scriptName],
    'react-scripts',
    'react-app-rewired'
  )
);

const newPackageJson = {
  ...packageJson
};

scriptsUsingReactScripts.forEach(scriptName => {
  newPackageJson.scripts[scriptName] = rewiredScripts[scriptName];
});

console.log(newPackageJson);
process.exit(1);

fs.copyFileSync(configOverridesPath, path.join(root, 'config-overrides.js'));
fs.writeFileSync(packageJsonPath, JSON.stringify(newPackageJson, null, 2));

console.log(chalk.bold.green('Rewired Succesfully'));
console.log('\n');
console.log('  Read more on rewiring here:');
console.log('  https://github.com/timarney/react-app-rewired');
console.log('\n');
