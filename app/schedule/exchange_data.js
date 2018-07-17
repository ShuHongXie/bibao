'use strict';

const Subscription = require('egg').Subscription;
/**
 * coinmarketcap的接口每分钟请求限制在30次内
 */
const Decimal = require('decimal.js');
// 利用async来进行sleep操作
const sleep = time => new Promise(res => setTimeout(res, time));

class ExchangeData extends Subscription {
  static get schedule() {
    return {
      cron: '0 0 0,6,12,18 * * *', // 0,6,12,18点执行一次
      type: 'worker', // all所有进程都执行，worker单台机器单进程执行
      immediate: true,
      // disable: false, 关闭定时任务
    };
  }

  async subscribe() {
    const ctx = this.ctx;
    const res = await ctx.curl('http://web.juhe.cn:8080/finance/exchange/rmbquot?key=c5242a74aafc22687734d36692b8ea35', {
      dataType: 'json',
    });
    const exDatas = res.data.result[0];
    exDatas.data0 = {
      name: '人民币',
      bankConversionPri: '100',
      date: exDatas.data1.date,
      time: exDatas.data1.time,
    };
    for (const i in exDatas) {
      const res = {};
      if (exDatas[i].name === '美元') {
        this.app.redis.set('USD', new Decimal(exDatas[i].bankConversionPri).div(100));
      }
      res.name = exDatas[i].name;
      res.date = `${exDatas[i].date} ${exDatas[i].time}`;
      res.price = new Decimal(exDatas[i].bankConversionPri).div(100);
      try {
        await ctx.service.exchange.newExchange(res);
      } catch (e) {
        throw e;
      }
      await sleep(500);
    }
    const list = await ctx.model.Exchange.find({}, { _id: 0, __v: 0 }).sort({ name: -1 });
    this.app.redis.set('exchangeList', JSON.stringify(list));
  }
}


module.exports = ExchangeData;
