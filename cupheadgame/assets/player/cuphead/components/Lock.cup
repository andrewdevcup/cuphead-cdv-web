return function(thisPlayer, flags, input, world, scene, game, data) {
	//Setup local variables here
	//This function will be called when player is first created
	//For executing actions when loading screen is being hidden,
	//add the method thisPlayer.onLoadingScreenOut = function(){...}
	//var myvar = flags.jumping

	var lock = false,
	angle = 0;

	return function(thisPlayer, flags, input, world, scene, game, data) {
		//This is a loop function
		//It will be called consecutively when loadingScreenOut
		if (flags.controllable) {
			flags.locking = !!input.R;

			var axis_x = Math.round(input.axis_x),
			axis_y = Math.round(input.axis_y),
			sh_ang = Math.atan2(axis_y, axis_x);

			thisPlayer.data.shootAngle = (!flags.ducking && sh_ang) || Math.PI* (thisPlayer.data.facing <= 0?1: 0);

			//For some weird reason, the angle changes even if axis_x is rounded to 0, like it was never rounded
			//So prevent doing that
			Math.abs(sh_ang) == Math.PI && thisPlayer.data.facing > 0 && (thisPlayer.data.shootAngle = 0);

			if (lock != flags.locking) {
				lock = flags.locking;

				//Don't update when already aiming up
				axis_y >= 0 && !flags.inAir && !flags.dashing && (thisPlayer.updateAnimations = true);
			}

			if (angle != sh_ang) {
				angle = sh_ang;

				//Don't update when it's running
				!flags.running && !flags.inAir && !flags.dashing && !flags.ducking && (thisPlayer.updateAnimations = true);
			}
		} else if(flags.locking) flags.locking = false;
		
	};
};