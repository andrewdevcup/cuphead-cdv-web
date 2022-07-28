
b5.LoadScene = function(world, scene, data, game) {
	//scene is the main scene where resources and actors will be added
	//game is equivalent to b5.Game where there's things like the loading screen, scene loader, player, configs and	more.
	//you should add local variables on data object, for them to be removed when another scene is being loaded, for global variables add them to game or write it to a file.
  
  world.camera_update = false;
  game.Flags.pausingEnabled = false;
  //Allow touchscreen
  world.touchable = true;
  game.GUI.disableButtons();
  
	var bg = new b5.RectActor();
	bg.setSize(2000,1000);
	bg.fill_style = "rgb(89,89,89)";
	world.addActor(bg);
	bg.name = "BG";
	
	const text = new b5.LabelActor();
	text.font = scene_GUI.findResource('CupheadVogueExtraBoldFont','brush');
	world.addActor(text);
	text.name = "noticetext";
	text.line_height = 45;
	text._y = -240;
	
};
b5.onAllResourcesLoaded = function(world,scene,data,game) {
	//When scene has loaded all resources (a bit before onLoadingScreenOut)
	
	const txt = world.findActor('noticetext',true);
	txt.text = scene.findResource('NoticeText','raw').data;
	
//	txt.text = txt.text.replace('tap the screen to continue','           tap the screen to continue');
	
};
b5.onLoadingScreenOut = function(world, scene, data, game) {
	//Called when the loading screen is fading out, here you can start animating your actors and do whatever you want!
  
  let randomBlurFunc = b5.generateRandomMovement(23);

  world.findActor('noticetext',true).setInterval(f => {
  	sceneMain.BLUR_MULTIPLIER = Math.max(0,randomBlurFunc(f.data.frame_count/10)*3);

  },0);
  
  const bg = world.findActor('BG',true);
  
  bg.touchable = true;
  
  bg.onBeginTouch = function() {
  	this.touchable = false;
  	this.onBeginTouch = null;
  	b5.Game.LoadScene('title', false, false, {show_anim: 'fade', show_speed: 0.4, hide_anim: 'fade', hide_speed: 1.4});
  }
  
  //Listen also to input
	bg.setInterval(function(f) {
		var _this = f.data;
		for(var i in game.Input.player1) Math.round(game.Input.player1[i]) && _this.touchable && _this.onBeginTouch();
	},0);
};
b5.addSceneResources = function(scene, data, game) {
	//Resources that will be added to scene, this will be called before LoadScene
  
  game.parseResources({
  	raw: [
  		{
  			name: "NoticeText",
  			src: "texts/notice.txt"
  		}
  	]
  }, scene);
};
b5.onSceneUnload = function(world, scene, data, game, clearResources) {
    //Called when app is about to remove the scene, if clearResources is true, that means the app will clean the resources of the scene
    //You can also remove created objects in b5.Game if they were created and used on the scene.
    world.findActor('noticetext',true).tasks.clear();
    sceneMain.BLUR_MULTIPLIER = 0;
};
//DEPRECATED
b5.UpdateScene = function(world, scene, data, game) {
	//For updating actors and behaviors on your scene every frame

};