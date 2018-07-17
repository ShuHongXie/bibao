$(function(){
	var windowHref = window.location.href;
	var currency = windowHref.split('/');
	var idx = 0,token;
	// 判断有没有登录 重新渲染是否有收藏
	if(wasLogin){
		var currencySave = JSON.parse(localStorage.getItem('mySave')).saveCurrency;
		token = JSON.parse(localStorage.getItem('bibao')).token;
		console.log(token);
		for(var i in currencySave){
			if(i === currency[currency.length-1]){
				$('.notsave').css('display','none');
				$('.save').css('display','inline');
			}
		}
	}else {
		$('.save').css('display','none');
		$('.notsave').css('display','inline');
	}
	
	// 点击收藏或取消收藏
	$('.save-box img').click(function(){
		if(wasLogin){
			if($(this).hasClass('save')){ // 取消收藏
				save(0,token,currency[currency.length-1],currencySave);
			} else { // 收藏
				save(1,token,currency[currency.length-1],currencySave);
			}
		}else {
			layer.msg('您还未登录,请先登录');
		}
		
	})
	
	function save(state,token,symbols,currency_list){
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
						$('.notsave').css('display','none');
						$('.save').css('display','inline');
					}else if(state === 0){  //当为0时取消收藏
						delete currency_list[symbols];
						$('.save').css('display','none');
						$('.notsave').css('display','inline');
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
	
	//token过期时候的 动作
	function tokenOverdue(data){
		localStorage.clear();
		layer.msg(data.respmsg);
		$('.toLogin').show();
		$('.userCenter').hide();
	}
	
	$('.code').hover(function(){
		$('.QR-code').show();
	},function(){
		$('.QR-code').hide();
	});
	
	
	$('.btc-title').text(currency[currency.length-1] + '价格趋势');
	//获取扇形图
	$.ajax({
		type:"GET",
		url: urls + '/v1/tokens/getSectorChartBySymbol',
		data : {
			symbol : currency[currency.length-1]
		},
		success:function(data){
			//流通量
			var circulation = ((data.data.chart_circulation_ps) * 100).toFixed(2) ;
			//总市值
			var supply = ((data.data.chart_supply_ps) * 100).toFixed(2) ;
			//换手率
			var turnover = ((data.data.chart_turnover_ps) * 100 ).toFixed(2);
			//总市值扇形图
			$('.char_3').text(supply + '%');
			new Chartist.Pie('.ct-chart3', {
				series: [supply, 100 - supply]
			}, {
				donut: true,
				donutWidth: 10,
				startAngle: 270,
				total: 200,
				showLabel: false,
			});
			//流通量扇形图
			$('.char_2').text(circulation + '%');
			new Chartist.Pie('.ct-chart2', {
				series: [circulation, 100 - circulation]
			}, {
				donut: true,
				donutWidth: 10,
				startAngle: 270,
				total: 200,
				showLabel: false,
			});
			//换手率扇形图
			$('.char_1').text(turnover + '%');
			new Chartist.Pie('.ct-chart1', {
				series: [turnover, 100 - turnover]
			}, {
				donut: true,
				donutWidth: 10,
				startAngle: 270,
				total: 200,
				showLabel: false,
			});
		},
		error:function(){
			layer.open({
			    content:'服务器错误',
			    btn: '确定'
			});
		}
	})
	//获取折线图
	$.ajax({
		type:"GET",
		url: urls + '/v1/tokens/getLineChart',
		data : {
			symbol : currency[currency.length-1]
		},
		success:function(data){
			if(data.respcode === 100){
				var all =  data.data.list, ohlc = [],volume = [],values = [];
				//设定时间
				var groupingUnits = [[
					'millisecond', // unit name
					[1, 2, 5, 10, 20, 25, 50, 100, 200, 500] // allowed multiples
				], [
					'second',
					[1, 2, 5, 10, 15, 30]
				], [
					'minute',
					[1, 2, 5, 10, 15, 30]
				], [
					'hour',
					[1, 2, 3, 4, 6, 8, 12]
				], [
					'day',
					[1]
				], [
					'week',
					[1]
				], [
					'month',
					[1, 3, 6]
				], [
					'year',
					[1, 3, 6]
				]];
				//数据装填
				for(var i = 0 ; i < all.date.length ;i++ ){
					ohlc.push([
						all.date[i],
						all.price[i]
					]);
					volume.push([
						all.date[i],
						all.volume[i]
					]);
					values.push([
						all.date[i],
						all.price[i]
					]);
				}
				console.log(ohlc);
				//开始
				var chart = Highcharts.stockChart('container', {
						rangeSelector: {
				            allButtonsEnabled: true,
				            buttons: [{
				                type: 'day',
				                count: 1,
				                text: '天',
				            }, {
				                type: 'week',
				                count: 1,
				                text: '周',
				            }, {
				                type: 'month',
				                count: 1,
				                text: '1月',
				            },{
				                type: 'month',
				                count: 3,
				                text: '3月',
				            },{
				                type: 'year',
				                text: '一年',
				                count: 1,
				            },{
				                type: 'all',
				                text: '全部',
				            }],
							inputDateFormat: '%Y-%m-%d',
				            selected: 6
				        },
						legend: {
							layout: 'horizontal',
							align: 'right',
							verticalAlign: 'top',
							enabled:true,
							floating:true,
							align:'center'
						},
						credits: {
							enabled: false
						},
						xAxis: {
							dateTimeLabelFormats: {
								millisecond: '%H:%M:%S.%L',
								second: '%H:%M:%S',
								minute: '%H:%M',
								hour: '%H:%M',
								day: '%m-%d',
								week: '%m-%d',
								month: '%y-%m',
								year: '%Y'
							},
							labels: {
									align: 'left',
									x: 3
							},
						},
						tooltip: {
								split: false,
								shared: true,
						},
						yAxis: [{
							labels: {
								align: 'right',
								x: -3
							},
							title: {
								text: '价格(美元)'
							},
							height: '65%',
							resize: {
									enabled: true
							},
							lineWidth: 2
						}, {
							labels: {
								align: 'right',
								x: -3
							},
							title: {
								text: '24h成交量',
								width:100
							},
							top: '65%',
							height: '35%',
							offset: 0,
							lineWidth: 2
						}],
						series: [{
							type: 'line',
							name: '美元USD',
							color: 'green',
							lineColor: 'green',
							upColor: 'red',
							upLineColor: 'red',
							tooltip: {
							},
							navigatorOptions: {
								color: Highcharts.getOptions().colors[0]
							},
							data: ohlc,
							dataGrouping: {
								units: groupingUnits
							},
							id: 'sz'
						},{
							type: 'column',
							name: '24小时成交量',
							data: volume,
							yAxis: 1,
							dataGrouping: {
								units: groupingUnits
							}
						}]
				});
			}
		},
		error:function(){
			layer.open({
			    content:'服务器错误',
			    btn: '确定'
			});
		}
	})
	
})
