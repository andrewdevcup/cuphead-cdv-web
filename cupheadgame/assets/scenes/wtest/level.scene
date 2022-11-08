
b5.LoadScene = function(world, scene, data, game) {
	//scene is the main scene where resources and actors will be added
	//game is equivalent to b5.Game where there's things like the loading screen, scene loader, player, configs and	more.
	//you should add local variables on data object, for them to be removed when another scene is being loaded, for global variables add them to game or write it to a file.
  
  game.importObject('CreateLevel').init();
  game.importObject('CreatePlayer');
  
  data.WEAPONDATA = [];
  var em = world.findActor('BulletEmitter',true);
  em.flags = {
		shooting: false,
		ducking: true
	};
	
  for(var i = 0, w = data.EquipmentList.weapons; i < w.length; i++)
   if(w[i] != 'empty' && w[i] != 'exploder') data.WEAPONDATA.push(new data.Weapon(w[i], em));
  
  scene.tryLoadNextResource();
};
b5.onLoadingScreenOut = function(world, scene, data, game) {
	//Called when the loading screen is fading out, here you can start animating your actors and do whatever you want!
  
  data.initializePlayers();
  
 //Initialize multiplayer
 game.Multiplayer.Initialize(world,data);
 
 //Test
 em = world.findActor('BulletEmitter',true);
 
 //Setup
 em.data = {
 	shootAngle: 0,
 	shootOffset: [0,0],
 	enemy: 'playerhitbox',
 	bulletTag: 'enemy',
 	triggerShot: () => {},
 	facing: 1
 };
 em.tag = em.name + 'hitbox';
 em.hitbox_active = true;
 
 em.weapons = data.WEAPONDATA;
 
 var p = world.findActorsByTagName('player',true)[0];
 
 em.setInterval(f => {
 	const wpn = em.weapons[b5.Maths.randomRange(0,em.weapons.length-1)];
 	
 	em.cweapon = wpn;
 	
 	if(wpn.wpn.setupActions.toString().indexOf('chaser') != -1) em.data.enemy = 'NOENEMY';
 	else em.data.enemy = 'playerhitbox';
 	
 	wpn.data.SpawnEX([0,0], em.data.shootAngle);
 	
 	scene.data.shakeCamera(7, 0.5, 150);
// 	f.stop();
 },3);
 
 em.onTick = function() {
 	this.cweapon && this.cweapon.updateBehavior();
 	this.data.shootAngle = b5.Maths.posAngle(this.x,this.y,p.x,p.y);
 }
 
};
b5.addSceneResources = function(scene, data, game) {
	//Resources that will be added to scene, this will be called before LoadScene
  
  var bit = new b5.Bitmap('bit',data.resourcePath + 'test.png');
  scene.addResource(bit,'bitmap');
  

};
b5.onSceneUnload = function(world, scene, data, game, clearResources) {
    //Called when app is about to remove the scene, if clearResources is true, that means the app will clean the resources of the scene
    //You can also remove created objects in b5.Game if they were created and used on the scene.

};
//DEPRECATED
b5.UpdateScene = function(world, scene, data, game) {
	//For updating actors and behaviors on your scene every frame

};