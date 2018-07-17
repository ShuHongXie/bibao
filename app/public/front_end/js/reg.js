$(function(){
	var pNumReg = /^[1][3,4,5,7,8][0-9]{9}$/;
	var pwdReg = /^(?=.{6,16})(?=.*[a-z])(?=.*[0-9])[0-9a-z]*$/;
	var testReg = /^\d{6}$/ ;
	var pwd = '';
	var time = 60,timer = null ;
	var encrypt=new JSEncrypt();
    encrypt.setPublicKey('-----BEGIN PUBLIC KEY-----\n'+
	'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCqBa0yw4CxVzN6M91TRzIEsPEt\n'+
	'3k/D/iiuCUGE0ujzbBGEmQzvU829GLPUgrw1RaLYNzjYveKm/NlI3EyHmSRSLygV\n'+
	'Y0HPAcOXfRl5CA89glEvGCenaop6QP1pGPGifd3N/S4SReVRT6UL1lOFiBflAe4S\n'+
	'cqy/KVYrCLcveeb4XwIDAQAB\n'+
	'-----END PUBLIC KEY-----');
	
	//电话号码格式验证
	$('.reg_phone_inp').focus(function(){
		$(this).on('input propertychange',function(){
	        var $val = $(this).val().trim();
	        if(pNumReg.test($val)){
	        	$(this).addClass('success').removeClass('fail nones');
	        	$('.tip_phone').addClass('success').removeClass('fail').text('手机号格式正确');
	        }else {
	        	$(this).addClass('fail').removeClass('success');
	        	$('.tip_phone').addClass('fail').removeClass('success nones').text('请输入正确格式的手机号');
	        }
	        if($('.tip_phone').hasClass('success')){
	        	var $that = $('.tip_phone');
	        	setTimeout(function(){
	        		$that.addClass('nones');
	        	},2000);
	        }
	    });
	})
	
	//验证码格式验证
	$('.test_code_inp').focus(function(){
		$(this).on('input propertychange',function(){
	        var $val = $(this).val().trim();
	        if(testReg.test($val)){
	        	$(this).addClass('success').removeClass('fail nones');
	        	$('.tip_test').addClass('success').removeClass('fail').text('验证码格式正确');
	        }else {
	        	$(this).addClass('fail').removeClass('success');
	        	$('.tip_test').addClass('fail').removeClass('success nones').text('请输入正确格式的验证码');
	        }
	        if($('.tip_test').hasClass('success')){
	        	var $that = $('.tip_test');
	        	setTimeout(function(){
	        		$that.addClass('nones');
	        	},2000);
	        }
	    });
	})
	
	//密码格式验证
	$('.reg_pwd_inp').focus(function(){
		$(this).on('input propertychange',function(){
	        var $val = $(this).val().trim();
	        pwd = $val ;
	        if(pwdReg.test($val)){
	        	$(this).addClass('success').removeClass('fail nones');
	        	$('.tip_pwd').addClass('success').removeClass('fail').text('密码格式正确');
	        }else {
	        	$(this).addClass('fail').removeClass('success');
	        	$('.tip_pwd').addClass('fail').removeClass('success nones').text('请输入正确格式的密码');
	        }
	        if($('.tip_pwd').hasClass('success')){
	        	var $that = $('.tip_pwd');
	        	setTimeout(function(){
	        		$that.addClass('nones');
	        	},2000);
	        }
	    });
	})
	
	$('.reg_pwdr_inp').focus(function(){
		$(this).on('input propertychange',function(){
	        var val = $(this).val().trim();
	        if( val == pwd ){
	        	$(this).addClass('success').removeClass('fail nones');
	        	$('.tip_pwdr').addClass('success').removeClass('fail').text('重复输入密码正确');
	        }else {
	        	$(this).addClass('fail').removeClass('success');
	        	$('.tip_pwdr').addClass('fail').removeClass('success nones').text('请输入正确格式的密码');
	        }
	        if($('.tip_pwdr').hasClass('success')){
	        	var $that = $('.tip_pwdr');
	        	setTimeout(function(){
	        		$that.addClass('nones');
	        	},2000);
	        }
	    });
	})
	
	//获取验证码
	$('.testCode').click(function(){
		if($('.tip_phone').hasClass('success')){
			//如果手机号格式正确 就可以点击获取验证码
			$(this).attr({"disabled":"disabled"}).text(time+ 's');
			var that = $(this) ;
			timer = setInterval(function(){
				time--;
				that.text(time+ 's');
				if(time === 0){
					that.removeAttr("disabled").text('获取验证码');
					time = 60;
					clearInterval(timer);
				}
			},1000);
			//获取手机号码
			var $val = $('.reg_phone_inp').val();
			//发送请求
			$.ajax({
				type:"POST",
				url: urls + '/v1/user/getSmsCode',
				data:{
					phone:$val
				},
				success:function(data){
					if(data.respcode === 100){
						layer.msg('验证码已发送');
					}
				},
				error:function(){
					layer.open({
					    content:'获取验证码失败',
					    btn: '确定'
					});
				}
			})
		}else{
			layer.open({
			    content: '手机号码未填写或格式不正确',
			    btn: '我知道了'
			});
		}
	})
	
	//注册效果
	$('.reg').click(function(){
		//定义4个参数
		var phoneNum = $('.reg_phone_inp').val().trim(),
		testCode = $('.test_code_inp').val().trim(),
		pwd = $('.reg_pwd_inp').val().trim() ,
		pwdr = $('.reg_pwdr_inp').val().trim() ;
		
		if(phoneNum === "" || testCode === "" || pwd === "" || pwdr === "" ){
			layer.open({
			    content: '必填项未完全填写',
			    btn: '我知道了'
			});
			if(phoneNum === ""){
				$('.reg_phone_inp').addClass('fail').removeClass('success');
	        	$('.tip_phone').addClass('fail').removeClass('success nones').text('请输入正确格式的手机号');
			}
			if(testCode === ""){
				$('.test_code_inp').addClass('fail').removeClass('success');
	        	$('.tip_test').addClass('fail').removeClass('success nones').text('请输入正确格式的验证码');
			}
			if(pwd === ""){
				$('.reg_pwd_inp').addClass('fail').removeClass('success');
	        	$('.tip_pwd').addClass('fail').removeClass('success nones').text('请输入正确格式的密码');
			}
			if(pwdr === ""){
				$('.reg_pwdr_inp').addClass('fail').removeClass('success');
	        	$('.tip_pwdr').addClass('fail').removeClass('success nones').text('请输入与上框相同的密码');
			}
			return false ;
		}
		if(pwdr !== pwd){
			$('.reg_pwdr_inp').addClass('fail').removeClass('success');
	        $('.tip_pwdr').addClass('fail').removeClass('success nones').text('请输入与上框相同的密码');
	        return false ;
		}
		if($('.tip_phone').hasClass('success') && $('.tip_test').hasClass('success') && $('.tip_pwd').hasClass('success')&& $('.tip_pwdr').hasClass('success')){
			//发送注册请求
			$.ajax({
				type:"POST",
				url: urls + '/v1/user/reg',
				data:{
					phone:phoneNum,
					password:encrypt.encrypt(pwd),
					code:testCode
				},
				success:function(data){
					if(data.respcode === 100){
						layer.msg('注册成功');
						$('.register').stop().animate({
							right:'-480px'
						},300);
						$('.blackBg').fadeOut();
					}else {
						layer.open({
						    content:data.respmsg,
						    btn: '确定'
						});
					}
				}
			})
		}
	})
	
	$('.reg_pwdr_inp').keyup(function(event){
		if(event.keyCode == 13){
			$(".reg").trigger("click");
		}
	});
	
})