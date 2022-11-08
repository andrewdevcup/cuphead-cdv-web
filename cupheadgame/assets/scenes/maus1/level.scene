
b5.LoadScene = function(world, scene, data, game) {
	//scene is the main scene where resources and actors will be added
	//game is equivalent to b5.Game where there's things like the loading screen, scene loader, player, configs and	more.
	//you should add local variables on data object, for them to be removed when another scene is being loaded, for global variables add them to game or write it to a file.
	data.noChalice = true;
	
	data.levelID = game.LevelIDs.mausoleum1; //Original Cuphead level ID
  
  game.SlotUtils.getLevelData(data.levelID).played = true;
 
	
	game.importObject('CreateLevel')
      .init()
      .loadFightTextsResources();
	  
	game.importObject('CreatePlayer');
	game.importObject('CreateCommonBossLevelResources');
	game.importObject('CreateVictoryFightTextsResources');
	game.importObject('CreateBoss');
	
	world.camera_speed_x = 0.15;
  
	game.DiscordSession.updateActivity({
		details: "Mausoleum I | " + game.d_getDifficulty(data.Statistics.skill),
		state: game.d_printPlayersAndHP()
	});
	
  var lr = world.findActor('LightRays', true);
	lr.atlas = scene.findResource('MausLightRaysAtlas','brush');
	lr.frame_speed = 12;
	lr.composite_op = 'lighter';
};
b5.onAllResourcesLoaded = function(world,scene,data,game) {
	//When scene has loaded all resources (a bit before onLoadingScreenOut)
};
b5.onLoadingScreenOut = function(world, scene, data, game) {
	//Called when the loading screen is fading out, here you can start animating your actors and do whatever you want!
	
	data.initializePlayers();
  
	//Initialize multiplayer
	game.Multiplayer.Initialize(world,data);
 
	if(!data.levelData.fightStarted) {
		data.playFightText('GetReady', null, true);
		data.playersIntroAnimation();
		
		[
			scene.findResource("voMausOpeningSfx1", "sound"),
			scene.findResource("voMausOpeningSfx2", "sound")
		][b5.Maths.randomRange(0,1)].play();
	}
	
	scene.findResource( 'Mus_Mausoleum', 'sound' ).play();
};
b5.addSceneResources = function(scene, data, game) {
	var res = new b5.Raw("MausResources", b5.Paths.scenes + "common_mausoleum/resources.json", true, f => {
		game.parseResources(f, scene);
	}, true);
	scene.addResource(res, "raw");
};
b5.onSceneUnload = function(world, scene, data, game, clearResources) {
    //Called when app is about to remove the scene, if clearResources is true, that means the app will clean the resources of the scene
    //You can also remove created objects in b5.Game if they were created and used on the scene.

};