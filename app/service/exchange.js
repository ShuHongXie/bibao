'use strict';

const Service = require('egg').Service;

class ExchangeService extends Service {

  async newExchange(post) { // 写入汇率
    const data = {
      name: post.name,
      price: post.price,
      date: post.date,
    };
    const ctx = this.ctx;
    const res = await ctx.model.Exchange.findOne({ name: post.name }, { _id: 0, __v: 0 });
    let temp;
    if (res) {
      temp = await this.ctx.model.Exchange.update({ name: post.name }, { $set: data });
    } else {
      temp = await this.ctx.model.Exchange.create(data);
    }
    return temp;
  }
}

module.exports = ExchangeService;
