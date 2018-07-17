	var page = null,sort_page = [] ,page_num = 1, rates = null, currency_type = null , userCurrency = false,saveCurrency = null ; 
	var currencyCNName = ['₩','菲律宾','￡','$','CHF','瑞典克朗','澳门元','AUD','HK$','泰国铢','€','林吉特','¥','新西兰元','新台币','新加坡元','挪威克朗','卢布','南非兰特','加拿大元','¥','丹麦克朗'];
	var currency = ['人民币','港币','澳大利亚元','美元','瑞士法郎','日元','欧元','英镑','韩国元'];
	var td = "<tr>"+
		"<th><span>#</span><i></i></th>"+
		"<th><span>名称</span></th>"+
		"<th><span>流通市值</span><i></i></th>"+
		"<th><span>价格</span><i></i></th>"+
		"<th><span>流通数量</span><i></i></th>"+
		"<th><span>24H成交额</span><i></i></th>"+
		"<th><span>24H涨幅</span><i></i></th>"+
		"<th><span>7D价格趋势</span></th>"+
		"<th><span>自选</span></th>"+
	"</tr>";
	
	//一进入页面就开始判断是否登录 
	var local = JSON.parse(localStorage.getItem('bibao'));
	$('.btn-box button:eq(0)').addClass('active')
	if(local){
		//如果有登录就保存
		saveCurrency = JSON.parse(localStorage.getItem('mySave')).saveCurrency;
		wasLogin = true ;
		$('.toRes').hide();
		$('.toLogin').hide();
		$('.userCenter').show()
		$('.userc_regtime').text(local.regTime);
		$('.userc_phone').text(local.phone);
		$('.userc_name').text(local.phone);
	}
	//点击收藏或者取消收藏
	$(document).on('click','.save-curr',function(){
		if(wasLogin){
			//根据span所在的位置来获取 第 index+1个tr里面的第一个td里面的值
			var idx = $('.save-curr').index(this) , index ;
			var spanText = parseInt($('.table_s tr:eq('+ (idx+1) +') td:eq(0)').text()) ;  //+1是因为tr 第一个为th
			if(spanText >= 0 && spanText <= $('.save-curr').length){  //当在1-20之间就不需要取余
				index = spanText ;
			}else{
				index = spanText  % 20 ;
			}
			var symbols = page[index-1].symbol ;
			var img = $(this).find('img') ;
			var bibao = JSON.parse(localStorage.getItem('bibao'));
			saveCurrency = JSON.parse(localStorage.getItem('mySave')).saveCurrency ;
			if(img.hasClass('notsave')){
				//如果是灰色 就收藏
				save(1,bibao.token,symbols,saveCurrency,idx);
			}else {
				//黄色就取消收藏
				save(0,bibao.token,symbols,saveCurrency,idx);
			}
		}else {
			layer.msg('登录失效 请重新登录');
		}
	})
	
	$('.btn-box button:eq(0)').click(function(){
		$(this).addClass('active').siblings().removeClass('active');
		$('.no-save-tip').hide();
		$('.table_s').show();
		//状态更改
		userCurrency = false ;
		getPage(getCurrencyPrice(currency_type,rates),rates);
	})
	//我的自选行情点击
	$('.btn-box button:eq(1)').click(function(){
		if(wasLogin){
			//如果登录就改变
			$(this).addClass('active').siblings().removeClass('active');
			//状态更改
			userCurrency = true ;
			//提取token
			var bibao = JSON.parse(localStorage.getItem('bibao'));
			//发送请求获取自选行情的币种
			$.ajax({
				type:"GET",
				url: urls+ "/v1/tokens/getOwnMarketList",
				headers:{
					csrftoken : bibao.token
				},
				data:{
					page:1,
					size:20
				},
				success:function(data){
					//console.log(data)
					//当状态为成功获取时
					if(data.respcode === 100){
						if(data.data.list.length === 0){
							$('.no-save-tip').show();
							$('.table_s').hide();
							//$('.btn-box button:eq(1)').addClass('active');
						}else {
							//当有值时
							$('.pagination').pagination({
								dataSource: data.data.list,
								pageSize:20,
								pageNumber:page_num,
								className:'paginationjs-theme-green paginationjs-smal',
							    callback: function(data, pagination){
							    	//保存当前页数
							    	page_num = pagination.pageNumber ;
							    	page = data ;	
									//渲染
							        var html = template(page,getCurrencyPrice(currency_type,rates),rates);
							        $('.table_s').html(html);
							        //渲染折线图
							        $('.line').peity('line', {
										width: 120,
										height: 22,
										fill: 'none',
										strokeWidth: 1,
										min: 10000,
										stroke: '#20CA70'
									})
							    }
							})
							
						}
					}else if(data.respcode === 500){
						//当token过期时清空所有本地存储 
						tokenOverdue(data);
					}else {
						layer.msg(data.respmsg);
					}
					
				},
				error:function(){
					layer.open({
					    content:'服务器错误',
					    btn: '确定'
					});
				}
			})
		}else {
			//用户未登录
			layer.msg('登录失效 请重新登录');
		}
	})
	
	// 收藏币种和取消收藏币种
	function save(state,token,symbols,currency_list,index){
		$.ajax({
			type:"POST",
			url: urls + "/v1/user/selectToken",
			headers:{
				csrftoken : token
			},
			data:{
				symbol : symbols,
				state : state
			},
			success:function(data){
				if(data.respcode === 100){
					//操作结果提示
					layer.msg(data.respmsg);
					//修改本地
					if(state === 1){  //当为1时添加收藏
						currency_list[symbols] = true ;
						$('.save-curr').eq(index).html("<img class='save show' src='/public/front_end/img/save.png' alt='' />");
					}else if(state === 0){  //当为0时取消收藏
						delete currency_list[symbols];
						$('.save-curr').eq(index).html("<img class='notsave show' src='/public/front_end/img/notsave.png' alt='' />");
					}
					//存储本地
					localStorage.setItem('mySave',JSON.stringify({
						saveCurrency : currency_list
					}))
					//开启渲染
				}else if(data.respcode === 500){
						//当token过期时清空所有本地存储 
					tokenOverdue(data);
				}else {
					layer.msg(data.respmsg);
				}	
			},
			error:function(){
				layer.open({
				    content:'服务器错误',
				    btn: '确定'
				});
			}
		});
	}
	
	//进入页面请求汇率
	$.ajax({
		type:'GET',
		url: urls + '/v1/public/getExchange',
		success:function(data){
			rates = data.data;
			//获取汇率后请求
			//选择类型为人名币
			currency_type = "人民币";
			//获取币种数据
			getPage(getCurrencyPrice(currency_type,rates),rates);
		}
	})
	
	//按钮点击
	$('.choose-lang button').click(function(){
		$('.btn-box button:eq(2)').html($(this).text()+'<i></i>');
		$('.choose-lang').slideUp(100);
		
		//获取当前选择的币中开始筛选
		var idx = $(this).index();
		currency_type = currency[idx];
		
		//筛选结束
		//获取保存的页码数
		var current_page = page_num ;
		if(userCurrency){ //如果是在我的行情里面切换
			changeUserPage(current_page,rates);
		}else {  //如果是在全部里面切换
			changeGetPage(current_page,rates);
		}
		
	})
	//渲染函数1 用户在全部里面改变汇率
	function changeGetPage(current_page,rates){
		
		$.ajax({
	        type: 'GET',
	        url: urls + '/v1/tokens/getMarketList',
	        data:{
				page:1,
				size:20
			},
	        success: function(data) {
	        	if(data.respcode === 100){
	        		var datas = [] ;
	        		//获取分页数并存储
	        		datas.length = data.data.count ;
					//获取本页数据并且存储
					var data_val = data.data.list ;
	        		$('.table_f').removeClass('realtives');
	        		//--------------------------------------------
	        		$('.pagination').pagination({
						dataSource:datas ,
						pageSize:20,
						pageNumber:current_page,
						className:'paginationjs-theme-green paginationjs-smal',
					    callback: function(data, pagination){
					    	//保存当前页数
					    	page_num = pagination.pageNumber ;
					    	page = data_val ;		    	
							//渲染
					        var html = template(page,getCurrencyPrice(currency_type,rates),rates);
					        $('.table_s').html(html);
					        //渲染折线图
					        $('.line').peity('line', {
								width: 120,
								height: 22,
								fill: 'none',
								strokeWidth: 1,
								min: 10000,
								stroke: '#20CA70'
							}) 
							//去除realtive 的 class
							$('.table_f').removeClass('realtives');
					    }
					})
	        		
	        		$('.pagination').addHook('beforePageOnClick', function(data,current) {
						$.ajax({
					        type: 'GET',
					        url: urls + '/v1/tokens/getMarketList',
					        data:{
								page:current,
								size:20
							},
					        success: function(data){
					        	if(data.respcode === 100){
					        		$(document).scrollTop(0)
					        		//存储data
					        		var data_val = data ;
					        		$('.table_f').removeClass('realtives');
					        		
							    	//保存当前页数
							    	page_num = current ;
					        		page = data_val.data.list ;		    	
									//渲染
							        var html = template(page,getCurrencyPrice(currency_type,rates),rates);
							        
							        //渲染折线图
							        $('.line').peity('line', {
										width: 120,
										height: 22,
										fill: 'none',
										strokeWidth: 1,
										min: 10000,
										stroke: '#20CA70'
									})
							        //去除class
							        $('.table_f').removeClass('realtives');    
					        		
								}else {
					        		layer.msg(data.respmsg);
					        		$('.table_f').addClass('realtives');
					        	} 
					        },
					        error:function(err){
					        	$('.table_f').addClass('realtives');
					        }
					    });
					    
					});
	        		
	        	}else {
	        		layer.msg(data.respmsg);
	        		$('.table_f').addClass('realtives');
	        	}
	        },
	        error:function(err){
	        	$('.table_f').addClass('realtives');
	        }
	    });
		
	}
	
	//渲染函数2 用户在我的行情里面改变币种汇率
	function changeUserPage(current_page,rates){
		//console.log('开始渲染')
		$('.pagination').pagination({
			dataSource:page,
			pageSize:20,
			pageNumber:current_page,
			className:'paginationjs-theme-green paginationjs-smal',
		    callback: function(data, pagination){
		    	//保存当前页数
		    	page_num = pagination.pageNumber ;	    	
				//渲染
		        var html = template(page,getCurrencyPrice(currency_type,rates),rates);
		        $('.table_s').html(html);
		        //渲染折线图
		        $('.line').peity('line', {
					width: 120,
					height: 22,
					fill: 'none',
					strokeWidth: 1,
					min: 10000,
					stroke: '#20CA70'
				}) 
		    }
		})
	}
	
	function getPage(rate,rates){
		$.ajax({
	        type: 'GET',
	        url: urls + '/v1/tokens/getMarketList',
	        data:{
				page:1,
				size:20
			},
	        success: function(data){
	        	if(data.respcode === 100){
	        		var datas = [] ;
	        		datas.length = data.data.count ;
	        		//存储data
	        		var data_val = data ;
	        		$('.table_f').removeClass('realtives');
	        		//开始分页
	        		$('.pagination').pagination({
						dataSource:datas ,
						pageSize:20,
						pageNumber:page_num,
						className:'paginationjs-theme-green paginationjs-smal',
					    callback: function(data, pagination){
					    	//保存当前页数
					    	page_num = pagination.pageNumber ;
			        		page = data_val.data.list ;		    	
							//渲染
					        template(page,rate,rates); 
					        //渲染折线图
					        $('.line').peity('line', {
								width: 120,
								height: 22,
								fill: 'none',
								strokeWidth: 1,
								min: 10000,
								stroke: '#20CA70'
							})
					        //去除class
					        $('.table_f').removeClass('realtives');    
						},
					})
					$('.pagination').addHook('beforePageOnClick', function(data,current){
						$.ajax({
					        type: 'GET',
					        url: urls + '/v1/tokens/getMarketList',
					        data:{
								page:current,
								size:20
							},
					        success: function(data){
					        	if(data.respcode === 100){
					        		$(document).scrollTop(0)
					        		//存储data
					        		var data_val = data ;
					        		$('.table_f').removeClass('realtives');
					        		
							    	//保存当前页数
							    	page_num = current ;
					        		page = data_val.data.list ;	
									//渲染
							        var html = template(page,rate,rates);
							        //渲染折线图
							        $('.line').peity('line', {
										width: 120,
										height: 22,
										fill: 'none',
										strokeWidth: 1,
										min: 10000,
										stroke: '#20CA70'
									})
							        //去除class
							        $('.table_f').removeClass('realtives');    
					        		
								}else {
					        		layer.msg(data.respmsg);
					        		$('.table_f').addClass('realtives');
					        	} 
					        },
					        error:function(err){
					        	$('.table_f').addClass('realtives');
					        }
					    });
					    
					});
				}else {
	        		layer.msg(data.respmsg);
	        		$('.table_f').addClass('realtives');
	        	} 
	        },
	        error:function(err){
	        	$('.table_f').addClass('realtives');
	        }
	    });
	}
	
	//token过期时候的 动作
	function tokenOverdue(data){
		localStorage.clear();
		layer.msg(data.respmsg);
		$('.toLogin').show();
		$('.toRes').show();
		$('.userCenter').hide();
		saveCurrency = 0 ;
	}
	
	//进入页面渲染模板
	function template(data,rate,rates){
		//渲染
		$('.table_s').html(td);
		var page_val = data ;
		var num = page_num ;
	    for(var i in page_val){	
			$('.table_s').append("<tr>"+
				"<td>"+ getNum(num,i) +"</td>"+
				"<td><img src='/public/icons/"+ getImg(page_val[i]) +"' alt='' /><span><a href="+ '/token/' + page_val[i].symbol +">"+ getName(page_val[i]) +"<a></span></td>"+
				"<td>"+ getCurrency(rates) + format_market_cap( filterTotalVal( page_val[i].total_value,parseFloat(rate)) ) +"</td>"+
				"<td>"+ getCurrency(rates) + formatprice( filterTotalVal( page_val[i].price_CNY , parseFloat(rate) ) ) +"</td>"+
				"<td>"+ format_crypto_volume(page_val[i].market_num) +"</td>"+
				"<td>"+ getCurrency(rates) + format_crypto_volume(page_val[i].totol_price_24h / parseFloat(rate)) +"</td>"+
				"<td>"+"<span class="+ getStatus(page_val[i].percent_change_24h)+" >"+ wasNull_24h(page_val[i].percent_change_24h) +"</span></td>"+
				"<td><span class='line' >"+ page_val[i].price_change_7d.toString() +"</span></td>"+
				"<td><span class='save-curr' >"+ filterSave(page_val[i].symbol) + "</span></td>"+
			"</tr>")
		}
	    
	}
	
	//根据登录状态渲染收藏按钮(星号)
	function filterSave(val){
		if(wasLogin){
			var mySave = JSON.parse(localStorage.getItem('mySave'));
			var saveCurrency = mySave.saveCurrency ;
			if(!saveCurrency || JSON.stringify(saveCurrency) == "{}"){
				return "<img class='notsave show' src='/public/front_end/img/notsave.png' alt='' />";
			}else {
				for(var i in saveCurrency){
					if(saveCurrency[val]){
						return "<img class='save show' src='/public/front_end/img/save.png' alt='' />" ;
					}else {
						return "<img class='notsave show' src='/public/front_end/img/notsave.png' alt='' />";
					}
				}
			}
		}else {
			return "<img class='save' src='/public/front_end/img/notsave.png' alt='' />";
		}
	}
	
	var idx ,sort = [ 0, 0, 0, 0, 0, 0, 0, 0, 0];
	//主页数据表单排名效果
	$('.table_f tr th').hover(function(){
		idx = $(this).index()
		$('.table_f th:eq('+idx+') i').show();
	},function(){
		$('.table_f th i').hide();
		$('.table_f th:eq('+idx+') i').show();
	})
	
	$('.table_f tr:eq(0) th').click(function(){
		var index = $(this).index();
		if( $(this).children('i').html() !== undefined ){
			sort[index] ++ ;
			$(this).children('i').css('transform','rotate('+180 * sort[index] +'deg)');
		}
		var rate = getCurrencyPrice(currency_type,rates);// 汇率获取
		//当点击为第一个时就排序
		if(index === 0){
			//降序处理
			if(sort[idx] % 2 === 0){
				sort_page = page.slice(0).reverse();
				var page_val = sort_page ;
				htmlDrop(page_val,rate);
			}else { //升序处理 
				//获取当前页的20条数据
				sort_page = page.slice(0);
				var page_val = sort_page ;
				//渲染为空
				htmlRise(page_val,rate);
			}
		}else if(index === 2){
			//升序
			if(sort[idx] % 2 === 0){
				sort_page = page.slice(0);
				var page_val = sort_page.sort(sortRise('total_value')) ;
				htmlRise(page_val,rate);
			}else {
				//降序
				sort_page = page.slice(0);
				var page_val = sort_page.sort(sortDrop('total_value')) ;
				htmlDrop(page_val,rate);
			}
		}else if(index === 3 || index === 4 || index === 5 || index === 6){
			var type = '';
			//根据点击不同的来选择不同的val值
		    if(index === 3){
		    	type = 'price_CNY';
		    }else if(index === 4){
		    	type = 'market_num';
		    }else if(index === 5){
		    	type = 'totol_price_24h';
		    }else if(index === 6){
		    	type = 'percent_change_24h';
		    }
			//console.log('点击了')
			if(sort[idx] % 2 === 0){
				sort_page = page.slice(0);
			    for(var i in sort_page){
			    	sort_page[i]['idx'] = getNum(page_num,i) ;
			    }
			    var page_val = sort_page.sort(sortRise(type)) ;
			}else {
				sort_page = page.slice(0);
			    for(var i in sort_page){
			    	sort_page[i]['idx'] = getNum(page_num,i) ;
			    }
			    var page_val = sort_page.sort(sortDrop(type)) ;
			}
			$('.table_s').html(td);
			for(var i in page_val){		
				$('.table_s').append("<tr>"+
					"<td>"+ page_val[i]['idx'] +"</td>"+
					"<td><img src='/public/icons/"+ getImg(page_val[i]) +"' alt='' /><span><a href="+ '/token/' + page_val[i].symbol +">"+ getName(page_val[i]) +"<a></span></td>"+
					"<td>"+ getCurrency(rates) + format_market_cap( filterTotalVal( page_val[i].total_value,parseFloat(rate)) ) +"</td>"+
					"<td>"+ getCurrency(rates) + formatprice( filterTotalVal( page_val[i].price_CNY , parseFloat(rate) ) ) +"</td>"+
					"<td>"+ format_crypto_volume(page_val[i].market_num) +"</td>"+
					"<td>"+ getCurrency(rates) + format_crypto_volume(page_val[i].totol_price_24h / parseFloat(rate)) +"</td>"+
					"<td>"+"<span class="+ getStatus(page_val[i].percent_change_24h)+" >"+ wasNull_24h(page_val[i].percent_change_24h) +"</span></td>"+
					"<td><span class='line' >"+ page_val[i].price_change_7d.toString() +"</span></td>"+
					"<td><span class='save-curr' >"+ filterSave(page_val[i].symbol) + "</span></td>"+
				"</tr>")
			}
		}
		//渲染折线图
        $('.line').peity('line', {
			width: 120,
			height: 22,
			fill: 'none',
			strokeWidth: 1,
			min: 10000,
			stroke: '#20CA70'
		})
	})
	
		
	//流通市值筛选 如果为 0 就返回空 反之返回汇率相除之后的值
	function filterTotalVal(val,rate){
		if(val){
			return val / rate
		}else {
			return null ;
		}
	}
	
	//名字渲染
	function getName(page){
		if(page.name){
			return page.symbol + '-' + page.name ;
		}else {
			return page.symbol ;
		}
	}
	
	//升序渲染 html 
	function htmlRise(page_val,rate){
		$('.table_s').html(td);
		for(var i in page_val){		
			$('.table_s').append("<tr>"+
				"<td>"+ getNum(page_num,i) +"</td>"+
				"<td><img src='/public/icons/"+ getImg(page_val[i]) +"' alt='' /><span><a href="+ '/token/' + page_val[i].symbol +">"+ getName(page_val[i]) +"<a></span></td>"+
				"<td>"+ getCurrency(rates) + format_market_cap( filterTotalVal( page_val[i].total_value , parseFloat(rate) ) ) +"</td>"+
				"<td>"+ getCurrency(rates) + formatprice( filterTotalVal( page_val[i].price_CNY , parseFloat(rate) ) ) +"</td>"+
				"<td>"+ format_crypto_volume(page_val[i].market_num) +"</td>"+
				"<td>"+ getCurrency(rates) + format_crypto_volume(page_val[i].totol_price_24h / parseFloat(rate)) +"</td>"+
				"<td>"+"<span class="+ getStatus(page_val[i].percent_change_24h)+" >"+ wasNull_24h(page_val[i].percent_change_24h) +"</span></td>"+
				"<td><span class='line' >"+ page_val[i].price_change_7d.toString() +"</span></td>"+
				"<td><span class='save-curr' >"+ filterSave(page_val[i].symbol) + "</span></td>"+
			"</tr>")
		}
	}
	
	//降序渲染
	function htmlDrop(page_val,rate){
		$('.table_s').html(td);
		for(var i in page_val){		
			$('.table_s').append("<tr>"+
				"<td>"+ Math.abs((page_num-1) * 20 + page_val.length - i) +"</td>"+
				"<td><img src='/public/icons/"+ getImg(page_val[i]) +"' alt='' /><span><a href="+ '/token/' + page_val[i].symbol +">"+ getName(page_val[i]) +"<a></span></td>"+
				"<td>"+ getCurrency(rates) + format_market_cap( filterTotalVal( page_val[i].total_value,parseFloat(rate)) ) +"</td>"+
				"<td>"+ getCurrency(rates) + formatprice( filterTotalVal( page_val[i].price_CNY , parseFloat(rate) ) ) +"</td>"+
				"<td>"+ format_crypto_volume(page_val[i].market_num) +"</td>"+
				"<td>"+ getCurrency(rates) + format_crypto_volume(page_val[i].totol_price_24h / parseFloat(rate)) +"</td>"+
				"<td>"+"<span class="+ getStatus(page_val[i].percent_change_24h)+" >"+ wasNull_24h(page_val[i].percent_change_24h) +"</span></td>"+
				"<td><span class='line' >"+ page_val[i].price_change_7d.toString() +"</span></td>"+
				"<td><span class='save-curr' >"+ filterSave(page_val[i].symbol) + "</span></td>"+
			"</tr>")
		}
	}
	
	//获取图片
	function getImg(page){
		if(page.icon){
			return page.icon ;
		}else {
			return 'common.png';
		}
	}
	
	//根据数值排序
	//降序
	function sortRise(keys) {
		return function(obj1,obj2){
			var a = obj1[keys];
			var b = obj2[keys];
			if( a > b ){
				return -1 ;
			}else if ( a < b ){
				return 1 ;
			}else {
				return 0 ;
			}
		}  
   }	
	//升序
	function sortDrop(keys) {
		return function(obj1,obj2){
			var a = obj1[keys];
			var b = obj2[keys];
			if( a > b ){
				return 1 ;
			}else if ( a < b ){
				return -1 ;
			}else {
				return 0 ;
			}
		}  
    }
	//币种符号更换
	function getCurrency(rates){
		for(var i in rates){
			if(rates[i].name == currency_type){
				return currencyCNName[i];
			}
		}
	}
	
	//数据索引整理
	function getNum(num,i){
		if( num > 1 & num < 100 && i < 10 ){
			return parseInt((num*2 - 2) + i) + 1 ;
		}else if( num > 1 & num >= 100 && i < 10 ){
			return parseInt((num*20 - 2) + i) + 1 ;
		}else if( num > 1 && i >= 10 ){
			return (num * 10) + (num - 1) * 10  + (i-9)  ;
		}else {
			return (parseInt(i)+1) ;
		}
	}
	
	//获取币种的汇率  参数1  所要选择的币种名称  参数2 汇率表
	function getCurrencyPrice(type,rates){
		for(var i in rates){
			if(rates[i].name === type){
				return rates[i].price ;
			}
		}
	}
	
	//判断是否是null
	function wasNull_24h(val){
		if(val == null){
			return '?';
		}else {
			return val + '%';
		}
	}
	
	//流通市值处理
	function toLocaleString(n, m) {
	    if (m == null || m == "") {
	        m = 0;
	    }
	
	    var str = n.toLocaleString();
	    if (-1 == str.lastIndexOf(".")) {
	        return str;
	    }
	    if (m > 0) {
	        str = str.substring(0, str.lastIndexOf(".") + 1 + m);
	    } else {
	        str = str.substring(0, str.lastIndexOf(".") + m);
	    }
	    return str;
	}
	
	function format_market_cap(val) {
		if(val != null ){
			if (val >= 1000000000) {
		        val = Math.round(val / 100000000).toLocaleString() + "亿";
		    } else if (val >= 100000000) {
		        val = (val / 100000000).toFixed(2).toLocaleString() + "亿";
		    } else if (val >= 1000000) {
		        val = (val / 100000000).toFixed(4).toLocaleString() + "亿";
		    } else if (val >= 1000) {
		        val = toLocaleString(val, 0);
		    }
		    else {
		        val = toLocaleString(val, 2);
		    }
		    return val;
		}else {
			return '?' ;
		}
	}
	
	//获取涨升幅度状态
	function getStatus(val){
		var str = String(val);
		if(str.indexOf('-') !== -1){
			return 'fall';
		}else {
			return 'rise';
		}
	}
	
	//美元价格处理
	function formatprice(val) {
		if(val){
			if(val > 1 ){
				return parseFloat(val.toFixed(2));
			}else if(val < 1){
				return parseFloat(val.toFixed(6));
			}else {
				return val ;
			}
		}else {
			return '?' ;
		}
	}

	function price(val) {
	    var price = val.toString();
	    var indx = price.indexOf('.');
	    var priceStr = price;
	    var counter = 0;
	    if (indx > -1) {
	        for (var i = price.length - 1; i >= 1; i--) {
	            if (price[i] == "0") {
	                counter++;
	                if (price[i - 1] == ".") {
	                    counter++;
	                    break;
	                }
	            } else {
	                break;
	            }
	        }
	        priceStr = "";
	        for (var i = 0; i < price.length - counter; i++) {
	            priceStr += price[i];
	        }
	    }
	    return priceStr;
	}
	
	//流通数量处理
	function format_crypto_volume(val) {
		if(val) {
			if (val >= 1000000) {
		        val = Math.round(val / 10000).toLocaleString() + "万";
		    } else if (val >= 100000) {
		        val = (val / 10000).toLocaleString() + "万";
		    } else if (val >= 1000) {
		        val = (val / 10000).toFixed(2).toLocaleString() + "万";
		    } else if (val >= 100) {
		        val = val.toFixed(0).toLocaleString();
		    } else if (val >= 0.1) {
		        val = val.toFixed(2).toLocaleString();
		    }
		    else {
		        val = val.toFixed(4).toLocaleString();
		    }
		
		    return price(val);
		}else {
			return '?';
		} 
	}	
