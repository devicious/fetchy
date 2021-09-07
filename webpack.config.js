const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = env => {

    const plugins = env.production ? [] : [
        new HtmlWebpackPlugin({
            title: 'fetchy',
        }),
    ];

    return {

        entry: {
            Fetchy: './src/ts/index.ts'
        },
        mode: env.production ? "production" : "development",
        module: {
            rules: [
                {
                    exclude: /node_modules/,
                    use: "babel-loader",
                },
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                }
            ],
        },
        plugins,
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
        output: {
            path: path.resolve(__dirname, './'),
            filename: 'index.js',
            library: "Fetchy",
            libraryTarget: "umd",
        },
    }
}
