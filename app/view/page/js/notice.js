
/**
 * 公告和新闻页面效果
 * 
 */

//点解切换新闻和页面
$(function(){
	$('.change-btn button').click(function(){
		var idx = $(this).index();
		$(this).addClass('active').siblings().removeClass('active');
		$(".notice-bottom > ul ").eq(idx).show().siblings().not('.page-bottom').hide();
	})
})
