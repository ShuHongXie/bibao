'use strict';

const Controller = require('egg').Controller;

class TokensController extends Controller {

  async getList() { // 获取Token信息--后台
    const ctx = this.ctx;
    try {
      const res = await ctx.service.tokens.getTokenList();
      ctx.body = res;
    } catch (e) {
      ctx.status = 500;
      ctx.body = e;
    }
  }

  async getMarketList() { // 获取市场行情
    const ctx = this.ctx;
    try {
      const res = await ctx.service.tokens.getMarketList();
      ctx.body = res;
    } catch (e) {
      ctx.status = 500;
      ctx.body = e;
    }
  }

  async getOwnMarketList() { // 获取自选行情
    const ctx = this.ctx;
    try {
      const res = await ctx.service.tokens.getOwnMarketList();
      ctx.body = res;
    } catch (e) {
      ctx.status = 500;
      ctx.body = e;
    }
  }

  async uploadIcon() { // 上传币种的icon
    const ctx = this.ctx;    
    // const target = path.join(this.config.baseDir, 'app/public/icons', `${stream.fields.name}.${filename.split('.')[1]}`);
    try {
      const res = await ctx.service.tokens.uploadIcon();
      ctx.body = res;
    } catch (e) {
      await sendToWormhole(part);
      throw e;
    }
  }

  async getTokenDetail() { // 根据Token简称获取Token详情
    const ctx = this.ctx;
    try {
      const res = await ctx.service.tokens.getTokenDetail();
      ctx.body = res;
    } catch (e) {
      ctx.status = 500;
      ctx.body = e;
    }
  }

  async setTokenDeatail() { // 根据Token简称设置Token详情
    const ctx = this.ctx;
    try {
      const res = await ctx.service.tokens.setTokenDeatail();
      ctx.body = res;
    } catch (e) {
      ctx.status = 500;
      ctx.body = e;
    }
  }

  async searchToken() { // 根据简称查找Token列表
    const ctx = this.ctx;
    try {
      const res = await ctx.service.tokens.searchToken();
      ctx.body = res;
    } catch (e) {
      ctx.status = 500;
      ctx.body = e;
    }
  }

  async getLineChart() { // 获取折线图数据
    const ctx = this.ctx;
    try {
      const res = await ctx.service.tokens.getLineChart();
      ctx.body = res;
    } catch (e) {
      ctx.status = 500;
      ctx.body = e;
    }
  }

  async changeList() { // 获取涨跌幅排行榜
    const ctx = this.ctx;
    try {
      const res = await ctx.service.tokens.changeList();
      ctx.body = res;
    } catch (e) {
      ctx.status = 500;
      ctx.body = e;
    }
  }

  async setTokenInfo() { // 修改Token信息--后台（未完成）
    const ctx = this.ctx;
    // 可修改项
    const data = {
      id: ctx.request.body.id,
      sortId: ctx.request.body.sortId,
      ico_l: ctx.request.body.ico_l,
      ico_s: ctx.request.body.ico_s,
      name: ctx.request.body.name,
      website: ctx.request.body.website,
      blocksWeb: ctx.request.body.blocksWeb,
      whiteBooks: ctx.request.body.whiteBooks,
      qq: ctx.request.body.qq,
      telegram: ctx.request.body.telegram,
      wechat: ctx.request.body.wechat,
    };
    const res = await ctx.service.tokens.serTokenInfo(data);
    ctx.body = res;
  }
}

module.exports = TokensController;
