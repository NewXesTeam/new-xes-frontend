import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const entriesName = [
    'index',
    'about',
    'login',
    'eula',
    'space',
    'userInfo',
    'discover',
    'user',
    'message',
    'embed/cpp',
];

let entries = {};
let plugins = [new MiniCssExtractPlugin()];

for (let entry of entriesName) {
    entries[entry] = `./src/${entry}.tsx`;
    plugins.push(
        new HtmlWebpackPlugin({
            template: './src/template.html',
            filename: `${entry}.html`,
            chunks: [entry],
            favicon: './src/static/favicon.ico',
        }),
    );
}

const baseConfig = {
    entry: entries,
    mode: 'development',
    devtool: 'source-map',
    stats: {
        warnings: false,
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /.(jsx?)|(tsx?)$/,
                exclude: /(node_modules)/,
                use: 'babel-loader',
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.(scss|sass)$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
                type: 'asset/resource',
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    plugins: plugins,
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
    cache: {
        type: 'filesystem',
    },
};

export default baseConfig;
