/*
 * @Author: xuxueliang
 * @Date: 2020-02-28 14:40:00
 * @LastEditors: xuxueliang
 * @LastEditTime: 2020-03-17 12:06:40
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
 * @return {null} 
 * */
module.exports = ({
  dir = null, // 程序目录
  baseUrl = '',// 基准目录
  prefixUrl = '/',// 基准目录
  checkTimes = 1000,// 检查间隔
  debug = true,//是否显示调试信息
  errorLog = () => { },
  page404 = () => { }
} = {}) => {
  return async (ctx, next) => {
    await next()
    if (ctx.response.status === 404 && dir) {
      let filePath = path.join(dir, getFilePath(ctx.request.url, baseUrl || prefixUrl))
      let requirepath = path.relative(__dirname, filePath)
      try {
        let data = require(requirepath)
        let mData = null
        if (!data._ckTime || Date.now() - data._ckTime >= checkTimes) {
          data._ckTime = Date.now()
          mData = fs.statSync(filePath + '.js')
          if (!data._mtime) {
            data._mtime = mData.mtime
          }
          if (data._mtime !== mData.mtime) {
            clearModule(requirepath)
            data = require(requirepath)
            data._ckTime = Date.now()
            data._mtime = mData.mtime
          }
        }
        try {
          await data(ctx)
        } catch (e) {
          console.log('文件 【' + filePath + '】 执行有问题')
          console.log(e)
          errorLog({
            path: filePath,
            des: '文件 【' + filePath + '】 执行有问题',
            error: e
          })
          if (debug) {
            ctx.type = 'text/html;charset=utf-8'
            ctx.body = `<div><h3>【koa-dir-router】捕获的异常信息 </h3>`
            ctx.body += "<hr>"
            ctx.body += "错误名称: " + e.name + '<br>'
            ctx.body += "<pre>错误信息: " + e.stack.replace(dir, '【koa-dir-router的工作目录下的】') + '</pre>'
            ctx.body += "<hr>"
            ctx.body += "<em style='font-size:12px;color:#999'>要想屏蔽该报错信息，需要设置【koa-dir-router】参数[debug]为[false] </em>"
            ctx.body += `<h5 style="font-size:12px;text-align:left;color:#999">koa-dir-router@${ version }</h5></div>`
          }
        }
        data = null
        mData = null
      } catch (e) {
        ctx.body = `${ ctx.request.url }  链接不存在 `
        // if (ctx.app.env === 'development') {
        //   console.log(e)
        // }
        if (typeof page404 === 'function') {
          page404(ctx) // 404页面需要自定义
        }
      }
    }
  }
}
function getFilePath (url, prefixUrl) {
  prefixUrl = prefixUrl === '/' ? '' : prefixUrl
  return url.split('?')[0].substr(prefixUrl.length)
}
