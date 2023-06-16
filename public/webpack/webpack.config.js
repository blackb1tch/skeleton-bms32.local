const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');

/* экспорт модулей вебпака */
module.exports = {
    /* режим разработки */
    mode: 'development',
    devtool: false,
    watch: true,
    /* точки входа */
    entry: {
        /* точка входа основной страницы */
        landing: path.resolve(__dirname, '../js/landing.js'),

        /* точка входа страницы оператора*/
        operator: path.resolve(__dirname, '../js/operator.js')
    },

    /* модули */
    module: {

        /* правила модулей*/
        rules: [
            {
                test: /\.css$/, //находим наши файлы css
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                /* файлы с расширением .less / .css */
                test: /\.(less)$/,

                use: [

                    {
                        loader:MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: "css-loader",
                    },
                    {
                        loader: "less-loader",
                        options: {
                            lessOptions: {
                                math: "always",
                            },
                        },
                    },
                ],
            },
            {
                test: /\.js$/,
                use: ['babel-loader'],
            },
        ]
    },

    /* точка выхода */
    output: {
        /* путь */
        path: path.resolve(__dirname, '../build'),

        /* имя файла */
        filename: '[name]_[contenthash:4].js',
    },

    /* плагины */
    plugins: [


        /* плагин очистки директории выхода */
        new CleanWebpackPlugin(),
        new DashboardPlugin(),

        /* плагин для создания файла .css */
        new MiniCssExtractPlugin({
            /* название конечного файла */
            filename: '[name]_[contenthash:4].css',
        }),
    ],
}