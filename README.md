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
