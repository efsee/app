var api_upload_url = 'https://www.ifcar99.com/api.php?module=upload';
function getimg(options) {
	var btnArray = [{
		title: "拍照"
	}, {
		title: "从相册选择"
	}];
	plus.nativeUI.actionSheet({
		title: "选择照片",
		cancel: "取消",
		buttons: btnArray
	}, function(e) {
		var index = e.index;
		switch (index) {
			case 0:
				break;
			case 1:
				var cmr = plus.camera.getCamera();
				cmr.captureImage(function(path) {
//	             path = "file://" + plus.io.convertLocalFileSystemURL(path);
					appendFile(path,options);
				}, function(err) {});
				break;
			case 2:
				plus.gallery.pick(function(path) {
					appendFile(path,options);
				}, function(err) {}, null);
				break;
		}
	});
}
					
// 拍照添加文件
function appendByCamera(){
	plus.camera.getCamera().captureImage(function(p){
		appendFile(p);
	});	
}

function appendFile(p,options){
	plus.zip.compressImage({
			src:p,
			dst:p,
			//width:"800px",
			quality:60,
			overwrite:true
		},
		function(event) {
			uploadFile(p,options);
		},function(error) {
			uploadFile(p,options);
	});
}
// 上传文件
function uploadFile(p,options){
var server = api_upload_url;
	var task=plus.uploader.createUpload(server,
		{method:"POST"},
		function(t,status){ //上传完成
			if(status==200){
				if(options.callback){
					options.callback(t.responseText);
				}
//				plus.storage.setItem("uploader",t.responseText);
//					console.log(t.responseText);
					mui.toast("上传成功");
//					var r = JSON.parse(t.responseText);
//					if(r.status == 1){
//						mui.toast(r.info);
//					}else{
//						mui.toast(r.info);
//					}
			}else{
				mui.toast("上传失败");
			}
		}
	);
	task.addFile(p,{"key":"file"});
	if(options.data){
		for(var jk in options.data){
			task.addData(jk,options.data[jk]);
		}		
	}
	task.start();
}