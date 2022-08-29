b5.LoadScene = function(world, scene, data, game) {
	//scene is the main scene where resources and actors will be added
	//game is equivalent to b5.Game where there's things like the loading screen, scene loader, player, configs and	more.
	//you should add local variables on data object, for them to be removed when another scene is being loaded, for global variables add them to game or write it to a file.
  
  //Import actors and initialize physics world
  
  game.importObject('CreateLevel').init();
  
  data.noChalice = true;
  game.importObject('CreatePlayer');
  
  //Update presence in discord
  game.DiscordSession.updateActivity({
  	details: "Elder Kettle's House | " + game.d_getDifficulty(data.Statistics.skill),
  	state: game.d_printPlayersAndHP()
  });
  
  var housebg = world.findActor('HouseBG', true);
  housebg.atlas = scene.findResource('ElderKettleHouseAtlas', 'brush');
  
  var housevig = world.findActor('HouseVignette',true);
  housevig.atlas = scene.findResource('ElderKettleHouseAtlas', 'brush');
  housevig.current_frame = 1;
  
  var housenotes = world.findActor('MusicNotes', true);
  housenotes.atlas = scene.findResource('ElderKettleMusicAtlas', 'brush');
  housenotes.playAnim(housenotes.atlas.listAnims()[0]);
  //Play random anims
  housenotes.onAnimEnd = function() {
  	this.playAnim( this.atlas.listAnims()[b5.Maths.randomRange(0,2)] );
  };
  
  housenotes.playAnim('white_crotchet');
  
  var fireplace = world.findActor('FirePlaceGlow', true);
  fireplace.atlas = scene.findResource('ElderKettleHouseAtlas', 'brush');
  fireplace.current_frame = 4;
  
  fireplace.op_func = b5.generateRandomMovement(15);
  fireplace.op_time = 0;
  fireplace.spd = 0.2;
  fireplace.composite_op = "lighter";
  
  fireplace.onTick = function() {
  	this.op_time += game.speed * this.spd;
  	this.opacity = ((0.5+Math.cos(this.op_time)*0.5) * this.op_func(this.op_time*0.5)*2)*0.9;
  };
  
  var bgchair = world.findActor('ChairBG',true);
  bgchair.atlas = scene.findResource('ElderKettleHouseAtlas', 'brush');
  bgchair.current_frame = 2;
  
  var bgcouch = world.findActor('CouchBG',true);
  bgcouch.atlas = scene.findResource('ElderKettleHouseAtlas', 'brush');
  bgcouch.current_frame = 3;
  
  //Elder kettle
  var ek = world.findActor('NPC_ElderKettle',true);
  ek.atlas = scene.findResource('ElderKettleAtlas',"brush");
  ek.center_atlas = true;
  ek.playAnim('ek_idle',true);
  
  //Particles
  data.spawnParticle = function(name, target) {
  	switch(name) {
  		case 'ek_puff':
  			var p = new b5.Actor;
		  	p.atlas = ek.atlas;
		  	p._scale = 0.9;
		  	p.tags = ['particle','playerParticle'];
		  	p.tag = p.tags[0];
		  	target.parent.addActor(p);
		  	p.setPosition(target.x-65,target.y-45);
		  	p.playAnim(name);
		  	p.onAnimEnd = p.destroy;
  			break;
  		case 'ek_bottle_dissapear_fx':
  			var p = new b5.Actor;
		  	p.atlas = ek.atlas;
		  	p._scale = 0.9;
		  	p.tags = ['particle','playerParticle'];
		  	p.tag = p.tags[0];
		  	target.parent.addActor(p);
		  	p.setPosition(target.x,target.y);
		  	p.playAnim(name);
		  	p.onAnimEnd = p.destroy;
  			break;
  	}
  }
};
b5.onLoadingScreenOut = function(world, scene, data, game) {
	//Called when the loading screen is fading out, here you can start animating your actors and do whatever you want!
  
  //Play music
  scene.findResource('MusElderKettleOrch', 'sound').play();
 
 //Tell world loading screen is being hidden
 //This method is added by CreatePlayer
 //Used play intro animations and defining variables
 data.initializePlayers();
 
 //Initialize multiplayer
 game.Multiplayer.Initialize(world,data);
 
 //Trigger first interaction when first talking to Elder Kettle
 var dialogStates = game.SlotUtils.getDialoguerStates();
 if(dialogStates[0] === 0 && !game.Multiplayer.isGuest) {
 	//Save
 	game.Flags.pausingEnabled = false;
 	world.findActor('NPC_ElderKettle',true).triggerInteract = true;
 }
};
b5.addSceneResources = function(scene, data, game) {
	//Resources that will be added to scene, this will be called before LoadScene
  
  //Background
  var house_bg = new b5.Bitmap('ElderKettleHouseBG', data.resourcePath + 'Elder_Kettle_Background.png', false);
  house_bg.enable_cache = false;
  scene.addResource(house_bg, 'bitmap');
  
  var ekh_atlas = new b5.ImageAtlas('ElderKettleHouseAtlas', [house_bg]);
  ekh_atlas.parseFrames(b5.File.readSync( data.resourcePath + 'Elder_Kettle_Background.csv'));
  scene.addResource(ekh_atlas, 'brush');
  
  //Music notes
  var ek_music_bitmap = new b5.Bitmap('ElderKettleMusic', data.resourcePath + 'SpriteAtlasTexture_Elder_Kettle_Music.png',false);
  scene.addResource(ek_music_bitmap, 'bitmap');
  
  var ek_music_atlas = new b5.ImageAtlas('ElderKettleMusicAtlas', [ek_music_bitmap]);
  ek_music_atlas.parseFrames(b5.File.readSync(data.resourcePath + 'SpriteAtlasTexture_Elder_Kettle_Music.csv'));
  ek_music_atlas.parseAnims(b5.File.readSync(data.resourcePath + 'music_notes.atlas.json'));
  scene.addResource(ek_music_atlas, 'brush');
  
  //Elder Kettle atlas
  var ek_btm = new b5.Bitmap('ElderKettleBitmap', data.resourcePath + 'SpriteAtlasTexture_ElderKettle-0.png',false);
  ek_btm.enable_cache = false;
  scene.addResource(ek_btm,'bitmap');
  
  var ek_atlas = new b5.ImageAtlas('ElderKettleAtlas', [ek_btm]);
  ek_atlas.parseFrames(b5.File.readSync(data.resourcePath + 'SpriteAtlasTexture_ElderKettle.csv'));
  ek_atlas.parseAnims(b5.File.readSync(data.resourcePath + 'ElderKettle.atlas.json'));
  scene.addResource(ek_atlas,'brush');
  
  //Elder Kettle sfx
  var sfxList = {
  	ExcitedBurst: [1, 16],
  	Laugh: [1, 4],
  	McKellen: [1, 6],
  	WarStory: [1, 12]
  };
  for(var i in sfxList) for(var a = sfxList[i][0]; a < sfxList[i][1]; a++) {
  	var snd = new b5.Sound('ek_' +i+'Sfx'+a, data.resourcePath + 'sfx/sfx_EK_'+ i + '_' + a.zfill(3) + '.ogg', false, false, false);
  	snd.output_gain = game.Sfx.volume;
  	snd.onDestroy = game.Sfx.remove;
  	game.Sfx.add(snd);
  	scene.addResource(snd, 'sound');
  }
  
  var bposfx = new b5.Sound('EkBottlePopsOutSfx', data.resourcePath + 'sfx_ek_bottle_pops_out_(isolated).ogg', false, false);
  bposfx.output_gain = game.Sfx.volume;
  bposfx.onDestroy = game.Sfx.remove;
  game.Sfx.add(bposfx);
  scene.addResource(bposfx, 'sound');
  
  var bdspsfx = new b5.Sound('EkBottleDissapearSfx', data.resourcePath + 'temp_sfx_ek_bottle_dissapear.ogg', false, false);
  bdspsfx.output_gain = game.Sfx.volume;
  bdspsfx.onDestroy = game.Sfx.remove;
  game.Sfx.add(bdspsfx);
  scene.addResource(bdspsfx, 'sound');
  
  var ppusfx = new b5.Sound('PlayerPowerUpSfx', data.resourcePath + 'sfx_anim_player_powerup_01.ogg', false, false);
  ppusfx.output_gain = game.Sfx.volume;
  ppusfx.onDestroy = game.Sfx.remove;
  game.Sfx.add(ppusfx);
  scene.addResource(ppusfx, 'sound');
  
  //Music
  
  var ek_orch = new b5.Sound('MusElderKettleOrch', data.resourcePath + 'MUS_ElderKettle_Orch.mp3', false, false, false, {equalizer:true, limiter:true, stream:false, reverb: true});
  ek_orch.loop = true;
  ek_orch.output_gain = game.Music.volume;
  ek_orch.onDestroy = game.Music.remove;
  game.Music.add(ek_orch);
  scene.addResource(ek_orch, 'sound');
 
};
b5.onSceneUnload = function(world, scene, data, game, clearResources) {
  //Called when app is about to remove the scene, if clearResources is true, that means the app will clean the resources of the scene
  //You can also remove created objects in b5.Game if they were created and used on the scene.

};
//DEPRECATED
b5.UpdateScene = function(world, scene, data, game) {
	//For updating actors and behaviors on your scene every frame

};