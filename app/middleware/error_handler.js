'use strict';

module.exports = () => {
  return async function isLogin(ctx, next) {
    // console.log(ctx.header.csrftoken);
    console.log(ctx.session);
    if (!ctx.session.id) {
      ctx.status = 509;
      ctx.body = {
        code: 509,
        msg: '您没有操作权限！',
      };
      return false;
    }
    await next();
  };
};
