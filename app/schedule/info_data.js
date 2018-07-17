'use strict';

const Subscription = require('egg').Subscription;

/**
 * coinmarketcap的接口每分钟请求限制在30次内
 */

// 利用async来进行sleep操作
const sleep = time => new Promise(res => setTimeout(res, time));

class InfoData extends Subscription {
  static get schedule() {
    return {
      cron: '0 0 2,8,14,20 * * *', // 每天4次执行
      type: 'worker', // all所有进程都执行，worker单台机器单进程执行
      immediate: true,
      // disable: false, 关闭定时任务
    };
  }
  // 订阅
  async subscribe() {
    const ctx = this.ctx;
    const res = await ctx.curl('https://api.coinmarketcap.com/v2/ticker/?start=1&limit=100', {
      dataType: 'json',
    });
    const nums = res.data.metadata.num_cryptocurrencies;
    await ctx.service.public.setWebInfo();
    await sleep(1000);
    // 循环获取
    for (let i = 1; i < nums; i += 100) {
      try {
        const temp = await this.ctx.curl(`https://api.coinmarketcap.com/v2/ticker/?start=${i}&limit=100`, {
          dataType: 'json',
        });
        for (const j in temp.data.data) {
          try {
            await ctx.service.tokens.setTokenHistory(temp.data.data[j]);
          } catch (e) {
            throw temp.data.data[j].symbol + ' no set,id:' + temp.data.data[j].id + 'data is:' + temp.data.data[j];
          }
        }
      } catch (e) {
        throw e;
      }
      await sleep(5000);
    }
    await ctx.service.tokens.setToken7d();
  }
}

module.exports = InfoData;
