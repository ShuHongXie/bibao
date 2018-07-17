'use strict';

const Service = require('egg').Service;
const xss = require('xss'); // 防止xss攻击

class NewsService extends Service {
  async getList(page, size, type) { // 获取文章列表
    const ctx = this.ctx;
    try {
      // 查询列表
      const count = await ctx.model.News.find({}).count();
      const res = await ctx.model.News.find({ type }, { _id: 0, __v: 0, 'meta.create_date': 0 }, [ 'id', 'title', 'content', 'meta.updatedDate' ])
        .sort({ id: 'desc' })
        .skip((parseInt(page) - 1) * size)
        .limit(parseInt(size));
      // 把新闻内容去掉html标签，并截取字数
      const regx = /<[^>]*>|<\/[^>]*>/gm;
      for (let i = 0; i < res.length; i++) {
        res[i].content = res[i].content.replace(regx, '');
        if (res[i].content.length > 100) {
          res[i].content = res[i].content.slice(0, 100);
        }
      }
      // 查询成功操作
      const data = {
        respcode: 100,
        respmsg: '查询列表成功！',
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

  async getId() { // 获取当前最大id
    return this.ctx.model.News.findOne({}, [ 'id' ]).sort({ id: 'desc' });
  }

  async getContent() { // 根据id获取新闻内容
    const ctx = this.ctx;
    const id = ctx.query.id;
    try {
      const res = await ctx.model.News.findOne({ id }, { _id: 0, __v: 0, 'meta.createDate': 0 }, [ 'id', 'title', 'content', 'meta.updatedDate' ]);
      // 查询成功操作
      const data = {
        respcode: 100,
        respmsg: '获取新闻内容成功！',
        data: res,
      };
      ctx.status = 200;
      return data;
    } catch (e) {
      ctx.status = 500;
      return e;
    }
  }

  async putArticle() { // 发布新闻
    const ctx = this.ctx;
    const title = ctx.request.body.title;
    const content = xss(ctx.request.body.content);
    const author = ctx.session.name;
    const type = ctx.request.body.type || 0;
    const maxId = await ctx.service.news.getId();
    if (!title || !content) {
      ctx.body = {
        respcode: 201,
        respmsg: '参数传递错误，请查看参数是否为空',
        data: null,
      };
      ctx.status = 500;
      return false;
    }
    const news = {
      id: maxId !== null ? maxId.id + 1 : 1,
      title,
      content,
      author,
      type,
      meta: {
        create_date: Date.now(),
        updated_date: Date.now(),
      },
    };
    try {
      const res = await this.ctx.model.News.create(news);
      ctx.status = 200;
      return {
        respcode: 100,
        respmsg: '添加新闻成功！',
        data: res,
      };
    } catch (e) {
      throw e;
    }
  }

  async updateArticle() { // 修改新闻
    const ctx = this.ctx;
    const id = ctx.request.body.id;
    const title = ctx.request.body.title;
    const content = xss(ctx.request.body.content);
    const author = ctx.session.name;
    // const type = ctx.request.body.type || 0;
    if (!id || !title || !content) {
      ctx.status = 500;
      return {
        respcode: 201,
        respmsg: '参数传递错误，请查看参数是否为空',
        data: null,
      };
    }
    const news = {
      title,
      content,
      author,
      'meta.updated_date': Date.now(),
    };
    try {
      const res = await this.ctx.model.News.update({ id }, { $set: news });
      ctx.status = 200;
      return {
        respcode: 100,
        respmsg: '修改新闻成功！',
        data: res,
      };
    } catch (e) {
      throw e;
    }
  }

  async setIndexNews() { // 首页新闻展示
    const ctx = this.ctx;
    const news1 = ctx.request.body.news1;
    const news2 = ctx.request.body.news2;
    const news3 = ctx.request.body.news3;
    try {
      // const temp = await ctx.model.Info.update({ _id: '5b1f6b274bf5ce10bc0ba131' }, { $set: data });
      const count = await ctx.model.Info.find({});
      let temp = null;

      let temp1,
        temp2,
        temp3;
      const data = {};
      // 获取新闻
      const regx = /<[^>]*>|<\/[^>]*>/gm;
      // 判断是否有3条新闻的参数
      if (news1.id && news1.pic) {
        temp1 = await ctx.model.News.findOne({ id: news1.id });
        temp1.title.length > 12 ? data.news1Title = temp1.title.slice(0, 12) + '...' : data.news1Title = temp1.title;
        temp1.content.length > 60 ? data.news1Content = temp1.content.replace(regx, '').slice(0, 60) + '...' : data.news1Content = temp1.content.replace(regx, '');
        data.news1Pic = news1.pic || '';
        data.news1Id = news1.id;
      }
      if (news2.id && news2.pic) {
        temp2 = await ctx.model.News.findOne({ id: news2.id });
        data.news2Title = (temp2.title.length > 12 ? temp2.title.slice(0, 12) + '...' : temp2.title);
        data.news2Content = (temp2.content.length > 60 ? temp2.content.replace(regx, '').slice(0, 60) + '...' : temp2.content.replace(regx, ''));
        data.news2Pic = news2.pic || '';
        data.news2Id = news2.id;
      }
      if (news3.id && news3.pic) {
        temp3 = await ctx.model.News.findOne({ id: news3.id });
        data.news3Title = (temp3.title.length > 12 ? temp3.title.slice(0, 12) + '...' : temp3.title);
        data.news3Content = (temp3.content.length > 60 ? temp3.content.replace(regx, '').slice(0, 60) + '...' : temp3.content.replace(regx, ''));
        data.news3Pic = news3.pic || '';
        data.news3Id = news3.id;
      }
      // 如果数据库中有数据则修改，否则添加
      if (count.length > 0) {
        temp = await ctx.model.Info.update({ _id: count[0]._id }, { $set: data });
      } else {
        temp = await ctx.model.Info.create(data);
      }
      ctx.status = 200;
      return {
        respcode: 100,
        respmsg: '设置首页新闻成功',
        data: temp,
      };
    } catch (e) {
      ctx.status = 500;
      return e;
    }
  }

}

module.exports = NewsService;
