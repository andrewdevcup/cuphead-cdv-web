b5.export = function(world, scene, data, game) {
	var myexports = {
	};
	
	//Import resources for level
	var resources = JSON.parse(b5.File.readSync(b5.Paths.sceneRes + 'common_bosslevel/resources.json'));
	
	game.parseResources(resources, scene);
	
	data.boss = {};
	return myexports;
};