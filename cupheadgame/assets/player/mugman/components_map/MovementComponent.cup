return function(thisPlayer, flags, input, world, scene, game, data) {
	//Setup local variables here
	//This function will be called when player is first created
	//For executing actions when loading screen is being hidden,
	//add the method thisPlayer.onLoadingScreenOut = function(){...}
	//var myvar = flags.jumping
	var walk = false,
	lAngle = 0,
	atlas = thisPlayer.findActor("AtlasImage"),
	dustTime = 12,
	dustTimeCount = 0,
	dustX = 20,
	dustXm = 1,
	footstepSfx = (function() {
		for(var i = 0, s = []; i < scene.sounds.length; i++) 
			scene.sounds[i].name.startsWith('PlayerWorldmapFootstepSfx') && s.push(scene.sounds[i]);
		return s;
	})(),
	footstepBridgeSfx = (function() {
		for(var i = 0, s = []; i < scene.sounds.length; i++) 
			scene.sounds[i].name.startsWith('PlayerWorldmapFootstepBridgeSfx') && s.push(scene.sounds[i]);
		return s;
	})(),
	sfxFootstepTime = 17,
	sfxFootstepTimeCount = 0;
	
	return function(thisPlayer, flags, input, world, scene, game, data) {
		//This is a loop function
		//It will be called consecutively when loadingScreenOut
		var axis_x = flags.controllable ? Math.round(input.axis_x) : 0,
   	axis_y = flags.controllable ? Math.round(input.axis_y) : 0;
   	
    thisPlayer.body.m_linearVelocity.x = axis_x * thisPlayer.data.baseSpeed * (axis_x && axis_y ? .75 : 1);
    thisPlayer.body.m_linearVelocity.y = axis_y * thisPlayer.data.baseSpeed * (axis_x && axis_y ? .75 : 1);
    
    flags.walking = flags.controllable && (axis_x || axis_y);
    
    if(walk != flags.walking) {
    	walk = flags.walking;
    	thisPlayer.updateAnimations = true;
    }
    if(lAngle != thisPlayer.data.facingAngle) {
    	lAngle = thisPlayer.data.facingAngle;
    	thisPlayer.updateAnimations = true;
    }
    
    if(walk) {
    	dustTimeCount > dustTime ? (
    		dustTimeCount = 0,
    		dustXm = -dustXm,
    		data.spawnPlayerParticle('walkingDust', thisPlayer, {ox: dustX * dustXm})
    	) : dustTimeCount += game.speed;
    	
    	sfxFootstepTimeCount > sfxFootstepTime ? (
    		sfxFootstepTimeCount = 0,
    		//Play sfx
      	flags.inWood ? 
      	  footstepBridgeSfx[b5.Maths.randomRange(0,footstepBridgeSfx.length-1)].play() :
    		 	footstepSfx[b5.Maths.randomRange(0,footstepSfx.length-1)].play()
    	) : sfxFootstepTimeCount += game.speed;
    }
    
    //Facing and angle
    axis_x && (atlas.scale_x = atlas.scale_y * Math.sign(axis_x));
    (axis_x || axis_y) && (thisPlayer.data.facingAngle = b5.Maths.radToDeg(Math.atan2(axis_y, axis_x)));
    
	};
};
/**********#*#*#*#*#**#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#-#*#-#-#-#*#*#*#*#*#*#*#*#*#*#*#*#*#*#-#-#-#-#-#-#-#*/