const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'index.js',
        libraryTarget: 'umd',
        globalObject: 'typeof self !== \'undefined\' ? self : this',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'src'),
                exclude: /(node_modules|build)/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },
    externals: {
      'react': 'commonjs react',
    },
    plugins:[
        new BundleAnalyzerPlugin()
    ]
}
