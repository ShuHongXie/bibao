'use strict';

// 管理员日志的操作内容
const link = {
  '/v1/user/updateUserInfo': '更新用户信息',
  '/v1/admin/changeUserStatus': '更改用户状态，用户id为：',
  '/v1/admin/addAdmin': '新增管理员：',
  '/v1/public/setInfo': '设置网站信息',
};

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
    // 写入管理员操作日志
    if (ctx.request.url === '/v1/admin/addAdmin') {
      null;
    } else if (ctx.request.method === 'POST') {
      await ctx.model.Log.create({
        id: ctx.session.id,
        phone: ctx.session.phone,
        date: Date.now(),
        action: link[ctx.request.url] + (ctx.request.body.id || ''),
      });
    }
    // 下一步
    await next();
  };
};
