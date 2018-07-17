 $(function(){

	//主页人民币按钮点击选择
	$('.btn-box button:eq(2)').click(function(){
		$('.choose-lang').slideToggle(100);
	});
	
	
	//主页新闻公告区域滑过效果
	$('.news ul li').mouseenter(function(){
		$(this).css('transform','translate(10px,10px)')
	}).mouseleave(function(){
		$(this).css('transform','translate(0,0)')
	});
	
	//表格固定
	$(window).scroll(function() {	
		var h = $('.table_s').height() - 60 ;
		if($(this).scrollTop() > 0 && $(this).scrollTop() < h ){
			$('.btn-box').addClass('wasFixed');
		}else {
			$('.btn-box').removeClass('wasFixed');
		}
	    if($(this).scrollTop() > 0 && $(this).scrollTop() < h ){
			$('.table_f').addClass('wasFixed');
		}else {
			$('.table_f').removeClass('wasFixed');
		}
		
	});

	
})


