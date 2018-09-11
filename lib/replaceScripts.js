module.exports = function replaceScripts(packageJson, newScripts) {
  const newPackageJson = {
    ...packageJson
  };

  Object.keys(newScripts).forEach(scriptName => {
    newPackageJson.scripts[scriptName] = newScripts[scriptName];
  });

  return packageJson;
};
