$(function(){

	//主页人民币按钮点击选择
	$('.btn-box button:eq(2)').click(function(){
		$('.choose-lang').slideToggle(100);
	})
	$('.choose-lang button').click(function(){
		$('.btn-box button:eq(2)').html($(this).text()+'<i></i>');
		$('.choose-lang').slideUp(100);
	})
	
	//主页新闻公告区域滑过效果
	$('.news ul li').mouseenter(function(){
		$(this).css('boxShadow','0 0  20px #ccc')
	}).mouseleave(function(){
		$(this).css('boxShadow','4px 0px 15px rgba(31, 31, 31, 0.06)')
	});
	
	
	
})


