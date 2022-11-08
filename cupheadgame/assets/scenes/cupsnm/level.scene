
b5.LoadScene = function(world, scene, data, game) {
	//scene is the main scene where resources and actors will be added
	//game is equivalent to b5.Game where there's things like the loading screen, scene loader, player, configs and	more.
	//you should add local variables on data object, for them to be removed when another scene is being loaded, for global variables add them to game or write it to a file.
  
  game.importObject('CreateLevel')
    .init()
    .loadFightTextsResources();
  game.importObject('CreatePlayer');
  game.importObject('CreateCommonBossLevelResources');
  game.importObject('CreateBoss');

  scene.findResource('MUS_Cuphead','sound').loop_start = 4.435;
  
  game.DiscordSession.updateActivity({
  	details: "Cuphead's Nightmare | EXTREME",
  	state: "403 FORBIDDEN"
  });
  
};
b5.onLoadingScreenOut = function(world, scene, data, game) {
	//Called when the loading screen is fading out, here you can start animating your actors and do whatever you want!
  
  data.initializePlayers();
 
 //Initialize multiplayer
 game.Multiplayer.Initialize(world,data);
 
 scene.findResource('MUS_Cuphead','sound').play();
 
 if(!data.levelData.fightStarted) {
		data.playFightText('GetReady');
  	data.playersIntroAnimation();
	}
 
};
b5.addSceneResources = function(scene, data, game) {
	//Resources that will be added to scene, this will be called before LoadScene
};
b5.onSceneUnload = function(world, scene, data, game, clearResources) {
    //Called when app is about to remove the scene, if clearResources is true, that means the app will clean the resources of the scene
    //You can also remove created objects in b5.Game if they were created and used on the scene.

};
//DEPRECATED
b5.UpdateScene = function(world, scene, data, game) {
	//For updating actors and behaviors on your scene every frame

};