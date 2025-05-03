/**
 * metro.config.js
 *
 * Exclude:
 *   1) The root index.js (your Express server entry)
 *   2) Everything under yumi-proxy/
 */
const { getDefaultConfig } = require('expo/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const path = require('path');

const projectRoot = __dirname;

const config = getDefaultConfig(projectRoot);

config.resolver.blacklistRE = exclusionList([
  // Match root `/index.js`
  new RegExp(`^${path.resolve(projectRoot, 'index')}\.js$`),

  // Match anything under `/yumi-proxy/`
  new RegExp(`^${path.resolve(projectRoot, 'yumi-proxy')}\\/.*`),
]);

module.exports = config;
