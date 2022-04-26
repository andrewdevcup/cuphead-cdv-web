b5.export = function(world, scene, data, game) {
	var myexports = {
	};
	
	var bossFile = data.levelDataPath + 'boss.cup',
	bossDataR = data.levelDataPath + 'bossData.json';
	
	data.boss = Function(b5.File.readSync(bossFile))();
	scene.data.bossData = JSON.secParse(b5.File.readSync(bossDataR));
	
	for(var i in data.boss) {
		//Assign
		var boss = world.findActor(i,true);
		if(boss) {
			data.bossData[i] = {};
			data.boss[i](boss, world, scene, data, game);
		}
	}
	
	data.onBossDeath = function() {
		scene.events.dispatch('bossdeath');
		data.playFightText('Knockout');
		data.updateStatistics = false;
	};

	return myexports;
};