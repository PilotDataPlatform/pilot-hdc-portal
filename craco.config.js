const CracoLessPlugin = require('craco-less');
const antdTheme = require('./src/Themes/antd');
module.exports = {
  webpack: {
    configure: function (webpackConfig, { env, paths }) {
      webpackConfig.output.filename = '[name].[contenthash].js';
      return webpackConfig;
    },
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: antdTheme,
            javascriptEnabled: true,
            math: 'always',
          },
        },
      },
    },
  ],
};
