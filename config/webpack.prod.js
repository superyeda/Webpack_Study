const path = require("path")
const os = require("os")
const ESLintPlugin = require('eslint-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin")
const threads = os.cpus().length
// 统一处理样式的loader
function getStyleLoader(pre) {
    return [
        MiniCssExtractPlugin.loader, //提取css成单独的文件
        "css-loader",
        {
            loader: "postcss-loader",
            options: {
                postcssOptions: {
                    plugins: [
                        "postcss-preset-env"
                    ]
                }
            }
        },
        pre
    ].filter(Boolean) //过滤掉undefined
}

module.exports = {
    // 入口
    entry: "./src/main.js",
    // 输出
    output: {
        // 文件输出位置
        path: path.resolve(__dirname, "../dist"),
        filename: "../js/main.js",
        // 自动清空上次打包内容
        clean: true
    },
    // 加载器
    module: {
        rules: [
            // loder配置
            {
                oneOf: [
                    // 打包样式资源
                    {
                        // 处理css资源
                        test: /\.css$/,
                        use: getStyleLoader()
                    },
                    {
                        // 处理less
                        test: /\.less$/,
                        use: getStyleLoader("less-loader")
                    },
                    {
                        // 处理s[ca]ss
                        test: /\.s[ac]ss$/,
                        use: getStyleLoader("sass-loader")
                    },
                    // 打包图片资源
                    {
                        test: /\.(png|jpe?g|git|webp|svg)$/,
                        type: "asset",
                        parser: {
                            dataUrlCondition: {
                                maxSize: 10 * 1024, //10kb以下的图转base64
                            }
                        },
                        generator: {
                            // 图片输出路径及名称
                            filename: "images/[hash:10][ext][query]"
                        }
                    },
                    // 处理iconfont和其他资源
                    {
                        test: /\.(ttf|woff2?|map3|mp4|avi)$/,
                        type: "asset/resource",
                        generator: {
                            filename: "media/[hash:10][ext][query]"
                        }
                    },
                    // bebal loader配置
                    {
                        test: /\.js$/,
                        include: path.resolve(__dirname, "../src"),
                        use: [{
                                loader: "thread-loader", //开启多线程
                                options: {
                                    works: threads //进程数量
                                }
                            },
                            {
                                loader: "babel-loader",
                                options: {
                                    // presets:["@babel/preset-env"]
                                    cacheDirectory: true, //开启babel缓存
                                    cacheCompression: false, //关闭缓存文件压缩
                                    plugins:["@babel/plugin-transform-runtime"],//避免重复引入，减少代码体积
                                }
                            }
                        ],

                    }

                ]
            }
        ]
    },
    // 插件
    plugins: [
        // 配置eslint
        new ESLintPlugin({
            // 检测那些文件
            context: path.resolve(__dirname, "../src"),
            exclude: "node_modules",
            cache: true, //开启缓存
            cacheLocation: path.resolve(__dirname, "../node_modules/.cache/eslintcache"),
            threads
        }),
        new HtmlWebpackPlugin({
            // 已指定html文件作为模板，创建新的html
            // 新的html结构和原来一致，自动导入打包后的资源
            template: path.resolve(__dirname, "../public/index.html")
        }),
        // 打包单独生成css文件
        new MiniCssExtractPlugin({
            filename: "css/main.css"
        }),

    ],
    optimization: {
        // 压缩操作
        minimizer: [
            // css代码压缩
            new CssMinimizerPlugin(),
            new TerserWebpackPlugin({ //terser用于压缩html代码
                parallel: threads //开启多进程
            })
        ]
    },
    mode: "production",
    devtool: "source-map",
}