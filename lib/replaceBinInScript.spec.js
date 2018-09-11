const replaceBinInScript = require('./replaceBinInScript');

describe('replaceBinInScript', () => {
  it('should replace a single occurence of a bin in command', () => {
    expect(
      replaceBinInScript(
        'react-scripts start',
        'react-scripts',
        'react-app-rewired'
      )
    ).toBe('react-app-rewired start');
  });

  it('should replace a multiple occurences of a bin in command', () => {
    expect(
      replaceBinInScript(
        'react-scripts test && react-scripts build',
        'react-scripts',
        'react-app-rewired'
      )
    ).toBe('react-app-rewired test && react-app-rewired build');
  });

  it('should not replace occurences of bin names that end with replaced string', () => {
    expect(
      replaceBinInScript(
        'nice-react-scripts test',
        'react-scripts',
        'react-app-rewired'
      )
    ).toBe('nice-react-scripts test');
  });
});
