/*
 * @Author: xuxueliang
 * @Date: 2020-02-28 14:40:00
 * @LastEditors: xuxueliang
 * @LastEditTime: 2020-02-28 16:59:57
 */
const path = require('path')
const fs = require('fs-extra')
const clearModule = require('clear-module')

module.exports = ({ dir = null, baseUrl = '/', checkTimes = 1, errorLog = () => { } } = {}) => {
  return async (ctx, next) => {
    await next()
    if (ctx.response.status === 404 && dir) {
      let filePath = path.join(dir, getFilePath(ctx.request.url, baseUrl))
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
          data(ctx)
        } catch (e) {
          console.log('文件 【' + filePath + '】 执行有问题')
          console.log(e)
          errorLog({
            path: filePath,
            des: '文件 【' + filePath + '】 执行有问题',
            error: e
          })
        }
        data = null
        mData = null
      } catch (e) {
        // if (ctx.app.env === 'development') {
        //   console.log(e)
        // }
      }
    }
  }
}
function getFilePath (url, baseUrl) {
  baseUrl = baseUrl === '/' ? '' : baseUrl
  return url.split('?')[0].substr(baseUrl.length)
}
