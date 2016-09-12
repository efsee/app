
 // 基于准备好的dom，初始化echarts实例
	/*var dateArray=[]
	var nowDate=new Date()
	var nYear=nowDate.getFullYear();
	var nMonth=nowDate.getMonth()+1;
	dateArray.unshift(nMonth+"月")
	for(var i=1;i<6;i++){
		console.log(dateArray)
		if((nMonth-i)>0){
			dateArray.unshift((nMonth-i)+"月")
		}else{
			dateArray.unshift(13-i+"月")
		}
	}*/
	var myChart_one = echarts.init(document.getElementById('chart_one'));
	var myChart_two = echarts.init(document.getElementById('chart_two'));
	// 指定图表的配置项和数据
	var option = {
		color: ['#3A75D6'],
		title: {
			text: '近一年月投资走势图（万元）',
			x:"center",
			top:10,
			textStyle:{
				fontSize:'14',
				fontWeight:'200'
				
			}
		},
		grid:{
			top:70,
			left:50
		},
		xAxis: {
			data: monthArray,
			axisLine:{
				lineStyle:{
					color:'#EFEFEF'
				}
				
			},
			axisLabel:{
				textStyle:{
					color:'#333'
				}
			},
			axisTick:{
				show:false,
			},
		},
		yAxis: {
			axisLine:{
				lineStyle:{
					width:0
				}
				
			},
			axisTick:{
				show:false,
			},
			lineStyle:{
					color:'#fff'
				}
		},
		series: [{
			name: '交易金额',
			type: 'bar',
			barWidth: '40%',
			label: {
                normal: {
                    show: true,
                    position:'top',
					textStyle:{
						color:'#333',
						fontSize:8
					}
                },
            },
			data: dateArray
		}]
	};
	var option2 = {
		color: ['#FF6600','#3A75D6','#1EC2D7','#F95452'],
		tooltip : {
			trigger: 'item',
			formatter: "{a} <br/>{b} : {c} ({d}%)"
		},
		legend: {
			//orient: 'vertical',
			itemWidth:16,
			itemHeight:16,
			bottom: '40',
			left: 'center',
			itemGap:20,
			data: [{name:'浙江',icon: 'circle'},
			{name:'上海',icon: 'circle'},"",
			{name:'安徽',icon: 'circle'},
			{name:'江西',icon: 'circle'}]
		},
		series : [
			{	
				name: '投资分布',
				type: 'pie',
				radius : '55%',
				center: ['50%', '35%'],
				label: {
					normal: {
						show: true,
						formatter: '{d}%' ,
						position:'top',
						textStyle:{
							fontSize:'12',
							fontWeight:'bold'
						},
					},
				},
				labelLine: {
					normal: {
						show: true,
						length: 0,
						lineStyle:{
							width:2
						}
					}
				},
				data:[
					{value:600, name:'浙江'},
					{value:210, name:'上海'},
					{value:134, name:'安徽'},
					{value:118, name:'江西'},
				],
				itemStyle: {
					normal: {
						borderWidth:2,
						borderColor:'#fff'
					},
					emphasis: {
						borderWidth:0,
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)'
					}
					
				}
			}
		]
	};
	var option3 = {
		color:['#fff','#1EC2D7'],
		series: [
			{
				name:'访问来源',
				type:'pie',
				radius: ['60%', '75%'],
				avoidLabelOverlap: false,
				label: {
					normal: {
						show: true,
						position: 'center',
						textStyle: {
							fontSize: '30',
							fontWeight: 'bold'
						}
					},
					emphasis: {
						show: true,
						textStyle: {
							fontSize: '30',
							fontWeight: 'bold'
						}
					}
				},
				labelLine: {
					normal: {
						show: false
					}
				},
				data:[
					{value:3},
					{value:97, name:'坏账率0.00%'}
				]
			}
		]
	};

	// 使用刚指定的配置项和数据显示图表。
	myChart_one.setOption(option);
	myChart_two.setOption(option2);