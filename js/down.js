;(function(w,d){
	d.body.addEventListener('touchstart',function(){},false);
	function g(s){return d.querySelector(s)};
	var css = ".mobile-dialog{width:100%;height:100%;position:fixed;z-index:9999;left:0;top:0;background:rgba(0,0,0,.6);color:#222;font-size:14px}.mobile-dialog *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}.mobile-dialog-wrap{max-width:400px; width:84%;position:absolute;left:50%;top:47%;transform:translate3d(-50%,-50%,0);-webkit-transform:translate3d(-50%,-50%,0);transform-origin:left;-webkit-transform-origin:left;background:#fff;height:auto;border-radius:10px;overflow:hidden;box-shadow:0 0 8px #333;animation:scaleAlt .3s ease-out;-webkit-animation:scaleAlt .3s ease-out}.mobile-dialog-title{padding:15px 10px;border-bottom:1px solid #dcdcdc;background:#f7f7f7;position:relative;text-align:center;font-size:20px;}.mobile-close{display:block;position:absolute;right:0;top:0;height:100%;width:40px}.mobile-dialog-btn{border-top:1px solid #dcdcdc;overflow:hidden;background:#f7f7f7;padding:10px 20px}.mobile-dialog-btn button{background-color:#f7f7f7;color:#7b7b7b;border:1px soild #dcdcdc;display:block;float:left;padding:10px 0;margin:0;width:100%;border-radius:5px;line-height:30px;font-size:18px;cursor:pointer;color:#7c7c7c;}.mobile-dialog-btn button:last-child{background-color:#f13f3f;color:#fff;border:none;margin-left:5%;line-height:31px}.mobile-close:after{content:'';display:block;width:48%;height:1px;background:#222;transform:rotate(45deg);-webkit-transform:rotate(45deg);position:absolute;left:26%;top:50%}.mobile-close:before{content:'';display:block;width:48%;height:1px;background:#222;transform:rotate(-45deg);-webkit-transform:rotate(-45deg);position:absolute;left:26%;top:50%}.mobile-close:active,.mobile-dialog-btn button:active{background:#e8e8e8}.mobile-dialog-con{word-break:break-all;word-wrap:break-word;padding:18px 20px;line-height:20px;}.mobile-dialog-btn button{width:50%}@keyframes scaleAlt{from{transform:scale(.88) translate3d(-50%,-50%,0);opacity:0}to{transform:scale(1) translate3d(-50%,-50%,0);opacity:1}}@-webkit-keyframes scaleAlt{from{-webkit-transform:scale(.88) translate3d(-50%,-50%,0);opacity:0}to{-webkit-transform:scale(1) translate3d(-50%,-50%,0);opacity:1}}",
		style = d.createElement('style'),f;
		style.type = 'text/css';
		style.appendChild(d.createTextNode(css));
		g('head').appendChild(style);
	function _(a,b){
		this.clickClose =b && b.clickClose===false ? false : true;
		this.init(a,b);
		this.bind();
	};
	_.prototype = {
		init : function(a,b){
			var t = this;close();
			b && b.before && b.before();
			b && b.after ? (f = b.after) : '';
			d.body.insertAdjacentHTML("beforeend", '<div class="mobile-dialog" ontouchmove="return false"><div class="mobile-dialog-wrap"><div class="mobile-dialog-con" style="'+ ((b && b.style) ? b.style : '') +'"></div></div></div>');
			var con = g('.mobile-dialog-con');
			if(b && b.title){
				con.insertAdjacentHTML("beforebegin", '<div class="mobile-dialog-title">'+ b.title +'</div>');
//				g('.mobile-close').addEventListener('click',function(){
//					close();
//				},false);
			};
			if(b && b.className){g('.mobile-dialog-wrap').classList.add(b.className);};
			if(b && b.button){
				con.insertAdjacentHTML("afterend", '<div class="mobile-dialog-btn"></div>');
				var _btn = g('.mobile-dialog-btn');
				b.button.forEach(function(i,n){
					_btn.insertAdjacentHTML("beforeend", '<button style="width :'+ 95/b.button.length+'%">'+i.name+'</button>');
					_btn.querySelectorAll('button')[n].onclick =function(){
						close();
						i.callBack && i.callBack.call(t);
					}; 
				});
			};
			(b && b.innerText) ? ( con.textContent =a  ) : (con.innerHTML = a);
		},
		bind : function(){
 			g('.mobile-dialog-wrap').onclick = function(e){e.stopPropagation();return false;};
			this.clickClose && g('.mobile-dialog').addEventListener('click',function(e){close();},false);
		}
	};
	function close(){try{d.body.removeChild(g('.mobile-dialog'));f && f();f=null}catch(e){};}
	window.alerts = function(a,b){ new _(a,b);};
	window.alerts.close = close;
})(window,document);