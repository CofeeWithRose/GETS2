const path = require('path')

module.exports = {
  "stories": [
    "../src/**/*.sb.mdx",
    "../src/**/*.sb.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  webpackFinal: config => {

    config.resolve.extensions.push('.ts', '.tsx')
    config.resolve.alias['ge'] = path.resolve(__dirname, '../src/index.ts')

    return config
  }
}