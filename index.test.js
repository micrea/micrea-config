const expect = require('chai').expect;

describe('config tests', () => {

  describe('env variable', () => {
    beforeEach(() => {
      env = process.env;
      process.env.MICREA_CONFIG_DIR = './test-assets';
      process.env.ENVOVERRIDE = 'myValue';
      config = require('./index');
    });

    afterEach(() => {
      process.env = env;
      delete require.cache[require.resolve('./index')];
    });

    it('gets value', () => {
      const value = config.get('micrea:envOverride');
      return expect(value).to.equal('myValue');
    });
  });

  describe('environment specific', () => {
    it('gets value', () => {
      const value = config.get('micrea:testOverride');
      return expect(value).to.equal('testOverrideValue');
    });
  });

  describe('default', () => {
    it('gets value', () => {
      const value = config.get('micrea:defaultOnly');
      return expect(value).to.equal('DefaultOnlyvalue');
    });
  });

});
