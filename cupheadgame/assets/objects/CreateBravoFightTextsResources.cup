b5.export = function(world, scene, data, game) {
	var myexports = {
	};
	return myexports;
	
	if(!scene.findResource("BravoFTResources", "raw")) scene.addResource(new b5.Raw("BravoFTResources", b5.Paths.scenes + "common_platforming/bravo/resources.json", true, d => 
		game.parseResources(d, scene)
	, true), "raw");
	scene.tryLoadNextResource();
};