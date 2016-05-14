var staticpicroot = 'http://www.ifcar99.com/';

template.helper('month2day', function (data) {
	res = Math.round(parseFloat(data) * 30);
	return res;
});

template.helper('toThousandsint', function (data) {
	data = parseInt(data);
	
	var result = [ ], counter = 0;
	    data = (data || 0).toString().split('');
	    for (var i = data.length - 1; i >= 0; i--) {
	        counter++;
	        result.unshift(data[i]);
	        if (!(counter % 3) && i != 0) { result.unshift(','); }
	    }
	    return result.join('');
});

template.helper('getpic', function (data) {
	res =  staticpicroot + data;
	return res;
});

template.helper('echojson', function (data) {
	res = isJson(data) ? JSON.stringify(data) : data;
	return res;
});

template.helper('updateimgpath', function (data) {
	// <img\\b[^<>]*?\\bsrc\\s*=\\s*(?:([\"'])(?<src>[^\"']+)\\1|(?<src>[^\\s>]+))
	//<img\b[^>]*src\s*=\s*"[^>"]*\.(?:png|jpg|bmp|gif)"[^>]*>
	//  /<img.+?src=('|")?([^'"]+)('|")?(?:\s+|>)/gim
	//res = data;
	res = data.replace(/<img\b[^<>]*?\bsrc\s*=\s*([\"']([^"']+)[\"']|[^\s>]+)/g, function(all, t , w){
		w = w || t;
		if(/^(http\:\/\/|https\:\/\/)/.test(w)){
			return all;
		}else{
			return all.replace(t,'"' + staticpicroot + w + '"');
		}
		return all;
	});
	return res;
});

// 小数两位
template.helper('toFixed', function (data,num) {
	if(isNaN(data)) return data;
	num = num || 2;
	data = new Number(data);
	res =  data.toFixed(num);
	return res;
});


// * 对日期进行格式化， 
// * @param date 要格式化的日期 
// * @param format 进行格式化的模式字符串
template.helper('dateFormat', function (date, format) {
    date = new Date(date * 1000);
    var map = {
        "M": date.getMonth() + 1, //月份 
        "d": date.getDate(), //日 
        "h": date.getHours(), //小时 
        "m": date.getMinutes(), //分 
        "s": date.getSeconds(), //秒 
        "q": Math.floor((date.getMonth() + 3) / 3), //季度 
        "S": date.getMilliseconds() //毫秒 
    };
    format = format.replace(/([yMdhmsqS])+/g, function(all, t){
        var v = map[t];
        if(v !== undefined){
            if(all.length > 1){
                v = '0' + v;
                v = v.substr(v.length-2);
            }
            return v;
        }
        else if(t === 'y'){
            return (date.getFullYear() + '').substr(4 - all.length);
        }
        return all;
    });
    return format;
});