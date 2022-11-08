b5.export = function(world, scene, data, game) {
	var myexports = {
	};
	
	if(!scene.findResource("VictoryFTResources", "raw")) scene.addResource(new b5.Raw("VictoryFTResources", b5.Paths.scenes + "common_mausoleum/victory/resources.json", true, d => 
		game.parseResources(d, scene)
	, true), "raw");
	scene.tryLoadNextResource();
	
	return myexports;
};