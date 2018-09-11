module.exports = function findScriptsUsingBin(scripts, binName) {
  if (typeof binName !== 'string') {
    throw new Error(
      `Expected 'binName' to be a String, but got ${typeof binName} instead`
    );
  }

  if (typeof scripts !== 'object') {
    return [];
  }

  return Object.keys(scripts).filter(name =>
    scripts[name].match(new RegExp(binName + ' '))
  );
};
