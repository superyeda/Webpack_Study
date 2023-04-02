const path =require("path")

module.exports={
    // 入口
    entry:"./src/main.js",
    // 输出
    output:{
        // 文件输出位置
        path:path.resolve(__dirname,"dist"),
        filename:"main.js"
    },
    // 加载器
    module:{
        rules:[
            // loder配置
            {
                // 处理css资源
                test:/\.css$/,
                use:[
                    // 从上到下执行
                    "style-loader",
                    "css-loader"
                ]
            }
        ]
    },
    // 插件
    plugins:[

    ],
    mode:"development"
}