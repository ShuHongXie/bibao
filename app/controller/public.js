'use strict';

const Controller = require('egg').Controller;
const fs = require('fs');
const path = require('path');
const sendToWormhole = require('stream-wormhole');

class PublicController extends Controller {
  async index() {
    this.ctx.body = await this.app.redis.get('USD');
  }

  async getLogs() { // 获取管理操作日志
    const ctx = this.ctx;
    try {
      const res = await ctx.service.public.getLogs();
      ctx.body = res;
    } catch (e) {
      ctx.status = 500;
      ctx.body = e;
    }
  }

  async getInfo() { // 获取网站信息
    const ctx = this.ctx;
    try {
      const res = await ctx.service.public.getInfo();
      ctx.body = res;
    } catch (e) {
      ctx.status = 500;
      ctx.body = e;
    }
  }

  async setInfo() { // 设置网站信息
    const ctx = this.ctx;
    try {
      const res = await ctx.service.public.setInfo();
      ctx.body = res;
    } catch (e) {
      ctx.status = 500;
      ctx.body = e;
    }
  }

  async getExchange() { // 获取汇率
    const ctx = this.ctx;
    try {
      const res = await ctx.service.public.getExchange();
      ctx.body = res;
    } catch (e) {
      ctx.status = 500;
      ctx.body = e;
    }
  }

  async deleteAdvices() { // 删除用户的反馈和建议信息
    const ctx = this.ctx;
    const id = ctx.request.body.id;
    try {
      await ctx.model.Useradvices.findOneAndRemove({ id }); // 找到并删除
      ctx.body = {
        respcode: 100,
        respmsg: '该条信息已成功删除',
      };
    } catch (e) {
      throw e;
    }
  }

  async getAdvices() { // 获取用户反馈和建议列表
    const ctx = this.ctx;
    try {
      const data = await ctx.model.Useradvices.find({});
      ctx.body = {
        respcode: 100,
        data,
        respmsg: '成功获取',
      }
    } catch (e) {
      throw e;
    }
  }

  async setAdvices() { // 收到用户反馈和建议 写入数据库
    const ctx = this.ctx;
    const name = ctx.request.body.name;
    const email = ctx.request.body.email;
    const phone = ctx.request.body.phone;
    const advices = ctx.request.body.advices;
    const arr = await ctx.model.Useradvices.find({});
    // 循环得出最大id
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i].id > arr[j].id) {
          let temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
        }
      }
    }
    // 通过上面循环获得id
    const id = arr[ arr.length - 1].id + 1;
    const data = {
      id,
      name,
      email,
      phone,
      advices,
    };
    try {
      const res = await ctx.model.Useradvices.create(data);
      if (res) {
        ctx.body = {
          respcode: 100,
          respmsg: '您的反馈已提交,感谢您的反馈',
        };
      }
    } catch (e) {
      throw e;
    }
  }

  async upload() { // 上传图片
    const ctx = this.ctx;
    const stream = await ctx.getFileStream();
    const filename = stream.filename;
    const target = path.join(this.config.baseDir, 'app/public/webinfo_img', `${stream.fields.name}.${filename.split('.')[1]}`);
    const writeStream = fs.createWriteStream(target);
    try {
      await stream.pipe(writeStream);
      ctx.body = {
        respcode: 100,
        img: `/webinfo_img/${stream.fields.name}.${filename.split('.')[1]}`,
      };
    } catch (err) {
      throw err;
    }
  }

  async uploadPartner() { // 友情链接图片上传或者链接地址修改  type: 0修改 1 添加
    const ctx = this.ctx;
    const parts = ctx.multipart();
    let part, query = {} ,status = 0 ,link = '',data = {} ,target , imgName;
    while ((part = await parts()) != null) {
      if (part.length) {
        // 如果是数组的话是 filed
        query[part[0]] = part[1];
      } else {
        if (!part.filename) {
          // 这时是用户没有选择文件就点击了上传(part 是 file stream，但是 part.filename 为空)
          // 需要做出处理，例如给出错误提示消息
          return;
        }
        // part 是上传的文件流
        query[part.fieldname] = part.filename;
        try {
          status = 1; // 改变状态 
          data = {
            link: query.link,
            img: link,
          };
          if (parseFloat(query.type)) { // 当为添加图片时
            var count = await ctx.model.Info.find({} ,{ trademark: 1 , _id:0 } ).sort({key:1}); // 保存现在的id个数
            var arr = count[0].trademark ;
            // 循环得出最大id
            for (var i = 0; i < arr.length; i++) {
              for (var j = i+1; j < arr.length; j++) {
                if (arr[i].id > arr[j].id) {
                  var temp = arr[i];
                  arr[i] = arr[j];
                  arr[j] = temp;
                }
              }
            }
            // 通过上面循环获得id
            let id = arr[ arr.length - 1].id + 1;
            imgName = 'partner' + id; // 设置对应图片名
            target = path.join(this.config.baseDir, 'app/public/webinfo_img', `${imgName}.${query.img.split('.')[1]}`);
            link = `/webinfo_img/${imgName}.${query.img.split('.')[1]}`; // 保存图片路径
            await ctx.model.Info.update({'trademarkToken': '123' }, { $push: { // 存储数据
              "trademark" : {
                'link' :  data.link,
                'img' : link,
                'id' : id,
              }
            }});
          } else { // 当为编辑图片时
            imgName = 'partner' + query.id;
            target = path.join(this.config.baseDir, 'app/public/webinfo_img', `${imgName}.${query.img.split('.')[1]}`);
            console.log(target);
            link = `/webinfo_img/${imgName}.${query.img.split('.')[1]}`; // 保存图片路径
            console.log(link);
            console.log(query);
            await ctx.model.Info.update({'trademark.id': parseInt(query.id) }, { $set: { // 更新数据
              'trademark.$.link' :  data.link,
              'trademark.$.img' : link,
            }});
          }
          const writeStream = fs.createWriteStream(target);
          await part.pipe(writeStream); 
          ctx.body = {
            errno: 0,
            data: '完成',
          };
          // console.log(query);
        } catch (err) {
          // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
          await sendToWormhole(part);
          throw err;
        }
      } 
    }
    // 当只修改链接地址 不修改图片时
    if(!status){
      await ctx.model.Info.update({'trademark.id': parseInt(query.id) }, { $set: { // 更新数据
        'trademark.$.link' :  query.link,
      }});
      ctx.body = {
        errno: 0,
        data: '完成',
      };
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
        const tempName = 'news_' + Date.now() + parseInt(Math.random() * 1000000);
        // const stream = fs.createReadStream(`${tempName}.${part.filename.split('.')[1]}`);
        const target = path.join(this.config.baseDir, 'app/public/news_img', `${tempName}.${part.filename.split('.')[1]}`);
        // fs.writeFileSync(target);
        links.push(`http://127.0.0.1:7001/public/news_img/${tempName}.${part.filename.split('.')[1]}`);
        const writeStream = fs.createWriteStream(target);
        // 文件处理，上传到云存储等等
        let result;
        try {
          await part.pipe(writeStream);
          console.log(132456);
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
    console.log('and we are done parsing the form!');
  }

  async getSectorChartBySymbol() { // 获取Token的扇形图数据
    const ctx = this.ctx;
    try {
      const res = await ctx.service.public.getSectorChartBySymbol();
      ctx.body = res;
    } catch (e) {
      ctx.status = 500;
      ctx.body = e;
    }
  }
}

module.exports = PublicController;
