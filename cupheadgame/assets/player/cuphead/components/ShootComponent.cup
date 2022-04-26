return function(thisPlayer, flags, input, world, scene, game, data) {
	//Setup local variables here
	//This function will be called when player is first created
	//For executing actions when loading screen is being hidden,
	//add the method thisPlayer.onLoadingScreenOut = function(){...}
	//var myvar = flags.jumping

	var shooting = false,
	shootingdiag = false,
	trigger = false;
	
	thisPlayer.weapons = [];
	
	thisPlayer.setWeapon = function(name, index) {
		thisPlayer.stopShooting && thisPlayer.stopShooting();
		thisPlayer.equipedWeapons[index] = name;
		thisPlayer.weapons[index] = new data.Weapon(name, thisPlayer);
		
		//Sync Guest
		game.Multiplayer.isHost && game.Multiplayer.sendToGuest('DISPATCH_EVENT',['playersetweapon',[thisPlayer.name,name,index,1]]);
	}
	
	scene.events.on('playersetweapon', function(evtdata) {
		if(evtdata[3] && game.Multiplayer.isGuest && thisPlayer.name == evtdata[0]) {
			thisPlayer.setWeapon(evtdata[1],evtdata[2]);
		}
	});
  
  for(var i=0;i<thisPlayer.equipedWeapons.length;i++)
	  thisPlayer.setWeapon(thisPlayer.equipedWeapons[i],i);

	thisPlayer.stopShooting = function(byDamage) {
		this.weapons[flags.weaponIndex].data.onShootingStopped(byDamage ? this : null);
	}
	
	thisPlayer.onRemove = thisPlayer.stopShooting;
	
	//Disable damage on Guest
	if(game.Multiplayer.isGuest) thisPlayer.data.damageMultiplier = 0;

	return function(thisPlayer, flags, input, world, scene, game, data) {
		//This is a loop function
		//It will be called consecutively when loadingScreenOut
		if (flags.controllable) {
			var axis_x = Math.round(input.axis_x),
			axis_y = Math.round(input.axis_y);

			flags.shooting = !!input.B && !flags.shootingEX && flags.canShoot;
			flags.shootingDiagonal = flags.shooting && (axis_y < 0 && axis_x);

			//Shooting state change
			if (shooting != flags.shooting) {
				shooting = flags.shooting;

				!flags.inAir && (thisPlayer.updateAnimations = true);
				if (!shooting) {
					thisPlayer.weapons[flags.weaponIndex].data.onShootingStopped();
				}
			}



			if (shootingdiag != flags.shootingDiagonal) {
				shootingdiag = flags.shootingDiagonal;

				!flags.inAir && (thisPlayer.updateAnimations = true);
			}

			if (flags.shooting || flags.shootingDiagonal) {
				thisPlayer.weapons[flags.weaponIndex].updateBehavior();
			}
		}

	};
};