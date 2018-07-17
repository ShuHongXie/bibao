'use strict';

const Service = require('egg').Service;
const Decimal = require('decimal.js');

class PublicService extends Service {

  async getLogs() { // 获取管理操作日志
    const ctx = this.ctx;
    const page = ctx.query.page || 1;
    const size = ctx.query.size || 10;
    try {
      const res = await ctx.model.Log.find({}, { _id: 0, __v: 0 })
        .sort({ date: -1 })
        .skip((parseInt(page) - 1) * size)
        .limit(parseInt(size));
      const count = await ctx.model.Log.find({}).count();
      const data = {
        respcode: 100,
        respmsg: '获取管理操作日志成功！',
        data: {
          count,
          list: res,
        },
      };
      ctx.status = 200;
      return data;
    } catch (e) {
      ctx.status = 500;
      return e;
    }
  }

  async getInfo() { // 获取网站信息
    const ctx = this.ctx;
    try {
      const res = await ctx.model.Info.findOne({}, { _id: 0, __v: 0 });
      const data = {
        respcode: 100,
        respmsg: '获取网站信息成功！',
        data: res,
      };
      ctx.status = 200;
      return data;
    } catch (e) {
      ctx.status = 500;
      return e;
    }
  }

  async setInfo() { // 设置网站信息
    const ctx = this.ctx;
    const data = {};
    if (ctx.request.body.tip) data.tip = ctx.request.body.tip;
    if (ctx.request.body.qq) data.qq = ctx.request.body.qq;
    if (ctx.request.body.wechat) data.wechat = ctx.request.body.wechat;
    if (ctx.request.body.email) data.email = ctx.request.body.email;
    if (ctx.request.body.phone) data.phone = ctx.request.body.phone;
    try {
      // const temp = await ctx.model.Info.update({ _id: '5b1f6b274bf5ce10bc0ba131' }, { $set: data });
      const count = await ctx.model.Info.find({});
      console.log(count);
      let temp = null;
      if (count.length > 0) {
        temp = await ctx.model.Info.update({ _id: count[0]._id }, { $set: data });
      } else {
        temp = await ctx.model.Info.create(data);
      }
      ctx.status = 200;
      return {
        respcode: 100,
        respmsg: '设置网站信息成功',
        data: temp,
      };
    } catch (e) {
      ctx.status = 500;
      return e;
    }

  }

  async setWebInfo() { // 设置网站数据--定时任务
    const ctx = this.ctx;
    // const data = {};
    try {
      const res = await ctx.model.Tokens.find({}, { _id: 0, __v: 0 });
      let total_value = 0,
        volume_24h = 0;
      for (let i = 0, len = res.length; i < len; i++) {
        if (res[i].total_value) {
          total_value = new Decimal(total_value).add(new Decimal(res[i].total_value)).toNumber();
        }
        if (res[i].volume_24h) {
          volume_24h = new Decimal(volume_24h).add(new Decimal(res[i].volume_24h)).toNumber();
        }
      }
      const data = {
        volume: parseInt(volume_24h),
        values: parseInt(total_value),
        tokenNums: res.length,
      };
      // 判断信息表是否有信息
      const count = await ctx.model.Info.find({});
      if (count.length > 0) {
        await ctx.model.Info.update({ _id: count[0]._id }, { $set: data });
      } else {
        await ctx.model.Info.create(data);
      }
    } catch (e) {
      ctx.status = 500;
      return e;
    }
  }

  async getExchange() { // 获取汇率接口
    const ctx = this.ctx;
    const exchangeList = await this.app.redis.get('exchangeList');
    const res = JSON.parse(exchangeList) || await ctx.model.Exchange.find({}, { _id: 0, __v: 0 }).sort({ name: -1 });
    return {
      respcode: 100,
      respmsg: '获取汇率成功',
      data: res,
    };
  }

  async getSectorChartBySymbol() { // 获取Token的扇形图数据
    const ctx = this.ctx;
    const symbol = ctx.query.symbol;
    const res = await ctx.model.Tokens.findOne({ symbol }, { _id: 0, chart_supply_ps: 1, chart_circulation_ps: 1, chart_turnover_ps: 1 });
    ctx.status = 200;
    console.log(res);
    return {
      respcode: 100,
      respmsg: '获取扇形图数据成功',
      data: res,
    };
  }
}

module.exports = PublicService;
