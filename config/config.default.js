'use strict';
const path = require('path');

module.exports = appInfo => {
  const config = exports = {};
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1524463351192_3795';

  config.security = {
    csrf: {
      enable: false,
      // headerName: 'csrfToken',
      // useSession: true, // 默认为 false，当设置为 true 时，将会把 csrf token 保存到 Session 中
      // cookieName: 'csrfToken', // Cookie 中的字段名，默认为 csrfToken
      // sessionName: 'csrfToken', // Session 中的字段名，默认为 csrfToken
      // headerName: 'x-csrf-token',
      ignoreJSON: true, // 允许
    },
    domainWhiteList: [ 'http://127.0.0.1:8081', 'http://127.0.0.1:8020', 'http://127.0.0.1:57451', 'http://192.168.50.156:8080' ],
  };
  config.mongoose = {
    client: {
      url: 'mongodb://127.0.0.1/test',
      options: {},
    },
  };
  config.redis = {
    client: {
      port: 6379, // Redis port
      host: '127.0.0.1', // Redis host
      password: 'auth',
      db: 0,
    },
  };

  config.session = {
    key: 'EGG_SESS',
    maxAge: 0.5 * 3600 * 1000, // 半小时
    // maxAge: 60 * 1000, // 半小时
    httpOnly: true,
    encrypt: true,
    renew: true,
  };
  config.cors = {
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    credentials: true,
  };

  config.view = {
    defaultViewEngine: 'nunjucks',
    root: [
      path.join(appInfo.baseDir, 'app/view'),
      // path.join(appInfo.baseDir, 'path/to/another'),
    ].join(','),
    view: {
      mapping: {
        '.nj': 'nunjucks',
      },
    },
  };

  // add your config here
  // config.middleware = [ 'errorHandler' ];

  return config;
};
