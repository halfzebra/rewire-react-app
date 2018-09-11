const path = require('path');
const spawn = require('cross-spawn');
const fs = require('fs');

describe('rewireReactApp', () => {
  it('should rewire the app', () => {
    const fixturePath = path.join(__dirname, 'fixture');
    spawn.sync('node', [require.resolve('./rewireReactApp'), 'my-app'], {
      cwd: fixturePath
    });
    expect(
      fs.existsSync(path.join(fixturePath, 'my-app', 'config-overrides.js'))
    ).toBe(true);
  });
});
