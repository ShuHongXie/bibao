$(function(){
 
	 
 
 	/**
 	 * topTimer => window滚动定时器
 	 * scrollT => 保存window.scrollTop值
 	 * pageNum => 保存分页的值
 	 */
 	var currencyText,topTimer,scrollT,pageNum;
	
	 //主页导航栏下拉导航栏效果
	$('.ranking').mouseenter(function(){
	 	$('.rank').slideDown(100);
	}).mouseleave(function(){
	 	$('.rank').slideUp(100);
	});
	
	/*//滚动条滚动到一定高度就固定在顶部
	$(document).bind('scroll',function(){
		if( $(document).scrollTop() > 0 ){
			$('#nav').addClass('overran');
			$('#header').addClass('overran');
		}else {
			$('#nav').removeClass('overran');
			$('#header').removeClass('overran');
		}
	})*/
	
	//根据是否有滚动条来确定footer区要不要固定 如果有就不固定 没有就固定
	if($(document).height() === $(window).height() ){
		console.log('没有滚动条')
		$('#footer').addClass('fixeds');
	}else {
		$('#footer').removeClass('fixeds');
	}
/*	console.log($(document).height() )
	console.log($(window).height() )
	console.log( $(window).scrollTop())*/
	
	//右侧固定栏top  点击top到达顶部
	$('.toTop').click(function(){
		if($(window).scrollTop() === 0){
			return ;
		}else {
			topTimer = setInterval(function(){
				scrollT = $(window).scrollTop() ;
				scrollT -= 30 ;
				$(window).scrollTop(scrollT) ;
				if( $(window).scrollTop() <= 0){
					clearInterval(topTimer)
				}
			}, 10);
		}
	})
	
	
	
	
	
	
})
