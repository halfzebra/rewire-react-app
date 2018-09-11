module.exports = function replaceBinInScript(script, oldBin, newBin) {
  return script
    .replace(new RegExp(`(^${oldBin}| ${oldBin}) `, 'g'), ` ${newBin} `)
    .trim();
};
