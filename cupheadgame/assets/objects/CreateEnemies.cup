b5.export = function(world, scene, data, game) {
	var myexports = {
	};
	
	var enemyScript = data.levelDataPath + 'enemy.cup';
	
	data.enemies = Function(b5.File.readSync(enemyScript))();
	
	data.createEnemy = function(name, x, y, facing, edata) {
		!edata && (edata={});
		if(data.enemies[name]) return data.enemies[name](world, scene, {
			pos: {x: x, y: y},
			facing: facing,
			layer: edata.layer || 0,
			data: edata || {}
		}, game);
	};
	return myexports;
};