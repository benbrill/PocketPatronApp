// metro.config.js
const { getDefaultConfig } = require('@expo/metro-config')
const exclusionList = require('metro-config/src/defaults/exclusionList')

const config = getDefaultConfig(__dirname)

config.resolver.unstable_conditionNames = ['browser']
config.resolver.unstable_enablePackageExports = false


// Optional: if you see issues with `.mjs` files
if (!config.resolver.sourceExts.includes('mjs')) {
  config.resolver.sourceExts.push('mjs')
}

module.exports = config
