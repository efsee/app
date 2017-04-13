/*!
 * ======================================================
 * FeedBack Template For MUI (http://dev.dcloud.net.cn/mui)
 * =======================================================
 * @version:1.0.0
 * @author:cuihongbao@dcloud.io
 */
	var pic_str = "";
	var index = 1;
	var size = null;
	var imageIndexIdNum = 0; 
	var starIndex = 0;
	var input_rows = $('.input_row');
	var feedback = {
		question: document.getElementById('reason'), 
		contact: document.getElementById('contact'), 
		imageList: document.getElementById('image-list'),
		submitBtn: document.getElementById('submit-btn')
	};
	feedback.singlefiles = [];  
	feedback.imgurl = []; 
	var url = apiurl_new+'/file/upload/form/notoken/';
	feedback.files = [];
	feedback.uploader = null;   
	feedback.addFile = function(path) {
		feedback.singlefiles=[{name:"images",path:path,id:"img"}];
	};
	//图片上传压缩
	mui('.input-group').on('tap','.uploader-file',function(){
		var self = this;
		var img_id = $(self).attr('id')
		var index_img = $('.uploader-file').index(self)
		/*plus.gallery.pick(function(e) {
//				console.log("event:"+e);
			var name = e.substr(e.lastIndexOf('/') + 1);
			plus.zip.compressImage({
				src: e,
				dst: '_doc/' + name,
				overwrite: true,
				quality: 50
			}, function(zip) {
				size += zip.size  
			//	console.log("filesize:"+zip.size+",totalsize:"+size);
				if (size > (10*1024*1024)) {
					return mui.toast('文件超大,请重新选择~');
				}
			//	if (!self.parentNode.classList.contains('space')) { //已有图片
				//	feedback.files.splice(index-1,1,{name:"images"+index,path:e});
				//} else { //加号
				//	placeholder.classList.remove('space');
					feedback.addFile(zip.target); 
				//	feedback.newPlaceholder();
				//}
				$(self).val(name)
				var sign_num = 0
				for(var i=0;i<input_rows.length;i++){
					if(input_rows.eq(i).val()!='') sign_num++
				}
				var bank_name = $("#input_bank").val()
				//console.log(sign_num+bank_name ) 
				if(sign_num==7&&bank_name!="0"){ 
					$("#submit-btn").addClass('submit-btn')
				}else{
					$("#submit-btn").removeClass('submit-btn')
				}
				feedback.send(mui.extend({}, '', {
					images: feedback.singlefiles,
					type: 'image',
					img_id:img_id,
					index:index
				}))
			}, function(zipe) { 
				mui.toast('压缩失败！')
			});
		}, function(e) {
			//mui.toast(e.message);
		},{});*/
		var btnArray = [{title:"拍摄照片"},{title:"从相册选择"}];
		plus.nativeUI.actionSheet( {
			title:"选择照片",
			cancel:"取消",
			buttons:btnArray
		}, function(e){
			var index = e.index;
			switch (index){
				case 0:
					
					break;
				case 1:
					//拍摄
					var cmr = plus.camera.getCamera();
					cmr.captureImage(function(e) {
						var name = e.substr(e.lastIndexOf('/') + 1);
						console.log(name)	
			            e = "file://" + plus.io.convertLocalFileSystemURL(e);
			          //  console.log("event:"+e);
						zipImage(self,e,img_id,index_img,name)
						
					}, function(e) {
						
					});
					break;
				case 2:
					//相册 
					plus.gallery.pick(function(e) { 
						//console.log("event:"+e);
						var name = e.substr(e.lastIndexOf('/') + 1);
						zipImage(self,e,img_id,index_img,name)
					}, function(e) {
						//mui.toast(e.message);
				},{});
				break;
			}
		});
	
	})
	
	//压缩
	 function zipImage(self,e,img_id,index_img,name){
	 	plus.zip.compressImage({
			src: e,
			dst: '_doc/' + name,
			overwrite: true,
			quality: 50
		}, function(zip) {
			size += zip.size  
		//	console.log("filesize:"+zip.size+",totalsize:"+size);
			if (size > (10*1024*1024)) {
				return mui.toast('文件超大,请重新选择~');
			}
			console.log(name)
			feedback.addFile(zip.target); 
			$(self).val(name)
			var sign_num = 0
			for(var i=0;i<input_rows.length;i++){
				if(input_rows.eq(i).val()!='') sign_num++
			}
			var bank_name = $("#input_bank").val()
			//console.log(sign_num+bank_name ) 
			if(sign_num==7&&bank_name!="0"){ 
				$("#submit-btn").addClass('submit-btn')
			}else{
				$("#submit-btn").removeClass('submit-btn')
			}
			feedback.send(mui.extend({}, '', {
				images: feedback.singlefiles,
				type: 'image',
				img_id:img_id,
				index:index_img
			}))
		}, function(zipe) { 
			mui.toast('压缩失败！')
		});
	 }
	
	
	//提交
	feedback.submitBtn.addEventListener('tap', function(event) {
	//	console.log($(this).hasClass())
		if(!$(this).hasClass('submit-btn')){
			mui.toast('银行卡信息填写不全！')
			return false;
		} 
		var nowTime = new Date().getTime();
		var clickTime = this.getAttribute('ctime') //$(this).attr("ctime");
		if( clickTime != 'undefined' && (nowTime - clickTime < 3000)){
	        return false;
	    }else{
	    	this.setAttribute("ctime",nowTime);
	    }
		var request = {
			'token':user.utoken(),
			'account':$("#bank-account").val(),
			'bank':$('#input_bank').val(),
			'province':$("#province").val(),
			'city':$("#city").val(),
			'area':'',
			'reason':$("#reason").val(),
			'front_pic':feedback.imgurl[0],
			'behind_pic':feedback.imgurl[1],
			'hand_pic':feedback.imgurl[2],
			'newbank_pic':feedback.imgurl[3]
		}
		//console.log(JSON.stringify(request))
		userbank.modify(request,function(res){
			//console.log(JSON.stringify(request))
			//console.log(JSON.stringify(res))
			
			if(res.error_no==200){ 
				mui.openWindow({
					id:'replace_bank_success.html',
					url:'replace_bank_success.html',
					styles:{popGesture:'close'}	,
					show:{
				      autoShow:true,
				      aniShow:'pop-in',
				      duration:300
				    },
				    waiting:{
				      autoShow:false  
				    }
				})
			}else{
				mui.toast(res.error_msg)
			}
		})
	}, false) 
	$('.input_row,#input_bank').change(function(){
		var sign_num = 0
		for(var i=0;i<input_rows.length;i++){
			if(input_rows.eq(i).val()!='') sign_num++
		}
		var bank_name = $("#input_bank").val()
		//console.log(sign_num+bank_name ) 
		if(sign_num==7&&bank_name!="0"){ 
			$("#submit-btn").addClass('submit-btn')
		}else{
			$("#submit-btn").removeClass('submit-btn')
		}
	})
	//发送图片
	feedback.send = function(content) {
		feedback.uploader = plus.uploader.createUpload(url, {
			method: 'POST'
		}, function(upload, status) {
//			plus.nativeUI.closeWaiting()
			//console.log("upload:"+JSON.stringify(upload));  
			//console.log("upload cb:"+upload.responseText);
			if(status==200){
				//console.log('content:'+JSON.stringify(content));  
				var data = JSON.parse(upload.responseText);
				feedback.imgurl[content.index] = data.result.url
				//console.log(JSON.stringify(feedback.imgurl))
				//上传成功，重置表单 
				if (data.ret === 0 && data.desc === 'Success') {
				//	console.log("upload success");
				}
			}else{
			//	console.log("upload fail");
			}
			
		});
		//添加上传数据
		mui.each(content, function(index, element) {
			if (index !== 'images') { 
			//	console.log("addData:"+index+","+element);
//				console.log(index);
				feedback.uploader.addData(index, element)
			} 
		});
		//添加上传文件
		feedback.uploader.addFile(feedback.singlefiles[0].path,{
			key: 'file'
		}); 
		//开始上传任务
		feedback.uploader.start();
	};

