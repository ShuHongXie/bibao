'use strict';

module.exports = {
  session: {
    renew: true,
  },
  mongoose: {
    enable: true,
    package: 'egg-mongoose',
  },
  redis: {
    enable: true,
    package: 'egg-redis',
  },
  cors: {
    enable: true,
    package: 'egg-cors',
    // credentials: true,
  },
  nunjucks: {
    enable: true,
    package: 'egg-view-nunjucks',
  },
};
