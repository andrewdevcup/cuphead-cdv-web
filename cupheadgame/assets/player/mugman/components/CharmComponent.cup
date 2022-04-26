return function(thisPlayer, flags, input, world, scene, game, data) {
	//Setup local variables here
	//This function will be called when player is first created
	//For executing actions when loading screen is being hidden,
	//add the method thisPlayer.onLoadingScreenOut = function(){...}
  
  thisPlayer.charm = new data.Charm(thisPlayer.equipedCharm, thisPlayer);
	
	return function(thisPlayer, flags, input, world, scene, game, data) {
		//This is a loop function
		//It will be called consecutively when loadingScreenOut
    thisPlayer.equipedCharm != "empty" && thisPlayer.charm.updateBehavior();
	};
};