return function(thisPlayer, flags, world, scene, game, wpnData) {
	/* Setup */

	var thisAtlas = scene.findResource('LobberAtlas', 'brush'),
	viewLayer = world.findActor(thisPlayer.parent.name, true),
	body = wpnData.body,
	shootTime = 0,
	shootChange = false,
	shootAngle = 0,
	time = 0,
	thisWeapon = null,
	name = "exploder",

	sfxBulletDeath = scene.findResource('WeaponDeathSfx', 'sound'),
	sfxBulletHit = scene.findResource('ShootHitSfx', 'sound'),
	sfxBulletShoot = [
		scene.findResource('LobberShootSfx1','sound'),
		scene.findResource('LobberShootSfx2','sound'),
		scene.findResource('LobberShootSfx3','sound'),
		scene.findResource('LobberShootSfx4','sound'),
		scene.findResource('LobberShootSfx5','sound')
	],
	sfxEXDeath = [
		scene.findResource('ShmupBombExplodeSfx1','sound'),
		scene.findResource('ShmupBombExplodeSfx2','sound'),
		scene.findResource('ShmupBombExplodeSfx3','sound')
	];
	
	/*Weapon behaviors*/
	var weapon = {
		Spawn: function(pos, angle) {
			/*Spawning normal bullet(s)*/

			var bullet = new b5.Actor(),
			bulletsns = new b5.Actor();
		//	bullet.radius = wpnData.body.hitbox.size;
			bullet.atlas = thisAtlas;
			bullet.x = thisPlayer.x + pos[0];
			bullet.y = thisPlayer.y + pos[1];
			bullet.despawnTime = wpnData.despawnTime;
			bullet.damage = wpnData.damage * thisPlayer.data.damageMultiplier;
			bullet.time = 0;
			bullet.tag = thisPlayer.data.bulletTag;
			bullet.tags = [bullet.tag];
	//		bullet.angle = angle;
			bullet.layer = thisPlayer.layer-1;
			bullet.supermeter_score = wpnData.supermeter_score;
			
			bullet.inFloor = false;
			bullet.pStFloor = false;
			bullet.bounces = 0;
			bullet.airTime = 0;
			
			bullet.playAnimWithEnd('lobber_start',b=>b.playAnim('lobber_loop',true));

			viewLayer.addActor(bullet);
			
			bulletsns.setPosition(bullet.x,bullet.y);
			bullet.parent.addActor(bulletsns);

			bullet.destroyBullet = function(timeout) {
				this.tasks.clear();
				if(!timeout) thisWeapon.SpawnParticle("bulletDeath", [this.x,this.y]);
				this.sensor.release(true);
	      this.release(true);
			}

			bullet.initBody(body.bodyType, body.fixedRotation, true);
			bulletsns.initBody('collider', true);
			
			var fxt = {
				type: b5.Shape[body.shape],
				width: body.size[0] + 5,
				height: body.size[1],
				friction: body.friction || 0,
				restitution: body.restitution || 0,
				density: body.density || 1,
				is_sensor: true
			}
			
			bulletsns.addFixture(fxt);
			bulletsns.body.m_invMass = 1e-6;
			
			fxt.is_sensor = false;
			fxt.collision_category = game.BULLET,
			fxt.collision_mask = game.FLOOR;
			fxt.width -= 5;
				
			bullet.addFixture(fxt);
			bullet.onPositionSet = function() {
				this.sensor.setPosition(this.x,this.y);
			}
			
			bullet.sensor = bulletsns;
			
			let up_angle = angle != 0 && Math.abs(angle) != Math.PI ? 0 : (thisPlayer.data.facing) * b5.Maths.DtoRad * wpnData.up_angle;
			
			bullet.body.m_linearVelocity.x = Math.cos(angle + up_angle) * (up_angle != 0 ? wpnData.speed : wpnData.diag_speed);
		  bullet.body.m_linearVelocity.y = Math.sin(angle + up_angle)* (up_angle != 0 ? wpnData.speed : wpnData.diag_speed)
		  
		  bullet.body.m_gravityScale.y = body.gravity_scale;
		  
			bullet.onTick = function() {
				this.time += app.dt;
				this.airTime += app.dt;
				if (this.time > this.despawnTime) {
					this.destroyBullet(true);
					return;
				}
				
				this.inFloor = false;
				
				//Check overlaps
				var ols = this.sensor.A_overlaps;
				for (var i = 0; i < ols.length; i++)
				if (ols[i]) {
					var l = ols[i];
					if (ols[i].tags.indexOf(thisPlayer.data.enemy) != -1) {
						//Enemy was hit
						if (!this.destroyed) {
							this.destroyBullet();
							l.onBulletHit && l.onBulletHit(this);
							this.destroyed = true;
							this.onEnemyHit && this.onEnemyHit(l);
							sfxBulletHit.play();

							//Add score to player
							thisPlayer.data.supermeter < thisPlayer.data.max_supermeter_score && (thisPlayer.data.supermeter += this.supermeter_score);
							
							//Add score to level
							scene.data.Statistics.damage_given += this.damage;
						}
						return;
					}
					
					if( l.isFloor ) {
						this.inFloor = true;
						break;
					}
				}
				
				if(this.inFloor != this.pStFloor ) {
					this.pStFloor = this.inFloor;
					if(this.inFloor) {
						this.body.SetActive(false);
						this.playAnimWithEnd(this.airTime >= 0.3 ? 'bounce_high':'bounce_low', f => f.playAnim('lobber_loop',true));
						this.setTimeout(f => f.data.body.SetActive(true), 2/60);
						this.bounces++;
						this.airTime = 0;
						this.bounces >= wpnData.max_bounce && this.destroyBullet();
					}
				}
				
			}

			//	scene.data.playerBullets.push(bullet);

		},
		SpawnParticle: function(type, pos, optTarget) {
			/*Bullet particle*/
			switch (type) {
				case "bulletSpawn":
					var p = new b5.Actor;
					p.atlas = thisAtlas;
					p.rotation = Math.PI * b5.Maths.randomRange(-1, 1, true);
					p.setPosition(pos[0], pos[1]);
					p.layer = thisPlayer.layer + (thisPlayer.data.shootAngle == b5.Maths.degToRad(90) || flags.ducking? 1: 0);
					thisPlayer.parent.addActor(p);
					p._scale = 0.92;
					p.playAnim('spark');
					p.center_atlas = true;
					p.tags = ["playerParticle"];
					p.onAnimEnd = p.destroy;
					p.spawned_when_running = flags.running;
					p.facing = thisPlayer.data.facing;

					//Follow player when running
					p.onTick = function() {
						var so = thisPlayer.data.shootOffset;
						thisPlayer.data.facing == this.facing &&
						this.spawned_when_running && flags.running &&
						!flags.inAir && p.setPosition(thisPlayer.x + so[0], thisPlayer.y + so[1]);
					}
					break;
				case "bulletDeath":
					var p = new b5.Actor;
			  	p.atlas = thisAtlas;
					p.setPosition(pos[0], pos[1]);
					p.rotation = Math.PI * b5.Maths.randomRange(-1, 1, true);
					p.layer = thisPlayer.layer + 1; 
					thisPlayer.parent.addActor(p);
					p._scale = wpnData.scale;
					p.playAnimWithEnd('lobber_death',f=>f.destroy());
					p.tags = ["playerParticle"];
					break;
				case "exDeath":
					var p = new b5.Actor;
			  	p.atlas = thisAtlas;
					p.setPosition(pos[0], pos[1]);
					p.layer = thisPlayer.layer + 1; 
					thisPlayer.parent.addActor(p);
					p._scale = 1.05;//wpnData.scale;
					p.playAnimWithEnd('ex_death',f=>f.destroy());
					p.tags = ["playerParticle"];
					break;
				case "exFX":
					var p = new b5.Actor;
			  	p.atlas = thisAtlas;
					p.setPosition(pos[0], pos[1]);
					p.layer = thisPlayer.layer;
					thisPlayer.parent.addActor(p);
					p.fx = ['a','b','c'][b5.Maths.randomRange(0,2)];
					p.playAnimWithEnd('ex_fx_'+ p.fx,f=>f.destroy());
					p.tags = ["playerParticle"];
					break;
			}
		},
		SpawnEX: function(pos, angle) {
			/*Spawning EX bullet(s)*/
			//Actor with kinematic body
			var exb = new b5.Actor();
			exb.atlas = thisAtlas;
			exb.radius = wpnData.body.ex.hitbox.size;
			exb.x = thisPlayer.x + pos[0];
			exb.y = thisPlayer.y + pos[1];
			exb.despawnTime = wpnData.ex.despawnTime;
			exb.damage = wpnData.ex.damage * thisPlayer.data.damageMultiplier;
			exb.time = 0;
			//	exb.fill_style = 'transparent';
			exb.tag = thisPlayer.data.bulletTag;
			exb.tags = [exb.tag];
			//exb.bulletsId = scene.data.playerBullets.length;
			exb.layer = thisPlayer.layer+2;
			exb.supermeter_score = 0;
			
			exb.playAnim('ex_loop',true);

			viewLayer.addActor(exb);
			exb._layer = thisPlayer.layer+2; //wpnData.body.ex.sub_layer;
		//	viewLayer.order_changed = true;

			exb.initBody(body.ex.bodyType, body.ex.fixedRotation, true);

			exb.addFixture({
				type: b5.Shape[body.ex.shape],
				width: body.ex.size[0],
				height: body.ex.size[1],
				friction: body.ex.friction || 0,
				restitution: body.ex.restitution || 0,
				density: body.ex.density || 1,
				is_sensor: true
		});

	//	exb.body.m_linearVelocity.x = Math.cos(angle)*wpnData.ex.speed;
	//	exb.body.m_linearVelocity.y = Math.sin(angle)*wpnData.ex.speed;
	
		let up_angle = angle != 0 && Math.abs(angle) != Math.PI ? 0 : (thisPlayer.data.facing) * b5.Maths.DtoRad * wpnData.up_angle;
			
		exb.body.m_linearVelocity.x = Math.cos(angle + up_angle) * wpnData.ex.speed;
		exb.body.m_linearVelocity.y = Math.sin(angle + up_angle)* wpnData.ex.speed;
		  
	  exb.body.m_gravityScale.y = body.ex.gravity_scale;
		
		exb.destroyBullet = function(timeout,impactGround) {
			if(!timeout) {
				thisWeapon.SpawnParticle("exDeath", [this.x,this.y+(impactGround	? this.radius : 0)]);
				
				sfxEXDeath[b5.Maths.randomRange(0,2)].play();
			}
			this.release(true);
		}
		
		//Spawn fx particles
		exb.setInterval(f => thisWeapon.SpawnParticle("exFX", 
		  [ f.data.x + b5.Maths.randomRange(-25,25.0),
		    f.data.y + b5.Maths.randomRange(-25,25) ]
		), 0.1);
	
		exb.onTick = function() {
			this.time += app.dt;
			if (this.time > this.despawnTime) {
				this.destroyBullet(true);
				return;
			}

			//Check overlaps
			var ols = this.A_overlaps; 
			for (var i = 0; i < ols.length; i++)
				if (ols[i]) {
					var l = ols[i];
				if (ols[i].tags.indexOf(thisPlayer.data.enemy) != -1) {
					//Enemy was hit
					ols[i].onBulletHit && ols[i].onBulletHit(this);
					this.onEnemyHit && this.onEnemyHit(ols[i]);
					//Add score to level
					scene.data.Statistics.damage_given += this.damage;
						
					this.destroyBullet();
					return;
				}
				if ((l.isWall || l.isFloor) && ols[i].tags.indexOf('ignoreBullets') == -1 && this.body.m_linearVelocity.y > 5) {
					this.destroyBullet(false, true);
					return;
				}
				
			}

		}
	},
	onTick: function(bullets, exBullets) {
		/*Updating bullets behavior*/
		time += app.dt;

		//Shooting angle changed
		if (shootAngle != thisPlayer.data.shootAngle) {
			shootAngle = thisPlayer.data.shootAngle;
			shootTime -= app.dt; //Delay shoot one frame to synchronize shooting angle and position
		}

		if (shootTime < wpnData.delay) shootTime += app.dt;
		else if (!flags.dashing && !flags.damageHit) {
			shootTime = 0;
			thisPlayer.data.triggerShot();
			!flags.inAir && (thisPlayer.updateAnimations = true);
			var pos = [
				thisPlayer.data.shootOffset[0],
				thisPlayer.data.shootOffset[1]
			];
			thisWeapon.Spawn(pos, thisPlayer.data.shootAngle);
			thisWeapon.SpawnParticle("bulletSpawn", [thisPlayer.x + thisPlayer.data.shootOffset[0], thisPlayer.y + thisPlayer.data.shootOffset[1]]);
			
			//Sfx
			sfxBulletShoot[b5.Maths.randomRange(0,4)].play();
		}

		//Shooting changed
		if (shootChange != flags.shooting) {
			shootChange = flags.shooting;

		}

	},
	onShootingStopped: function(playerDamaged) {
		shootChange = false;
	}
};

return thisWeapon = weapon;
};