# SuperD Webpack Study Record
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
### 处理js资源eslint
兼容性,可组装的JavaScript和JSX检测工具
1. 配置文件：.eslintrc.(js|json|)
