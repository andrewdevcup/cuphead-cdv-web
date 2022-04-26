return function(thisPlayer, flags, input, world, scene, game, data) {
	//Setup local variables here
	//This function will be called when player is first created
	//For executing actions when loading screen is being hidden,
	//add the method thisPlayer.onLoadingScreenOut = function(){...}
	//var myvar = flags.jumping
	
	var L_press = false,
	nextWeapon = function() {
		var e = thisPlayer.equipedWeapons,
		t = flags.weaponIndex+1;
		return e[t] ? e[t] : e[0];
	};
	
	scene.events.on('playerchangeweapon', evtdata => {
		if(evtdata[2] && game.Multiplayer.isGuest && thisPlayer.name == evtdata[0]) {
			thisPlayer.stopShooting();
			flags.weaponIndex = evtdata[1];
		}
	});
	
	return function(thisPlayer, flags, input, world, scene, game, data) {
		//This is a loop function
		//It will be called consecutively when loadingScreenOut
    if(flags.controllable) {
    	if(input.L != L_press) {
    		L_press = input.L;

    		if(L_press && nextWeapon() != "empty" && !game.Multiplayer.isGuest) {
    			thisPlayer.stopShooting(); //Stop weapon sfx
    			flags.weaponIndex < thisPlayer.weapons.length && flags.weaponIndex++;
    			!thisPlayer.weapons[flags.weaponIndex] && (flags.weaponIndex = 0);
    			
    			scene.events.dispatch('playerchangeweapon',[thisPlayer.name, flags.weaponIndex,0]);
    			
    			game.Multiplayer.isHost && game.Multiplayer.sendToGuest('DISPATCH_EVENT',['playerchangeweapon',[thisPlayer.name,flags.weaponIndex,1]])
    		}
    	}
    }
    
	};
};