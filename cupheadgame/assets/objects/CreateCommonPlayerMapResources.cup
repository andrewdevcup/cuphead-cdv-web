b5.export = function(world, scene, data, game) {
	var myexports = {
	};
	
	//Import resources
	var resources = JSON.parse(b5.File.readSync(b5.Paths.player + 'common_map/resources.json'));
	
	game.parseResources(resources,scene);
		
		//Load particles
		var particles = Function(b5.File.readSync(b5.Paths.player + 'common_map/particles.cup'))();
		data.spawnPlayerParticle = function(name,fromPlayer,data) {
			return particles[name](fromPlayer,scene,data);
		};
	
	
	return myexports;
};