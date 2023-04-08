const path = require("path")
const ESLintPlugin = require('eslint-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const os = require("os")
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin")
const threads = os.cpus().length

module.exports = {
    // 入口
    entry: "./src/main.js",
    // 输出
    output: {
        // 文件输出位置 开发环境不需要输出
        path: undefined,
        filename: "js/main.js",
        chunkFilename: "js/[name].chunk.js",
        assetModuleFilename: "media/[hash:10][ext][query]",
        clean: true
    },
    // 加载器
    module: {
        rules: [{
            oneOf: [
                {
                    // 处理css资源
                    test: /\.css$/,
                    use: [
                        // 从上到下执行
                        "style-loader",
                        "css-loader"
                    ]
                },
                {
                    test: /\.less$/,
                    use: ["style-loader", "css-loader", "less-loader"]
                },
                {
                    test: /\.s[ac]ss$/,
                    use: ["style-loader", "css-loader", "sass-loader"]
                },
                {
                    test: /\.(png|jpe?g|git|webp|svg)$/,
                    type: "asset",
                    parser: {
                        dataUrlCondition: {
                            maxSize: 10 * 1024, //10kb以下的图转base64
                        }
                    }
                },
                {
                    test: /\.(ttf|woff2?|map3|mp4|avi)$/,
                    type: "asset/resource",
                },
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
        }]
    },
    // 插件
    plugins: [
        // 配置eslint
        new ESLintPlugin({
            context: path.resolve(__dirname, "../src"),
            exclude: "node_modules",
            cache: true, //开启缓存
            cacheLocation: path.resolve(__dirname, "../node_modules/.cache/eslintcache"),
            threads
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "../public/index.html")
        })
    ],
    optimization: {
        // 压缩操作
        minimizer: [
            // css代码压缩
            new CssMinimizerPlugin(),
            new TerserWebpackPlugin({ //terser用于压缩html代码
                parallel: threads //开启多进程
            })
        ],
        splitChunks: {
            chunks: "all",
        }
    },
    devServer: {
        host: "localhost",
        port: "3001",
        open: true, //自动打开浏览器
        hot: true, //开启HMR
    },
    mode: "development",
    devtool: "cheap-module-source-map", //打包编译熟读快，只包含行映射
}