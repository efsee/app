var url = "";
var isOpenLogin;
var templates = {};
var getTemplate = function(name, header, content) {
	var template = templates[name];
	if (!template) {
		//预加载共用父模板；
		var headerWebview = mui.preload({
			url: header,
			id: name + "-main",
			styles: {
				popGesture: "hide"
			},
			extras: {
				mType: 'main'
			}
		});
		//预加载共用子webview
		var subWebview = mui.preload({
			url: !content ? "" : content,
			id: name + "-sub",
			styles: {
				top: '45px',
				bottom: '0px',
				scrollIndicator:"none"
			},
			extras: {
				mType: 'sub'
			}
		});
		subWebview.addEventListener('loaded', function() {
			setTimeout(function() {
				subWebview.show();
			}, 50);
		});
		subWebview.hide();
		headerWebview.append(subWebview);
		//iOS平台支持侧滑关闭，父窗体侧滑隐藏后，同时需要隐藏子窗体；
		if (mui.os.ios) { //5+父窗体隐藏，子窗体还可以看到？不符合逻辑吧？
			headerWebview.addEventListener('hide', function() {
				subWebview.hide("none");
			});
		}
//		headerWebview.show('none',10,function(){
//			headerWebview.hide();
//			headerWebview.setStyle({opacity:1});
//		})
		templates[name] = template = {
			name: name,
			header: headerWebview,
			content: subWebview,
		};
	}
	return template;
};

function opentemplate(templatename,data){
	var template = getTemplate(templatename);
		//获得共用父模板
	var headerWebview = template.header;
		//获得共用子webview
	var contentWebview = template.content;
	contentWebview.loadURL(data.href);
	var right_btn = data.right_btn || "";
	mui.fire(headerWebview, 'updateHeader', {
		title: data.title,
		showMenu: false,
		right_btn:data.right_btn
	});
	mui.fire(headerWebview, 'loading');
	headerWebview.show('slide-in-right', 150);
}

function login() {
	plus.nativeUI.closeWaiting();
	//防止重复点击
	if (isOpenLogin == 1) {
		return;
	}
	loginWebView = mui.openWindow({
		url: '/login.html',
		id: 'loginWebView',
		show: {
			autoShow: true,
			duration: 300,
			aniShow: 'slide-in-bottom'
		},
		waiting: {
			autoShow: false
		}
	});
	isOpenLogin = 1;
	setTimeout(function() {
		isOpenLogin = 0;
	}, 1000);
}