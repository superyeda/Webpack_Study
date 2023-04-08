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

# 高级
## 2023年4月7日
### sourceMap
用来生成源代码与构建后代码每一行每一列的一一映射的文件
便于从构建后代码出错位置找到映射后找到源代码出错位置，从而让浏览器提示代码错误位置，帮助我们更快的找到错误根源
1. 开发模式
   devtool:"   -module-source-map", 打包速度快，只包含行映射
2. 生产模式
   devtool:"source-map"，打包速度慢，包含行和列映射

### 提高打包构建速度
1. 热模块替换HMR，只能由于开发环境，js需单独处理
2. oneOf:打包时每个文件都会经过所有loader处理，但通过正则test后没有处理上，但需要都过一遍比较慢，oneOf可以让每个文件只匹配上一个loader
3. include/Exclude：include只处理xxx文件，Exclude：不处理xxx文件
4. cache：缓存之前的eslint检查和babel编译结果
5. Thead：多进程打包 

### 减少代码体积
1. TreeShaking：js中没有使用上的代码，默认开启
2. babel：babel为编译的每个文件都插入了辅助代码，使体积过大，对一些公共代码默认情况下会添加到每一个文件中，可以将这些辅助代码作为一个独立的模块
3. 图片压缩：

### 优化代码性能
codeSplit
1. 对需要打包的代码分割，生成多个js文件，多个入口文件
2. 处理公共模块 
3. 多入口按需载入，动态加载返回一个promise（import(xxx).then()）
4. 模块命名chunk和主文件

preload/prefetch
在浏览器空闲时，加载后续需要使用的资源，只加载不执行，都有缓存，兼容性都很差
1. preload：兼容性相对较好，告诉浏览器立即加载资源
2. prefetch：兼容性差，浏览器空闲时才开始加载

NetWork cache
1. 使用contenthash文件内容不变hash也不变，好做缓存
2. 用runtime记录hash和依赖文件的对应关系

core-js
解决js兼容性问题

PWA
离线访问，兼容性差