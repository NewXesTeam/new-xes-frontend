const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { type } = require("os");
const path = require("path");
const { cache } = require("react");

const entriesName = ["index", "about"];

let entries = {};
let plugins = [new MiniCssExtractPlugin()];

for (let entry of entriesName) {
    entries[entry] = `./src/${entry}.jsx`;
    plugins.push(
        new HtmlWebpackPlugin({
            template: "./src/template.html",
            filename: `${entry}.html`,
            chunks: [entry],
        })
    );
}

module.exports = {
    entry: entries,
    mode: "development",
    devtool: "source-map",
    stats: {
        warnings: false,
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /.(jsx?)|(tsx?)$/,
                exclude: /(node_modules)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-react"],
                    },
                },
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            {
                test: /\.(scss|sass)$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            },
            {
                test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
                type: "asset/resource",
            },
        ],
    },
    plugins: plugins,
    optimization: {
        splitChunks: {
            chunks: "all",
            minChunks: 2,
        },
    },
    cache: {
        type: "filesystem",
    },
};
