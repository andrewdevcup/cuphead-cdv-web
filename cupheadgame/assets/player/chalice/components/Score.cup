return function(thisPlayer, flags, input, world, scene, game, data) {
	//Setup local variables here
	//This function will be called when player is first created
	//For executing actions when loading screen is being hidden,
	//add the method thisPlayer.onLoadingScreenOut = function(){...}
	//var myvar = flags.jumping
	
	var stat = data.Statistics,
	shootex = false,
	_super = false;
	
	return function(thisPlayer, flags, input, world, scene, game, data) {
		//This is a loop function
		//It will be called consecutively when loadingScreenOut
    
    if(shootex != flags.shootingEX) {
    	shootex = flags.shootingEX;
    	if(shootex) {
    		var max_score = thisPlayer.data.supermeter == thisPlayer.data.max_supermeter_score;
    	
    		if(!max_score) data.addScore('super',1);
    	}
    }
    
    if(_super != !!flags.SUPER) {
    	_super = !!flags.SUPER;
    	
    	if(_super) data.addScore('super',5);
    }
    
	};
};