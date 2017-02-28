'use strict';

const path = require('path');
const nconf = require('nconf');
const glob = require('glob');
const fs = require('fs');
const template = require('string-template');

const configFolder = process.env.MICREA_CONFIG_DIR || 'config';

function loadEnvSpecificConfig(dir) {
  const baseDir = path.join(process.cwd(), dir);
  const envFile = path.join(baseDir, `${process.env.NODE_ENV}.json`);
  const defaultFile = path.join(baseDir, 'default.json');

  nconf.file(envFile, envFile);
  nconf.file(defaultFile, defaultFile);
}

function loadConfigFromOtherModules() {
  glob.sync('**/*/micrea-*/config').forEach(loadEnvSpecificConfig);
}

function loadLocalConfig() {
  loadEnvSpecificConfig(configFolder);
}

function deleteEmptyPropertiesOf(object) {
  for (const property in object) {
    if (object.hasOwnProperty(property) && !object[property]) {
      delete object[property];
    } else if (typeof object[property] === 'object') {
      deleteEmptyPropertiesOf(object[property]);
    }
  }
}

function mapCustomEnvVariables() {
  const customEnvFile = path.join(process.cwd(), configFolder, 'env-vars.json');

  if (fs.existsSync(customEnvFile)) {
    const customEnvContent = fs.readFileSync(customEnvFile).toString();
    const mappedConf = JSON.parse(template(customEnvContent, process.env));

    deleteEmptyPropertiesOf(mappedConf);
    nconf.defaults(mappedConf);
  }
}

function loadConfig(config) {
  if (config) {
    nconf.overrides(config);
  }

  mapCustomEnvVariables();
  loadLocalConfig();
  loadConfigFromOtherModules();
}

loadConfig();
nconf.update = loadConfig;

module.exports = nconf;
