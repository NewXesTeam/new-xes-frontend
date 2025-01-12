import webpackMerge from 'webpack-merge';
import baseConfig from './webpack.base.js';

const devConfig = webpackMerge.merge(baseConfig, {
    mode: 'development',
    devtool: 'source-map',
});

export default devConfig;
