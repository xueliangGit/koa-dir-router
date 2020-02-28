# koa-dir-router

一个 koa 的中间件，支持以文件夹目录为网址的访问形式，且不用重启 koa 服务，即可热更新文件夹内部的文件代码，修改即上线。在开发接口时方便修改代码，和无感上线。

## Installation

```
$ npm install koa-dir-router
```

## Options

- `dir` 一个储存代码的文件目录的绝对路径，必须传递
- `baseUrl` 请求的基准 url,默认是'/'
- `checkTimes` 检测文件改动的时间，单位是 ms；默认是 1
- `errorLog` 文件目录下的文件代码执行异常时的捕获的代码方法；接受到值是`{path,des,error}`

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
// ./controller/mis/type.js
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

![showOK.png](./showOK.png)

如果需要一个基础的地址 `baseUrl`

```js
// ./index.js
const dirRouter = require('koa-dir-router')
const Koa = require('koa')
const path = require('path')
var app = new Koa()

app.use(
  dirRouter({
    dir: path.join(__dirname, './controller'), // 传入要访问的目录机构
    baseUrl: '/mis' // 基础地址
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

![showOK2.png](./showOK2.png)

# License

MIT
