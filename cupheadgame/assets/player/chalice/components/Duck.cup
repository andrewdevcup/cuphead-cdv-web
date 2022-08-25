return function(thisPlayer, flags, input, world, scene, game, data) {
	//Setup local variables here
	//This function will be called when player is first created
	//For executing actions when loading screen is being hidden,
	//add the method thisPlayer.onLoadingScreenOut = function(){...}
	//var myvar = flags.jumping
	
	var duck = false,
	sx = 0,
	atlas = thisPlayer.findActor("AtlasImage");
	
	return function(thisPlayer, flags, input, world, scene, game, data) {
		//This is a loop function
		//It will be called consecutively when loadingScreenOut

    var axis_y = flags.controllable ? Math.round(input.axis_y) : 0;
    
    flags.ducking = axis_y > 0 && !flags.inAir && !flags.locking;
    
    if(duck != flags.ducking) {
    	duck = flags.ducking;
    	
    	!flags.inAir && !flags.dashing && (thisPlayer.updateAnimations=true);
      
    }
    
    if(sx != atlas.scale_x && !flags.running && !flags.locking) {
    	sx = atlas.scale_x;
    	duck = !flags.ducking;
    }
 
	};
};