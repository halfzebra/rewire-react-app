const findScriptsUsingBin = require('./findScriptsUsingBin');

describe('findScriptsUsingBin', () => {
  it('should find a script using bin', () => {
    expect(
      findScriptsUsingBin({ build: 'react-scripts build' }, 'react-scripts')
    ).toEqual(['build']);
  });

  it('should find multiple scripts using bin', () => {
    expect(
      findScriptsUsingBin(
        {
          start: 'react-scripts start',
          build: 'react-scripts build',
          test: 'react-scripts test --env=jsdom',
          eject: 'react-scripts eject'
        },
        'react-scripts'
      )
    ).toEqual(['start', 'build', 'test', 'eject']);
  });
});
