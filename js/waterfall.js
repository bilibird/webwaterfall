/*js代码*/
$(function(){
		//获取容器对象
		var $container = $("#container");
		//定义图片初始宽度
		var width = 200;
		//定义下一图片间间隙
		var space = 14;
		//真实宽度
		var outerWidth = width + space;
		//初始化列数
		var cell = 0;
		//访问数据URL
		var sURL ="http://www.wookmark.com/api/json/popular?callback=?";
		//数据页码
		var pageNo = 0;
		//加锁
		var mark = true;
		//加载图片
		var $loading = $("#loading")
		//计算当前窗口的列数-------------------
		getCells();
		function getCells(){
			cell = Math.floor($(window).width()/outerWidth);
			if(cell<2)cell = 2;
			//得到总宽
			$container.width(cell*outerWidth-space);
		}
		//定义数组:定位图片的坐标------------------------
		//循环列数
		var arrTop = [];
		var arrLeft = [];
		for (var i=0;i<cell;i++ )
		{
			arrTop.push(0);//[h1,h2,h3...hi-1]
			arrLeft.push(i*outerWidth);
		}
		//加载数据---------------------
		loadData();
		function loadData(){
			//锁
			if(mark){
				//加载图片
				mark = false;
				$loading.show();
				$.getJSON(sURL,{page:pageNo},function(data){
					//console.log(data);
					$.each(data,function(index,obj){
						//图片缩小后的真实高度
						var height = width/obj.width*obj.height;
						//获取数组中最小值索引
						var minIndex = getMinIndex(arrTop);
						//动态创建div
						var $div = $("<div></div>");
						$div.addClass("items").css({top:arrTop[minIndex],left:arrLeft[minIndex]}).html("<a href='"+obj.image+"'title='"+obj.title+"' target='_blank'><img src="+obj.preview+" width='"+width+"' height='"+height+"'/></a><p class='p1'>总感觉这下面能写点什么</p>");
						//将div添加到$container中
						$container.append($div);
						//arrTop[minIndex] += height + space;
						arrTop[minIndex] += $div.height() + space;
					});
					mark = true;
					//隐藏加载图片
					$loading.hide(); 
				});
			};
		}
		//滚动加载分页------------------------
		$(window).on("scroll",function(){
			var minIndex = getMinIndex(arrTop);
			//图片最小高度--定值
			var minHeight = arrTop[minIndex] + $container.offset().top;
			//浏览器滚动高度
			var sHeight = $(window).height() + $(window).scrollTop();
			if(sHeight >= minHeight && mark){
				pageNo++;
				loadData();
				//console.log(pageNo)
			}
		})
		//调整浏览器窗口大小时候---------------------------
		$(window).on("resize",function(){
			//重新计算当前窗口的列数
			getCells();
			arrTop = [];
			arrLeft = [];
			for(var i=0;i<cell;i++){
				arrTop.push(0);
				arrLeft.push(i*outerWidth);
			}
			//获取现有元素进行位置交换
			var $items = $container.find(".items");
			$items.each(function(){
				var minIndex = getMinIndex(arrTop);
				$(this).animate({top:arrTop[minIndex],left:arrLeft[minIndex]},"fast");
				arrTop[minIndex] += $(this).height() + space;
			});
		});
		//求数组最小值的索引------------------
		function getMinIndex(arr){
			var value = arr[0];
			var index = 0;
			for(var i=1;i<arr.length;i++){
				if(value > arr[i]){
					value = arr[i];
					index = i;
				}
			}
			//拿到最小值索引
			return index;
		}
	});
	/*
		防止选中
		body{
			-moz-user-select: none; 火狐
		   -webkit-user-select: none;  webkit浏览器
		   -ms-user-select: none;   IE10
			-khtml-user-select: none; 早期浏览器
			user-select: none;
		}
		ie6-9通过js实现
		document.body.onselectstart = document.body.ondrag = function(){
			return false;
		}
	*/
