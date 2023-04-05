# SuperD Webpack Study Record
# 基础
## 2023-4-2
### 启用webpack
``` cmd
// 1.开发模式
npx webpack filePath --mode=development
// 2.生产模式
npx webpack filePath --mode=production
```
### 五大核心概念
1. entry（入口）：指定webpack从哪个文件开始打包
2. output（输出）：指示打包完后的文件输出位置，及命名
3. loader（加载器）：webpack只能处理js，json等资源，其他资源需要借助loader才能解析
4. plugins（插件）：拓展功能
5. mode（模式）

### 处理样式资源
1. css:style-loader,css-loader
2. less:style-loader,css-loader,less-loader
3. s[ac]ss:style-loader,css-loader,scss-loader

### 处理图片资源
小图10kb左右转化为base64格式
大图不变
```javascript
 {
    test: /\.(png|jpe?g|git|webp|svg)$/,
    type:"asset",
    parser:{
        dataUrlCondition:{
            maxSize:10*1024,//10kb以下的图转base64
        }
    },
    generator:{
    // 图片输出路径及名称
    filename:"images/[hash:10][ext][query]"
    }
}

```

### 处理字体图标资源和其他资源
```javascript
{
    test:/\.(ttf|woff2?|map3|mp4|avi)$/,
    type:"asset/resource",
    generator:{
        filename:"media/[hash:10][ext][query]"
    }
}
```

## 2023-4-4
### 处理js资源eslint
兼容性,可组装的JavaScript和JSX检测工具
1. 配置文件：.eslintrc.(js|json|)
2. 忽略检测文件：.eslintignore
详细配置说明 https://webpack.docschina.org/plugins/eslint-webpack-plugin/

### babel
1. 配置文件：.babelrc.js 配置都可以写在这个里面
主要用与将es6语法编写的代码向后兼容，让落后的浏览器也能正常使用
详细配置见 https://www.webpackjs.com/loaders/babel-loader/

### 处理html资源
将html一并打包至dist，并可以自动导入打包后的资源
1. 指定html文件作为模板，创建新的html
2. 新的html结构和原来一致，自动导入打包后的资源
详细配置见 https://www.webpackjs.com/plugins/html-webpack-plugin/

### 搭建开发服务器
cnpm i webpack-dev-server -D
```javascript
devServer:{
        host:"localhost",
        port:"3001",
        open:true,//自动打开浏览器
    },
```
启动指令 npx webpack serve

## 2023年4月5日
### 生产模式准备工作
dev：开发模式，无输出output，绝对路径需要回退一层
prod：生产模式，有输出，绝对路径回退一层，无需devserver
配置启动指令
```json
  "scripts": {
    "start": "npm run dev",
    "dev":"webpack serve --config ./config/webpack.dev.js",
    "build":"webpack --config ./config/webpack.prod.js"
  },
```

### css处理
MiniCssExtractPlugin 详细配置 https://webpack.docschina.org/plugins/mini-css-extract-plugin/
将css文件提取成单独的文件，不会出现闪屏现象，以link的方式引入样式，样式渲染更快

### css兼容性处理
```cmd
npm i postcss-loader postcss postcss-preset-env -D
```
在css-loader 后 style-loader之前加上配置
```javascript
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
```
封装函数统一处理样式的loader

### css压缩
npm install css-minimizer-webpack-plugin --save-dev
详细配置 https://webpack.docschina.org/plugins/css-minimizer-webpack-plugin/