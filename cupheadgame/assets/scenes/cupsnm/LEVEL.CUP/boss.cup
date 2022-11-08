return {
	BulletEmitter: function(thisActor, world, scene, data, game) {
		var difficulty = 1;
		
		//Explosions after Knockout
		thisActor.onDeath = function() {
			scene.events.once('after-knockout',()=>{
			//	scene.data.createBossExplosionsEmitter(x,y,r,t);
			});
		};
		
		data.NM_WEAPONS = [];
		
		//Load all main weapons
  	for(var i = 0, w = data.EquipmentList.weapons; i < w.length; i++)
  		 if(w[i] != 'empty' && w[i] != 'exploder') data.NM_WEAPONS.push(new data.Weapon(w[i], thisActor));

		
		//After sting, load winscreen or any other scene
		//If winscreen, pass statistics and players to evaluate grade
		scene.events.once('onfightwin:nextscene', ()=>{
			!game.Multiplayer.isGuest && b5.Game.LoadScene('credits', 0, 0, {
				show_anim: 'fade',
				show_speed: 2,
				hide_anim: 'fade',
				hide_speed: 0.35,
				hourglass: false
			});
		});
		
		scene.events.on('playEvent',e =>data.playEvent(e[0],e[1],true));
		
		//Event system to synchronize host and guest
		
		data.playEvent = function(evt, evtData, eventFromHost) {
			if(game.Multiplayer.isHosting)
				game.Multiplayer.sendToGuest('PLAY_EVENT',[evt,evtData]);
				
			if(!game.Multiplayer.isGuest || eventFromHost) switch(evt) {
				default:
				  void 0;
			}
		}
		
		//Basic defeat manager
		var dead = false,
		bossData;

		thisActor.onTick = function() {
			bossData = scene.data.bossData; //Fix object error in guest
			
			if (scene.data.levelData.fightStarted) {
				//Do things
				
				if (bossData.health <= 0 && !dead) {
					dead = true;
					
					data.playEvent('Knockout'); //Handler
				}
			}
			
		}
		
	}
};