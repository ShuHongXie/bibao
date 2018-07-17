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
	$('.retrieve_phone').focus(function(){
		$(this).on('input propertychange',function(){
	        var $val = $(this).val().trim();
	        if(pNumReg.test($val)){
	        	$(this).addClass('success').removeClass('fail nones');
	        	$('.retrieve_phone_tip').addClass('success').removeClass('fail').text('手机号格式正确');
	        }else {
	        	$(this).addClass('fail').removeClass('success');
	        	$('.retrieve_phone_tip').addClass('fail').removeClass('success nones').text('请输入正确格式的手机号');
	        }
	        if($('.retrieve_phone_tip').hasClass('success')){
	        	var $that = $('.retrieve_phone_tip');
	        	setTimeout(function(){
	        		$that.addClass('nones');
	        	},2000);
	        }
	    });
	})
	
	//验证码格式验证
	$('.retrieve_code').focus(function(){
		$(this).on('input propertychange',function(){
	        var $val = $(this).val().trim();
	        if(testReg.test($val)){
	        	$(this).addClass('success').removeClass('fail nones');
	        	$('.retrieve_code_tip').addClass('success').removeClass('fail').text('验证码格式正确');
	        }else {
	        	$(this).addClass('fail').removeClass('success');
	        	$('.retrieve_code_tip').addClass('fail').removeClass('success nones').text('请输入正确格式的验证码');
	        }
	        if($('.retrieve_code_tip').hasClass('success')){
	        	var $that = $('.retrieve_code_tip');
	        	setTimeout(function(){
	        		$that.addClass('nones');
	        	},2000);
	        }
	    });
	})
	
	//密码格式验证
	$('.retrieve_pwd').focus(function(){
		$(this).on('input propertychange',function(){
	        var $val = $(this).val().trim();
	        pwd = $val ;
	        if(pwdReg.test($val)){
	        	$(this).addClass('success').removeClass('fail nones');
	        	$('.retrieve_pwd_tip').addClass('success').removeClass('fail').text('密码格式正确');
	        }else {
	        	$(this).addClass('fail').removeClass('success');
	        	$('.retrieve_pwd_tip').addClass('fail').removeClass('success nones').text('请输入正确格式的密码');
	        }
	        if($('.retrieve_pwd_tip').hasClass('success')){
	        	var $that = $('.retrieve_pwd_tip');
	        	setTimeout(function(){
	        		$that.addClass('nones');
	        	},2000);
	        }
	    });
	})
	
	$('.retrieve_pwd_r').focus(function(){
		$(this).on('input propertychange',function(){
	        var val = $(this).val().trim();
	        if( val == pwd ){
	        	$(this).addClass('success').removeClass('fail nones');
	        	$('.retrieve_pwd_r_tip').addClass('success').removeClass('fail').text('重复输入密码正确');
	        }else {
	        	$(this).addClass('fail').removeClass('success');
	        	$('.retrieve_pwd_r_tip').addClass('fail').removeClass('success nones').text('请输入正确格式的密码');
	        }
	        if($('.retrieve_pwd_r_tip').hasClass('success')){
	        	var $that = $('.retrieve_pwd_r_tip');
	        	setTimeout(function(){
	        		$that.addClass('nones');
	        	},2000);
	        }
	    });
	})
	
	//获取验证码
	$('.retrieve_code_btn').click(function(){
		if($('.retrieve_phone_tip').hasClass('success')){
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
			var $val = $('.retrieve_phone').val();
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
	
	//找回密码
	$('.retrieve_btn').click(function(){
		//定义4个参数
		var phoneNum = $('.retrieve_phone').val().trim(),
		testCode = $('.retrieve_code').val().trim(),
		pwd = $('.retrieve_pwd').val().trim() ,
		pwdr = $('.retrieve_pwd_r').val().trim() ;
		
		if(phoneNum === "" || testCode === "" || pwd === "" || pwdr === "" ){
			layer.open({
			    content: '必填项未完全填写',
			    btn: '我知道了'
			});
			if(phoneNum === ""){
				$('.retrieve_phone').addClass('fail').removeClass('success');
	        	$('.retrieve_phone_tip').addClass('fail').removeClass('success nones').text('请输入正确格式的手机号');
			}
			if(testCode === ""){
				$('.retrieve_code').addClass('fail').removeClass('success');
	        	$('.retrieve_code_tip').addClass('fail').removeClass('success nones').text('请输入正确格式的验证码');
			}
			if(pwd === ""){
				$('.retrieve_pwd').addClass('fail').removeClass('success');
	        	$('.retrieve_pwd_tip').addClass('fail').removeClass('success nones').text('请输入正确格式的密码');
			}
			if(pwdr === ""){
				$('.retrieve_pwd_r').addClass('fail').removeClass('success');
	        	$('.retrieve_pwd_r_tip').addClass('fail').removeClass('success nones').text('请输入正确格式的密码');
			}
			return false ;
		}
		if(pwdr !== pwd){
			$('.retrieve_pwd_r').addClass('fail').removeClass('success');
	        $('.retrieve_pwd_r_tip').addClass('fail').removeClass('success nones').text('请输入与上框相同的密码');
	        return false ;
		}
		if($('.retrieve_phone').hasClass('success') && $('.retrieve_code').hasClass('success') && $('.retrieve_pwd').hasClass('success')&& $('.retrieve_pwd_r').hasClass('success')){
			//发送注册请求
			$.ajax({
				type:"POST",
				url: urls + '/v1/user/retrieve',
				data:{
					phone:phoneNum,
					password:encrypt.encrypt(pwd),
					code:testCode
				},
				success:function(data){
					if(data.respcode === 100){
						layer.msg('密码找回成功');
						$('.retrieve').stop().animate({
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
	
	$('.retrieve_pwd_r').keyup(function(event){
		if(event.keyCode == 13){
			$(".retrieve_btn").trigger("click");
		}
	});
	
})
