'use strict';

const Subscription = require('egg').Subscription;

/**
 * coinmarketcap的接口每分钟请求限制在30次内
 */

const sleep = time => new Promise(res => setTimeout(res, time));

class TokenData extends Subscription {
  static get schedule() {
    return {
      cron: '0 */5 * * * *', // 每5分钟执行一次
      type: 'worker', // all所有进程都执行，worker单台机器单进程执行
      immediate: true,
      // disable: false, 关闭定时任务
    };
  }
  async subscribe() { // 订阅事件
    const ctx = this.ctx;
    const res = await ctx.curl('https://api.coinmarketcap.com/v2/ticker/?start=1&limit=100', {
      dataType: 'json',
    });
    // 获取完Tokens总数后，休眠2秒
    const nums = res.data.metadata.num_cryptocurrencies;
    await ctx.service.tokens.ramTokenData();
    await sleep(2000);
    // 循环获取
    for (let i = 1; i < nums; i += 100) {
      try {
        const temp = await this.ctx.curl(`https://api.coinmarketcap.com/v2/ticker/?start=${i}&limit=100`, {
          dataType: 'json',
        });
        //console.log(i);
        //console.log(`https://api.coinmarketcap.com/v2/ticker/?start=${i}&limit=100`);
        for (const j in temp.data.data) { // 循环写入100个Token
          try {
            await ctx.service.tokens.setTokens(temp.data.data[j]);
          } catch (e) {
            throw temp.data.data[j].symbol + ' no set,id:' + temp.data.data[j].id + 'data is:' + temp.data.data[j];
          }
        }
      } catch (e) {
        continue;
        // throw e;
      }
      // await sleep(5000);
    }
  }
}

module.exports = TokenData;
