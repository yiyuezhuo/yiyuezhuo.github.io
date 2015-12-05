var map_el=$('#map');
map_el.css({'position':'absolute','left':'100px','top':'25px'});

short_edge_length=50;
hex_k=Math.cos(Math.PI/6)*2;
long_edge_length=short_edge_length*hex_k;
attach_edge=short_edge_length*1.5;
default_hex_type='tip';
counter_x=48;
counter_y=48;
function all(l){
	return l.reduce(function(x,y){return x&&y});
}
function any(l){
	return l.reduce(function(x,y){return x||y});
}
function copy(l){
	return l.slice();
}
function equal_struct(l1,l2){
	if (typeof(l1)!=='object'){
		return l1===l2;
	}
	else{
		if (l1.length!==l2.length){
			return false;
		}
		for(var i=0;i<l1,length;i++){
			if (typeof(l1[i])!=='object'){
				if (l1[i]!==l2[i]){
					return false;
				}
			}
			else{
				if(!equal_struct(l1[i],l2[i])){
					return false;
				}
			}
		}
		return true;
	}
}
function member(atom,list){
    for(var i=0;i<list.length;i++){
		if (equal_struct(atom,list[i])){
			return true;
		}
	}
    return false;
}

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
function other(l,atom){
	for (var i=0;i<l.length;i++){
		if (atom!=l[i]){
			return l[i];
		}
	}
}
random=(function(){
	module={};
	module.random=Math.random;
	module.choice=function(list){
		var index=int(Math.random()*list.length);
		return list[index];
	};
	module.shuffle=function(list){//
		//python的shuffle是传引用的
		var list_ing=list.slice();
		console.log('list_ing',list_ing);
		var list_build=[];
		while(list_ing.length>0){
			var index=int(Math.random()*list_ing.length);
			list_build.push(list_ing[index]);
			list_ing.splice(index,1);
		}
		for (var i=0;i<list.length;i++){
			list[i]=list_build[i];
		}
		console.log('list_build',list_build);
	}
	return module;
})();
function sum(l){
	return l.reduce(function(x,y){return x+y});
}

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
		switch(phase_box.state[1]){
			case 'move':
				console.log('enter move')
				switch(this.state){
					case 'start':
						this.try_choose(unit);
						break;
					case 'choosed':
						this.try_choose(unit);
						break;
				break;
				}
			case 'combat':
				console.log('enter combat');
				battle_box.join(unit);
				break;
			
		}
		console.log('click end');
	}
	this.reset_focus=function(){
		var set=this.choose_unit.move_range();
		this.remove_focus();
		for(var ss in set){
			var hex=hex_d[ss];
			hex.highlight();
		}
	}
	this.remove_focus=function(){
		hex_l.forEach(function(hex){
			if (hex.is_highlight){
				hex.de_highlight();
			}
		})
	}
	this.try_choose=function(unit){
		if (phase_box.is_choose_able(unit)){
			this.choose_unit=unit;
			this.reset_focus();
			this.state='choosed';//目前实现的应该是此货处于此状态时点击另一个Hex就移动过去。
		}
		else{
			console.log('you can not choose a unit in error phase');
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
						if (unit_click_box.choose_unit.move_range()[[hex.m,hex.n]]!==undefined){
							unit_click_box.choose_unit.move_to_path(hex.x,hex.y);
						}
						else{
							unit_click_box.state='start';
							unit_click_box.remove_focus();
							console.log('Too long to move');
						}
						break;
				}
				break;
		}
	}
}
function Battle_box(){
	//这个对象的背后可能会影响的UI在toolbox里
	this.atk_unit_list=[];
	this.def_unit_list=[];
	var that=this;
	this.join_able=function(unit){
		//这个函数按照当前已加入的单位判定视图加入的单位是否是合法的,注意这里没有加入到“哪一边”的自由度
		//这里的实现是可以一个单位攻击多个单位或多个单位攻击一个单位，但不能多对多。但是至少应从一个守方单位开始
		//选起
		var atk_unit_list=this.atk_unit_list;
		var def_unit_list=this.def_unit_list;
		if(unit.side===phase_box.state[0]){
			//选择当前阶段而言的己方单位
			if (def_unit_list.length===0){
				return false;
			}
			else{
				if(atk_unit_list.length>=1 && def_unit_list.length>1){
					return false;
				}
				else{
					var def=def_unit_list[0];
					var nei=hex_d[[def.m,def.n]].nei;
					return member([unit.m,unit.n],nei);
				}
			}
		}
		else{
			//选择当前阶段而言的敌方单位
			if (atk_unit_list.length>1){
				return false;
			}
			else if(atk_unit_list.length===0 && def_unit_list.length===0){
				return true;
			}
			else if(atk_unit_list.length===0 && def_unit_list.length>0){
				return false;
			}
			else{
				var atk=atk_unit_list[0];
				var nei=hex_d[[def.m,def.n]].nei;
				return member([unit.m,unit.n],nei);
			}
		}
	}
	this.join=function(unit){
		if (this.join_able(unit)){
			if (unit.side===phase_box.state[0]){
				this.atk_unit_list.push(unit);
				toolbox.battle_odds_attack.append($('<p>'+unit.to_tag()+'</p>'));
				console.log('join atk');
			}
			else{
				this.def_unit_list.push(unit);
				toolbox.battle_odds_defence.append($('<p>'+unit.to_tag()+'</p>'));
				console.log('join def');
			}
		}
		else{
			console.log('join fail');
		}
	}
	this.do_it=function(){
		//完成结算并重置状态
		var atk_id_list=that.atk_unit_list.map(function(unit){return unit.id});
		var def_id_list=that.def_unit_list.map(function(unit){return unit.id});
		do_battle(atk_id_list,def_id_list);
		//this.atk_unit_list=[];
		//this.def_unit_list=[];
		that.reset();
	}
	this.reset=function(){
		this.atk_unit_list=[];
		this.def_unit_list=[];
		toolbox.battle_odds_attack.empty();
		toolbox.battle_odds_defence.empty();
	}
}
function Phase_box(){
	//这个“静态”对象应该处理有关阶段切换的有关逻辑，toolbox除了提供ui，主逻辑也应该由它执行。
	this.turn=1;
	this.state=[0,'ready'];
	var that=this;
	
	this.next_phase=function(){//这货作为<a>的回调函数，this表示的是a标签，应该用that转为引用此对象
		unit_click_box.remove_focus();
		switch (that.state[1]){
			case 'ready':
				//this.state=[this.state[0],'move'];
				that.change_phase_to(that.state[0],'move');
				break;
			case 'move':
				//this.state=[this.state[0],'combat'];
				that.change_phase_to(that.state[0],'combat');
				toolbox.combat_box.show();
				break;
			case 'combat':
				//this.state=[this.next_player(),'ready'];
				var next_player=player_d[that.next_player_id()]
				that.change_phase_to(next_player.id,'ready');
				next_player.ready();
				toolbox.combat_box.hide();
				//ready阶段，在你处理的时候，自动恢复阶段已经结束，这里处理的是其他东西，如资源调配
				that.turn+=1;
				break;
		}
	}
	this.change_phase_to=function(side,state){
		console.log(player_d[side].name+' '+state+' phase');
		toolbox.show_widget.html(player_d[side].name+' '+state+' phase');
		this.state=[side,state];
		return 
	}
	this.next_player_id=function(){
		return other([0,1],this.state[0]);
	}
	this.is_choose_able=function(unit){
		return unit.side===this.state[0] && this.state[1]==='move';
	}
	//this.change_phase_to(0,'ready');
}
function Toolbox(){
	this.el=$('#toolbox');
	this.el.css({'z-index':20,position:'fixed','background-color': 'rgb(250, 250, 250)'});
	//this.el.append($('<div>HeHe</div>'));
	var next_phase_a=$('#next_phase_a');//这个如果性能不过关就动态创建
	next_phase_a.click(phase_box.next_phase);
	this.show_widget=$('#turn_state');
	this.do_it_a=$('#do_it_a');
	this.reset_a=$('#reset_a');
	this.combat_box=$('#combat_box');
	this.battle_odds=$('#battle_odds');
	this.battle_odds_attack=$('#battle_odds_attack');
	this.battle_odds_defence=$('#battle_odds_defence');
	this.do_it_a.click(battle_box.do_it);
	this.reset_a.click(battle_box.reset);
	this.combat_box.hide();
}
function Player(side_id){
	//player级的状态管理由这里处理,以及一些诸如选择全体算子的处理方法
	this.side=side_id;
	this.id=side_id;
	var that=this;
	this.all_unit=function(){
		var l=[];
		unit_l.forEach(function(unit){
			if (unit.side===that.side){
				l.push(unit);
			}
		})
		return l;
	}
	this.ready=function(){
		this.all_unit().forEach(function(unit){
			unit.ready();
		})
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
	this.is_highlight=false;
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
			that.is_highlight=true;
		})
	}
	this.de_highlight=function(){
		this.bound.forEach(function(bound){
			bound.removeClass('highlight');
			bound.addClass('unhighlight');
			that.is_highlight=false;
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
	this.short_path={};//该量在每次可达域计算时作为副作用重置，在寻路时使用
	this.surplus_map={};
	this.removed=false;
	this.deco=function(){
		this.els.l0.html(this.combat);
		this.els.l2.html(this.movement);
	}
	this.ready=function(){
		this.mp=this.movement;
	}
	this.set_hex=function(m,n){
		this.hex_move(this.m,this.n,m,n);
		//hex_d[[this.m,this.n]].unit=null;
		var left=mat[m][n].left+short_edge_length*Math.cos(Math.PI/6)-counter_x/2;
		var top=mat[m][n].top+short_edge_length/2-counter_y/2;
		this.el.css({left:left,top:top});
		this.m=m;
		this.n=n;
		//hex_d[[m,n]].unit=this;
	}
	this.move_to=function(m,n,duration,pattern,mode){
		//hex_d[[this.m,this.n]].unit=null;
		this.hex_move(this.m,this.n,m,n);
		var left=mat[m][n].left+short_edge_length*Math.cos(Math.PI/6)-counter_x/2;
		var top=mat[m][n].top+short_edge_length/2-counter_y/2;
		if (mode==='no_focus'){
			this.el.animate({left:left,top:top},duration,pattern);
		}
		else{
			this.el.animate({left:left,top:top},duration,pattern,function(){console.log('wuyu');unit_click_box.reset_focus();});
		}
		this.m=m;
		this.n=n;
		//this.mp-=1;这个消耗不能在这个阶段得到正确的计算
		//hex_d[[m,n]].unit=this;
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
	this.hex_move=function(m1,n1,m2,n2){
		hex_d[[m1,n1]].unit=null;
		hex_d[[m2,n2]].unit=this;
	}
	this.hex_pass=function(m1,n1,m2,n2){
		hex_d[[m1,n1]].pass=null;
		hex_d[[m2,n2]]=pass.this;
	}
	this.move_to_path=function(target_m,target_n){
		var ing_m=this.m;
		var ing_n=this.n;
		var path=[];
		/*
		while(ing_m!==target_m || ing_n!==target_n){
			//console.log(ing_m,ing_n);
			var neis=hex_d[[ing_m,ing_n]].nei;
			var items=neis.map(function(nei){return [nei,distance(nei[0],nei[1],target_m,target_n)];});
			var target= min(items,function(item){return item[1];})[0];
			path.push(target);
			ing_m=target[0];
			ing_n=target[1];
		}
		*/
		if (this.short_path[[target_m,target_n]]!==undefined)
			path=this.short_path[[target_m,target_n]].slice(1);
		else{
			console.log('No path cal to that');
		}
		
		//console.log('path:',path);
		path.forEach(function(node){
			that.move_to(node[0],node[1],100, "linear");
		})
		this.mp=this.surplus_map[[target_m,target_n]];
		//console.log(path);
	}
	this.zoc_map=function(mn){
		var hex=hex_d[mn];
		var map={}
		var that=this;
		player_l.forEach(function(player){
			map[player.id]=any(hex.nei.map(function(nei_id){
				var nei= hex_d[nei_id];
				//console.log('mn',mn,'nei.unit',nei.unit,'nei.unit.side',nei.unit ? nei.unit.side:'unit=null','player.id',player.id)
				if (nei.unit===null || nei.unit.side===player.id){
					return false;
				}
				else{
					return true;
				}
			}))
		})
		return map;
	}
	this.move_cost=function(mn,surplus){
			var hex=hex_d[mn];
			//console.log(this.zoc_map(mn));
			if (hex.unit!==null && hex.unit.side!==this.side){
				return Math.max(surplus+1,1);//从而trick的禁止移动
			}
			if (this.zoc_map(mn)[this.side]){//这里有个布尔代数trick重构时注意
				//console.log('zoc_map',this.zoc_map(mn));
				return Math.max(surplus,1);
			}
			return 1;
			//return 1；
		};//这是将hex_mn映射到移动力消耗上，暂时是个常数函数

	this.move_range=function(){
		//这个方法应该给出可行域以及可行域中的所有hex的最短路径。继续用dij算法
		var that=this;
		this.short_path={};//映射到当前最优路线的所过节点表
		this.short_path[[this.m,this.n]]=[[this.m,this.n]];//最优路线是包含初始点的，之后利用时可能需要删除
		var mp_s=this.mp;
		var set={};//映射到当前最优路径的移动力消耗
		set[[this.m,this.n]]=this.mp;
		//var set_l=[[this.m,this.n]];
		var activate_list=[[this.m,this.n]];
		//var zoc_cost=
		while (activate_list.length!==0){
			var activate_list_b=[];
			activate_list.forEach(function(act_mn){
				//var act=hex_d[act_mn[0],act_mn[1]];
				var act=hex_d[act_mn];
				act.nei.forEach(function(try_mn){
					var try_s=set[act_mn]-that.move_cost(try_mn,set[act_mn]);
					//console.log(try_mn,try_s);
					if ((set[try_mn]===undefined && try_s>=0)||(set[try_mn]!==undefined && set[try_mn]<try_s)){
						set[try_mn]=try_s;
						var build_path=copy(that.short_path[act_mn]);
						build_path.push(try_mn);
						that.short_path[try_mn]=build_path;
						//set_l.push(try_mn);
						if (try_s>0){
							activate_list_b.push(try_mn);
						}
					}
				})
			})
			activate_list=activate_list_b;
		}
		//return set_l;
		this.surplus_map=set;
		return set;
	}
	this.destroy=function(){
		this.removed=true;
		this.el.hide();
		hex_d[[this.m,this.n]].unit=null;
		this.m=undefined;
		this.n=undefined;
		
	}
	this.to_tag=function(){
		//这个函数会返回一个简介字符串，用于插入到odds里显示
		return this.label+':'+this.combat;
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
function Cav(id){
	Unit.call(this,id);
	var pad=this.els.pad;
	var line2=draw_line(0,16,25,0);
	line2.appendTo(pad);
	this.els['line']=[line1,line2];
}


var unit_click_box=new Unit_click_box();
var hex_click_box=new Hex_click_box();
var phase_box=new Phase_box();
var battle_box=new Battle_box();

var toolbox=new Toolbox();


//draw_hex(50,50,'tip');
//draw_hex(200,200,'lie');
//Hex(10,11,350,200);

var unit_l=[];
var unit_d={};//unit的key是外部的id，该id是标准化文件中应该携带
var hex_l=[];
var hex_d={};//hex的key是它的坐标列表（字面量
var player_l=[];
var player_d={};

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
	hex.unit=null;//正在占据此格的单位
	hex.pass=null;//正在通过的单位
	
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
});
scenario_dic['player_dic_list'].forEach(function(_player){
	var player=new Player(_player.id);
	player.name=_player.name;
	
	player_l.push(player);
	player_d[_player['id']]=player;
})

phase_box.change_phase_to(0,'ready');

var unit=unit_l[0];
