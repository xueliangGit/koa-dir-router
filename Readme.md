# koa-dir-router

[中文文档](http://koadirrouter.yamjs.cn/Readme_cn)

A middleware of KOA supports the access form with folder directory as the URL, and does not need to restart koa service. It can update the file code of the folder inside the folder and modify it. It is convenient to modify the code and go online without feeling when developing the interface.

You can use other middleware or define page mix. Koa dir router only works when `ctx.response.status===404`

## Installation

```
$ npm install koa-dir-router
```

## Options

- `dir` The absolute path to the directory where the code is stored, must
- `baseUrl` The reference URL of the request. The default is' / '
- `checkTimes` Time to detect file changes, in MS; default is 1
- `errorLog` Code method caught when the file code under the file directory executes an exception; the received value is `{path, DES, error}`
- `page404` When the file code in the file directory does not exist, the callback function receives a value of `[function] (ctx)`
- `debug` Whether to display debugging information; the default value is' true 'and the value is `[Boolean]`

## Example

Start in the same level directory of the startup program

directory structure

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
    dir: path.join(__dirname, './controller') // Incoming directory structure to access
  })
)
app.listen(3000)
```

When accessing http://localhost:3000/mis/type, it will correspond to the file code of `./controller/MIS/type.JS` under the corresponding file directory

yields:

```js
$ GET /mis/type

show-ok
```

![showOK.png](https://raw.githubusercontent.com/xueliangGit/koa-dir-router/master/showOk.png)

If you need a base address `baseUrl`

```js
// ./index.js
const dirRouter = require('koa-dir-router')
const Koa = require('koa')
const path = require('path')
var app = new Koa()

app.use(
  dirRouter({
    dir: path.join(__dirname, './controller'), // Incoming directory structure to access
    baseUrl: '/mis' // base address
  })
)
app.listen(3000)
```

When accessing http://localhost:3000/mis/mis/type, it will correspond to the file code of `./controller/MIS/type.JS` under the corresponding file directory
yields:

```js
$ GET /mis/mis/type

show-ok
```

![showOK2.png](https://raw.githubusercontent.com/xueliangGit/koa-dir-router/master/showOk2.png)

# License

MIT
