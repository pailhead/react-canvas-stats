const path = require('path')

const config = (env, argv) => {
    console.log('env is ', env)

    const config = {
        entry: './src/index.js',
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: 'index.js',
            libraryTarget: 'commonjs2'
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
        }
    }

    if (argv.mode === 'production') {
        config.externals = {
            react: {
                root: 'React',
                'commonjs-module': 'react',
                commonjs2: 'react',
                commonjs: 'react',
                amd: 'react'
            }
        }
    }
    return config
}

module.exports = config
