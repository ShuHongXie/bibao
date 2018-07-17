'use strict';

const Service = require('egg').Service;
const fs = require('fs');
const path = require('path');
const sendToWormhole = require('stream-wormhole');
const Decimal = require('decimal.js');

const sleep = time => new Promise(res => setTimeout(res, time));

class TokensService extends Service {

  async getTokenList() { // 获取Token列表--后台
    const ctx = this.ctx;
    const page = ctx.query.page || 1;
    const size = ctx.query.size || 10;
    try {
      const count = await ctx.model.Tokens.find({}).count();
      const res = await ctx.model.Tokens.find({}, { _id: 0, __v: 0 })
        .sort({ id: 1 })
        .skip((parseInt(page) - 1) * size)
        .limit(parseInt(size));
      const data = {
        respcode: 100,
        respmsg: '获取Token信息成功！',
        data: {
          list: res,
          count,
        },
      };
      ctx.status = 200;
      return data;
    } catch (e) {
      ctx.status = 500;
      return e;
    }
  }

  async getMarketList() { // 获取行情列表
    const ctx = this.ctx;
    const page = ctx.query.page || 1;
    const size = ctx.query.size || 10;
    try {
      const res = JSON.parse(await this.app.redis.get('token_page' + page)) || await ctx.model.Tokens.find({}, {
        _id: 0,
        __v: 0,
        sortId: 0,
        info: 0,
        percent_change_1h: 0,
        percent_change_7d: 0 })
        .sort({ id: 1 })
        .skip((parseInt(page) - 1) * size)
        .limit(parseInt(size));
      const count = parseInt(await this.app.redis.get('token_count')) || await ctx.model.Tokens.find({}).count();
      const data = {
        respcode: 100,
        respmsg: '获取行情列表成功！',
        data: {
          list: res,
          count,
        },
      };
      ctx.status = 200;
      return data;
    } catch (e) {
      ctx.status = 500;
      return e;
    }
  }

  async getOwnMarketList() { // 获取自选行情列表
    const ctx = this.ctx;
    const page = ctx.query.page || 1;
    const size = ctx.query.size || 10;
    try {
      const temp = await ctx.model.User.findOne({ id: ctx.session.id });
      const arr = Object.keys(temp.coinList || []);
      const res = await ctx.model.Tokens.find({ symbol: { $in: arr } }, {
        _id: 0,
        __v: 0,
        sortId: 0,
        info: 0,
        percent_change_1h: 0,
        percent_change_7d: 0 })
        .sort({ sortId: -1 })
        .skip((parseInt(page) - 1) * size)
        .limit(parseInt(size));
      const count = await ctx.model.Tokens.find({ symbol: { $in: arr } }, {}).count();
      const data = {
        respcode: 100,
        respmsg: '获取自选Token列表成功！',
        data: {
          list: res,
          count,
        },
      };
      ctx.status = 200;
      return data;
    } catch (e) {
      ctx.status = 500;
      return e;
    }
  }

  async uploadIcon() { // 上传币种对应的icon
    const ctx = this.ctx;
    const parts = ctx.multipart();
    let part, query = {}, img, target;
    // parts() return a promise
    while ((part = await parts()) != null) {
      if (part.length) {
        query[part[0]] = part[1];
      } else {
        if (!part.filename) {
          // 这时是用户没有选择文件就点击了上传(part 是 file stream，但是 part.filename 为空)
          // 需要做出处理，例如给出错误提示消息
          return;
        }
        query[part.fieldname] = part.filename;
        // 文件处理，上传到云存储等等
        try { 
          const res = await ctx.model.Tokens.find({ id: query.id });
          console.log(res)
          if (res[0].icon){
            img =  res[0].icon;
            target = path.join(this.config.baseDir, 'app/public/icons',`${img}`);
          } else {
            console.log('走下面');
            await ctx.model.Tokens.update({ id: res[0].id },{ $set: { icon: res[0].en_name.toLowerCase() + '_icon.png' } }, { multi: 1, upsert: true });
            target = path.join(this.config.baseDir, 'app/public/icons',`${res[0].en_name.toLowerCase()}_icon.png`);
          }
          const writeStream = fs.createWriteStream(target);
          await part.pipe(writeStream);
          return {
            respcode: 100,
            respmsg: '上传成功',
          };
        } catch (err) {
          // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
          await sendToWormhole(part);
          throw err;
        }
      }
    }
  }

  async deletePartner() { // 删除友情链接信息
    const ctx = this.ctx;
    const id = this.ctx.request.body.id;
    let temp;
    try {
      temp = await ctx.model.Info.update({ 'trademarkToken' : '123'}, { $pull: { // 删除数据
        "trademark": {
          'id' : id,
        }
      }});
      ctx.body = {
        respcode: 100,
        respmsg: '删除成功',
        data: temp,
      }
    } catch (e) {
      ctx.status = 500;
      return e;
    }
  }

  async uploadEditor() { // 富文本多个图片上传
    const ctx = this.ctx;
    const parts = ctx.multipart();
    let part;
    const links = [];
    // parts() return a promise
    while ((part = await parts()) != null) {
      if (part.length) {
        // 如果是数组的话是 filed
        console.log('field: ' + part[0]);
        console.log('value: ' + part[1]);
        console.log('valueTruncated: ' + part[2]);
        console.log('fieldnameTruncated: ' + part[3]);
      } else {
        if (!part.filename) {
          // 这时是用户没有选择文件就点击了上传(part 是 file stream，但是 part.filename 为空)
          // 需要做出处理，例如给出错误提示消息
          return;
        }
        // part 是上传的文件流
        console.log('field: ' + part.fieldname);
        console.log('filename: ' + part.filename);
        console.log('encoding: ' + part.encoding);
        console.log('mime: ' + part.mime);
        // 文件处理，上传到云存储等等
        let result;
        try {
          const data = {
            respcode: 100,
            respmsg: '完成',
          }
        } catch (err) {
          // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
          await sendToWormhole(part);
          throw err;
        }
        console.log(result);
      }
    }
    // 全部上传完毕
    ctx.body = {
      errno: 0,
      data: links,
    };
  }

  async getTokenDetail() { // 根据Token简称获取Token详情
    const ctx = this.ctx;
    const token = ctx.query.token;
    try {
      const res = await ctx.model.Tokens.findOne({ symbol: token }, { _id: 0,
        __v: 0,
      });
      const data = {
        respcode: 100,
        respmsg: `获取${token}详情成功！`,
        data: res,
      };
      ctx.status = 200;
      return data;
    } catch (e) {
      ctx.status = 500;
      return e;
    }
  }

  async setTokenDeatail() { // 根据Token简称修改Token详情
    const ctx = this.ctx;
    const symbol = ctx.request.body.symbol; // 简称
    const data = {};
    ctx.request.body.sortId ? data.sortId = ctx.request.body.sortId : null;
    ctx.request.body.website ? data['info.website'] = ctx.request.body.website.split(',') : null;
    ctx.request.body.blocks_web ? data['info.blocks_web'] = ctx.request.body.blocks_web.split(',') : null;
    ctx.request.body.white_boooks ? data['info.white_boooks'] = ctx.request.body.white_boooks : null;
    ctx.request.body.remark ? data['info.remark'] = ctx.request.body.remark : null;
    ctx.request.body.icon ? data.icon = ctx.request.body.icon : null;
    ctx.request.body.name ? data.name = ctx.request.body.name : null;
    try {
      const res = await ctx.model.Tokens.update({ symbol }, data);
      const ret = {
        respcode: 100,
        respmsg: `修改 ${symbol} 详情成功！`,
        data: res,
      };
      ctx.status = 200;
      return ret;
    } catch (e) {
      ctx.status = 500;
      return e;
    }
  }

  async searchToken() { // 根据简称查找Token列表
    const ctx = this.ctx;
    const symbol = ctx.query.symbol;
    const res = await ctx.model.Tokens.find({ symbol }, { _id: 0, __v: 0 });
    const count = res.length;
    const data = {
      respcode: 100,
      respmsg: '查询Token信息成功！',
      data: {
        list: res,
        count,
      },
    };
    ctx.status = 200;
    return data;
  }

  async getLineChart() { // 获取折线图数据
    const ctx = this.ctx;
    const symbol = ctx.query.symbol;
    const res = await ctx.model.Tokenlist.findOne({ symbol }, { _id: 0, __v: 0, id: 0 });
    const data = {
      respcode: 100,
      respmsg: '查询Token折线图数据成功！',
      data: {
        list: res,
      },
    };
    return data;
  }

  async changeList() { // 获取涨跌幅排行榜
    const ctx = this.ctx;
    const page = ctx.query.page;
    const size = ctx.query.size;
    const sort = ctx.query.sort; // 1升序，-1降序
    const type = ctx.query.type; // 1h 7d 24h
    const count = await ctx.model.Tokens.find({ ['percent_change_' + type ]: { $ne: null } }).count();
    const res = await ctx.model.Tokens.find({ ['percent_change_' + type ]: { $ne: null } }, { _id: 0, __v: 0 })
      .sort({ ['percent_change_' + type ]: sort })
      .skip((parseInt(page) - 1) * size)
      .limit(parseInt(size));
    const data = {
      respcode: 100,
      respmsg: '查询Token涨跌排行成功！',
      data: {
        count,
        list: res,
      },
    };
    return data;
  }

  async setTokens(post) { // 写入Token信息--定时任务
    const ctx = this.ctx;
    const USD = await this.app.redis.get('USD');
    const hadToken = await ctx.model.Tokens.find({ id: post.id }).count();
    const totalData = await ctx.model.Info.findOne({});
    const data = {
      id: post.id, // 币种ID
      ico_l: post.ico_l || '',
      ico_s: post.ico_s || '',
      en_name: post.name || '', // 币种英文名
      symbol: post.symbol || '', // 币种英文简称
      total_value: new Decimal(post.quotes.USD.market_cap || 0)
        .mul(new Decimal(USD))
        .toNumber() || '', // 总市值
      market_num: post.circulating_supply || '', // 流通数量
      max_supply: post.max_supply || '', // 总发行数量
      price_USD: new Decimal(post.quotes.USD.price || 0).toNumber() || '', // 美元价格
      price_CNY: new Decimal(USD)
        .mul(new Decimal(post.quotes.USD.price || 0))
        .toNumber() || '', // 人民币价格
      volume_24h: post.quotes.USD.volume_24h || '', // 24h成交量
      totol_price_24h: new Decimal(post.quotes.USD.volume_24h || 0)
        .mul(new Decimal(USD))
        .toNumber() || '', // 24h成交额
      percent_change_1h: post.quotes.USD.percent_change_1h || '', // 1h变化
      percent_change_24h: post.quotes.USD.percent_change_24h || '', // 24h变化
      percent_change_7d: post.quotes.USD.percent_change_7d || '', // 24h变化
      'info.updated_time': Date.now(), // 更新日期
      chart_supply_ps: new Decimal(post.quotes.USD.market_cap || 0)
        .div(new Decimal(totalData.values || 0))
        .toNumber() || '',
      chart_circulation_ps: new Decimal(post.circulating_supply || 0)
        .div(new Decimal(post.max_supply || 0))
        .toNumber() || '',
      chart_turnover_ps: new Decimal(post.quotes.USD.volume_24h || 0)
        .div(new Decimal(post.quotes.USD.price || 0))
        .div(new Decimal(post.circulating_supply || 0))
        .toNumber() || '',
    };
    let res;
    try {
      if (hadToken !== 0) {
        res = await ctx.model.Tokens.update({ id: post.id }, { $set: data });
      } else {
        res = await ctx.model.Tokens.create(data);
      }
      return res;
    } catch (e) {
      throw e;
    }
  }

  async setTokenHistory(post) { // 设置Token历史记录--定时任务
    const ctx = this.ctx;
    const isExist = await ctx.model.Tokenlist.findOne({ id: post.id });
    // console.log(post);
    if (isExist) {
      isExist.date.unshift(post.last_updated * 1000);
      isExist.price.unshift(post.quotes.USD.price);
      isExist.volume.unshift(post.quotes.USD.volume_24h);
      const data = {
        date: isExist.date,
        price: isExist.price,
        volume: isExist.volume,
        symbol: post.symbol,
      };
      try {
        await ctx.model.Tokenlist.update({ id: post.id }, { $set: data });
      } catch (e) {
        throw e;
      }
    } else {
      const data = {
        id: post.id,
        symbol: post.symbol,
        date: [ post.last_updated * 1000 ],
        price: [ post.quotes.USD.price ],
        volume: [ post.quotes.USD.volume_24h ],
      };
      try {
        await ctx.model.Tokenlist.create(data);
      } catch (e) {
        throw e;
      }
    }
  }

  async setToken7d() { // 写入7天价格的Token数据--定时任务
    const ctx = this.ctx;
    const tokenList = await ctx.model.Tokenlist.find({});
    for (let i = 0, len = tokenList.length; i < len; i++) {
      await ctx.model.Tokens.update({ id: tokenList[i].id }, { $set: {
        price_change_7d: tokenList[i].price.slice(0, 30),
      } });
      sleep(500);
    }
  }

  async ramTokenData() { // 保存Token行情列表数据在缓存中--定时任务
    const ctx = this.ctx;
    let page = 1;
    const size = 20;
    try {
      const count = await ctx.model.Tokens.find({}).count();
      if (size * page < count) {
        const res = await ctx.model.Tokens.find({}, { _id: 0, __v: 0 })
          .sort({ id: 1 })
          // .sort({ sortId: 1 })
          .skip((parseInt(page) - 1) * size)
          .limit(parseInt(size));
        this.app.redis.set('token_page' + page, JSON.stringify(res));
        this.app.redis.set('token_count', JSON.stringify(count));
        page++;
        this.ramTokenData();
      }
    } catch (e) {
      ctx.status = 500;
      throw e;
    }
  }

}

module.exports = TokensService;
