$(function(){
	
	/**
 	 * pageNum => 保存分页的值
 	 */
	pagation($('.pageNum').eq(0),$('.pageNum').eq(1),100)
//	pagation($('.pageNum').eq(1),$('.pageNum').eq(0))
	function pagation(dom1,dom2,max){
		var scrollT,pageNum;
		var max = max,turnPage = true,turnPagePrev = true ;
	
		//分页-----------------------------------------start--------------------------------------------------------------
		//点击选择币种 查看不同币种的趋势信息
		//当获取的数据在大于7页或者小于7页的两种情况来确定页码的内容
		if(max <= 7 ){
			
			for(var i = 0 ; i < max ;i++){
				dom1.append('<li>'+ (i+1) +'</li>');
				dom2.append('<li>'+ (i+1) +'</li>');
			}
			dom1.width(max*36);
			dom2.width(max*36);
			$('.pagination').width(max*36+72);
			//添加完dom后给第一个页码默认添加class = active
			dom1.find('li:eq(0)').addClass('active')
			dom2.find('li:eq(0)').addClass('active')
//			$('.pageNum li:eq(0)').addClass('active');
			
			//点击页码之后就有效果
			
//			$('.pageNum li').click(function(){
			dom1.find('li').click(function(){
				pageNum = $(this).index() ;
				dom1.find('li:eq('+$(this).index()+')').addClass('active').siblings().removeClass('active');
				dom2.find('li:eq('+$(this).index()+')').addClass('active').siblings().removeClass('active');
//				$('.pageNum li:eq('+$(this).index()+')').addClass('active').siblings().removeClass('active');
			})
			dom2.find('li').click(function(){
				pageNum = $(this).index() ;
				dom1.find('li:eq('+$(this).index()+')').addClass('active').siblings().removeClass('active');
				dom2.find('li:eq('+$(this).index()+')').addClass('active').siblings().removeClass('active');
//				$('.pageNum li:eq('+$(this).index()+')').addClass('active').siblings().removeClass('active');
			})
			//点击上一页
			
//			$('.prevPage').click(function(){
	
			dom1.closest('.pagination').find('.prevPage').click(function(){
				
//				$('.pageNum li').each(function(idx){
				dom1.find('li').each(function(idx){
					//获取当前active所在的index
					if($(this).hasClass('active')){
						pageNum = idx ;		
					}
				})
				
				pageNum --;
				if(pageNum < 0 ){
					pageNum = 0 ;
				}
				dom1.find('li:eq('+pageNum+')').addClass('active').siblings().removeClass('active');
				dom2.find('li:eq('+pageNum+')').addClass('active').siblings().removeClass('active');
//				$('.pageNum li:eq('+pageNum+')').addClass('active').siblings().removeClass('active');
				
			})
			dom2.closest('.pagination').find('.prevPage').click(function(){
				
//				$('.pageNum li').each(function(idx){
				dom2.find('li').each(function(idx){
					//获取当前active所在的index
					if($(this).hasClass('active')){
						pageNum = idx ;		
					}
				})
				
				pageNum --;
				if(pageNum < 0 ){
					pageNum = 0 ;
				}
				dom1.find('li:eq('+pageNum+')').addClass('active').siblings().removeClass('active');
				dom2.find('li:eq('+pageNum+')').addClass('active').siblings().removeClass('active');
//				$('.pageNum li:eq('+pageNum+')').addClass('active').siblings().removeClass('active');
				
			})
			
			//点击下一页
			dom1.closest('.pagination').find('.nextPage').click(function(){

				dom1.find('li').each(function(idx){
					//获取当前active所在的index
					if($(this).hasClass('active')){
						pageNum = idx ;	
					}
				})
				
				pageNum++;
				if(pageNum > 7){
					pageNum = 7 ;
				}

				dom1.find('li:eq('+pageNum+')').addClass('active').siblings().removeClass('active');
				dom2.find('li:eq('+pageNum+')').addClass('active').siblings().removeClass('active');
			})	
			dom2.closest('.pagination').find('.nextPage').click(function(){
				dom2.find('li').each(function(idx){
					//获取当前active所在的index
					if($(this).hasClass('active')){
						pageNum = idx ;	
					}
				})
				
				pageNum++;
				if(pageNum > 7){
					pageNum = 7 ;
				}
				dom1.find('li:eq('+pageNum+')').addClass('active').siblings().removeClass('active');
				dom2.find('li:eq('+pageNum+')').addClass('active').siblings().removeClass('active');
			})	
		}else {
			for(var i = 0 ; i < 7 ;i++){
				dom1.append('<li>'+ (i+1) +'</li>');
				dom2.append('<li>'+ (i+1) +'</li>');
			}
			$('.pageNum').width(7*36);
			$('.pagination').width(7*36+72);
			
			$.each($('.pageNum'),function(idx,item){
				////添加完dom后给第一个页码默认添加class = active
				$(item).find('li').eq(0).addClass('active');
				//如果是页数大于7的话要给倒数第二个的text变成...
				$(item).find('li').eq(5).text('...');
				//最后一个页码变成max的值
				$(item).find('li').eq(6).text(max);
			})		
			
			
//			$('.pageNum li').click(function(){
			dom1.find('li').click(function(){
				var num  = $(this).index();
				xky(dom1,num)
			})
			dom2.find('li').click(function(){
				var num  = $(this).index();
				xky(dom2,num)
			})
			function xky(dom,num){
				if(num > 3 && num < 5 && dom.find('li:eq('+num+')').text() > 4 && dom.find('li:eq('+num+')').text() < max -2 ){
					dom1.find('li:eq(1)').text('...');
					dom2.find('li:eq(1)').text('...');
					for(var i = 0 ; i < 5;i++ ){
						if( i > 1 ){
							var texts = dom.find('li:eq('+i+')').text();
							dom1.find('li:eq('+i+')').text(parseInt(texts)+1);
							dom2.find('li:eq('+i+')').text(parseInt(texts)+1);
						}
					}
					dom1.find('li:eq('+(num-1)+')').addClass('active').siblings().removeClass('active');
					dom2.find('li:eq('+(num-1)+')').addClass('active').siblings().removeClass('active');
					if(dom.find('li:eq(4)').text() == max-2 ){
						dom1.find('li:eq(5)').text(max-1);
						dom2.find('li:eq(5)').text(max-1);
					}
				}else if(num < 3 && dom.find('li:eq('+num+')').text() <= max-4 & dom.find('li:eq('+num+')').text() > 3){
					dom1.find('li:eq(5)').text('...');
					dom2.find('li:eq(5)').text('...');
					for(var i = 0 ; i < 5;i++ ){
						if( i > 1 ){
							var texts = dom.find('li:eq('+i+')').text();
							dom1.find('li:eq('+i+')').text(parseInt(texts)-1);
							dom2.find('li:eq('+i+')').text(parseInt(texts)-1);
						}
					}
					dom1.find('li:eq('+(num+1)+')').addClass('active').siblings().removeClass('active');
					dom2.find('li:eq('+(num+1)+')').addClass('active').siblings().removeClass('active');
					
					if(dom.find('li:eq(2)').text() == 3 ){
						dom1.find('li:eq(1)').text(2);
						dom2.find('li:eq(1)').text(2);
					}
				}else if(num == 6){
//					$('.pageNum li:eq(1)').text('...');
					dom1.find('li:eq(1)').text('...');
					dom2.find('li:eq(1)').text('...');
					dom1.find('li:eq(6)').addClass('active').siblings().removeClass('active');
					dom2.find('li:eq(6)').addClass('active').siblings().removeClass('active');


					for(var i = 2,j=0; i < 6 ;i++){
						dom.find('li:eq('+i+')').text(max-4+j);
						j++
					}
				}else if(num === 0){
					dom1.find('li:eq(5)').text('...');
					dom2.find('li:eq(5)').text('...');
					dom1.find('li:eq(0)').addClass('active').siblings().removeClass('active');
					dom2.find('li:eq(0)').addClass('active').siblings().removeClass('active');
					for(var i = 0,j=1; i < 5 ;i++){
						dom1.find('li:eq('+i+')').text(j);
						dom2.find('li:eq('+i+')').text(j);
						j++;
					}
				}
				else{
					$.each($('.pageNum'),function(idx,item){
						$(item).find('li').eq(num).addClass('active').siblings().removeClass('active');
					})
				}
			}
			//点击上一页
			dom1.closest('.pagination').find('.prevPage').click(function(){
				prevs(dom1)
			})	
			dom2.closest('.pagination').find('.prevPage').click(function(){
				prevs(dom2)
			})	
			function prevs(dom){
				turnPage = true ;
				dom.find('li').each(function(idx){
					//获取当前active所在的index
					if($(this).hasClass('active')){
						pageNum = idx ;	
					}
				})
	
				if(pageNum == 3 && turnPagePrev){
					pageNum = 4 ;
					dom1.find('li:eq('+pageNum+')').addClass('active').siblings().removeClass('active');
					dom2.find('li:eq('+pageNum+')').addClass('active').siblings().removeClass('active');
				}
				
				pageNum--;
				if(pageNum <= 0){
					pageNum = 0 ;
					turnPage = true ;
				}else if(pageNum == 3){
					if(turnPagePrev){
						dom1.find('li:eq(5)').text('...');
						dom2.find('li:eq(5)').text('...');
						for(var i = 0 ; i < 5;i++ ){
							if( i > 1 ){
								var texts = dom.find('li:eq('+i+')').text();
								dom1.find('li:eq('+i+')').text(parseInt(texts)-1);
								dom2.find('li:eq('+i+')').text(parseInt(texts)-1);
							}
						}
					}
				}
				
				if(dom.find('li:eq(3)').text() == 4 ){
					turnPagePrev = false ;
					dom1.find('li:eq(1)').text(2);
					dom2.find('li:eq(1)').text(2);
				}
					
				dom1.find('li:eq('+pageNum+')').addClass('active').siblings().removeClass('active');
				dom2.find('li:eq('+pageNum+')').addClass('active').siblings().removeClass('active');
			}
			//点击下一页
//			$('.nextPage').click(function(){
			dom1.closest('.pagination').find('.nextPage').click(function(){
				nexts(dom1)
			})	
			dom2.closest('.pagination').find('.nextPage').click(function(){
				nexts(dom2)
			})		
			
			function nexts(dom){
//				$('.pageNum li').each(function(idx){
				dom.find('li').each(function(idx){
					//获取当前active所在的index
					if($(this).hasClass('active')){
						pageNum = idx ;	
					}
				})
				
				pageNum++;
				if(pageNum >= 6){
					pageNum = 6 ;
					turnPagePrev = true ;
				}else if(pageNum == 4){
					if(turnPage){
//						$('.pageNum li:eq(1)').text('...');
						dom1.find('li:eq(1)').text('...');
						dom2.find('li:eq(1)').text('...');
						for(var i = 0 ; i < 5;i++ ){
							if( i > 1 ){
								var texts = dom.find('li:eq('+i+')').text();
								dom1.find('li:eq('+i+')').text(parseInt(texts)+1);
								dom2.find('li:eq('+i+')').text(parseInt(texts)+1);
							}
						}
						pageNum = 3;
					}
				}
				
				if(dom.find('li:eq(3)').text() == max - 3 ){
					turnPage = false ;
//					$('.pageNum li:eq(5)').text(max-1);
					dom1.find('li:eq(5)').text(max-1);
					dom2.find('li:eq(5)').text(max-1);
				}
				dom1.find('li:eq('+pageNum+')').addClass('active').siblings().removeClass('active');
				dom2.find('li:eq('+pageNum+')').addClass('active').siblings().removeClass('active');
			}
			
			
		}
	}
	//分页-----------------------------------------end--------------------------------------------------------------	
})


