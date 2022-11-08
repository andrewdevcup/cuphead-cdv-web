return function(thisPlayer, flags, input, world, scene, game, data) {
	//Setup local variables here
	//This function will be called when player is first created
	//For executing actions when loading screen is being hidden,
	//add the method thisPlayer.onLoadingScreenOut = function(){...}
	//var myvar = flags.jumping
	
	//Sounds
	var parrySlapSfx = [
		scene.findResource('PlayerParrySlapSfx1','sound'),
		scene.findResource('PlayerParrySlapSfx2','sound')
	],
	parryPowerUpSfx = [
		scene.findResource('PlayerParryPowerUpSfx1','sound'),
		scene.findResource('PlayerParryPowerUpSfx2','sound')
	],
	parryPowerUpFullSfx = scene.findResource('PlayerParryPowerUpFull','sound'),
	atlas = thisPlayer.findActor('AtlasImage','brush'),
	parryScoreSync = 0;
	
	
	//Events
	scene.events.on('playerparry', evtdata => {
		if(evtdata[3] == "send") {
			var target = game.Multiplayer.target();
			game.Multiplayer["sendTo" + target]('DISPATCH_EVENT',['playerparry',[evtdata[0], evtdata[1], evtdata[2], target]]);
		}
		else if(evtdata[3] == game.Multiplayer.session && thisPlayer.name == evtdata[0]) {
			thisPlayer.data.supermeter = evtdata[2];
			!flags.successfulParry && thisPlayer.parry(evtdata[1]);
		}
	});
	
	//On parry hit
	thisPlayer.parry = function(parryScore) {
		data.spawnPlayerParticle('parryEffect',thisPlayer);
		world.active = false;
		flags.parryActive = false;
		flags.successfulParry = true;
		thisPlayer.body.SetActive(false);
		scene.world.m_sleep = true;
		//Parry pink
		var currfr = atlas.current_frame;
		atlas.playAnim('jump_parry_pink');
		atlas.current_frame = currfr;
		//Play sfx
		parrySlapSfx[b5.Maths.randomRange(0,1)].play();
		
		//Sync
		parryScoreSync = parryScore || 0;
		scene.events.dispatch('playerparry',[thisPlayer.name, parryScore, thisPlayer.data.supermeter, game.Multiplayer.canExecute(thisPlayer)?'send':'no']);
		
		//Add score
		parryScore >= 100 && data.addScore('parry',1);
		
		thisPlayer.data.supermeter += parryScore || 0;
		thisPlayer.data.supermeter > thisPlayer.data.max_supermeter_score && (thisPlayer.data.supermeter = thisPlayer.data.max_supermeter_score);
		//Depending on the score, play either power up or full sfx
		thisPlayer.data.supermeter < thisPlayer.data.max_supermeter_score ? parryScore && parryPowerUpSfx[b5.Maths.randomRange(0,1)].play() :
		  parryPowerUpFullSfx.play();
		
		
		game.Flags.pausingEnabled = false;
		app.setTimeout(function() {
			world.active = true;
	  	//Dashing sets y gravity scale to 0, so if the player does a frame perfect dash and parry, it will send him flying. Preventing that:
    	thisPlayer.body.m_linearVelocity.y = !flags.dashing ? -thisPlayer.data.jumpSpeed*thisPlayer.data.parryJumpHeightMultiplier : 0;
    	flags.parrying = true;
    	flags.jumpState = 1; //Recover parry
    	thisPlayer.body.SetActive(!flags.shootingEX);
    	game.Flags.pausingEnabled = !data.players_dead;
    	scene.world.m_sleep = false;
    	//Continue parryActive until anim ends
    	atlas.playAnimWithEnd('jump_parry', function() {
    		thisPlayer.updateAnimations = true;
    	});
    	atlas.current_frame = currfr;
		}, 0.2);
	};
	
	return function(thisPlayer, flags, input, world, scene, game, data) {
		//This is a loop function
		//It will be called consecutively when loadingScreenOut
 	};
};