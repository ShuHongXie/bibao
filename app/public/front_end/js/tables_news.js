$(function(){
	var page = null,sort_page = [] ,page_num = 1, rates = null, currency_type = null; 
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
	//进入页面请求汇率
	$.ajax({
		type:'GET',
		url:'http://192.168.50.136:7001/v1/public/getExchange',
		success:function(data){
			rates = data.data;
			//获取汇率后请求
			//选择类型为人名币
			currency_type = "人民币";
			getPage(getCurrencyPrice(currency_type,rates),rates);
		}
	})
	
	//按钮点击
	$('.choose-lang button').click(function(){
		$('.btn-box button:eq(2)').html($(this).text()+'<i></i>');
		$('.choose-lang').slideUp(100);
		
		//获取当前选择的币中  开始筛选
		var idx = $(this).index();
		currency_type = currency[idx];
		//筛选结束
		//获取保存的页码数
		var current_page = page_num ;
		changeGetPage(current_page,rates);
	})
	
	
	function changeGetPage(current_page,rates){
		$('.pagination').pagination({
			dataSource: function(done) {
			    $.ajax({
			        type: 'GET',
			        url: 'http://192.168.50.136:7001/v1/tokens/getMarketList',
			        data:{
						page:1,
						size:20
					},
			        success: function(data) {
			        	if(data.respcode === 100){
			        		var datas = [] ;
			        		datas.length = data.data.count ;
			        		done(datas);
			        	}else {
			        		alert('币种数据获取失败 请重新刷新页面获取');
			        	}
			        }
			    });
			},
			pageSize:20,
			pageNumber:current_page,
			className:'paginationjs-theme-green paginationjs-smal',
		    callback: function(data, pagination){
		    	//保存当前页数
		    	page_num = pagination.pageNumber ;
		    	$.ajax({
			        type: 'GET',
			        url: 'http://192.168.50.136:7001/v1/tokens/getMarketList',
			        data:{
						page:page_num,
						size:20
					},
			        success: function(data) {
      			    	page = data.data.list ;		    	
				    	
						//渲染
				        var html = template(page,getCurrencyPrice(currency_type,rates),pagination,rates);
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
			    });
//		    	//保存当前页面数据
//		    	page = data ;
//		    	
//		    	//保存当前页数
//		    	page_num = pagination.pageNumber ;
//				
//		        //模板函数映射
//		        var html = template(data,getCurrencyPrice(currency_type,rates),pagination,rates);
//		        $('.table_s').html(html);
//		        //渲染折线图
//		        $('.line').peity('line', {
//					width: 120,
//					height: 22,
//					fill: 'none',
//					strokeWidth: 1,
//					min: 10000,
//					stroke: '#20CA70'
//				})
		    }
		})
	}
	
	function getPage(rate,rates){
		$('.pagination').pagination({
			dataSource: function(done) {
			    $.ajax({
			        type: 'GET',
			        url: 'http://192.168.50.136:7001/v1/tokens/getMarketList',
			        data:{
						page:1,
						size:20
					},
			        success: function(data) {
			        	if(data.respcode === 100){
			        		var datas = [] ;
			        		datas.length = data.data.count ;
			        		done(datas);
			        	}else {
			        		alert('币种数据获取失败 请重新刷新页面获取');
			        	}
			            
			        }
			    });
			},
			pageSize:20,
			pageNumber:1,
			className:'paginationjs-theme-green paginationjs-smal',
		    callback: function(data, pagination) {
		    	//保存当前页数
		    	page_num = pagination.pageNumber ;
		    	$.ajax({
			        type: 'GET',
			        url: 'http://192.168.50.136:7001/v1/tokens/getMarketList',
			        data:{
						page:page_num,
						size:20
					},
			        success: function(data) {
      			    	page = data.data.list ;		    	
				    	
						//渲染
				        var html = template(page,rate,pagination,rates);
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
			    });
//		    	//保存当前页面数据
//		    	page = data ;
//		    	console.log(page)
//		    	//保存当前页数
//		    	page_num = pagination.pageNumber ;
//				//渲染
//		        var html = template(data,rate,pagination,rates);
//		        $('.table_s').html(html);
//		        //渲染折线图
//		        $('.line').peity('line', {
//					width: 120,
//					height: 22,
//					fill: 'none',
//					strokeWidth: 1,
//					min: 10000,
//					stroke: '#20CA70'
//				})
		        
		    }
		})
	}
	
	function template(data,rate,pagination,rates) {
		//渲染
		$('.table_s').html(td);
		var page_val = data ;
		var num = pagination.pageNumber ;
	    for(var i in page_val){		
			$('.table_s').append("<tr>"+
				"<td>"+ getNum(num,i) +"</td>"+
				"<td><img src='img/btye.png' alt='' /><span><a href="+ '/token/' + page_val[i].symbol +">"+ page_val[i].name +"<a></span></td>"+
				"<td>"+ getCurrency(rates) + format_market_cap(page_val[i].total_value / parseFloat(rate)) +"</td>"+
				"<td>"+ getCurrency(rates) + formatprice(page_val[i].price_CNY / parseFloat(rate)) +"</td>"+
				"<td>"+ format_crypto_volume(page_val[i].market_num) +"</td>"+
				"<td>"+ getCurrency(rates) + format_crypto_volume(page_val[i].totol_price_24h / parseFloat(rate)) +"</td>"+
				"<td>"+"<span class="+ getStatus(page_val[i].percent_change_24h)+" >"+ wasNull_24h(page_val[i].percent_change_24h) +"</span></td>"+
				"<td><span class='line' >"+ page_val[i].price_change_7d.toString() +"</span></td>"+
				"<td>"+"<img src='img/save.png' alt='' />" + "</td>"+
			"</tr>")
		}
	}
	

	
	var idx ,sort = [ 0, 0, 0, 0, 0, 0, 0, 0, 0];
	//主页数据表单排名效果
	$('.table_f tr th').hover(function(){
		idx = $(this).index()
		$('.table_f th:eq('+idx+') i').show();
	},function(){
		if(sort[idx] === 0){
			$('.table_f th:eq('+idx+') i').hide();
		}	
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
			//升序
			if(sort[idx] % 2 === 0){
				//降序
				sort_page = page.slice(0).reverse();
				var page_val = sort_page ;
				$('.table_s').html(td)
				for(var i in page_val){		
					$('.table_s').append("<tr>"+
						"<td>"+ Math.abs(page_num * 20 - i) +"</td>"+
						"<td><img src='img/btye.png' alt='' /><span><a href="+ '/token/' + page_val[i].symbol +">"+ page_val[i].name +"<a></span></td>"+
						"<td>"+ getCurrency(rates) + format_market_cap(page_val[i].total_value / parseFloat(rate)) +"</td>"+
						"<td>"+ getCurrency(rates) + formatprice(page_val[i].price_CNY / parseFloat(rate)) +"</td>"+
						"<td>"+ format_crypto_volume(page_val[i].market_num) +"</td>"+
						"<td>"+ getCurrency(rates) + format_crypto_volume(page_val[i].totol_price_24h / parseFloat(rate)) +"</td>"+
						"<td>"+"<span class="+ getStatus(page_val[i].percent_change_24h)+" >"+ wasNull_24h(page_val[i].percent_change_24h) +"</span></td>"+
						"<td><span class='line' >"+ page_val[i].price_change_7d.toString() +"</span></td>"+
						"<td>"+"<img src='img/save.png' alt='' />" + "</td>"+
					"</tr>")
				}
			}else {
				//获取当前页的20条数据
				sort_page = page.slice(0);
				var page_val = sort_page ;
				//渲染为空
				$('.table_s').html(td);
				for(var i in page_val){		
					$('.table_s').append("<tr>"+
						"<td>"+ getNum(page_num,i) +"</td>"+
						"<td><img src='img/btye.png' alt='' /><span><a href="+ '/token/' + page_val[i].symbol +">"+ page_val[i].name +"<a></span></td>"+
						"<td>"+ getCurrency(rates) + format_market_cap(page_val[i].total_value / parseFloat(rate)) +"</td>"+
						"<td>"+ getCurrency(rates) + formatprice(page_val[i].price_CNY / parseFloat(rate)) +"</td>"+
						"<td>"+ format_crypto_volume(page_val[i].market_num) +"</td>"+
						"<td>"+ getCurrency(rates) + format_crypto_volume(page_val[i].totol_price_24h / parseFloat(rate)) +"</td>"+
						"<td>"+"<span class="+ getStatus(page_val[i].percent_change_24h)+" >"+ wasNull_24h(page_val[i].percent_change_24h) +"</span></td>"+
						"<td><span class='line' >"+ page_val[i].price_change_7d.toString() +"</span></td>"+
						"<td>"+"<img src='img/save.png' alt='' />" + "</td>"+
					"</tr>")
				}
			}
		}else if(index === 2){
			//升序
			if(sort[idx] % 2 === 0){
				sort_page = page.slice(0);
				var page_val = sort_page.sort(sortRise('total_value')) ;
				$('.table_s').html(td);
				for(var i in page_val){		
					$('.table_s').append("<tr>"+
						"<td>"+ getNum(page_num,i) +"</td>"+
						"<td><img src='img/btye.png' alt='' /><span><a href="+ '/token/' + page_val[i].symbol +">"+ page_val[i].name +"<a></span></td>"+
						"<td>"+ getCurrency(rates) + format_market_cap(page_val[i].total_value / parseFloat(rate)) +"</td>"+
						"<td>"+ getCurrency(rates) + formatprice(page_val[i].price_CNY / parseFloat(rate)) +"</td>"+
						"<td>"+ format_crypto_volume(page_val[i].market_num) +"</td>"+
						"<td>"+ getCurrency(rates) + format_crypto_volume(page_val[i].totol_price_24h / parseFloat(rate)) +"</td>"+
						"<td>"+"<span class="+ getStatus(page_val[i].percent_change_24h)+" >"+ wasNull_24h(page_val[i].percent_change_24h) +"</span></td>"+
						"<td><span class='line' >"+ page_val[i].price_change_7d.toString() +"</span></td>"+
						"<td>"+"<img src='img/save.png' alt='' />" + "</td>"+
					"</tr>")
				}
			}else {
				//降序
				sort_page = page.slice(0);
				var page_val = sort_page.sort(sortDrop('total_value')) ;
				$('.table_s').html(td);
				for(var i in page_val){		
					$('.table_s').append("<tr>"+
						"<td>"+ Math.abs(page_num * 20 - i) +"</td>"+
						"<td><img src='img/btye.png' alt='' /><span><a href="+ '/token/' + page_val[i].symbol +">"+ page_val[i].name +"<a></span></td>"+
						"<td>"+ getCurrency(rates) + format_market_cap(page_val[i].total_value / parseFloat(rate)) +"</td>"+
						"<td>"+ getCurrency(rates) + formatprice(page_val[i].price_CNY / parseFloat(rate)) +"</td>"+
						"<td>"+ format_crypto_volume(page_val[i].market_num) +"</td>"+
						"<td>"+ getCurrency(rates) + format_crypto_volume(page_val[i].totol_price_24h / parseFloat(rate)) +"</td>"+
						"<td>"+"<span class="+ getStatus(page_val[i].percent_change_24h)+" >"+ wasNull_24h(page_val[i].percent_change_24h) +"</span></td>"+
						"<td><span class='line' >"+ page_val[i].price_change_7d.toString() +"</span></td>"+
						"<td>"+"<img src='img/save.png' alt='' />" + "</td>"+
					"</tr>")
				}
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
					"<td><img src='img/btye.png' alt='' /><span><a href="+ '/token/' + page_val[i].symbol +">"+ page_val[i].name +"<a></span></td>"+
					"<td>"+ getCurrency(rates) + format_market_cap(page_val[i].total_value / parseFloat(rate)) +"</td>"+
					"<td>"+ getCurrency(rates) + formatprice(page_val[i].price_CNY / parseFloat(rate)) +"</td>"+
					"<td>"+ format_crypto_volume(page_val[i].market_num) +"</td>"+
					"<td>"+ getCurrency(rates) + format_crypto_volume(page_val[i].totol_price_24h / parseFloat(rate)) +"</td>"+
					"<td>"+"<span class="+ getStatus(page_val[i].percent_change_24h)+" >"+ wasNull_24h(page_val[i].percent_change_24h) +"</span></td>"+
					"<td><span class='line' >"+ page_val[i].price_change_7d.toString() +"</span></td>"+
					"<td>"+"<img src='img/save.png' alt='' />" + "</td>"+
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
		if( num === 1 ){
			return parseInt(i) + 1 ;
		}else if( num > 1 & num < 100 && i < 10 ){
			return parseInt((num*2 - 2) + i) + 1 ;
		}else if( num > 1 & num >= 100 && i < 10 ){
			return parseInt((num*20 - 2) + i) + 1 ;
		}else if( num > 1 && i >= 10 ){
			return (num * 10) + (num - 1) * 10  + (i-9)  ;
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
	    return parseInt(priceStr*100)/100;
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
		if(val != null) {
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
	
	
	
	
	
	
})
