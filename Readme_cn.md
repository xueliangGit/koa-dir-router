# koa-dir-router

[english](http://koadirrouter.yamjs.cn)

一个 koa 的中间件，支持以文件夹目录为网址的访问形式，且不用重启 koa 服务，即可热更新文件夹内部的文件代码，修改即上线。在开发接口时方便修改代码，和无感上线。

可以使用其他中间件或者自己定义页面混用，koa-dir-router 只有在`ctx.response.status === 404`时候起作用

## Installation

```
$ npm install koa-dir-router
```

## Options

- `dir` 一个储存代码的文件目录的绝对路径，必须传递 `[String]`
- `prefixUrl` 请求路径的前缀,用来匹配本地文件默认是'/' `[String]`
- `checkTimes` 检测文件改动的时间，单位是 ms；默认是 1000 `[Number]`
- `errorLog` 文件目录下的文件代码执行异常时的捕获的代码方法；接受到值是`[Function]({path,des,error})`
- `page404` 文件目录下的文件代码不存在时，回调的函数接受到值是`[Function](ctx)`
- `debug` 是否显示调试信息；默认是 `true` 接受到值是`[Boolean]`

> 1.0.5 版本 废除`baseUrl` 参数名，使用`prefixUrl`来替代；

## Example

在启动程序同级目录下开始
目录结构

```
·
├──index.js
├──controller
   ├──mis
      ├──type.js
```

```js
// ./controller/mis/type.js 推荐接口写法一个文件一个接口；
module.exports = function(ctx) {
  ctx.body = `show-ok`
}
// ./index.js
const dirRouter = require('koa-dir-router')
const Koa = require('koa')
const path = require('path')
var app = new Koa()

app.use(
  dirRouter({
    dir: path.join(__dirname, './controller') // 传入要访问的目录机构
  })
)
app.listen(3000)
```

访问 http://localhost:3000/mis/type 时会对应到对应的 文件目录下的 `./controller/mis/type.js`这个文件代码

yields:

```js
$ GET /mis/type

show-ok
```

![showOK.png](https://static.bestsloth.top/showOk.png)

如果需要一个基础的地址 `prefixUrl`

```js
// ./index.js
const dirRouter = require('koa-dir-router')
const Koa = require('koa')
const path = require('path')
var app = new Koa()

app.use(
  dirRouter({
    dir: path.join(__dirname, './controller'), // 传入要访问的目录机构
    prefixUrl: '/mis' // 基础地址
  })
)
app.listen(3000)
```

访问 http://localhost:3000/mis/mis/type 时会对应到对应的 文件目录下的 `./controller/mis/type.js`这个文件代码
yields:

```js
$ GET /mis/mis/type

show-ok
```

![showOK2.png](https://static.bestsloth.top/showOk2.png)

**代码出问题时？**

如果在开发时代码出问题了，`koa-dir-router`会有一个友好的提示

![error.png](https://static.bestsloth.top/error.png)

若是线上代码，可以使用`errorLog`来获取。

# License

MIT
