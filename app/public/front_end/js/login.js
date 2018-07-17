$(function(){
	var pNumReg = /^[1][3,4,5,7,8][0-9]{9}$/;
	var pwdReg = /^(?=.{6,16})(?=.*[a-z])(?=.*[0-9])[0-9a-z]*$/;
	var encrypt=new JSEncrypt();
    encrypt.setPublicKey('-----BEGIN PUBLIC KEY-----\n'+
	'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCqBa0yw4CxVzN6M91TRzIEsPEt\n'+
	'3k/D/iiuCUGE0ujzbBGEmQzvU829GLPUgrw1RaLYNzjYveKm/NlI3EyHmSRSLygV\n'+
	'Y0HPAcOXfRl5CA89glEvGCenaop6QP1pGPGifd3N/S4SReVRT6UL1lOFiBflAe4S\n'+
	'cqy/KVYrCLcveeb4XwIDAQAB\n'+
	'-----END PUBLIC KEY-----');
	
	//电话号码格式验证
	$('.login_phone_inp').focus(function(){
		$(this).on('input propertychange',function(){
	        var $val = $(this).val().trim();
	        if(pNumReg.test($val)){
	        	$(this).addClass('success').removeClass('fail nones');
	        	$('.login_t_p').addClass('success').removeClass('fail').text('手机号格式正确');
	        }else {
	        	$(this).addClass('fail').removeClass('success');
	        	$('.login_t_p').addClass('fail').removeClass('success nones').text('请输入正确格式的手机号');
	        }
	        if($('.login_t_p').hasClass('success')){
	        	var $that = $('.login_t_p');
	        	setTimeout(function(){
	        		$that.addClass('nones');
	        	},2000);
	        }
	    });
	})
	
	//电话号码格式验证
	$('.login_phone_pwd').focus(function(){
		$(this).on('input propertychange',function(){
	        var $val = $(this).val().trim();
	        if(pwdReg.test($val)){
	        	$(this).addClass('success').removeClass('fail nones');
	        	$('.login_t_pwd').addClass('success').removeClass('fail').text('密码格式正确');
	        }else {
	        	$(this).addClass('fail').removeClass('success');
	        	$('.login_t_pwd').addClass('fail').removeClass('success nones').text('请输入正确格式的密码');
	        }
	        if($('.login_t_pwd').hasClass('success')){
	        	var $that = $('.login_t_pwd');
	        	setTimeout(function(){
	        		$that.addClass('nones');
	        	},2000);
	        }
	    });
	})
	//登录
	$('.log').click(function(){
		if($('.login_phone_inp').hasClass('success') && $('.login_t_pwd').hasClass('success')){
			var pwd = encrypt.encrypt($('.login_phone_pwd').val())
			$.ajax({
				type:"POST",
				url: urls+'/v1/user/login',
				data:{
					phone:$('.login_phone_inp').val(),
					password:pwd
				},
				success:function(data){
					if(data.respcode === 100){
						layer.msg('登录成功');
						$('.userCenter').show();
						$('.login').stop().animate({
							right:'-480px'
						},300);
						$('.toLogin').css('display','none');
						$('.blackBg').fadeOut();
						//改变登录状态；
						wasLogin = true ;
						//保存登陆时间
						var curTime = new Date().getTime();
						//保存本地
						localStorage.setItem('bibao',JSON.stringify({
							token : data.data.token,
							phone : data.data.phone,
							regTime : data.data.regTime,
							loginTime : curTime
						}));
						var local = JSON.parse(localStorage.getItem('bibao'));
						//渲染用户中心
						$('.userc_regtime').text(local.regTime);
						$('.userc_phone').text(local.phone);
						$('.userc_name').text(local.phone);
						//获取用户行情渲染
						$.ajax({
							type:"GET",
							url: urls + '/v1/user/getUserTokenList',
							headers:{
								'csrftoken' : data.data.token
							},
							success:function(data){
								if(data.respcode === 100){
									//追加本地
									localStorage.setItem('mySave',JSON.stringify({
										saveCurrency : data.data 
									}));
									//登录完成就刷新
									 window.location.reload();									
								}else {
									layer.open({
									    content:data.respmsg,
									    btn: '确定'
									})
								}
							}
						})		
					}else {
						layer.open({
						    content:data.respmsg,
						    btn: '确定'
						})
					};	
				},
				error:function(){
					layer.open({
					    content:'服务器错误',
					    btn: '确定'
					});
				}
			})
		}else {
			layer.open({
			    content:'请填写正确的账号密码',
			    btn: '确定'
			});
		}
	})
	
	
	
	//退出账户
	$('.login_out').click(function(){
		//清除本地
		localStorage.removeItem('bibao');
		localStorage.removeItem('mySave');
		//改变登录状态
		wasLogin = false ;
		//提示
		layer.msg('账户已退出');
		//页面效果
		$('.userMsg').stop().animate({
			right:'-480px'
		},300);
		$('.blackBg').fadeOut();
		$('.userCenter').hide();
		$('.toLogin').show();
		$('.toRes').show();
		//退出完成就刷新
		window.location.reload();
	})
	
	$('.login_phone_pwd').keyup(function(event){
		if(event.keyCode == 13){
			$(".log").trigger("click");
		}
	});
 
})
