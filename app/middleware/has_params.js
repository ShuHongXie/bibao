'use strict';

module.exports = options => {
  return async function isLogin(ctx, next) {
    if (!ctx.session.id) {
      ctx.status = 509;
      ctx.body = {
        code: 509,
        msg: '您没有操作权限！',
        options,
      };
      return false;
    }
    await next();
  };
};
