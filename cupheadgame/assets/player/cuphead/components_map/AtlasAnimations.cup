return function(thisPlayer, flags, input, world, scene, game, data) {
	//Setup local variables here
	//This function will be called when player is first created
	//For executing actions when loading screen is being hidden,
	//add the method thisPlayer.onLoadingScreenOut = function(){...}
	//var myvar = flags.jumping
	var angleToStringDeg = function(d) {
		switch(d) {
			case 0:
			case 180:
			case -180:
				return "straight";
			case -90:
				return "up";
			case 90:
				return "down";
			case 45:
			case 135:
				return "diag_down";
			case -45:
			case -135:
				return "diag_up";
		  default:
		  	return "down";
		}
	},
	atlas = thisPlayer.findActor("AtlasImage"),
	blinkInterval = 8,
	blinkTime = 0;
	
	atlas.onAnimRepeat = function(a) {
		if(blinkTime < blinkInterval) blinkTime++;
		else {
			blinkTime = 0;
			switch(this.current_anim) {
				case "idle_down":
					this.playAnimWithEnd('idle_down_blink',()=>{
						atlas.playAnim('idle_down',true)
					});
					break;
				case "idle_straight":
					this.playAnimWithEnd('idle_straight_blink',()=>{
						atlas.playAnim('idle_straight',true)
					});
					break;
				default: delete this.onAnimEnd;
			}
		}
	}
	
	return function(thisPlayer, flags, input, world, scene, game, data) {
		//This is a loop function
		//It will be called consecutively when loadingScreenOut
    if (thisPlayer.updateAnimations) {
			thisPlayer.updateAnimations = false;
			
			var cf = atlas.current_frame;
			atlas.playAnim(
				(flags.walking ? 'walk_' : 'idle_') + angleToStringDeg(thisPlayer.data.facingAngle),
				true);
			flags.walking && thisPlayer.setTimeout(()=>{atlas.current_frame = cf},app.dt);
    }
	};
};