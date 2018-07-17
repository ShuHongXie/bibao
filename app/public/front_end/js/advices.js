$(function(){
	$('.sendAdvices').click(function(){
		var nval = $('.usern').val().trim();
		var eval = $('.usere').val().trim();
		var pval = $('.userp').val().trim();
		var aval = $('.usera').val().trim();
		
		if( nval === '' || eval === '' || pval === '' || aval === '' ){
			layer.msg('4个选项未填满哦');
		}else {
			$.ajax({
				type:'POST',
				url: urls + '/v1/public/setAdvices',
				data:{
					name : nval ,
					email : eval ,
					phone : pval ,
					advices : aval 
				},
				success:function(data){
					layer.msg(data.respmsg);
				},
				error:function(err){
					console.log(err);
				}
			})
		}
		
	})
	
	
	
})
