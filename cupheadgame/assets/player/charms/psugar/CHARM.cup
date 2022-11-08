return function(thisPlayer, flags, world, scene, game, charmData) {
	//Setup actions
	let air = false,
	pSParry = false,
	pDash = false,
	sugarActive = false,
	shootEX = false,
	lasthp = flags.heartPoints;
	
	return {
		onTick: function() {
			//Upddate
			
			if(lasthp != flags.heartPoints) {
				lasthp = flags.heartPoints;
				
				thisPlayer.hitboxes[5].hitbox_active = false;
				sugarActive = false;
				return;
			}
			
			if(flags.inAir != air) {
				air = flags.inAir;
				
				if(air && !flags.shootingEX && !flags.damageHit && flags.heartPoints > 0) {
					sugarActive = true;
					thisPlayer.setTimeout(m=>
					  !flags.damageHit && !flags.shootingEX && thisPlayer.Sprite.playAnim('jump_parry',true), app.dt*2);
					thisPlayer.hitboxes[5].hitbox_active = true;
				}
				else thisPlayer.hitboxes[5].hitbox_active = false;
			}
			
			if(flags.dashing != pDash && lasthp > 0) {
				pDash = flags.dashing;
				
				pDash ? (sugarActive && (
					sugarActive = false,
					thisPlayer.hitboxes[5].hitbox_active = false
				))
				: flags.inAir && !flags.successfulParry && (
					//Restore sugar after dash
					sugarActive = true,
					thisPlayer.hitboxes[5].hitbox_active = true,
					thisPlayer.setTimeout(m=>
					!flags.damageHit && !flags.shootingEX && thisPlayer.Sprite.playAnim('jump_parry',true), app.dt*2)
				)
			}
			
			if(flags.successfulParry != pSParry) {
				pSParry = flags.successfulParry;
				
				if(pSParry && sugarActive) {
					sugarActive = false;
					thisPlayer.hitboxes[5].hitbox_active = false;
				}
				
			}
			
			if(flags.shootingEX != shootEX) {
				shootEX = flags.shootingEX;
				
				if(sugarActive && shootEX) {
					sugarActive = false;
					thisPlayer.hitboxes[5].hitbox_active = false;
				}
				
				if(!shootEX && !sugarActive && flags.inAir && !flags.successfulParry) {
					//Restore sugar after	ex
					sugarActive = true;
					thisPlayer.hitboxes[5].hitbox_active = true;
				}
				
			}
			
		}
	};
};