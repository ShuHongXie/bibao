'use strict';

module.exports = () => {
  return async function isLogin(ctx, next) {
    // 判断session中是否有token，来判断是否过期
    if (!ctx.session.token) {
      ctx.status = 202;
      ctx.body = {
        respcode: 500,
        respmsg: '登录过期，请重新登录！',
      };
      return false;
    }
    // csrf安全token验证，判断请求头中的token是否与session中的一致
    if (ctx.request.header.csrftoken !== ctx.session.token) {
      ctx.status = 202;
      ctx.body = {
        respcode: 500,
        respmsg: '您没有操作权限！',
      };
      return false;
    }
    // 下一步
    await next();
  };
};
