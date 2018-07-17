
//点解切换新闻和页面
$(function(){
	var val = [];
	val.length = 100
	$('.pagination').pagination({
		dataSource: val,
		pageSize:20,
		pageNumber:1,
		showGoInput: true,
		showGoButton: true,
		className:'paginationjs-theme-green paginationjs-smal',
	    callback: function(data, pagination){
	    	
	    }
	})
})
