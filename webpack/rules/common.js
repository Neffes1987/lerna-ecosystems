const PostCSSFlexBugsFixes = require('postcss-flexbugs-fixes');
const autoprefixer = require('autoprefixer');

/**
 * @see https://webpack.js.org/guides/typescript/#loader
 */
const typescriptRule = {
    test: /\.tsx?$/,
    loader: 'ts-loader',
    options: {
        transpileOnly: true,
    },
    exclude: (module) => /node_modules/.test(module) && !(/(@components.*)/.test(module)),
};

/**
 * @see https://webpack.js.org/loaders/babel-loader
 */
const javascriptRule = {
    test: /\.(js|jsx)$/,
    use: [
        {
            loader: 'babel-loader',
            options: {
                plugins: [
                    '@babel/plugin-syntax-dynamic-import',
                    '@babel/plugin-proposal-class-properties',
                    '@babel/plugin-proposal-export-namespace-from',
                    '@babel/plugin-proposal-throw-expressions',
                    '@babel/plugin-proposal-object-rest-spread',
                    '@babel/plugin-proposal-export-default-from',
                    'react-refresh/babel',
                ],
            },
        },
    ],
    exclude: /node_modules/,
};

/**
 * @see https://webpack.js.org/loaders/html-loader
 */
const htmlRule = {
    test: /\.(html)$/,
    use: {
        loader: 'html-loader',
    },
};

/**
 * @see https://webpack.js.org/guides/asset-modules/
 */
const cssRule = {
    test: /\.css$/,
    use: [
        {
            loader: require.resolve('style-loader'),
        },
        {
            loader: require.resolve('css-loader'),
            options: {
              modules:{
                mode: 'local',
                localIdentName: '[local]--[hash:base64:5]'
              }
            },
        },
        {
            loader: require.resolve('postcss-loader'),
            options: {
                sourceMap: true,
                postcssOptions: {
                    plugins: () => [
                        PostCSSFlexBugsFixes,
                        autoprefixer({
                            flexbox: 'no-2009',
                        }),
                    ]
                },
            },
        },
    ],
};

module.exports = {
  typescriptRule, javascriptRule, htmlRule, cssRule
}
