'use strict';

const Controller = require('egg').Controller;


function toThousands(num) {
  return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
}
function getDate(str) { // 格式化日期
  let date = new Date(str);
  date = `${date.getFullYear()}年${date.getMonth() > 9 ? date.getMonth() : '0' + date.getMonth()}月${date.getDate() > 9 ? date.getDate() : '0' + date.getDate()}日`;
  return date;
}
class HomeController extends Controller {
  async index() {
    // this.ctx.body = 'hi, egg';
    // await this.app.redis.set('test', 'goodgoodstudy');
    // this.ctx.body = await this.app.redis.get('USD');
    // this.ctx.body = await this.ctx.model.Tokens
    //   // .find({ id: { $mod: [ 100, 0 ] } })
    //   .find({ symbol: { $in: [ 'BTC', 'ETH', 'EOS' ] } })
    //   .sort({ 'info.updated_time': 1 });
    // this.ctx.body = await this.ctx.model.Tokens.find({ symbol: 'BTC' }).count();
    const ctx = this.ctx;
    const res = await ctx.service.public.getInfo();
    res.data.volume = toThousands(res.data.volume);
    const data = {
      info: {
        volume: toThousands(res.data.volume),
        values: toThousands(res.data.values),
        tip: res.data.tip,
        tokenNums: res.data.tokenNums,
        qq: res.data.qq,
        wechat: res.data.wechat,
        trademark: res.data.trademark,
        phone: res.data.phone, // 主页右侧电话号码
        email: res.data.email, // 主页右侧邮箱地址
      },
      news: [
        {
          title: res.data.news1Title,
          content: res.data.news1Content,
          pic: res.data.news1Pic,
          id: res.data.news1Id,
        },
        {
          title: res.data.news2Title,
          content: res.data.news2Content,
          pic: res.data.news2Pic,
          id: res.data.news2Id,
        },
        {
          title: res.data.news3Title,
          content: res.data.news3Content,
          pic: res.data.news3Pic,
          id: res.data.news3Id,
        },
      ],
    };
    ctx.body = await ctx.renderView('home/index.nj', data);
  }
  async test() {
    const ctx = this.ctx;
    const data = {
      name: ctx.params.id,
      team: {
        name: 'lisi',
        age: 18,
      },
      list: [
        { name: 'ewrew', age: 45 },
        { name: 'adsa', age: 45 },
      ],
    };
    ctx.body = await ctx.renderView('home/index.nj', data);
  }
  // async commonInfo
  async newsList() { // 新闻列表
    const ctx = this.ctx;
    const news = await ctx.service.news.getList(1, 10, 0);
    console.log(news.data);

    const info = await ctx.service.public.getInfo();
    info.data.volume = toThousands(info.data.volume);
    const data = {
      info: {
        volume: toThousands(info.data.volume),
        values: toThousands(info.data.values),
        tip: info.data.tip,
        tokenNums: info.data.tokenNums,
        phone: info.data.phone, // 主页右侧电话号码
        email: info.data.email, // 主页右侧邮箱地址
      },
    };
    ctx.body = await ctx.renderView('news/news-list.nj', data);
  }

  async appPage() { // app下载页面
    const ctx = this.ctx;
    const res = await ctx.service.public.getInfo();
    res.data.volume = toThousands(res.data.volume);
    const data = {
      info: {
        volume: toThousands(res.data.volume),
        values: toThousands(res.data.values),
        tip: res.data.tip,
        tokenNums: res.data.tokenNums,
        qq: res.data.qq,
        wechat: res.data.wechat,
        trademark: res.data.trademark,
        phone: res.data.phone, // 主页右侧电话号码
        email: res.data.email, // 主页右侧邮箱地址
      },
    };
    ctx.body = await ctx.renderView('pages/app.nj', data);
  }

  async tokenDetail() { // Token详情页面
    const ctx = this.ctx;
    // 网站信息
    const res = await ctx.service.public.getInfo();
    res.data.volume = toThousands(res.data.volume);
    // Token信息
    const token = await ctx.model.Tokens.findOne({ symbol: { $regex: ctx.params.token, $options: 'i' } }, { _id: 0,
      __v: 0,
    });
    // console.log('-----------------------------------');
    // console.log(res);
    console.log('------------------------------token');
    console.log(token.info['updated_time']);
    console.log('------------------------------token结束');
    const data = {
      info: {
        volume: toThousands(res.data.volume),
        values: toThousands(res.data.values),
        tip: res.data.tip,
        tokenNums: res.data.tokenNums,
        qq: res.data.qq, // 主页右侧QQ固定图片
        wechat: res.data.wechat, // 主页右侧页微信图片
        trademark: res.data.trademark, // 友情链接列表
        qqGroup: res.data.qqGroup, // qq群二维码
        wechatGroup: res.data.wechatGroup, // 微信群二维码
        regionGroup: res.data.regionGroup, // 区域电报群二维码
        phone: res.data.phone, // 主页右侧电话号码
        email: res.data.email, // 主页右侧邮箱地址
      },
      token,
    };
    ctx.body = await ctx.renderView('pages/detail.nj', data);

  }

  async noticeList() { // 新闻列表页
    const ctx = this.ctx;
    const page = ctx.params.page;
    const res = await ctx.service.news.getList(page, 10, 0);
    const info = await ctx.service.public.getInfo();
    for (let i = 0; i < res.data.list.length; i++) {
      res.data.list[i].time = getDate(res.data.list[i].meta.updated_date);
    }
    const data = {
      info: {
        volume: toThousands(info.data.volume),
        values: toThousands(info.data.values),
        tip: info.data.tip,
        tokenNums: info.data.tokenNums,
        qq: info.data.qq,
        wechat: info.data.wechat,
        trademark: info.data.trademark,
        phone: info.data.phone, // 主页右侧电话号码
        email: info.data.email, // 主页右侧邮箱地址
      },
      res: res.data.list,
      count: res.data.count,
    };
    ctx.body = await ctx.renderView('pages/notice.nj', data);
  }

  async about() { // 关于我们页面
    const ctx = this.ctx;
    const info = await ctx.service.public.getInfo();
    const res = await ctx.model.About.find();
    const data = {
      info: {
        volume: toThousands(info.data.volume),
        values: toThousands(info.data.values),
        tip: info.data.tip,
        tokenNums: info.data.tokenNums,
        qq: info.data.qq,
        wechat: info.data.wechat,
        trademark: info.data.trademark,
        phone: info.data.phone, // 主页右侧电话号码
        email: info.data.email, // 主页右侧邮箱地址
        aboutUs: res[0].aboutUs, // 关于我i们的文档
      },
    };
    ctx.body = await ctx.renderView('pages/about.nj', data);
  }

  async contactUs() { // 联系我们页面
    const ctx = this.ctx;
    const info = await ctx.service.public.getInfo();
    const res = await ctx.model.About.find();
    const data = {
      info: {
        volume: toThousands(info.data.volume),
        values: toThousands(info.data.values),
        tip: info.data.tip,
        tokenNums: info.data.tokenNums,
        qq: info.data.qq,
        wechat: info.data.wechat,
        trademark: info.data.trademark,
        phone: info.data.phone, // 主页右侧电话号码
        email: info.data.email, // 主页右侧邮箱地址
        qqAdvertise: res[0].qqAdvertise, // 广告合作QQ
        qqbusiness: res[0].qqbusiness, // 商务合作QQ
        servicePhone: res[0].servicePhone, // 服务电话
      },
    };
    ctx.body = await ctx.renderView('pages/contactUs.nj', data);
  }

  async commonProblem() { // 常见问题页面
    const ctx = this.ctx;
    const info = await ctx.service.public.getInfo();
    const res = await ctx.model.About.find();
    const data = {
      info: {
        volume: toThousands(info.data.volume),
        values: toThousands(info.data.values),
        tip: info.data.tip,
        tokenNums: info.data.tokenNums,
        qq: info.data.qq,
        wechat: info.data.wechat,
        trademark: info.data.trademark,
        phone: info.data.phone, // 主页右侧电话号码
        email: info.data.email, // 主页右侧邮箱地址
        commonProblem: res[0].commonProblem, // 常见问题文档
      },
    };
    ctx.body = await ctx.renderView('pages/commonProblem.nj', data);
  }

  async statement() { // 免责声明页面
    const ctx = this.ctx;
    const info = await ctx.service.public.getInfo();
    const res = await ctx.model.About.find();
    const data = {
      info: {
        volume: toThousands(info.data.volume),
        values: toThousands(info.data.values),
        tip: info.data.tip,
        tokenNums: info.data.tokenNums,
        qq: info.data.qq,
        wechat: info.data.wechat,
        trademark: info.data.trademark,
        phone: info.data.phone, // 主页右侧电话号码
        email: info.data.email, // 主页右侧邮箱地址
        statement: res[0].statement, // 免责声明文档
      },
    };
    ctx.body = await ctx.renderView('pages/statement.nj', data);
  }


  async noticeDetail() { // 新闻详情
    const ctx = this.ctx;
    const id = ctx.params.id;
    const res = await ctx.model.News.find({ id: { $in: [ id, parseInt(id) + 1 ] } }, { _id: 0, __v: 0 });
    const info = await ctx.service.public.getInfo();
    if (res[1] === undefined) {
      res[1] = {};
      res[1].title = '无';
    }
    const data = {
      info: {
        volume: toThousands(info.data.volume),
        values: toThousands(info.data.values),
        tip: info.data.tip,
        tokenNums: info.data.tokenNums,
        qq: info.data.qq,
        wechat: info.data.wechat,
        trademark: info.data.trademark,
        phone: info.data.phone, // 主页右侧电话号码
        email: info.data.email, // 主页右侧邮箱地址
      },
      news: res,
    };
    ctx.body = await ctx.renderView('pages/noticeDetail.nj', data);
  }

  async risefall() { // 排行榜
    const ctx = this.ctx;
    const res = await ctx.service.public.getInfo();
    const data = {
      info: {
        volume: toThousands(res.data.volume),
        values: toThousands(res.data.values),
        tip: res.data.tip,
        tokenNums: res.data.tokenNums,
        qq: res.data.qq,
        wechat: res.data.wechat,
        trademark: res.data.trademark,
        phone: res.data.phone, // 主页右侧电话号码
        email: res.data.email, // 主页右侧邮箱地址
      },
    };
    ctx.body = await ctx.renderView('pages/risefall.nj', data);
  }
}

module.exports = HomeController;
