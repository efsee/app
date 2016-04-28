// JavaScript Document
$(function(){
$("#back").bind({
	tap:function(){
		history.back();
		}
	});
	
$("#share").bind({
		tap:function(){
			openlayer("layer-bg","blayer");
			}
		});
		
$(".layer .close-btn").bind({
	tap:function(){
		$(this).parents(".layer").removeClass("active");
		$("#layer-bg").removeClass("active");
		return false;
		}
	});

$(".blayer .cancel").bind({
	tap:function(){
		$(this).parents(".blayer").removeClass("active");
		$("#layer-bg").removeClass("active");
		return false;
		}
	});

$(".on-off .bun").bind({
	tap:function(){
		$(this).parent(".on-off").toggleClass("active");
	}
});


	
});
//调用弹出层
function openlayer(idn1,idn2){
	$("#"+idn1).addClass("active");
	$("#"+idn2).addClass("active");
	}
function closelayer(idn1,idn2){
	$("#"+idn1).removeClass("active");
	$("#"+idn2).removeClass("active");
	}
function NavScroll(idn,row){
	var Scroll_w,jqul,jqli,jqa,jqScroll,row_n,row_w;
	var that=$(idn);
	Scroll_w=$(that).width();
	jqScroll=$(that).find(".scroll-box");
	jqul=$(that).find("ul");
	jqli=$(jqul).find("li");
	jqli.eq(0).addClass("active");
	row_n=jqli.length;
	row_w=Scroll_w/row;
	$(jqli).css({"width":row_w+"px"});
	$(jqScroll).css({"width":row_n*row_w+"px"});
	$(jqul).css({"width":row_n*row_w+"px"});
	}