/*
 * @Author: xuxueliang
 * @Date: 2020-02-28 14:40:00
 * @LastEditors: xuxueliang
 * @LastEditTime: 2020-04-16 18:02:10
 */
const path = require('path')
const fs = require('fs')
const clearModule = require('clear-module')
const version = require('./package.json').version
/**
 * @method dirRouter
 * @param {String} dir 程序目录
 * @param {String} baseUrl 基准目录
 * @param {String} prefixUrl 基准目录
 * @param {Number} checkTimes 检查间隔ms
 * @param {Boolean} debug 是否显示调试信息
 * @param {Functin} errorLog 异常捕获记录
 * @param {Functin} page404 404页面
 * @param {Functin} context 函数调用的上下问对象 默认时global
 * @return {null} 
 * */
module.exports = ({
  dir = null, // 程序目录
  baseUrl = '',// 基准目录
  prefixUrl = '/',// 基准目录
  checkTimes = 1000,// 检查间隔
  debug = true,//是否显示调试信息
  errorLog = () => { },
  context = global,
  page404 = () => { }
} = {}) => {
  return async (ctx, next) => {
    await next()
    ctx.dirRouter = { debug, errorLog, dir }
    if (ctx.response.status === 404 && dir) {
      let filePath = path.join(dir, getFilePath(ctx.request.url, baseUrl || prefixUrl))
      let requirepath = path.relative(__dirname, filePath)
      try {
        let data = require(requirepath)

        let mData = null
        if (!data._ckTime || Date.now() - data._ckTime >= checkTimes) {
          data._ckTime = Date.now()
          let _filePath = filePath + '.js'
          if (!fs.existsSync(_filePath)) {
            _filePath = filePath + '/index.js'
          }
          mData = await fs.statSync(_filePath)
          const mtime = mData.mtime.toString()
          if (!data._mtime) {
            data._mtime = mtime
          }
          if (data._mtime !== mtime) {
            clearModule(requirepath)
            data = require(requirepath)
            data._ckTime = Date.now()
            data._mtime = mtime
          }
        }
        try {
          if (typeof data === 'function') {
            await data.call(context, ctx)
          } else {

            handleError(new Error(filePath + '不是一个函数'), filePath, ctx)
          }
        } catch (e) {
          handleError(e, filePath, ctx)
        }
        data = null
        mData = null
      } catch (e) {

        if (e.toString().indexOf('no such file')) {
          ctx.body += `${ ctx.request.url }  链接不存 \r`
        } else {
          handleError(e, filePath, ctx)
        }
        if (ctx.app.env === 'development') {
          console.log(e)
        }
        if (typeof page404 === 'function') {
          page404(ctx) // 404页面需要自定义
        }
      }
    }
  }
}
function handleError (e, filePath, ctx) {
  console.log('文件 【' + filePath + '】 执行有问题')
  typeof ctx.dirRouter.errorLog === 'function' && ctx.dirRouter.errorLog({
    path: filePath,
    des: '文件 【' + filePath + '】 执行有问题',
    error: e
  })
  ctx.type = 'text/html;charset=utf-8'
  if (ctx.dirRouter.debug) {
    ctx.body = `<div><h3>【koa-dir-router】捕获的异常信息 </h3>`
    ctx.body += "<hr>"
    ctx.body += "错误名称: " + e.name + '<br>'
    ctx.body += "<pre>错误信息: " + e.stack.replace(ctx.dirRouter.dir, '【koa-dir-router的工作目录下的】') + '</pre>'
    ctx.body += "<hr>"
    ctx.body += "<em style='font-size:12px;color:#999'>要想屏蔽该报错信息，需要设置【koa-dir-router】参数[debug]为[false] </em>"
  } else {
    ctx.body = `${ ctx.request.url }  访问出错\r`
    ctx.body += "<hr>"
  }
  ctx.body += `<h5 style="font-size:16px;text-align:left;color:#999"><a target='_blank' href='https://www.npmjs.com/package/koa-dir-router'>koa-dir-router@${ version } 提供路由服务</a></h5></div>`
}
function getFilePath (url, prefixUrl) {
  prefixUrl = prefixUrl === '/' ? '' : prefixUrl
  return url.split('?')[0].substr(prefixUrl.length)
}
