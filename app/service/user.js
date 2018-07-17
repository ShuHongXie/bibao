'use strict';

const Service = require('egg').Service;
const bcrypt = require('bcryptjs'); // 密码加密所需bcrypt模块
const crypto = require('crypto'); // 生成加密token
const md5 = crypto.createHash('md5');
// 短信服务器账号密码-----BEGIN
const sms_username = 'zg785671649';
const sms_password = md5.update('83926298').digest('hex');
// 短信服务器账号密码-----END

// 前端传过来的RSA密码解密-----BEGIN
const NodeRSA = require('node-rsa');
const key = new NodeRSA(`-----BEGIN RSA PRIVATE KEY-----
MIICWwIBAAKBgQCqBa0yw4CxVzN6M91TRzIEsPEt3k/D/iiuCUGE0ujzbBGEmQzv
U829GLPUgrw1RaLYNzjYveKm/NlI3EyHmSRSLygVY0HPAcOXfRl5CA89glEvGCen
aop6QP1pGPGifd3N/S4SReVRT6UL1lOFiBflAe4Scqy/KVYrCLcveeb4XwIDAQAB
AoGANwomuxk+RFVGAoMJsgIz4gA52IRwRAgMuTz2gH4aZWWQTOGS+2L2EQdkfSC5
YXF35GYJZA4hx7cbdr0XlTSb5JUm1eUDHu+JtMQBVXS2qkFSVtq9QEI+iW9SFTrC
b0nLcOwX4TImwJv2xd6jh+V1lg2ge3PwtX6Udezj5KGZ1vECQQC0LKHTm4k0xAoK
xdQ/af1wwYxKvI0sdARHb/mPwyo+NAHyrMw2H77N+pCFuHyK2lwZtQcW+SqMWdpI
VseiMx8nAkEA8ZNIyHNbQE1yTvE/V/yWn0WFYyGAJYr1kXrxbiHiPAjVJhuLjGp2
8y3w1pBMJtsqhBR+am7LwP8sUoROLdogCQJAPCyr34CS0oymzfJEcOl1O7Nop41R
mQcmZrV/JASKlzvHasVLbsgrcZ+9pOt4rOdA21UaiRGupDFeNcrF4eYxAQJABcLo
endd1sPCFSXlx9hrUzMaQkn7P2n3/1c6SNEgDyR6yOThSCEF4zjWRJe+aTLS6cF/
XlR0IY80ZGdpYeiQ2QJAN/5j9z9rFTgmwbGx1886A7PWvWdU7BY5zw1pwghNY55h
5wz8YJ9iYgo3036gqV1TkDuHDAaQUBQM1LAtTpXONw==
-----END RSA PRIVATE KEY-----`); // 私钥
key.setOptions({ encryptionScheme: 'pkcs1' });
// 前端传过来的RSA密码解密-----END

async function getHash(pwd) { // 把原文密码加密生成hash值
  return new Promise((res, rej) => {
    bcrypt.genSalt(10, (err, salt) => { // 生成强度10的加密hash，强度越高需要算力越高
      if (err) return rej('error');
      bcrypt.hash(pwd, salt, (err, hash) => {
        res(hash);
      });
    });
  });
}

async function checkPwd(pwd, hash) { // 检测传过来的密码是否与数据库密码一致
  return new Promise((res, rej) => {
    bcrypt.compare(pwd, hash, (err, bool) => {
      if (err) return rej('error');
      res(bool);
    });
  });
}

function getDate(str) { // 格式化日期
  let date = new Date(str);
  date = `${date.getFullYear()}-${date.getMonth() > 9 ? date.getMonth() : '0' + date.getMonth()}-${date.getDate() > 9 ? date.getDate() : '0' + date.getDate()} ${date.getHours() > 9 ? date.getHours() : '0' + date.getHours()}:${date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()}:${date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds()}`;
  return date;
}


// 用户操作类
class UserService extends Service {
  async getUserPwd(phone) {
    return this.ctx.model.User.findOne({ phone }, [ 'password' ]);
  }

  async reg() { // 用户注册
    const ctx = this.ctx;
    const phone = ctx.request.body.phone;
    const password = ctx.request.body.password;
    const code = ctx.request.body.code;
    const maxId = await this.getId();
    const post = {
      id: maxId == null ? 1 : maxId.id + 1,
      phone,
      password,
      type: 0,
      status: 1,
      coinList: {},
      meta: {
        regTime: Date.now(),
      },
    };
    // 判断验证码是否过期和不存在
    if (!ctx.session.sms_code) {
      const res = {
        respcode: 201,
        respmsg: '验证码过期',
      };
      return res;
    } else if (code !== ctx.session.sms_code) {
      const res = {
        respcode: 200,
        respmsg: '验证码错误',
      };
      return res;
    }
    try {
      try {
        post.password = key.decrypt(post.password, 'utf-8');
      } catch (e) {
        return {
          respcode: 203,
          respmsg: '密码加密格式错误',
        };
      }
      post.password = await getHash(post.password);
      const res = await ctx.model.User.create(post);
      if (res) {
        const res = {
          respcode: 100,
          respmsg: '注册成功',
        };
        return res;
      }
    } catch (e) {
      let res = null;
      if (e.code === 11000) { // 如果为11000则表示数据库里面已经存在了
        res = {
          respcode: 200,
          respmsg: '已存在该手机号码',
        };
      } else {
        res = {
          respcode: 200,
          respmsg: e,
        };
      }
      ctx.status = 200;
      return res;
    }
  }

  async retrieve() { // 用户找回密码
    const ctx = this.ctx;
    const phone = ctx.request.body.phone;
    let password = ctx.request.body.password;
    const code = ctx.request.body.code;
    // 从数据库中获取用户信息
    const temp = await ctx.model.User.findOne({ phone });
    if (!temp) {
      const res = {
        respcode: 200,
        respmsg: '该用户不存在',
      };
      return res;
    }
    // 判断验证码是否过期和不存在
    if (!ctx.session.sms_code) {
      const res = {
        respcode: 201,
        respmsg: '验证码过期',
      };
      return res;
    } else if (code !== ctx.session.sms_code.toString()) {
      const res = {
        respcode: 200,
        respmsg: '验证码错误',
      };
      return res;
    }
    // 密码进行加密和解密
    try {
      try {
        // 密码解密
        password = key.decrypt(password, 'utf-8');
      } catch (e) {
        return {
          respcode: 203,
          respmsg: '密码加密格式错误',
        };
      }
      // 密码加密
      password = await getHash(password);
      const res = await ctx.model.User.update({ phone }, {
        $set: { password },
      });
      if (res) {
        const res = {
          respcode: 100,
          respmsg: '密码修改成功',
        };
        return res;
      }
    } catch (e) {
      let res = null;
      res = {
        respcode: 200,
        respmsg: e,
      };
      ctx.status = 200;
      return res;
    }
  }


  async getId() { // 获取最大ID
    return this.ctx.model.User.findOne({}, [ 'id' ]).sort({ id: 'desc' });
  }

  async getPwdByPhone(phone, pwd) { // 根据手机号获取密码
    console.log(phone);
    const temp = await this.ctx.model.User.findOne({ phone }, [ 'password' ]).sort({ id: 'desc' });
    const login = checkPwd(pwd, temp.password);
  }

  async login() { // 用户登录
    const ctx = this.ctx;
    const phone = ctx.request.body.phone;
    let password = ctx.request.body.password;
    const temp = await ctx.model.User.findOne({ phone });
    if (!temp) {
      const res = {
        respcode: 200,
        respmsg: '该用户不存在',
      };
      return res;
    }
    try {
      password = key.decrypt(password, 'utf-8');
    } catch (e) {
      return {
        respcode: 203,
        respmsg: '密码加密格式错误',
      };
    }
    const login = await checkPwd(password, temp.password);
    let res = {};
    if (login) {
      ctx.session.id = temp.id;
      ctx.session.name = temp.name;
      // 生成token，id+日期+随机数
      ctx.session.token = crypto.createHash('md5').update(temp.id + new Date() + Math.random()).digest('hex');
      ctx.status = 200;
      res = {
        respcode: 100,
        respmsg: '登录成功',
        data: {
          token: ctx.session.token,
          regTime: getDate(temp.meta.regTime),
          phone: temp.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
        },
      };
    } else {
      ctx.status = 201;
      res = {
        respcode: 200,
        respmsg: '密码不正确或账户不存在',
      };
    }
    return res;
  }

  async getSmsCode() { // 获取短信验证码
    const ctx = this.ctx;
    const phone = ctx.request.body.phone;
    // 一分钟内不能重复发送
    if (ctx.session.sms_time) {
      ctx.status = 200;
      return {
        respcode: 200,
        respmsg: '一分钟内请不要重复发送',
      };
    }
    // 设置随机验证码和验证码过期时间
    const code = Math.round(900000 * Math.random() + 100000);
    const time = 1000 * 60 * 5;
    const outTime = 1000 * 60 * 1;
    ctx.session.sms_time = true;
    ctx.session.sms_code = code;
    // 一分钟后才可以发送
    setTimeout(() => {
      ctx.session.sms_time = null;
    }, outTime);
    // 过期清除掉验证码
    setTimeout(() => {
      ctx.session.sms_code = null;
    }, time);
    // 请求短信接口
    const content = encodeURI(`【币报】您的验证码为${code}，在5分钟内有效。如非本人操作，请忽略此短信`);
    // 请求短信服务器接口
    try {
      const txt = await this.ctx.curl(`http://api.smsbao.com/sms?u=${sms_username}&p=${sms_password}&m=${phone}&c=${content}`
        , { dataType: 'json' });
      let msg;
      switch (txt.data) {
        case 0:
        {
          msg = '验证码发送成功';
          const res = {
            respcode: 100,
            respmsg: msg || '',
          };
          return res;
        }
        case 41:
          msg = '余额不足';
          break;
        case 43:
          msg = 'IP地址限制';
          break;
        case 50:
          msg = '内容含有敏感词';
          break;
        case 51:
          msg = '手机号码不正确';
          break;
        default:
          msg = '服务器出错';
      }
      ctx.status = 200;
      const res = {
        respcode: 200,
        respmsg: msg || '',
      };
      return res;
    } catch (e) {
      ctx.status = 500;
      const res = {
        respcode: 202,
        respmsg: e,
      };
      return res;
    }
  }

  async selectToken() { // 加入或取消自选Token
    const ctx = this.ctx;
    const symbol = ctx.request.body.symbol;
    const state = ctx.request.body.state;// 0取消，1选中
    if (!state || !symbol) {
      const ret = {
        respcode: 203,
        respmsg: '请求数据不能为空',
      };
      return ret;
    }
    let temp1 = { coinList: {} };
    temp1 = await ctx.model.User.findOne({ id: ctx.session.id });
    if (parseInt(state) === 1) {
      if (!temp1.coinList) {
        temp1.coinList = {};
      }
      temp1.coinList[symbol] = {};
      temp1.coinList[symbol] = true;
    } else {
      temp1.coinList[symbol] = {};
      temp1.coinList[symbol] = false;
    }
    for (const item in temp1.coinList) {
      if (!temp1.coinList[item]) {
        delete temp1.coinList[item];
      }
    }
    if (Object.getOwnPropertyNames(temp1.coinList).length === 0) {
      await ctx.model.User.update({ id: ctx.session.id }, { $set: { coinList: {} } });
    }
    const res = await ctx.model.User.update({ id: ctx.session.id }, { $set: temp1 });
    if (res.ok) {
      const ret = {
        respcode: 100,
        respmsg: '修改自选行情成功',
      };
      return ret;
    }
  }

  async getUserTokenList() { // 获取
    const ctx = this.ctx;
    const id = ctx.session.id;
    const res = await ctx.model.User.findOne({ id });
    if (res) {
      const ret = {
        respcode: 100,
        respmsg: '获取用户自选行情成功',
        data: res.coinList || {},
      };
      return ret;
    }
  }
}

module.exports = UserService;
