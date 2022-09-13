return function(thisPlayer, flags, input, world, scene, game, data) {
	//Setup local variables here
	//This function will be called when player is first created
	//For executing actions when loading screen is being hidden,
	//add the method thisPlayer.onLoadingScreenOut = function(){...}
	//var myvar = flags.jumping

	var atlas = thisPlayer.findActor("AtlasImage"),
	scale = atlas.scale_x,
	ducking = false,
	duckchange = false,
	lockchange = false,
	locking = false,
	flipchange = false,
	shooting = false,
	shootchange = false,
	playAnimAfter = function(anim1, anim2, func,repeat) {
		repeat === undefined && (repeat = true);
		atlas.frames_repeat = false;
		atlas.playAnimWithEnd(anim1, function() {
			atlas.playAnim(anim2, repeat);
			func && func();
		});
	};
	
	thisPlayer.data.triggerShot = function() {
		this.animTriggerShot = true;
	}

	return function(thisPlayer, flags, input, world, scene, game, data) {
		//This is a loop function
		//It will be called consecutively when loadingScreenOut

		if (thisPlayer.updateAnimations) {
			thisPlayer.updateAnimations = false;

			//Some variables
			//There's an extra detail when you flip you character
			//Animations for that transition
			var flipped = scale != atlas.scale_x ? (scale = atlas.scale_x, true):false,
			axis_x = Math.round(input.axis_x),
			axis_y = Math.round(input.axis_y),
			vars = thisPlayer.data;
			
			//Damage animation
			if(flags.damageHit) {
				if(flags.heartPoints > 0) {
	  			atlas.current_anim != 'enemy_hit' && atlas.playAnimWithEnd('enemy_hit',()=>{
		  			thisPlayer.updateAnimations=true;
		  		  flags.controllable = true;
		  		  flags.damageHit = false;
		  		  thisPlayer.body.m_gravityScale.y = 1;
     				thisPlayer.body.m_gravityScale.x = 1;
	  			});
				}
				else {
					atlas.playAnimWithEnd('enemy_hit_death',()=>{
					});
				}
				return;
			}
			
			if(flags.shootingEX) {
				//Switch animations, in ground or in air.
				var air = flags.inAir ? '_air' : '_ground';
			  atlas.current_anim.indexOf('ex') == -1 && atlas.playAnimWithEnd(!axis_y ? "ex_straight"+air:
				  axis_y < 0 ? axis_x ? "ex_diag_up"+air: "ex_up"+air:
					axis_y > 0 ? axis_x ? "ex_diag_down"+air: "ex_down"+air:
					"ex_straight"+air,()=>{
						thisPlayer.updateAnimations=true;
						thisPlayer.onEXAnimEnded();
					});
				return;
			}
			
			//Stand animation (default)
			if (!flags.running && !flags.ducking && !flags.locking && !flags.dashing)
				flags.shooting ? vars.animTriggerShot ? playAnimAfter('shooting_straight', 'shooting_straight_boil'): atlas.playAnim('shooting_straight_boil', true): atlas.playAnim("idle_stand", true);
     
     //Dashing animation
			if (flags.dashing) {
				atlas.current_anim != "dash" && atlas.playAnim("dash"); return
			}
      
      //Ducking state changed?
			duckchange = ducking != flags.ducking ? (ducking = flags.ducking, true): false;
			shootchange = shooting != flags.shooting ? (shooting = flags.shooting, true): false;
			//If ducking state changed, state is not ducking and is shooting
			duckchange && flags.shooting && !flags.ducking && (thisPlayer.updateAnimations=true)
			
			if (flags.ducking) {
				flipped ? playAnimAfter("duck_tr_flip", flags.shooting ? 'shooting_duck_boil': "duck", function() {
					thisPlayer.updateAnimations = true;
					flipchange = true;
				}): playAnimAfter(duckchange ? flags.shooting ? 'duck_tr_shoot' : "duck_tr" : flags.shooting?'shooting_duck_boil': !flipchange && !shootchange ?'duck_tr':'duck', flags.shooting ? 'shooting_duck_boil': "duck");
				vars.animTriggerShot && flags.shooting && playAnimAfter('shooting_duck','shooting_duck_boil');
			flipchange = false;
			} else if (!flags.ducking && duckchange && !flags.inAir && !flags.shooting) {
				playAnimAfter("duck_tr_bck" + (flags.locking?'': '_idle'), "idle_stand", ()=> {
					thisPlayer.updateAnimations = true
				}); return
			}

			if (!flags.inAir && !flags.dashing) {
				//Running animations
				if (flags.running) {
					var cf = atlas.current_frame;
					//Wait one frame for flip animations
					/*Running normal*/	if (!flags.shooting) flipped ? thisPlayer.setTimeout(()=>{playAnimAfter("run_flip", "run")},app.dt): atlas.playAnim("run", true);
					/*Running shoot diagonal*/  else if (flags.shootingDiagonal) flipped ? thisPlayer.setTimeout(()=>{playAnimAfter("shooting_run_diag_flip", "shooting_run_diag")},app.dt): atlas.playAnim("shooting_run_diag", true);
					/*Running shoot straight*/  else flipped ? thisPlayer.setTimeout(()=>{playAnimAfter("shooting_run_flip", "shooting_run")},app.dt): atlas.playAnim("shooting_run", true);
					atlas.current_frame = cf;
				} else if (flags.locking && !flags.ducking && !duckchange) {
					//Locking animations
					flags.shooting ?
					vars.animTriggerShot ?
					//TriggerShot
					atlas.playAnimWithEnd(
						!axis_y ? "shooting_straight":
						axis_y < 0 ? axis_x ? "shooting_diag_up": "shooting_up":
						axis_y > 0 ? axis_x ? "shooting_diag_down": "shooting_down":
						"shooting_straight",()=>{thisPlayer.updateAnimations=true}):
					//Shooting
					atlas.playAnim(
						!axis_y ? "shooting_straight_boil":
						axis_y < 0 ? axis_x ? "shooting_diag_up_boil": "shooting_up_boil":
						axis_y > 0 ? axis_x ? "shooting_diag_down_boil": "shooting_down_boil":
						"shooting_straight_boil", true):
					//Locking
					atlas.playAnim(
						!axis_y ? "aim_straight":
						axis_y < 0 ? axis_x ? "aim_diag_up": "aim_up":
						axis_y > 0 ? axis_x ? "aim_diag_down": "aim_down":
						"aim_straight", true);

				} else if (axis_y < 0 && !axis_x) {
					//Aim up
					!vars.animTriggerShot ? atlas.playAnim(flags.shooting ? "shooting_up_boil" : "aim_up", true)
					  : flags.shooting ? playAnimAfter('shooting_up', 'shooting_up_boil') : atlas.playAnim('aim_up',true);
				}

			} else if (flags.parryActive) playAnimAfter("jump_parry", "jump", function() {
					flags.parryActive = false});
			else atlas.playAnim("jump", true);
      
      //Reset triggerShot
			vars.animTriggerShot = false;
			
		}
		
	};
};