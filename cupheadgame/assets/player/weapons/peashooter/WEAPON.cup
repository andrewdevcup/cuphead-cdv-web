return function(thisPlayer, flags, world, scene, game, wpnData) {
	/* Setup */

	var thisAtlas = scene.findResource('PeashooterAtlas', 'brush'),
	viewLayer = world.findActor(thisPlayer.parent.name, true),
	body = wpnData.body,
	shootTime = 0,
	shootChange = false,
	shootAngle = 0,
	time = 0,
	thisWeapon = null,
	startTime = -2,
	name = "peashooter",

	sfxBulletDeath = scene.findResource('WeaponDeathSfx', 'sound'),
	sfxBulletHit = scene.findResource('ShootHitSfx', 'sound'),
	sfxFireStart = [
		scene.findResource('PeashooterStartSfx1', 'sound'),
		scene.findResource('PeashooterStartSfx2', 'sound')
	],
	sfxFireLoop = [
		scene.findResource('PeashooterLoopSfx1', 'sound'),
		scene.findResource('PeashooterLoopSfx2', 'sound')
	],
	sfxExHit = scene.findResource('EXShotHitSfx', 'sound');
	
	const WPN_FIXTURE = {
		type: 0,
		width: 1,
		height: 1,
		friction: 0,
		restitution: 0,
		density: 1,
		is_sensor: true
	};

	/*Weapon behaviors*/
	var weapon = {
		Spawn: function(pos, angle) {
			/*Spawning normal bullet(s)*/

			//Actor with kinematic body
			var bullet = new b5[wpnData.body.hitbox.type+'Actor'];
			bullet.radius = wpnData.body.hitbox.size;
			bullet.x = thisPlayer.x + pos[0];
			bullet.y = thisPlayer.y + pos[1];
			bullet.despawnTime = wpnData.despawnTime;
			bullet.damage = (wpnData.damage * thisPlayer.data.damageMultiplier)
			/ Math.max(scene.data.players.activePlayers.length * game.Flags.multiplayerDamageMultiplier,1);
			bullet.time = 0;
			bullet.fill_style = 'transparent';
			bullet.tag = thisPlayer.data.bulletTag;
			bullet.tags = [bullet.tag];
			bullet.bulletsId = scene.data.playerBullets.length;
			bullet.layer = thisPlayer.layer-1;
			bullet.supermeter_score = wpnData.supermeter_score;

			viewLayer.addActor(bullet);

			bullet.destroyBullet = function(timeout) {
				!timeout && thisWeapon.SpawnParticle('bulletDeath', [this.x, this.y]);
				this.release(true);
			}

			bullet.initBody(body.bodyType, body.fixedRotation, true);
			
			WPN_FIXTURE.type = b5.Shape[body.shape],
			WPN_FIXTURE.width = body.size[0],
			WPN_FIXTURE.height = body.size[1],
			WPN_FIXTURE.friction = body.friction || 0,
			WPN_FIXTURE.restitution = body.restitution || 0,
			WPN_FIXTURE.density = body.density || 1,
			WPN_FIXTURE.is_sensor = true;
				
				
			bullet.addFixture(WPN_FIXTURE);
			/*
			bullet.addFixture({
				type: b5.Shape[body.shape],
				width: body.size[0],
				height: body.size[1],
				friction: body.friction || 0,
				restitution: body.restitution || 0,
				density: body.density || 1,
				is_sensor: true
			});*/


			//Attach atlas
			var bAt = new b5.Actor;
			bAt.atlas = thisAtlas;
			bAt.x = -5;
			bAt.rotation = angle || 0;
			bullet.addActor(bAt);
			bAt.use_parent_opacity = false;
			bAt._scale = wpnData.scale;

			bullet.body.m_linearVelocity.x = Math.cos(angle)*wpnData.speed;
			bullet.body.m_linearVelocity.y = Math.sin(angle)*wpnData.speed;

			//Play anims
			//Intro
			bAt.playAnimWithEnd(
				'peashot_intro_' + (b5.Maths.randomRange(0, 1) ? 'a': 'b'),
				function(_this) {
					//Loop
				  _this.playAnim('peashot_loop', true);
				});


			bullet.onTick = function() {
				this.time += app.dt;
				if (this.time > this.despawnTime) {
					this.destroyBullet(true);
				}

				//Check overlaps
				var ols = this.A_overlaps;
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
					if ((l.isWall || l.isFloor) && ols[i].tags.indexOf('ignoreBullets') == -1) {
						//Scenery was hit
						this.destroyBullet();
						sfxBulletDeath.play();
						return;
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
					p.layer = thisPlayer.layer+1;
					thisPlayer.parent.addActor(p);
					p._scale = 0.92;
					p.playAnim('peashot_death');
					p.center_atlas = true;
					p.tags = ["playerParticle"];
					p.onAnimEnd = p.destroy;
					break;
				case "exBulletHit":
					var p = new b5.Actor;
					p.atlas = scene.findResource('WeaponEXSparkAtlas', 'brush');
					p.rotation = Math.PI * b5.Maths.randomRange(-1, 1, true);
					p.setPosition(pos[0], pos[1]);
					thisPlayer.parent.addActor(p);
					p._layer = thisPlayer.layer+1;
					p.frame_speed = 24;
					p.frames_repeat = false;
					p.center_atlas = true;
					p.tags = ["playerParticle"];
					p.onAnimEnd = p.destroy;
					break;
				case "exBulletDeath":
					if (optTarget) {
						var p = new b5.Actor;
						p.atlas = thisAtlas;
						p.setPosition(pos[0], pos[1]);
						p.layer = optTarget.layer;
						optTarget.parent.addActor(p);
						p._scale = 0.92;
						p.playAnim('ex_death');
						p.center_atlas = true;
						p.tags = ["playerParticle"];
						p.onAnimEnd = p.destroy;
					}
					break;
			}
		},
		SpawnEX: function(pos, angle) {
			/*Spawning EX bullet(s)*/
			//Actor with kinematic body
			var exb = new b5[wpnData.body.ex.hitbox.type+'Actor'];
			exb.radius = wpnData.body.ex.hitbox.size;
			exb.x = thisPlayer.x + pos[0];
			exb.y = thisPlayer.y + pos[1];
			exb.rotation = angle || 0;
			exb.despawnTime = wpnData.ex.despawnTime;
			exb.damage = (wpnData.ex.damage * thisPlayer.data.damageMultiplier) / scene.data.players.activePlayers.length;
			exb.time = 0;
			exb.fill_style = "transparent";
			//	exb.fill_style = 'transparent';
			exb.tag = thisPlayer.data.bulletTag;
			exb.tags = [exb.tag];
			//exb.bulletsId = scene.data.playerBullets.length;
			exb.layer = thisPlayer.layer+2;
			exb.supermeter_score = 0;
			exb.enemy_hit = false,
			exb.stun_delay = wpnData.ex.hitDelay;
			exb.stun_current = 0;
			exb.hits = 0;
			exb.max_hits = wpnData.ex.multiHit;

			viewLayer.addActor(exb);
			exb._layer = thisPlayer.layer+1; //wpnData.body.ex.sub_layer;
		//	viewLayer.order_changed = true;

			//Attach atlas
			var bAt = new b5.Actor;
			bAt.atlas = thisAtlas;
			bAt.x = 5;
			exb.addActor(bAt);
			bAt.use_parent_opacity = false;
			bAt.center_atlas = true;
			bAt._scale = wpnData.ex.scale;
			bAt.playAnim('ex_loop', true);

			exb.destroyBullet = function(timeout) {
				!timeout && thisWeapon.SpawnParticle('exBulletDeath', [this.x, this.y], this);
				this.release(true);
			}

			exb.initBody(body.ex.bodyType, body.ex.fixedRotation, true);
			
			WPN_FIXTURE.type = b5.Shape[body.ex.shape],
			WPN_FIXTURE.width = body.ex.size[0],
			WPN_FIXTURE.height = body.ex.size[1],
			WPN_FIXTURE.friction = body.ex.friction || 0,
			WPN_FIXTURE.restitution = body.ex.restitution || 0,
			WPN_FIXTURE.density = body.density || 1,
			WPN_FIXTURE.is_sensor = true;
				
			exb.addFixture(WPN_FIXTURE);
			/*
			exb.addFixture({
				type: b5.Shape[body.ex.shape],
				width: body.ex.size[0],
				height: body.ex.size[1],
				friction: body.ex.friction || 0,
				restitution: body.ex.restitution || 0,
				density: body.ex.density || 1,
				is_sensor: true
		});*/

		exb.body.m_linearVelocity.x = Math.cos(angle)*wpnData.ex.speed;
		exb.body.m_linearVelocity.y = Math.sin(angle)*wpnData.ex.speed;

		exb.onTick = function() {
			this.time += app.dt;
			if (this.time > this.despawnTime) {
				this.destroyBullet(true);
			}

			//Check overlaps
			var ols = this.A_overlaps; 
			for (var i = 0; i < ols.length; i++)
				if (ols[i]) {
				if (ols[i].tags.indexOf(thisPlayer.data.enemy) != -1) {
					//Enemy was hit
					//Stun
					if (!this.enemy_hit) {
						this.enemy_hit = true;
						this.stun_current = 0;
						this.hits++;
						ols[i].onBulletHit && ols[i].onBulletHit(this);
						this.onEnemyHit && this.onEnemyHit(ols[i]);
						//Add score to level
						scene.data.Statistics.damage_given += this.damage;
						
						sfxExHit.play();
						if (this.hits >= this.max_hits) this.destroyBullet();
						else thisWeapon.SpawnParticle('exBulletHit', [this.x, this.y], this);
					} else if (this.stun_current < this.stun_delay) this.stun_current += game.speed;
					else {
						this.enemy_hit = false;
					}
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
			thisPlayer.data.triggerShot();// = true;
			!flags.inAir && (thisPlayer.updateAnimations = true);
			var pos = [
				thisPlayer.data.shootOffset[0],
				thisPlayer.data.shootOffset[1] - (12+Math.cos(time*12)*12)
			];
			thisWeapon.Spawn(pos, thisPlayer.data.shootAngle);
			thisWeapon.SpawnParticle("bulletSpawn", [thisPlayer.x + thisPlayer.data.shootOffset[0], thisPlayer.y + thisPlayer.data.shootOffset[1]]);
		}

		//Shooting changed
		if (shootChange != flags.shooting) {
			shootChange = flags.shooting;

			if (shootChange) {
				time - startTime > 0.2 && sfxFireStart[b5.Maths.randomRange(0, 1)].play();
				sfxFireLoop[b5.Maths.randomRange(0, 1)].play();
				startTime = time;
			}

		}

	},
	onShootingStopped: function(playerDamaged) {
		for (var i = 0; i < sfxFireLoop.length; i++) {
			sfxFireLoop[i].location && sfxFireLoop[i].stop();
		}

		//If other players are shooting with the same weapon,
		//Keep	playing the sound effect
		//This only applies to those weapons with a looping sfx rather than playing one sfx per shot

	/*	if(playerDamaged)*/ for (var i = 0, p = world.findActorsByTagName('player', true); i < p.length; i++) if(p[i] !== thisPlayer) {
			var player = p[i],
			w = player.equipedWeapons[player.flags.weaponIndex];

			if (w === name && player.flags.shooting && player.flags.heartPoints > 0) {
				var si = b5.Maths.randomRange(0, 1);
				!sfxFireLoop[si].isPlaying() && sfxFireLoop[si].play();
			}
		}
		shootChange = false;

	}
};

return thisWeapon = weapon;
};