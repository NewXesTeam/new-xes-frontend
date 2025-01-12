import webpackMerge from 'webpack-merge';
import baseConfig from './webpack.base.js';

const prodConfig = webpackMerge.merge(baseConfig, {
    mode: 'production',
    devtool: false,
});

export default prodConfig;
