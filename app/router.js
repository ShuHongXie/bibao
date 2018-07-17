'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // const errorHandler = app.middleware.errorHandler();
  const adminHandler = app.middleware.adminHandler();
  const userHandler = app.middleware.userHandler();

  router.get('/', controller.home.index);
  router.get('/newsList', controller.home.newsList);
  router.get('/app', controller.home.appPage);
  router.get('/token/:token', controller.home.tokenDetail);
  router.get('/notice/:page', controller.home.noticeList);
  router.get('/noticeDetail/:id', controller.home.noticeDetail);
  router.get('/risefall', controller.home.risefall);
  router.get('/about', controller.home.about); // 关于我们页
  router.get('/contactUs', controller.home.contactUs); // 联系我们页
  router.get('/commonProblem', controller.home.commonProblem); // 常见问题页
  router.get('/statement', controller.home.statement); // 免责声明页

  // 新闻
  router.get('/v1/news/getList', adminHandler, controller.news.getList);// 获取新闻列表
  router.get('/v1/news/getContent', adminHandler, controller.news.getContent);// 根据id获取新闻内容
  router.post('/v1/news/put', adminHandler, controller.news.putArticle);// 发布新闻
  router.post('/v1/news/updateArticle', adminHandler, controller.news.updateArticle);// 发布新闻
  router.post('/v1/news/setIndexNews', adminHandler, controller.news.setIndexNews);// 设置首页新闻

  // 前端用户
  router.post('/v1/user/getSmsCode', controller.user.getSmsCode);// 获取短信验证码
  router.post('/v1/user/reg', controller.user.reg);// 用户注册
  router.post('/v1/user/login', controller.user.login); // 用户登录
  router.post('/v1/user/retrieve', controller.user.retrieve); // 用户找回密码
  router.post('/v1/user/selectToken', userHandler, controller.user.selectToken);// 自选行情
  router.get('/v1/user/getUserTokenList', userHandler, controller.user.getUserTokenList);// 自选行情

  // 后台登录接口
  router.post('/v1/admin/login', controller.user.adminLogin);// 管理登录
  router.post('/v1/admin/logout', controller.user.adminLogout);// 管理注销

  // 后台用户管理接口
  router.get('/v1/admin/getUserList', adminHandler, controller.user.getUserList);// 获取用户列表
  router.get('/v1/admin/getUserInfo', adminHandler, controller.user.getUserInfo);// 获取用户详细信息
  router.post('/v1/admin/changeUserStatus', adminHandler, controller.user.changeUserStatus);// 修改用户状态
  router.post('/v1/admin/removeUser', adminHandler, controller.user.removeUser);// 删除用户

  // 用户反馈
  router.post('/v1/public/setAdvices', controller.public.setAdvices); // 联系我们页发出反馈和建议
  router.post('/v1/public/deleteAdvices', controller.public.deleteAdvices); // 删除用户反馈信息
  router.get('/v1/public/getAdvices', controller.public.getAdvices); // 获取用户反馈和建议列表

  // 后台管理员相关接口
  router.get('/v1/admin/getAdminList', adminHandler, controller.user.getAdminList);// 获取管理员列表
  router.post('/v1/admin/addAdmin', adminHandler, controller.user.addAdmin);// 新增管理员
  router.get('/v1/admin/getLogs', adminHandler, controller.public.getLogs);// 获取管理员操作日志

  // 公共接口
  router.post('/v1/public/upload', controller.public.upload);// 上传文件接口
  router.post('/v1/public/uploadEditor', controller.public.uploadEditor);// 上传文件接口
  router.post('/v1/public/uploadPartner', controller.public.uploadPartner);// 上传友情链接文件接口
  router.post('/v1/public/deletePartner', controller.public.deletePartner);// 删除友情链接文件接口
  router.get('/v1/public/getInfo', adminHandler, controller.public.getInfo);// 获取网站信息
  router.post('/v1/public/setInfo', adminHandler, controller.public.setInfo);// 设置网站信息
  router.get('/v1/public/getExchange', controller.public.getExchange);// 获取汇率信息


  // Tokens接口
  router.get('/v1/tokens/getList', adminHandler, controller.tokens.getList);// 获取tokens列表
  router.get('/v1/tokens/getMarketList', controller.tokens.getMarketList);// 获取首页行情列表
  router.get('/v1/tokens/changeList', controller.tokens.changeList);// 获取涨跌幅列表
  router.get('/v1/tokens/getTokenDetail', adminHandler, controller.tokens.getTokenDetail);// 获取首页行情列表
  router.post('/v1/tokens/setTokenDeatail', adminHandler, controller.tokens.setTokenDeatail);// 获取首页行情列表
  router.post('/v1/tokens/searchToken', adminHandler, controller.tokens.searchToken);// 获取自选行情列表
  router.post('/v1/tokens/uploadIcon', adminHandler, controller.tokens.uploadIcon);// 上传币种的icon图标

  router.get('/v1/tokens/getOwnMarketList', userHandler, controller.tokens.getOwnMarketList);// 获取自选行情列表

  router.get('/v1/tokens/getLineChart', controller.tokens.getLineChart);// 获取折线图
  router.get('/v1/tokens/getSectorChartBySymbol', controller.public.getSectorChartBySymbol);// 获取扇形图
};
