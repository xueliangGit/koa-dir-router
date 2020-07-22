# 1.1.6 / 2020-07-22

- 增加`acceptMethods` `[String]`参数，支持设定接受的方法 默认是 '\*' ，规范是 'get,post'
- 增加`httpMethod` `[Array]`参数，支持扩展检测支持的方法 默认是`[get,post,put,delete]`
- 增加`ctx.dirRouter`增加方法捕获的事件【'暂仅支持 get,post,put,delete‘允许进行扩展 httpMethod】允许在方法内针对不同的请求方法进行分别处理；前提；该方法在`httpMethod`内包含，所择会提示错误

  ```js
  module.exports = async function (ctx) {
    await ctx.dirRouter.get((c) => {
      console.log('执行了Get')
    })
    await ctx.dirRouter.post((c) => {
      console.log('执行了POST')
    })
  }
  ```

# 1.1.3 / 2020-04-16

- 修复 bug，优化一场捕获

# 1.0.7 / 2020-03-3

- add prefixUrl,delete baseUrl
- remove `fs-extra` module

# 1.0.6 / 2020-03-1

- add debug, page404

# 1.0.0 / 2020-02-28

- add koa-dir-router
