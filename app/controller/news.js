'use strict';

const Controller = require('egg').Controller;

class NewsController extends Controller {

  async getList() { // 获取新闻列表
    const ctx = this.ctx;
    const page = ctx.query.page || 1;
    const size = ctx.query.size || 10;
    const type = ctx.query.type || 0;
    const res = await ctx.service.news.getList(page, size, type);
    ctx.body = res;
  }

  async getContent() { // 根据新闻id获取新闻主内容
    const ctx = this.ctx;
    const res = await ctx.service.news.getContent();
    ctx.status = 200;
    ctx.body = res;
  }

  async putArticle() { // 发布新闻
    const ctx = this.ctx;
    try {
      const res = await ctx.service.news.putArticle();
      ctx.body = res;
    } catch (e) {
      ctx.status = 500;
      ctx.body(e);
    }
  }

  async updateArticle() { // 修改新闻
    const ctx = this.ctx;
    try {
      const res = await ctx.service.news.updateArticle();
      ctx.body = res;
    } catch (e) {
      ctx.status = 500;
      ctx.body(e);
    }
  }

  async setIndexNews() { // 首页新闻设置
    const ctx = this.ctx;
    try {
      const res = await ctx.service.news.setIndexNews();
      ctx.body = res;
    } catch (e) {
      ctx.status = 500;
      ctx.body = e;
    }
  }

}

module.exports = NewsController;
