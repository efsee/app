var utoken, uid;
var host = 'http://test.ifcar99.com/';
var apiurl = 'http://test.ifcar99.com/api.php';
var api_upload_url = 'http://test.ifcar99.com/api.php?module=upload';
var chargeapi_url = 'http://test.ifcar99.com/api/authllcz/llcz_charge_api.php';
var queryapi_url = 'http://test.ifcar99.com/api/authllcz/llcz_query_api.php';
//var host = 'http://192.168.1.10/';

var appinfo = {};

mui.plusReady(function() {
	/*plus.runtime.getProperty(plus.runtime.appid, function(wgtinfo) {
		//appid属性
		appinfo.appid = wgtinfo.appid;
		//version属性
		appinfo.version = wgtinfo.version;
		//name属性
		appinfo.name = wgtinfo.name;
	});*/
if(document.getElementById("main-box")){
	mui('#main-box').on('tap', 'a[href]', function(){
		var href = this.getAttribute('href');
		if(/^(http\:\/\/|https\:\/\/)/.test(href)){
			plus.runtime.openURL(href);
			return false;
		}
	})
}
});


//保存数据
function cache(key, val) {
	if (key == 'clear') {
		localStorage.clear();
	} else if (val === null) {
		window.localStorage.removeItem(key);
	} else if (val) {
		window.localStorage[key] = val;

	} else {
		return window.localStorage[key];
	}
}

//本地存储
var store = {
	set: function(key, val, exp) {
		var obj = plus.storage;
		var nowtime = new Date().getTime() / 1000;

		exp = exp ? exp : 3600 * 24 * 0.5; //默认有效期*天
		val = JSON.stringify({
			val: val,
			exp: exp,
			time: nowtime
		});
		obj.setItem(key, val);
	},

	get: function(key) {
		var obj = plus.storage;
		var info = obj.getItem(key);//单类模型获取对象方法（java）
		var nowtime = new Date().getTime() / 1000;
		var network = plus.networkinfo.getCurrentType();
		if (!info) {
			return null;
		}
		info = JSON.parse(info);

		//没网络不判断过期时间
		if (network <= 1) {
			return info.val
		}
		if (nowtime - info.time > info.exp) {
			this.delete(key);
			return null;
		}

		return info.val;
	},
	delete: function(key) {
		var obj = plus.storage;
		obj.removeItem(key);
		//this.set(key, null, 0);
	},
	clear: function(key) {
		var obj = plus.storage;
		obj.clear();
	}
}

//获取url参数
function get(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]);
	return null;
}

function alert(msg) {
	plus.nativeUI.alert(msg);
}

//获取图片,优先从缓存获取
function getImg(src) {
	return src;
}

//开始网络请求
function startNetwork() {
	var n = plus.networkinfo.getCurrentType();
	watingSec = 30000;
	if (n <= 1) {
		//alert('请检查网络设置');
		plus.nativeUI.toast( "请检查网络设置", {"verticalAlign":"center"});
		return false;
	}
//	var w = plus.nativeUI.showWaiting('', {
//		padlock: true
//	});
//	w.background = '#ffffff';
//	setTimeout(function() {
//		plus.nativeUI.closeWaiting();
//	}, watingSec);
}


//网络请求结束
function endNetwork() {
	plus.nativeUI.closeWaiting();
}

//判断是否json格式
function isJson(obj) {
	var isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
	return isjson;
}


//封装ajax方法
function ajaxGet(url, data, obj) {
	$.get(url, data, obj);
}

var ajax = {
	'post': function(url, data, obj) {
		startNetwork();
		mui.ajax(url,{
			type: 'POST',
			//url: url,
			data: data,
			dataType: 'json',
			timeout: 30 * 1000,
			success: obj,
			complete: function(xhr) {
				endNetwork();
			},
			error: function(e, type) {
				endNetwork();
				if(type != 'abort' && type != 'parsererror' && type != 'timeout') {
					plus.nativeUI.toast("数据加载失败，请返回重试!("+ type + ")");
				}
				console.log('ajax 错误(' + type + '):' + url + data);
				if(type == 'parsererror'){
					console.log(e.responseText);
					//重试
				}
			}
		})
	},
	'get': function(url, data, obj) {

		mui.ajax(url,{
			type: 'get',
			//url: url,
			data: data,
			dataType: 'json',
			timeout: 30 * 1000,
			success: obj,
			complete: function() {},
			error: function(e, type) {
				plus.nativeUI.toast("数据加载失败，请返回重试!(" + type + ")");
				console.log('ajax 错误(' + type + '):' + url);
			}
		})
	}
}

var user = {
	'shoushi': function() {
		return store.get('shoushi');
	},
	'uid': function() {
		return store.get('uid');
	},
	'utoken': function() {
		return store.get('utoken');
	},
	'deleteCache': function(uid) {
		var uid = uid ? uid : this.uid();
		var key = 'user@info_' + uid;
		store.delete(key);
	},
	'yzpassword': function($data, callback) {
		var url = apiurl + '?module=user&action=yzpassword';
		if (!$data.username) {
			alert('请填写用户名');
			return;
		}
		if (!$data.password) {
			alert('请填写密码');
			return;
		}
		ajax.post(url, $data, callback);
	},
	
	//发送验证码
	'mobilecode': function($data, callback) {
		var url = apiurl + '?module=user&action=mobilecode';
		ajax.post(url, $data, callback);
	},
	//发送验证码
	'yycode': function($data, callback) {
		var url = apiurl + '?module=user&action=yycode';
		ajax.post(url, $data, callback);
	},
	//发送验证码
	'anjiemobilecode': function($data, callback) {
		var url = apiurl + '?module=user&action=anjiemobilecode';
		ajax.post(url, $data, callback);
	},
	'reg_invite': function($data, callback) {
		var url = apiurl + '?module=user&action=reg_invite';
		ajax.post(url, $data, callback);
	},
	'register': function($data, callback) {
		var url = apiurl + '?module=user&action=register';
		if (!$data.username) {
			alert('请填写用户名');
			return;
		}
		if (!$data.password) {
			alert('请填写密码');
			return;
		}
		ajax.post(url, $data, callback);
	},
	'login': function($data, callback) {
		var url = apiurl + '?module=user&action=login';
		if (!$data.username) {
			alert('请填写用户名');
			return;
		}
		if (!$data.password) {
			alert('请填写密码');
			return;
		}
		ajax.post(url, $data, callback);
	},
	'logout': function($data, callback) {
		var uid = this.uid();
		var url = apiurl + '?module=user&action=logout';
//		clientInfo = plus.push.getClientInfo();
		ajax.post(url, {
			uid: uid,
//			push_clientid:clientInfo.clientid,
			utoken: user.utoken()
		}, callback);
		user.deleteCache(uid); //清空缓存 
		store.delete('uid');
		store.delete('utoken');
	},	
	'getInfo': function(callback) {
		var uid = this.uid();
		var key = 'user@info_' + uid;
//		info = store.get(key);
//		if (info) {
//			callback(info);
//			return info;
//		}
		var url = apiurl + '?module=user&action=UserInfo';
		ajax.post(url, {request : {'user_id':uid}}, function(res) {
			if(res){
				info = res;
				info.host = host;
				store.set(key, info);
				callback(info);
				return info;
			}else{
				return null;
			}
		});
	},
	"UserInfo" : function($data, callback){
		var url = apiurl + '?module=user&action=UserInfo';
		ajax.post(url, $data, callback);
	},
	"GetUsers" : function($data, callback){
		var url = apiurl + '?module=user&action=GetUsers';
		ajax.post(url, $data, callback);
	},
	"GetHongbao" : function($data, callback){
		var url = apiurl + '?module=user&action=GetHongbao';
		ajax.post(url, $data, callback);
	},
	"GetFriendsInvite" : function($data, callback){
		var url = apiurl + '?module=user&action=GetFriendsInvite';
		ajax.post(url, $data, callback);
	},
	"GetFriendsList" : function($data, callback){
		var url = apiurl + '?module=user&action=GetFriendsList';
		ajax.post(url, $data, callback);
	},
	"delfriend" : function($data, callback){
		var url = apiurl + '?module=user&action=delfriend';
		ajax.post(url, $data, callback);
	},
	"realname" : function($data, callback){
		var url = apiurl + '?module=user&action=realname';
		ajax.post(url, $data, callback);
	},
	"userpwd" : function($data, callback){
		var url = apiurl + '?module=user&action=userpwd';
		ajax.post(url, $data, callback);
	},
	"paypwd" : function($data, callback){
		var url = apiurl + '?module=user&action=paypwd';
		ajax.post(url, $data, callback);
	},
	"setpwd" : function($data, callback){
		var url = apiurl + '?module=user&action=setpwd';
		ajax.post(url, $data, callback);
	},
	"setpaypwd" : function($data, callback){
		var url = apiurl + '?module=user&action=setpaypwd';
		ajax.post(url, $data, callback);
	},
//	"loginbbs" : function($data, callback){
//		var url = apiurl + '?module=user&action=loginbbs';
//		ajax.post(url, $data, callback);
//	}
	"GetPhoneInfo" : function($data, callback){
		var url = apiurl + '?module=user&action=GetPhoneInfo';
		ajax.post(url, $data, callback);
	},
	"CallPhone" : function($data, callback){
		var url = apiurl + '?module=user&action=CallPhone';
		ajax.post(url, $data, callback);
	},
	"GetLastPhone" : function($data, callback){
		var url = apiurl + '?module=user&action=GetLastPhone';
		ajax.post(url, $data, callback);
	},
	"AddCharge": function($data, callback) {
		var url = chargeapi_url;
		ajax.post(url, $data, callback);
	},
	"GetllczCount" : function($data, callback){
		var url = apiurl + '?module=user&action=GetllczCount';
		ajax.post(url, $data, callback);
	},
	"GetllczMonthCount" : function($data, callback){
		var url = apiurl + '?module=user&action=GetllczMonthCount';
		ajax.post(url, $data, callback);
	},
	"GetllczList" : function($data, callback){
		var url = apiurl + '?module=user&action=GetllczList';
		ajax.post(url, $data, callback);
	},
	"UpdateCzlist" : function($data, callback){
		var url = queryapi_url ;
		ajax.post(url, $data, callback);
	},
	"Deletellcz" : function($data, callback){
		var url = apiurl + '?module=user&action=Deletellcz';
		ajax.post(url, $data, callback);
	},
	"GetllczPrice" : function($data, callback){
		var url = apiurl + '?module=user&action=GetllczPrice';
		ajax.post(url, $data, callback);
	}
}

var account = {

	"GetOne" : function($data, callback){
		var url = apiurl + '?module=account&action=GetOne';
		ajax.post(url, $data, callback);
	},
	"GetLogList" : function($data, callback){
		var url = apiurl + '?module=account&action=GetLogList';
		ajax.post(url, $data, callback);
	},
	"GetUsersBankOne" : function($data, callback){
		var url = apiurl + '?module=account&action=GetUsersBankOne';
		ajax.post(url, $data, callback);
	},
	"cardbing" : function($data, callback){
		var url = apiurl + '?module=account&action=cardbing';
		ajax.post(url, $data, callback);
	},
	"cardbin" : function($data, callback){
		var url = apiurl + '?module=account&action=cardbin';
		ajax.post(url, $data, callback);
	},
	"cash_new" : function($data, callback){
		var url = apiurl + '?module=account&action=cash_new';
		ajax.post(url, $data, callback);
	},
	"recharge_new" : function($data, callback){
		var url = apiurl + '?module=account&action=recharge_new';
		ajax.post(url, $data, callback);
	},
	"getrealname" : function($data, callback){
		var url = apiurl + '?module=account&action=getrealname';
		ajax.post(url, $data, callback);
	},
	"Cost_llcz" : function($data, callback){
		var url = apiurl + '?module=account&action=Cost_llcz';
		ajax.post(url, $data, callback);
	},
	//充值记录api
	"GetRechargeList" : function($data, callback){
		var url = apiurl + '?module=account&action=GetRechargeList';
		ajax.post(url, $data, callback);
	},
	//提现记录
	"GetCashList" : function($data, callback){
		var url = apiurl + '?module=account&action=GetCashList';
		ajax.post(url, $data, callback);
	}
}

var borrow = {
	"GetTenderBorrowList" : function($data, callback){
		var url = apiurl + '?module=borrow&action=GetTenderBorrowList';
		ajax.post(url, $data, callback);
	},
	"GetTenderList" : function($data, callback){
		var url = apiurl + '?module=borrow&action=GetTenderList';
		ajax.post(url, $data, callback);
	},
	"GetBtenderDetail" : function($data, callback){
		var url = apiurl + '?module=borrow&action=GetBtenderDetail';
		ajax.post(url, $data, callback);
	},
	"GetRecoverList" : function($data, callback){
		var url = apiurl + '?module=borrow&action=GetRecoverList';
		ajax.post(url, $data, callback);
	},
	"sy" : function($data, callback){
		var url = apiurl + '?module=borrow&action=sy';
		ajax.post(url, $data, callback);
	},
	"tender" : function($data, callback){
		var url = apiurl + '?module=borrow&action=tender';
		ajax.post(url, $data, callback);
	},
	"auto_add" : function($data, callback){
		var url = apiurl + '?module=borrow&action=auto_add';
		ajax.post(url, $data, callback);
	},
	"GetAutoList" : function($data, callback){
		var url = apiurl + '?module=borrow&action=GetAutoList';
		ajax.post(url, $data, callback);
	},
	"auto_del" : function($data, callback){
		var url = apiurl + '?module=borrow&action=auto_del';
		ajax.post(url, $data, callback);
	},
	"recordcounts" : function($data, callback){
		var url = apiurl + '?module=borrow&action=recordcounts';
		ajax.post(url, $data, callback);
	},
	"lantou" : function($data, callback){
		var url = apiurl + '?module=borrow&action=lantou';
		ajax.post(url, $data, callback);
	},
	"AddAnJie" : function($data, callback){
		var url = apiurl + '?module=borrow&action=AddAnJie';
		ajax.post(url, $data, callback);
	},
	"GetTenderLists" : function($data, callback){
		var url = apiurl + '?module=borrow&action=GetTenderLists';
		ajax.post(url, $data, callback);
	},
	

}

var product = {
	"list" : function($data, callback){
		var url = apiurl + '?module=borrow&action=GetList';
		ajax.post(url, $data, callback);
	},
	"all" : function($data, callback){
		var url = apiurl + '?module=borrow&action=GetList';
		ajax.post(url, $data, callback);
	},
	"detail" : function($data, callback){
		var url = apiurl + '?module=borrow&action=GetDetail';
		ajax.post(url, $data, callback);
	},	
	'getrecommendborrow': function(callback, time) {
		var key = 'product@borrow_top';
		info = store.get(key);
		if (info) {
			callback(info);
			if(time && plus.networkinfo.getCurrentType() > 1){
				setTimeout(function(){
					var request = {'borrow_type':'','epage':1,'recommend':'1','xszx':'1'};
					product.getborrowlist({"request":request},function(info){
							callback(info);
							store.set(key, info, 3600 * 1);
					});
				},time);
			}
			return info;
		}
		var request = {'borrow_type':'','epage':1,'recommend':'1','xszx':'1'};
		this.getborrowlist({"request":request},function(info){
				callback(info);
				store.set(key, info, 3600 * 1);
		});
	},
	'getborrowlist': function($data, callback) {
		var url = apiurl + '?module=borrow&action=GetList';
		ajax.post(url, $data, callback);
	},
	'gettotal': function($data, callback) {
		var url = apiurl + '?module=borrow&action=GetTotal';
		ajax.post(url, $data, callback);
	},
	'getversion': function($data, callback) {
		var url = apiurl + '?module=borrow&action=GetVersion';
		ajax.post(url, $data, callback);
	}
}

var articles = {
	"GetList" : function($data, callback){
		var url = apiurl + '?module=articles&action=GetList';
		ajax.post(url, $data, callback);
	},
	"all" : function($data, callback){
		var url = apiurl + '?module=articles&action=GetList';
		ajax.post(url, $data, callback);
	},
	"detail" : function($data, callback){
		var url = apiurl + '?module=articles&action=GetDetail';
		ajax.post(url, $data, callback);
	},
	"GetPage" : function($data, callback){
		var url = apiurl + '?module=articles&action=GetPage';
		ajax.post(url, $data, callback);
	},
	"getnewnotice" : function($data, callback){
		var url = apiurl + '?module=articles&action=getnewnotice';
		ajax.post(url, $data, callback);
	},
	"GetscrollpicList" : function($data, callback){
		var url = apiurl + '?module=articles&action=GetscrollpicList';
		ajax.post(url, $data, callback);
	},
	"GetAdBox" : function($data, callback){
		var url = apiurl + '?module=articles&action=GetAdBox';
		ajax.post(url, $data, callback);
	}	
}

var credit = {
	"GetSign" : function($data, callback){
		var url = apiurl + '?module=credit&action=Sign';
		ajax.post(url, $data, callback);
	},
	"GetList" : function($data, callback){
		var url = apiurl + '?module=credit&action=GetList';
		ajax.post(url, $data, callback);
	}
}


var system = {
	'get': function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]);
		return null;
	},
	'open': function(url, id, extras) {
		mui.openWindow({
			id: id,
			url: url,
			show: {
				autoShow: false,
				duration: 1
			},
			waiting: {
				autoShow: false
			},
			extras: extras
		});
	},
	'allCHN': function(str) {
		var reg = /^[\u0391-\uFFE5]{1,8}$/;
		if (!reg.test(str)) {
			return false;
		} else {
			return true;

		}
	},
	'sendDeviceInfo': function(obj) {
		var url = apiurl + 'updateDeviceInfo';
		var types = {};
		types[plus.networkinfo.CONNECTION_UNKNOW] = "未知";
		types[plus.networkinfo.CONNECTION_NONE] = "未连接网络";
		types[plus.networkinfo.CONNECTION_ETHERNET] = "有线网络";
		types[plus.networkinfo.CONNECTION_WIFI] = "WiFi网络";
		types[plus.networkinfo.CONNECTION_CELL2G] = "2G蜂窝网络";
		types[plus.networkinfo.CONNECTION_CELL3G] = "3G蜂窝网络";
		types[plus.networkinfo.CONNECTION_CELL4G] = "4G蜂窝网络";
		clientInfo = plus.push.getClientInfo();
		var network = types[plus.networkinfo.getCurrentType()];
		var uid = user.uid();
		var key = 'user@info_' + uid;
		var u = store.get(key);
		var mobile = u ? u.username : '';
		//console.log(clientInfo.clientid)
		setTimeout(function() {
			ajax.post(url, {
				uid: uid,
				utoken: user.utoken(),
				mobile: mobile,
				appid: appinfo.appid,
				app_name: appinfo.name,
				app_version: appinfo.version,
				device_model: plus.device.model, //设备型号
				device_vendor: plus.device.vendor, //厂商
				device_imei: plus.device.imei,
				device_uuid: plus.device.uuid,
				device_screen: plus.screen.resolutionWidth * plus.screen.scale + "x" + plus.screen.resolutionHeight * plus.screen.scale, //分辨率
				os_name: plus.os.name,
				os_version: plus.os.version,
				os_language: plus.os.language,
				os_vendor: plus.os.vendor,
				network: network,
				push_clientid: clientInfo.clientid
			}, obj);
		}, 400);
	},
	'isJson': function(obj) {
		var isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
		return isjson;
	}
}
