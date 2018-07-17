$(function(){
	var page = null ,page_num = 1 ,rate = null ,type = '24h' ,status = 1 ,idx_f = 0 ,idx_s = 2;
	var currencyCNName = ['₩','菲律宾','￡','$','CHF','瑞典克朗','澳门元','AUD','HK$','泰国铢','€','林吉特','¥','新西兰元','新台币','新加坡元','挪威克朗','卢布','南非兰特','加拿大元','¥','丹麦克朗'];
	var currency = ['人民币','港币','澳大利亚元','美元','瑞士法郎','日元','欧元','英镑','韩国元'];
	
	var td = "<tr>"+
		"<th>#</th>"+
		"<th>名称</th>"+
		"<th>简称</th>"+
		"<th>成交额 ( 24小时 )</th>"+
		"<th>价格</th>"+
		"<th>24小时%</th>"+
	"</tr>";
	//点击出现汇率选择表
	$('.choose > button:eq(0)').click(function(){
		$('.choose-langs').slideToggle(100);
	});
	
	//不同国家币种汇率选择
	$('.choose-langs button').click(function(){
		$('.choose button:eq(0)').html($(this).text()+'<i></i>');
		$('.choose-langs').slideUp(100);
		
		//获取当前选择的币中  开始筛选
		var idx = $(this).index();
		currency_type = currency[idx];
		//筛选结束
		//获取保存的页码数
		//var current_page = page_num ;
		template(page,getCurrencyPrice(currency_type,rates),rates)	
	})
	
	//选择24h 7h 1天
	$('.choose > button:not(.choose-langs)').click(function(){
		var index = $(this).index();
		if(index !== 0){
			$(this).addClass('active').siblings().removeClass('active');
			//赋值type
			if(index === 1){
				type = '1h' ;
			}else if(index === 2){
				type = '24h' ;
			}else if(index === 3){
				type = '7d' ;
			}
			if(index !== idx_s){
				idx_s = index ;
				getPage(getCurrencyPrice(currency_type,rates),rates);
			}
			
		}
	})
	
	//选择涨幅榜或者跌幅榜
	$('.switch button').click(function(){
		var index = $(this).index();
		$(this).addClass('active').siblings().removeClass('active');
		if(index === 0){
			status = 1 ;
		}else {
			status = -1 ;
		}
		
		if(index !== idx_f){
			idx_f = index ;
			getPage(getCurrencyPrice(currency_type,rates),rates);
		}
	})
	
	//进入页面请求汇率
	$.ajax({
		type:'GET',
		url: urls + '/v1/public/getExchange',
		success:function(data){
			rates = data.data;
			//获取汇率后请求
			//选择类型为人名币
			currency_type = "人民币";
			console.log(rates)
			getPage(getCurrencyPrice(currency_type,rates),rates);
		}
	})
	
	//获取排行榜数据文件
	function getPage(rate,rates){
		$.ajax({
			type: 'GET',
			url: urls + '/v1/tokens/changeList' ,
			data:{
				page : 1,
				size : 30 ,
				sort : status ,
				type : type
			},
			success:function(data){
				if(data.respcode === 100){
					var data = data.data.list ;
					page = data ;
					template(data,rate,rates);
					console.log(idx_s)
					var pecent = $('table tr:eq(0) th:eq(5)') ;
					if(idx_s === 1){
						pecent.text('1小时%');
					}else if(idx_s === 2){ ;
						pecent.text('24小时%');
					}else if(idx_s === 3){
						pecent.text('一星期%');
					}
					$('.not_data').hide();
				}else {
					$('.not_data').show();
				}
			},
			error:function(){
				$('.not_data').show();
			}
		})
	}
	
	//进入页面渲染模板
	function template(data,rate,rates){
		//渲染
		$('table').html(td);
		var page_val = data ;
	    for(var i in page_val){		
			$('table').append("<tr>"+
				"<td><span class='num' >"+ (parseInt(i)+1) +"</span></td>"+
				"<td><img src='img/btye.png' alt='' /><span><a href="+ '/token/' + page_val[i].symbol +">"+ getName(page_val[i]) +"<a></span></td>"+
				"<td>"+ page_val[i].symbol +"</td>"+ 
				"<td>"+ getCurrency(rates) + format_crypto_volume( filterTotalVal( page_val[i].totol_price_24h,parseFloat(rate)) ) +"</td>"+
				"<td>"+ getCurrency(rates) + formatprice( filterTotalVal( page_val[i].price_CNY,parseFloat(rate)) ) +"</td>"+
				"<td>"+"<span class="+ getStatus(changeStatus(page_val[i]))+" >"+ wasNull_24h(changeStatus(page_val[i])) +"</span></td>"+
			"</tr>")
		}
	}
	
	//流通市值筛选 如果为 0 就返回空 反之返回汇率相除之后的值
	function filterTotalVal(val,rate){
		if(val){
			return val / rate
		}else {
			return null ;
		}
	}
	
	//改变状态 7d 24h 1h
	function changeStatus(page){
		if( idx_s === 1 ){
			return page.percent_change_1h ;
		}else if (idx_s === 2){
			return page.percent_change_24h ;
		}else if(idx_s === 3){
			return page.percent_change_7d ;
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
	
	//获取币种的汇率  参数1  所要选择的币种名称  参数2 汇率表
	function getCurrencyPrice(type,rates){
		for(var i in rates){
			if(rates[i].name === type){
				return rates[i].price ;
			}
		}
	}
	
	//名字渲染
	function getName(page){
		if(page.name){
			return page.name ;
		}else {
			return page.en_name ;
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
	
	//币种符号更换
	function getCurrency(rates){
		for(var i in rates){
			if(rates[i].name == currency_type){
				return currencyCNName[i];
			}
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
	
})
