return function(thisPlayer, flags, input, world, scene, game, data) {
	//Setup local variables here
	//This function will be called when player is first created
	//For executing actions when loading screen is being hidden,
	//add the method thisPlayer.onLoadingScreenOut = function(){...}
	//var myvar = flags.jumping
	var btnX = 0;
	
	return function(thisPlayer, flags, input, world, scene, game, data) {
		//This is a loop function
		//It will be called consecutively when loadingScreenOut
    if(input.X != btnX && flags.controllable) {
    	btnX = input.X;
    	
    	if(btnX) {
    		//Open equip menu
    		scene.data.EquipCardsManager.show();
    	}
    }
    
	};
};