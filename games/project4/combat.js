//这个模块实现经典的CRT裁决，并解决UI交互以外的所有战斗相关功能函数。

var CRT= (function(){
	var A1='A1';
	var AR='AR';
	var D1='D1';
	var DR='DR';
	var AE='AE';
	var DE='DE';
	var EX='EX';

	var table={
		0.25:[AE,AE,AE,AR,AR,DR],
		0.33:[AE,AE,AR,AR,AR,DR],
		0.5:[AE,AR,AR,AR,DR,DR],
		1.0:[AR,AR,AR,DR,DR,DR],
		1.5:[AR,AR,DR,DR,DR,DR],
		2.0:[AR,AR,DR,DR,DR,DE],
		3.0:[AR,DR,DR,DR,DE,DE],
		4.0:[EX,DR,DR,DE,DE,DE],
		5.0:[EX,EX,DE,DE,DE,DE],
		6.0:[DE,DE,DE,DE,DE,DE]
	}
	return table
})();
function result_distribution(atk,def){
	//接受攻方总点数与守方总点数，映射一个结果表，这里不进行直接抽取。
	var odds;
	var odds_r=atk/def;
	var odds_c=0.25
	for (odds in CRT){
		if (odds>odds_c && odds_r>=odds){
			odds_c=odds;
		}
	}
	return CRT[odds_c];
}
function result_draw(atk,def){
	var d6=int(random.random()*6);
	return result_distribution(atk,def)[d6];
}