return function(thisPlayer, flags, input, world, scene, game, data) {
	//Setup local variables here
	//This function will be called when player is first created
	//For executing actions when loading screen is being hidden,
	//add the method thisPlayer.onLoadingScreenOut = function(){...}
	//var myvar = flags.jumping

	var dash = false,
	dashtime = 0,
	recoil = false,
	stX = false,
	dashes = 0,
	air = false,
	prevHit = flags.hittable;
	
	//Sfx 
	var dashsfx = [
		scene.findResource('PlayerDashSfx1','sound'),
		scene.findResource('PlayerDashSfx2','sound'),
		scene.findResource('PlayerDashSfx3','sound')
	];

	//kinematic bodies doesn't have an active	collision
	//so when dashing the player will go trough walls
	//adding a collision detection to walls by detecting their tag
	//and setting x speed to 0
	thisPlayer.data.WallCollisionSide = 0;
	
	thisPlayer.resetDashes = function() {
		dashes = 0;
		dashtime = 0;
	}
	
	thisPlayer.addDashParticles = function() {
		var p = new	b5.Actor();
		p.atlas = scene.findResource('ChaliceFXAtlas','brush');
		p.playAnimWithEnd('dash_pink',f => {
			thisPlayer._dashParticle = null;
			f.destroy();
		});
		thisPlayer.addActor(p);
		p._scale = thisPlayer.Sprite._scale;
		p._scale_x = thisPlayer.Sprite.scale_x;
		this._dashParticle = p;
		p.setOrigin(thisPlayer.Sprite.ox,thisPlayer.Sprite.oy);
		
		//Sparkles
		var s = new b5.Actor();
		s.atlas = p.atlas;
		s.playAnimWithEnd('dash_sparkles', f => f.destroy());
		thisPlayer.parent.addActor(s);
		s.setPosition(thisPlayer.x,thisPlayer.y);
		s.layer = thisPlayer.layer + 1;
		s._scale = p._scale;
		s._scale_x = p.scale_x;
	}


	return function(thisPlayer, flags, input, world, scene, game, data) {
		//This is a loop function
		//It will be called consecutively when loadingScreenOut
		//Dash once
		if (input.X && !stX && flags.controllable) {
			stX = true;
			dashes < 1 && (flags.dashing = true,
				dashes++
			);

		} else if (stX && !input.X) stX = false;


		//On dash state change
		if (dash != flags.dashing && !recoil && !flags.damageHit) {
			dash = flags.dashing;

			if (flags.dashing) {
				thisPlayer.body.m_gravityScale.y = 0;
				thisPlayer.body.m_linearVelocity.y = 0;
				thisPlayer.body.m_linearVelocity.x = thisPlayer.data.WallCollide ? 0: (
					Math.sign(thisPlayer.data.facing) * thisPlayer.data.dashSpeed
				);
				thisPlayer.updateAnimations = true;
				flags.parryActive = false;
				
				//Play sfx 
				dashsfx[b5.Maths.randomRange(0,2)].play();
				
				//Invincibility roll
				if(flags.ducking) {
					prevHit = flags.hittable;
					flags.hittable = false;
					flags.rolling = true;
				}
				else {
					//Spawn particle
		  	  data.spawnPlayerParticle('dashDust',thisPlayer);
		  	  thisPlayer.addDashParticles();
					flags.parryActive = true; //Parry dash
				}
				
			}
			else {
				//Stopped dashing
				flags.hittable = prevHit;
				thisPlayer.setTimeout(x=>flags.rolling = false,app.dt);
				flags.parryActive = false;
			}

			if (!flags.inAir) dashes = 0;
		}

		//On air state change

		if (air != flags.inAir) {
			air = flags.inAir;
			//Reset dash in ground
			if (!flags.inAir && !flags.dashing) {
				dashes = 0;
				dashtime = 0;
			}
		}

		if (flags.dashing) {
			dashtime += app.dt;
			if (dashtime > thisPlayer.data.dashTime) {
				recoil = true;
				thisPlayer.body.m_gravityScale.y = 1;
				thisPlayer.setFixture();
				(flags.inAir || !flags.running) && (thisPlayer.updateAnimations = true);
				flags.dashing = false;
				flags.parryActive = false;
				thisPlayer.setTimeout(function() {
					dashtime = 0;
					recoil = false;
				}, thisPlayer.data.dashRecoil);
			}
		}

	};
};