$(function(){
	//关于我们页面切换效果
	$('.about-top ul li').click(function(){
		$(this).addClass('active').siblings().removeClass('active');
		var index = $(this).index();
		$('.about-all > li').eq(index).show().siblings().hide()
	})
	
})
