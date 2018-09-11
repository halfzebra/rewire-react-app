const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const commander = require('commander');
const get = require('lodash.get');
const findScriptsUsingBin = require('./lib/findScriptsUsingBin');
const replaceBinInScript = require('./lib/replaceBinInScript');
const clearConsole = require('./lib/clearConsole');
const replaceScripts = require('./lib/replaceScripts');
const spawn = require('cross-spawn');
const packageJson = require('./package.json');

const configOverridesPath = path.join(__dirname, 'config-overrides.js');
const cwd = process.cwd();

let projectName;

const program = new commander.Command(packageJson.name)
  .version(packageJson.version)
  .arguments('<project-directory>')
  .usage(`${chalk.green('<project-directory>')}`)
  .action(name => {
    projectName = name;
  })
  .on('--help', () => {
    console.log(`    Only ${chalk.green('<project-directory>')} is required.`);
    console.log();
  })
  .parse(process.argv);

if (typeof projectName === 'undefined') {
  console.error('Please specify the project directory:');
  console.log(
    `  ${chalk.cyan(program.name())} ${chalk.green('<project-directory>')}`
  );
  console.log();
  console.log('For example:');
  console.log(`  ${chalk.cyan(program.name())} ${chalk.green('my-react-app')}`);
  console.log();
  console.log(
    `Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`
  );
  process.exit(1);
}

const appRoot = path.join(cwd, projectName);

if (!fs.existsSync(appRoot)) {
  clearConsole();
  console.log(chalk.red('Rewiring Failed'));
  console.log();
  console.log(`  Can't find "${projectName}" in ${cwd}`);
  console.log();
  console.log(`  Are you sure you're not running the command`);
  console.log('  from the project root?');
  console.log();
  process.exit(1);
}

const appPackageJsonPath = path.join(appRoot, 'package.json');

if (!fs.existsSync(path.join(appRoot, 'package.json'))) {
  clearConsole();
  console.log(chalk.red('Rewiring Failed'));
  console.log();
  console.log('  package.json was not found in ' + appRoot);
  console.log();
  process.exit(1);
}

console.log();
console.log('Rewiring ' + appRoot);

const appPackageJsonRaw = fs.readFileSync(appPackageJsonPath);
let appPackageJson;

try {
  appPackageJson = JSON.parse(appPackageJsonRaw);
} catch (error) {
  clearConsole();
  console.log(chalk.red('Rewiring Failed'));
  console.log();
  console.log('  Failed to decode package.json in:');
  console.log('  ' + appRoot);
  console.log();
  console.log('  Please check if it contains valid JSON.');
  console.log();
  process.exit(1);
}

const isInDependencies = !!get(appPackageJson, 'dependencies.react-scripts');
const isInDevDependencies = !!get(
  appPackageJson,
  'devDependencies.react-scripts'
);

if (isInDependencies === false && isInDevDependencies === false) {
  clearConsole();
  console.log(chalk.red('Rewiring Failed'));
  console.log();
  console.log('  "react-scripts" module is not found in the "dependencies"');
  console.log('  or "devDepejndencies" of ' + projectName);
  console.log();
  console.log(
    '  Are you sure this project was created using Create React App?'
  );
  console.log('  If yes, please install "react-scripts" and try again.');
  console.log();
  process.exit(1);
}

const scriptsUsingReactScripts = findScriptsUsingBin(
  appPackageJson.scripts,
  'react-scripts'
);

if (scriptsUsingReactScripts.length === 0) {
  clearConsole();
  console.log(chalk.red('Rewiring Failed'));
  console.log();
  console.log('  "react-scripts" is not used in package.json "scripts" in ');
  console.log('  ' + projectName);
  console.log();
  console.log(
    '  Are you sure this project was created using Create React App?'
  );
  console.log();
  process.exit(1);
}

const rewiredScripts = scriptsUsingReactScripts.reduce(
  (acc, scriptName) => ({
    ...acc,
    [scriptName]: replaceBinInScript(
      appPackageJson.scripts[scriptName],
      'react-scripts',
      'react-app-rewired'
    )
  }),
  {}
);

const newAppPackageJson = replaceScripts(appPackageJson, rewiredScripts);

// Run all the rewiring logic.
fs.copyFileSync(configOverridesPath, path.join(appRoot, 'config-overrides.js'));
fs.writeFileSync(
  appPackageJsonPath,
  JSON.stringify(newAppPackageJson, null, 2)
);

const args = [
  'install',
  'react-app-rewired',
  isInDependencies ? '--save' : '--save-dev'
];

spawn.sync('npm', args, {
  stdio: 'inherit',
  cwd: appRoot
});

console.log(chalk.bold.green('Rewired Succesfully'));
console.log();
console.log('  Start with checking config-overrides.js in ' + projectName);
console.log();
console.log('  Read more on rewiring here:');
console.log('  https://github.com/timarney/react-app-rewired');
console.log();
