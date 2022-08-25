return function(thisPlayer, flags, input, world, scene, game, data) {
	//Setup local variables here
	//This function will be called when player is first created
	//For executing actions when loading screen is being hidden,
	//add the method thisPlayer.onLoadingScreenOut = function(){...}
	//var myvar = flags.jumping
	var last_scale = Math.sign(data.player.spawn.facing),
	running = false,
	dustTime = 0,
	atlas = thisPlayer.findActor("AtlasImage");
	
	return function(thisPlayer, flags, input, world, scene, game, data) {
		//This is a loop function
		//It will be called consecutively when loadingScreenOut

		//Move physics body left or right on axis_x
		//Flip the player to face in the direction
		//Disable on lock mechanic
		//Also duck mechanic
		
		var axis_x = flags.controllable ? Math.round(input.axis_x) : flags.move_x_axis;
		
		thisPlayer.data.facing = Math.sign(atlas.scale_x);

		flags.running = !!axis_x && !flags.locking && !flags.inAir && !flags.dashing && !flags.ducking;
		flags.standing = !flags.running;
		
		var runSpeed = axis_x * thisPlayer.data.baseSpeed,
		wallCollSide = thisPlayer.data.WallCollisionSide;
		
		if(!flags.dashing && !flags.shootingEX) thisPlayer.body.m_linearVelocity.x = 
		  flags.locking || flags.ducking ? 0 : (
		  	-wallCollSide != Math.sign(runSpeed) ? runSpeed : 0
		  );
		  
		if(!flags.dashing) { 
			atlas.scale_x = (axis_x || last_scale) * atlas.scale;
	  	thisPlayer.data.facing = atlas.scale_x;
		}
		
		//Run state change
		if(flags.running != running) {
			running = flags.running;
			!flags.inAir && !flags.dashing && (thisPlayer.updateAnimations = true);
		}
		
		//Spawn particles
		if(flags.running && !flags.inAir && !flags.dashing) {
			dustTime < 0.51 ? dustTime += app.dt : (
				dustTime = 0,
				data.spawnPlayerParticle('runningDust',thisPlayer),
				thisPlayer.setTimeout(function() {
					!flags.inAir && data.spawnPlayerParticle('runningDust',thisPlayer);
				}, 0.186)
			);
		}
		
		//Player has changed side
		axis_x != 0 && (last_scale = axis_x);
	};
};