$(function(){
	
	var idx ;
	
	/**
	 * sortIdx:排序索引
	 * valueIdx：价值索引
	 * priceIdx:价格索引
	 * numIdx:数量索引
	 * dealIdx:成交值索引
	 * changeIdx:涨幅索引
	 */
	var sortIdx = 0,valueIdx=0,priceIdx=0,numIdx=0,dealIdx=0,changeIdx=0;
	//主页数据表单排名效果
	$('#table tr th').hover(function(){
		idx = $(this).index()
		$('#table tr th:eq('+idx+') i').show();
	},function(){
		$('#table tr th:eq('+idx+') i').hide();
	})
	
	$('#table tr th:eq(0)').click(function(){
		sortIdx ++ ;
		$('#table tr th:eq(0) i').css('transform','rotate('+180*sortIdx+'deg)')
	})
	$('#table tr th:eq(2)').click(function(){
		valueIdx ++ ;
		$('#table tr th:eq(2) i').css('transform','rotate('+180*valueIdx+'deg)')
	})
	$('#table tr th:eq(3)').click(function(){
		priceIdx ++ ;
		$('#table tr th:eq(3) i').css('transform','rotate('+180*priceIdx+'deg)')
	})
	$('#table tr th:eq(4)').click(function(){
		numIdx ++ ;
		$('#table tr th:eq(4) i').css('transform','rotate('+180*numIdx+'deg)')
	})
	$('#table tr th:eq(6)').click(function(){
		dealIdx ++ ;
		$('#table tr th:eq(6) i').css('transform','rotate('+180*dealIdx+'deg)')
	})
	$('#table tr th:eq(6)').click(function(){
		changeIdx ++ ;
		$('#table tr th:eq(6) i').css('transform','rotate('+180*changeIdx+'deg)')
	})
	
})
