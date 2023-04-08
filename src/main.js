import sum from './js/sum'
// import count from './js/count'
import './css/index.css'
import './less/index.less'
import './sass/index.sass'
import './sass/index.scss'
// var a=2
console.log(sum(1,2));
// console.log(count(1,2,3,45,6));
// 动态导入
document.getElementById("btn").onclick=()=>{
    // /*webpackChunkName:"count"*/ webpack魔法命名
    import(/*webpackChunkName:"count"*/"./js/count").then(res=>{
        console.log(res.default(1,2,3,4,5));
    })
}
if(module.hot){
    // 判断是否支持热模块替换
    module.hot.accept("./js/sum.js")
    module.hot.accept("./js/count.js")
}