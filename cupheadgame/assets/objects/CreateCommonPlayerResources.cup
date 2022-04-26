b5.export = function(world, scene, data, game) {
	var myexports = {
	};
	
	//Import resources
	var resources = JSON.parse(b5.File.readSync(b5.Paths.player + 'common/resources.json'));
	
	
	game.parseResources(resources,scene);
		
		//Load particles
		var particles = Function(b5.File.readSync(b5.Paths.player + 'common/particles.cup'))();
		data.spawnPlayerParticle = function(name,fromPlayer) {
			return particles[name](fromPlayer,scene);
		};
	
	
	return myexports;
};