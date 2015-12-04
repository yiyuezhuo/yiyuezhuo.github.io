var map_el=$('#map');

short_edge_length=50;
hex_k=Math.cos(Math.PI/6)*2;
long_edge_length=short_edge_length*hex_k;
attach_edge=short_edge_length*1.5;
default_hex_type='tip';
counter_x=48;
counter_y=48;

function int(n){
	var m=Number(n);
	if (m%1===0){
		return m;
	}
	else{
		return Number(n)-Number(n)%1;
	}
}
function min(l,key){
	var ll;
	if (key!=undefined){
		ll=l.map(key);
	}
	else{
		ll=l;
	}
	//console.log('ll',ll);
	var minv=ll[0];
	var index=0;
	for (var i=0;i<l.length;i++){
		var value=ll[i];
		if (value<minv){
			//console.log('value',value);
			minv=value;
			index=i;
		}
	}
	//console.log('index',index);
	return l[index];
}

random=(function(){
	module={};
	module.random=Math.random;
	module.choose=function(list){
		var index=int(Math.random()*list.length);
		return list[index];
	};
	return module;
})();

function distance(x1,y1,x2,y2){
	return Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2));
}

function draw_hex(left,top,type){
	//这玩意几年前就写过了，现在居然又要写，实在伤不起。
	//因为用SVG太蛋疼，使用双层div，一层div专用CSS渲染六角格形状。不接收事件
	//另一层div接受click事件并且对坐标系进行映射。抽象el元素应当同时管理这两个部分。
	var three;
	if (type==='tip'){
		three=[0,60,120];
	}
	else if (type==='lie'){
		three=[90,150,210];
	}
	var els=[]
	three.forEach(function(degree){
		var base=$('<div></div>');
		//var degree=0;
		base.css({'background-color':'rgb(150,200,150)',width:long_edge_length,height:short_edge_length,
				position:'absolute',transform:"rotate("+degree+"deg)",left:left+'px',top:top+'px'});
		base.appendTo(map_el);	
		els.push(base);
	})
	return els;
}
function attach_hex(left,top){
	var base=$('<div></div>');
	var diff_left=short_edge_length*Math.cos(Math.PI/6)-attach_edge/2;
	var diff_top=(attach_edge-short_edge_length)/2;
	base.css({width:attach_edge,height:attach_edge,position:'absolute',left:left+diff_left+'px',top:top-diff_top+'px'});
	base.appendTo(map_el);	
	return base;
}

function create_hexs(m,n){
	//用Hex创建m,n个hex并返回Hex矩阵。Hex进一步处理和修改应当在之后进行，这里只是初始化Hex网络
	var i,j;
	var mat=[];
	var diff_i,diff_j,diff_k;
	for (i=0;i<m;i++){
		var line=[];
		for(j=0;j<n;j++){
			//console.log(i,j)
			//diff_i=short_edge_length*Math.sin(Math.PI/6)*2+short_edge_length;
			diff_i=short_edge_length*Math.sin(Math.PI/6)+short_edge_length;
			diff_j=short_edge_length*Math.cos(Math.PI/6)*2;
			if ((i%2)===1){
				diff_k=short_edge_length*Math.cos(Math.PI/6);
			}
			else{
				diff_k=0;
			}
			line.push(new Hex(i,j,j*diff_j+diff_k,i*diff_i));
		}
		mat.push(line);
	}
	return mat;
}
function create_bound(left,top){
	//放线的点，该点最后不会在线上
	var L=short_edge_length;
	var sin=Math.sin(Math.PI/6);
	var cos=Math.cos(Math.PI/6);
	var p1=[left-short_edge_length/2,top+short_edge_length/2];
	var p2=[left+L*cos/2-L/2,top+L+L*sin/2];
	var p3=[left+L*cos*1.5-L/2,top+L+L*sin/2];
	var p4=[left+L*cos*2-L/2,top+L/2];
	var p5=[left+L*cos*1.5-L/2,top-L*sin/2];
	var p6=[left+L*cos/2-L/2,top-L*sin/2];
	var degrees=[90,30,150,90,30,150];
	var pl=[p1,p2,p3,p4,p5,p6];
	var ll=[];
	for(var i=0;i<6;i++){
		var degree=degrees[i];
		var line=$("<div class='line' style='left: "+(pl[i][0])+"px; top: "+(pl[i][1])+"px;'></div>");
		line.css({width:L,height:3,position:"absolute",transform:"rotate("+degree+"deg)"})//,"background-color":"rgb(0,0,0)"});
		line.addClass('unhighlight');
		line.appendTo(map_el);
		ll.push(line);
	}
	return ll;
}
function random_color(){
	var band=[];
	for(var i=0;i<3;i++){
		//band.push(int(random.random()*255));
		band.push(155+int(random.random()*100));
	}
	return band;
}
function draw_counter(){
	var box=$('<div></div>');
	box.css({width:counter_x,height:counter_y,position:"absolute","background-color":"rgb(150,150,150)",'z-index':1,'user-select':'none',border:'2px solid #000'});
	var size=$('<div></div>');
	size.css({left:17,top:0,position:"absolute",'font-size':'10%','color':"rgb(255,255,255)"});
	size.html('XX');
	size.appendTo(box);
	var pad=$('<div></div>');
	//pad.css({width:25,height:17,position:"absolute","background-color":"rgb(200,200,200)",left:9,top:14,border:'2px solid #000','border-color':"rgb(0,0,0)"});
	pad.css({width:25,height:17,position:"absolute","background-color":"rgb(200,200,200)",left:9,top:14,border:'2px solid rgb(100,50,10)'});
	pad.appendTo(box);
	var l0=$('<div></div>');
	l0.css({left:6,top:34,position:"absolute",'font-size':'10%','color':"rgb(255,255,255)"});
	//l0.html('10');
	var l1=$('<div></div>');
	l1.css({left:18,top:34,position:"absolute",'font-size':'10%','color':"rgb(255,255,255)"});
	//l1.html('21');
	var l2=$('<div></div>');
	l2.css({left:36,top:34,position:"absolute",'font-size':'10%','color':"rgb(255,255,255)"});
	//l2.html('31');
	l0.appendTo(box);l1.appendTo(box);l2.appendTo(box);
	return {box:box,size:size,pad:pad,l0:l0,l1:l1,l2:l2};
}
function draw_line(x1,y1,x2,y2){
		//console.log(x1,y1,x2,y2);
		var dx=x2-x1;
		var dy=y2-y1;
		var dd=Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));
		var cos_n=dx/dd;
		var sin_n=dy/dd;
		var pi=Math.PI;
		if (dy>0){
			var cos_c=Math.acos(cos_n);
			var sin_c=Math.asin(sin_n);
		}
		else{
			var cos_c=pi+pi-Math.acos(cos_n);
			var sin_c=pi+pi-Math.asin(sin_n)+pi;
		}
		var cos_d=cos_c/(2*pi)*360;
		var sin_d=sin_c/(2*pi)*360;
		var degree=cos_d;
		var x3=(x1+x2)/2-dd/2;
		var y3=(y1+y2)/2;
		var line=$("<div class='line' style='left: "+(x3)+"px; top: "+(y3)+"px;'></div>");
		line.css({width:dd,height:2,position:"absolute",transform:"rotate("+degree+"deg)","background-color":"rgb(0,0,0)"});
		return line;
}
function Unit_click_box(){
	this.state='start';
	this.choose_unit=undefined;
	this.unit_click=function(el){
		//这个函数是点击事件的入口,el应该是jQuery元素
		//console.log('el_id',el.id);
		var unit=unit_d[el.className];
		console.log(unit.combat,unit.movement);
		switch(this.state){
			case 'start':
				this.choose_unit=unit;
				this.state='choosed';//目前实现的应该是此货处于此状态时点击另一个Hex就移动过去。
				console.log('start->choosed');
				break;
			case 'choosed':
				this.state='start';
				console.log('choosed->start');
				break;
		}
	}
	
}
function Hex_click_box(){
	this.state='start';
	this.hex_click=function(el){
		//var hex=hex_d[]
		var hex=hex_d[el.className];
		console.log('hex:',hex.x,hex.y);
		switch(this.state){
			case 'start':
				switch(unit_click_box.state){
					case 'start':
						console.log('can not do anything');
						break;
					case 'choosed':
						//unit_click_box.choose_unit.move_to(hex.x,hex.y);
						unit_click_box.choose_unit.move_to_path(hex.x,hex.y);
				}
				break;
		}
	}
}
function Hex(x,y,left,top){
	this.x=x;
	this.y=y;
	this.m=x;
	this.n=y;//可能还是下面那个写法比较明显
	this.left=left;
	this.top=top;
	this.els=draw_hex(left,top,default_hex_type);
	this.el=attach_hex(left,top);//这个就是应该保持传一样的值，具体的细节在里面调节
	this.bound=create_bound(left,top);
	that=this;
	this.el.click(function(){
		//console.log('This is',x,y);
		hex_click_box.hex_click(this);
	});
	this.set_color=function(band){
		//band是rgb三元数组，字符串化内部进行
		this.els.forEach(function(part){
			part.css({'background-color':'rgb('+band[0]+','+band[1]+','+band[2]+')'})
		})
	}
	this.highlight=function(){
		this.bound.forEach(function(bound){
			bound.removeClass('unhighlight');
			bound.addClass('highlight');
		})
	}
	//hex_l.push(this);
	//hex_d[[x,y]]=this;
	this.el.attr({class:String([x,y])});
	var tran;
	if (this.m%2===0){
		tran=[[-1,-1],[-1,0],[0,1],[1,0],[1,-1],[0,-1]];
	}
	else{
		tran=[[-1, 0],[-1,1],[0,1],[1,1],[1, 0],[0,-1]];
	}
	//console.log(tran);
	//console.log(tran.map(function(mn){return [ mn[0]+this.m,mn[1]+this.n]}));
	//console.log(tran[0][0]+this.m,tran[0][1]+this.n);
	var that=this;
	/*
	this.nei=tran.map(function(mn){
		//console.log('mn',mn,'this.m',this.m,'this.n',this.n,'result',[ mn[0]+this.m,mn[1]+this.n]);
		return [ mn[0]+that.m,mn[1]+that.n];
	});
	*/
	nei_a=tran.map(function(mn){
		//console.log('mn',mn,'this.m',this.m,'this.n',this.n,'result',[ mn[0]+this.m,mn[1]+this.n]);
		return [ mn[0]+that.m,mn[1]+that.n];
	});
	this.nei=nei_a.filter(function(nei){
		return 0<=nei[0] && nei[0]<scenario_dic['size'][0] && 0<=nei[1] && nei[1]<scenario_dic['size'][1];
	});
	
}
function set_color(el,rgb,key){
	if (key===undefined){
		key='color';
	}
	var r=rgb[0];var g=rgb[1];var b=rgb[2];
	var dic={};
	dic[key]='rgb('+r+','+g+','+b+')';
	el.css(dic);
}
function Unit(id){
	//console.log('Unit',id);
	var that=this;
	this.id=id;
	this.els=draw_counter();
	this.el=this.els.box;
	this.combat=0;
	this.movement=0;
	this.mp=0;
	this.deco=function(){
		this.els.l0.html(this.combat);
		this.els.l2.html(this.movement);
	}
	this.ready=function(){
		this.mp=this.movement;
	}
	this.set_hex=function(m,n){
		var left=mat[m][n].left+short_edge_length*Math.cos(Math.PI/6)-counter_x/2;
		var top=mat[m][n].top+short_edge_length/2-counter_y/2;
		this.el.css({left:left,top:top});
		this.m=m;
		this.n=n;
	}
	this.move_to=function(m,n,duration,pattern){
		var left=mat[m][n].left+short_edge_length*Math.cos(Math.PI/6)-counter_x/2;
		var top=mat[m][n].top+short_edge_length/2-counter_y/2;
		this.el.animate({left:left,top:top},duration,pattern);
		this.m=m;
		this.n=n;
	}
	this.el.click(function(){
		unit_click_box.unit_click(this);
	});
	this.el.attr({class:id});
	//unit_l.push(this);
	//unit_d[id]=this;
	map_el.append(this.el);
	this.set_font_color=function(rgb){
		//var r=rgb[0];var g=rgb[1];var b=rgb[2];
		//this.els.size.css({'color':'rgb('+r+','+g+','+b+')'})
		set_color(this.els.size,rgb);
		set_color(this.els.l0,rgb);
		set_color(this.els.l1,rgb);
		set_color(this.els.l2,rgb);
	};
	this.set_box_color=function(rgb){
		set_color(this.els.box,rgb,'background-color');
	};
	this.set_box_border_color=function(rgb){
		//border:'2px solid #000','border-color':"rgb(0,0,0)"
		//set_color(this.els.box,rgb,'')
		var r=rgb[0];var g=rgb[1];var b=rgb[2];
		this.els.box.css({border:'2px solid'+' rgb('+r+','+g+','+b+')'});
	}
	this.set_pad_color=function(rgb){
		set_color(this.els.pad,rgb,'background-color');
	}
	this.set_pad_line_color=function(rgb){
		var r=rgb[0];var g=rgb[1];var b=rgb[2];
		var rgbs='rgb('+r+','+g+','+b+')';
		this.els.pad.css({border:'2px solid'+' rgb('+r+','+g+','+b+')'});
		this.els.line.forEach(function(line){
			set_color(line,rgb,'background-color');
		})
	}
	this.move_to_path=function(target_m,target_n){
		var ing_m=this.m;
		var ing_n=this.n;
		var path=[];
		while(ing_m!==target_m || ing_n!==target_n){
			//console.log(ing_m,ing_n);
			var neis=hex_d[[ing_m,ing_n]].nei;
			var items=neis.map(function(nei){return [nei,distance(nei[0],nei[1],target_m,target_n)];});
			var target= min(items,function(item){return item[1];})[0];
			path.push(target);
			ing_m=target[0];
			ing_n=target[1];
		}
		//console.log('path:',path);
		path.forEach(function(node){
			that.move_to(node[0],node[1],100, "linear");
		})
		//console.log(path);
	}
	this.move_range=function(){
		//这个方法应该给出可行域以及可行域中的所有hex的最短路径。继续用dij算法
		var mp_s=this.mp;
		var set={};
		set[[this.m,this.n]]=this.mp;
		var set_l=[[this.m,this.n]];
		var activate_list=[[this.m,this.n]];
		var move_cost=function(mn){return 1};//这是将hex_mn映射到移动力消耗上，暂时是个常数函数
		/*
		for(var i=0;i<mp_s;i++){
			var activate_list_b=[];
			activate_list.forEach(function(act_mn){
				//var act=hex_d[act_mn[0],act_mn[1]];
				var act=hex_d[act_mn];
				act.nei.forEach(function(try_mn){
					if (set[try_mn]===undefined){
						set[try_mn]=true;
						set_l.push(try_mn);
						activate_list_b.push(try_mn);
					}
				})
			})
			activate_list=activate_list_b;
		}
		*/
		while (activate_list.length!==0){
			var activate_list_b=[];
			activate_list.forEach(function(act_mn){
				//var act=hex_d[act_mn[0],act_mn[1]];
				var act=hex_d[act_mn];
				act.nei.forEach(function(try_mn){
					var try_s=set[act_mn]-move_cost(try_mn)
					if (set[try_mn]===undefined && try_s>=0){
						set[try_mn]=try_s;
						set_l.push(try_mn);
						activate_list_b.push(try_mn);
					}
				})
			})
			activate_list=activate_list_b;
		}
		return set_l;
	}
}
function Inf(id){
	//console.log('Inf',id);
	Unit.call(this,id);
	var pad=this.els.pad;
	//var line1=$('<div></div>');
	//line1.css({position:"absolute",left:0,top:9,width:Math.sqrt(25*25+17*17),height:2},);
	//下面是画一个北约军事符号步兵的叉
	var line1=draw_line(0,0,25,16);
	var line2=draw_line(0,16,25,0);
	//pad.append(line1);
	//pad.append(line2);
	line1.appendTo(pad);
	line2.appendTo(pad);
	this.els['line']=[line1,line2];
	
}


var unit_click_box=new Unit_click_box();
var hex_click_box=new Hex_click_box();

//draw_hex(50,50,'tip');
//draw_hex(200,200,'lie');
//Hex(10,11,350,200);

var unit_l=[];
var unit_d={};//unit的key是外部的id，该id是标准化文件中应该携带
var hex_l=[];
var hex_d={};//hex的key是它的坐标列表（字面量

var mat=create_hexs(scenario_dic['size'][0],scenario_dic['size'][1]);

scenario_dic['hex_dic_list'].forEach(function(_hex){
	//var hex=new Hex();
	var hex=mat[_hex.m][_hex.n];
	hex.m=_hex.m;
	hex.x=_hex.m;
	hex.n=_hex.n;
	hex.y=_hex.n;
	hex.label=_hex.label;
	hex.VP=_hex.VP;
	hex.terrain=_hex.terrain;
	hex.capture=_hex.capture;
	
	hex_l.push(hex);
	hex_d[[hex.m,hex.n]]=hex;
});

scenario_dic['unit_dic_list'].forEach(function(_unit){
	var unit;
	console.log('_unit',_unit);
	switch(_unit.pad){
		case 'infantry'://剧本文件里pad指定兵牌类型，这类型怎么画由这里决定
			unit=new Inf(_unit.id);
			break;
	}
	unit.id=_unit.id;
	unit.side=_unit.side;
	unit.combat=_unit.combat;
	unit.movement=_unit.movement;
	unit.m=_unit.m;
	unit.n=_unit.n;
	unit.VP=_unit.VP;
	unit.label=_unit.label;
	unit.img=_unit.img;
	unit.set_box_border_color(_unit.color.box_border);
	unit.set_box_color(_unit.color.box_back);
	unit.set_font_color(_unit.color.font);
	unit.set_pad_color(_unit.color.pad_back);
	unit.set_pad_line_color(_unit.color.pad_line);
	unit.deco();
	unit.set_hex(unit.m,unit.n);
	unit.ready();
	
	unit_l.push(unit);
	unit_d[unit.id]=unit;
})

var unit=unit_l[0];
var range=unit.move_range()
range.forEach(function(mn){
	hex_d[mn].highlight();
})
/*
var mat= create_hexs(6,8);
for (var i=0;i<6;i++){
	for(var j=0;j<8;j++){
		mat[i][j].set_color(random_color());
		//create_bound(mat[i][j].left,mat[i][j].top);
	}
}
//var dic=draw_counter();
//dic.box.appendTo(map_el);

inf=new Inf(0);
inf.combat=10;
inf.movement=5;
inf.deco();
*/