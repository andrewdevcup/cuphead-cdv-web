
b5.LoadScene = function(world, scene, data, game) {
	//scene is the main scene where resources and actors will be added
	//game is equivalent to b5.Game where there's things like the loading screen, scene loader, player, configs and	more.
	//you should add local variables on data object, for them to be removed when another scene is being loaded, for global variables add them to game or write it to a file.
  game.Flags.pausingEnabled = false;
  game.GUI.disableButtons();
  
  var dat = new b5.Actor();
  dat.bitmap = scene.findResource('data',"bitmap");
  world.addActor(dat);
  dat.setSize(1280,720);
};
b5.onAllResourcesLoaded = function(world,scene,data,game) {
	//When scene has loaded all resources (a bit before onLoadingScreenOut)
};
b5.onLoadingScreenOut = function(world, scene, data, game) {
	//Called when the loading screen is fading out, here you can start animating your actors and do whatever you want!
  
};
b5.addSceneResources = function(scene, data, game) {
	//Resources that will be added to scene, this will be called before LoadScene
  var dat = new b5.Bitmap('data', data.resourcePath + 'data.mp4', 0, null, true);
  dat.loaded = true;
  dat.resource.source.onended	= f => {
  	game.loadingScreen.nightmare=true;
  	game.LoadScene('main_menu', true, true, {
  		hourglass: true
  	});
  }
  scene.addResource(dat,'bitmap');
};
b5.onSceneUnload = function(world, scene, data, game, clearResources) {
    //Called when app is about to remove the scene, if clearResources is true, that means the app will clean the resources of the scene
    //You can also remove created objects in b5.Game if they were created and used on the scene.

};
//DEPRECATED
b5.UpdateScene = function(world, scene, data, game) {
	//For updating actors and behaviors on your scene every frame

};