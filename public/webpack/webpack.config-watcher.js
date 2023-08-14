const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/* экспорт модулей вебпака */
module.exports = {
    /* режим разработки */
    mode: 'development',
    devtool: false,
    watch: true,
    /* точки входа */
    entry: {
        /* точка входа основной страницы */
        landing:[
			path.resolve(__dirname, '../js/landing.js'),
			path.resolve(__dirname, '../less/main-landing.less'),
			path.resolve(__dirname, '../js/React/index.jsx')
		],

        /* точка входа страницы оператора*/
        operator: [
			path.resolve(__dirname, '../js/operator.js'),
			path.resolve(__dirname, '../less/operator.less'),
			path.resolve(__dirname, '../js/React/index.jsx')
		]
      
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
                test: /\.jsx?$/,
              //  use: ['babel-loader'],
				exclude: /(node_modules)/,  // исключаем из обработки папку node_modules
                loader: "babel-loader",   // определяем загрузчик
                options:{
                    presets:['@babel/preset-env', '@babel/preset-react']    // используемые плагины
                }
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
    //  new DashboardPlugin(),

        /* плагин для создания файла .css */
        new MiniCssExtractPlugin({
            /* название конечного файла */
            filename: '[name]_[contenthash:4].css',
        }),
    ],
}