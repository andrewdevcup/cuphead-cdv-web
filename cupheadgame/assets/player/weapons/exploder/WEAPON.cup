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
	name = "exploder",

	sfxBulletDeath = scene.findResource('WeaponDeathSfx', 'sound'),
	sfxBulletHit = scene.findResource('ShootHitSfx', 'sound');
	
	/*Weapon behaviors*/
	var weapon = {
		Spawn: function(pos, angle) {
			/*Spawning normal bullet(s)*/

			//Actor with kinematic body
			var bullet = new b5.ArcActor();
			bullet.radius = wpnData.body.hitbox.size;
			bullet.fill_style = "red";
			bullet.stroke_filled = true;
			bullet.stroke_style = "black";
			bullet.stroke_thickness = 4;
			bullet.x = thisPlayer.x + pos[0];
			bullet.y = thisPlayer.y + pos[1];
			bullet.despawnTime = wpnData.despawnTime;
			bullet.damage = wpnData.damage * thisPlayer.data.damageMultiplier;
			bullet.time = 0;
			bullet.tag = thisPlayer.data.bulletTag;
			bullet.tags = [bullet.tag];
			bullet.angle = angle;
			bullet.layer = thisPlayer.layer-1;
			bullet.supermeter_score = wpnData.supermeter_score;

			viewLayer.addActor(bullet);

			bullet.destroyBullet = function(timeout) {
	       this.release(true);
			}

			bullet.initBody(body.bodyType, body.fixedRotation, true);

			bullet.addFixture({
				type: b5.Shape[body.shape],
				width: body.size[0],
				height: body.size[1],
				friction: body.friction || 0,
				restitution: body.restitution || 0,
				density: body.density || 1,
				is_sensor: true
			});
			
			bullet.axis = {
				x: Math.cos(angle),
				y: Math.sin(angle)
			}
			
			bullet.baseSpeedX = bullet.body.m_linearVelocity.x = bullet.axis.x*wpnData.speed;
		  bullet.baseSpeedY = bullet.body.m_linearVelocity.y = bullet.axis.y*wpnData.speed;

			bullet.onTick = function() {
				this.time += app.dt;
				if (this.time > this.despawnTime) {
					this.destroyBullet(true);
					return;
				}
		
				var lv = this.body.m_linearVelocity;
				
				lv.x = this.baseSpeedX + (Math.sin(this.time*8) *5);
				lv.y = this.baseSpeedY + (Math.cos(this.time*8) *5);

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
					if (ols[i].tags.search(["wall", "floor"]) != -1 && ols[i].tags.indexOf('ignoreBullets') == -1) {
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
			exb.fill_style = "red";
			exb.stroke_filled = true;
			exb.stroke_style = "black";
			exb.stroke_thickness = 4;
			exb.despawnTime = wpnData.ex.despawnTime;
			exb.damage = wpnData.ex.damage * thisPlayer.data.damageMultiplier;
			exb.time = 0;
			//	exb.fill_style = 'transparent';
			exb.tag = thisPlayer.data.bulletTag;
			exb.tags = [exb.tag];
			//exb.bulletsId = scene.data.playerBullets.length;
			exb.layer = thisPlayer.layer+2;
			exb.supermeter_score = 0;

			viewLayer.addActor(exb);
			exb._layer = thisPlayer.layer+1; //wpnData.body.ex.sub_layer;
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

		exb.body.m_linearVelocity.x = Math.cos(angle)*wpnData.ex.speed;
		exb.body.m_linearVelocity.y = Math.sin(angle)*wpnData.ex.speed
		exb.inwall = false;
		exb.destroyBullet = function() {
			this.release(true);
			
		}
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
				if (ols[i].tags.indexOf(thisPlayer.data.enemy) != -1) {
					//Enemy was hit
					ols[i].onBulletHit && ols[i].onBulletHit(this);
					this.onEnemyHit && this.onEnemyHit(ols[i]);
					//Add score to level
					scene.data.Statistics.damage_given += this.damage;
						
					this.destroyBullet();
					return;
				}
				if (ols[i].isWall && ols[i].tags.indexOf('ignoreBullets') == -1 && !this.inwall) {
					//Reflect and make enemy
					this.radius *= 7;
					this.inwall = true;
					this.body.SetActive(false);
					
					//Reflect
					this.setTimeout(m => {
						var _this = m.data;
						_this.radius /= 7;
						
						_this.body.SetActive(true);
						
						_this.body.m_linearVelocity.x *= -1;
						_this.body.m_linearVelocity.y *= -1;
						
						_this.tags.push(thisPlayer.data.enemy);
						_this.draw();
					},0.1);
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
				thisPlayer.data.shootOffset[1]
			];
			thisWeapon.Spawn(pos, thisPlayer.data.shootAngle);
			thisWeapon.SpawnParticle("bulletSpawn", [thisPlayer.x + thisPlayer.data.shootOffset[0], thisPlayer.y + thisPlayer.data.shootOffset[1]]);
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