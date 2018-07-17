var local = JSON.parse(localStorage.getItem('bibao'));
if(local){
	//如果有登录就保存
	$('.toLogin').hide();
	$('.toRes').hide();
	$('.userCenter').show()
	$('.userc_regtime').text(local.regTime);
	$('.userc_phone').text(local.phone);
	$('.userc_name').text(local.phone);
	wasLogin = true ;
}