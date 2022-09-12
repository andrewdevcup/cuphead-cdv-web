return function(thisPlayer, flags, input, world, scene, game, data) {
	//Setup local variables here
	//This function will be called when player is first created
	//For executing actions when loading screen is being hidden,
	//add the method thisPlayer.onLoadingScreenOut = function(){...}
	//var myvar = flags.jumping
	
	var atlas = thisPlayer.findActor("AtlasImage");
	
	atlas.onAnimStart = function(e) {
		//Set the scale down a bit for boil animations
		this.depth = e.indexOf('power_up') != -1 || 
		e.indexOf('intro_b') != -1 ? 1.1 : 0;
		this.dirty();
	};
	
	return function(thisPlayer, flags, input, world, scene, game, data) {
		//This is a loop function
		//It will be called consecutively when loadingScreenOut
    
	};
};