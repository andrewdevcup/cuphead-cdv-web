return {
	BossObject: function(thisActor, world, scene, data, game) {
		
		var difficulty = scene.data.Statistics.skill,
		currentPhase = data.bossData.difficultyAndPhases[difficulty],
		flowerSfx = {
			intro: scene.findResource('FlowerIntroSfx','sound'),
			laserStart: scene.findResource('FlowerLaserStartSfx','sound'),
			laserLoop: scene.findResource('FlowerLaserLoopSfx','sound'),
			laserEnd: scene.findResource('FlowerLaserEndSfx','sound'),
			handsStart: scene.findResource('FlowerHandsStartSfx','sound'),
			handsOpen: scene.findResource('FlowerHandsOpenSfx','sound'),
			handsEnd: scene.findResource('FlowerHandsEndSfx','sound'),
			seedPoof: scene.findResource('SeedPoofSfx','sound'),
			gattlingStart: scene.findResource('FlowerGattlingStartSfx','sound'),
			gattlingLoop: scene.findResource('FlowerGattlingLoopSfx','sound'),
			gattlingEnd: scene.findResource('FlowerGattlingEndSfx','sound')
		}
		
		//Explosions after Knockout
		thisActor.onDeath = function(emx,emy) {
			scene.events.once('after-knockout',()=>{
				scene.data.createBossExplosionsEmitter(emx,emy,250,20);
			});
		};
		
		data.levelData.flowerCurrentPhase = 'PhaseOne';
		
		var enemyHitShader = scene.findResource('EnemyHitShader','shader');
		
		//After sting, load winscreen or any other scene
		//If winscreen, pass statistics and players to evaluate grade
		scene.events.once('onfightwin:nextscene', ()=>{
			!game.Multiplayer.isGuest && b5.Game.LoadScene('winscreen', 0, 0, {
				show_anim: 'fade',
				show_speed: 2,
				hide_anim: 'fade',
				hide_speed: 0.35,
				hourglass: false
			}, {
				stats: Object.clone(scene.data.Statistics),
				players: scene.data.players.activePlayers,
				fromLevelID: data.levelID
			});
		});
		
		scene.events.on('playEvent',e =>data.playEvent(e[0],e[1],true));
		
		data.levelData.id = 0;
		data.getId = function() {
			//Generate and increment an id for enemies
			//It'll be used to identify objects on local mp
			return data.levelData.id++;
		}
		
		//Event system to synchronize host and guest
		
		data.playEvent = function(evt, evtData, eventFromHost) {
			if(game.Multiplayer.isHosting)
				game.Multiplayer.sendToGuest('PLAY_EVENT',[evt,evtData]);
				
			if(!game.Multiplayer.isGuest || eventFromHost) switch(evt) {
				case "FlowerIntro":
					
					var flowerObj = data.FlowerBoss = new b5.Actor(),
					flower = new b5.Actor(),
					flowerBlink = new b5.Actor();
					
					flowerObj.Sprite = flower;
					flowerObj.BlinkSprite = flowerBlink;
					flowerObj.addActor(flower);
					flowerObj.addActor(flowerBlink);
					
					flowerObj._layer = 1;
					world.PlayerLayer.addActor(flowerObj);
					flower.data = flowerObj.data = currentPhase.data.flower;
					
					flower.atlas = scene.findResource('FlowerAtlasPH1','brush');
					flowerBlink.atlas = flower.atlas;
					flowerBlink.visible = false;
					flowerBlink.active = false;
					
					var flowerHitboxMain = new b5.ArcActor();
					flowerObj.hbMain = flowerHitboxMain;
					
					world.PlayerLayer.addActor(flowerHitboxMain);
					flowerHitboxMain.radius = 75;
					flowerHitboxMain._layer = 2;
					flowerHitboxMain.setPosition(420,-160);
					flowerHitboxMain.initBody('collider');
					flowerHitboxMain.addFixtureSelf(1,0,0,true);
					
					flowerHitboxMain.opacity = 0.5;
					flowerHitboxMain.visible = game.Flags.debugShowHitboxes;
					
					flowerHitboxMain.tags = ['enemy','hittableEnemy'];
					
					flowerHitboxMain.onBulletHit = function(bullet) {
						flower.onHit(bullet.damage);
					}
					
					flower.onHit = function(damage) {
						flowerObj.addFilter(enemyHitShader.filter);
				  	flowerObj.setTimeout(t=>{
				  		t.data.removeFilter(enemyHitShader.filter);
				  	},app.dt*4);
				  	
						if(!flowerObj.invincible) bossData.health -= damage * currentPhase.damageMultiplier;

						if(bossData.health <= flower.data.morphHP && data.levelData.flowerCurrentPhase == "PhaseOne" && !flowerObj.attacking) {
							data.playEvent('FlowerMorphPH2');
						}
					}
					
					flower.setAtlas = function(a) {
						this.atlas = scene.findResource('FlowerAtlasPH'+a,'brush');
					}
					
					if(!data.levelData.fightStarted) flower.setTimeout(f => flowerSfx.intro.play(), 1.25);
					
					flower.playAnimWithEnd(data.levelData.fightStarted ? 'idle':'intro',fl => {
			    	fl.playAnim('idle',true);
			    	
			    	flower.ph1NextAttack =	function() {
			    		//Get random attack
			    		data.FlowerBoss.attacking = true;
			    		var rndAtt = flower.data.attack_list[b5.Maths.randomRange(0,flower.data.attack_list.length - 1)];
			    		if(data.players_dead) return;
			    		switch(rndAtt) {
			    			case 'laser': return data.playEvent('FlowerLaserPrepare',[b5.Maths.randomRange(0,1)]);
			    			case 'magicHands': return data.playEvent('FlowerMagicHandsPrepare');
			    			case 'gattling': return data.playEvent('FlowerGattlingStart');
			    		}
			    		
			    	}
			    	
			    	//Initialize interval
			    	flower.prepareNextAttack = function() {
			    		data.FlowerBoss.attacking = false;
			    		if(data.levelData.flowerCurrentPhase == 'PhaseOne') {
				    		this.tAttack = this.setTimeout(f => this.ph1NextAttack(),
				    		  b5.Maths.randomRange(
				    		  	this.data.attackWaitTimeRanges[0],
				    		  	this.data.attackWaitTimeRanges[1],
				    		  	true
				    		  )
				    		);
			    		}
			    		else {
			    			
			    		}
			    		
			    	}
			    	
			    	flower.setTimeout(f => flower.prepareNextAttack(),1);
					});
					
					flowerObj._scale = 0.97;
					flowerObj.setPosition(400,-10);
					
					flower.idleLoopCount = 0;
					
					flower.onAnimRepeat = function() {
						//Is on idle?
						if((this.current_anim == "idle" && (this.idleLoopCount++, true)) && this.idleLoopCount > b5.Maths.randomRange(3,5)) {
							this.next_blink = true;
							this.idleLoopCount = 0;
						}
					}
					
					flower.activeBlink = function() {
						flowerBlink._av = true;
						this._av = false;
						
						flowerBlink.playAnimWithEnd('idle_blink', f => this.offBlink());
					}
					
					flower.offBlink = function() {
						this._av = true;
						flowerBlink._av = false;
					}
					
					flower.onTick = function() {
						//Check for idle anim and blink
						if(this.current_frame < 1 && this.next_blink) {
							this.next_blink = false;
							this.activeBlink();
						}
					}
					
					break;
				case 'FlowerLaserPrepare':
					var flower = data.FlowerBoss,
					flowerSprite = flower.Sprite,
					dir = evtData[0] == 1 ? 'up' : 'down';
					
					flowerSprite.offBlink();
					flowerSprite.setAtlas(1);
					
					flowerSfx.laserStart.play();
					
					//Play laser anim
					flowerSprite.playAnimWithEnd('laser_'+dir+'_intro', f => {
						f.playAnim('laser_'+dir+'_prepare',true);
					});
					
					//Wait and attack
					flower.setTimeout(f => !data.players_dead && data.playEvent('FlowerLaser',[evtData[0]]),
					  flower.data.laserChargeDuration
					);
					break;
				case 'FlowerLaser':
					var flower = data.FlowerBoss,
					flowerSprite = flower.Sprite,
					dir = evtData[0] == 1 ? 'up' : 'down';
					
					flowerSprite.offBlink();
					flowerSprite.setAtlas(1);
					
					flowerSfx.laserLoop.play();
					
					flowerSprite.playAnimWithEnd('laser_'+dir+'_start', f => {
						f.playAnim('laser_'+dir+'_loop',true);
						
						//Wait and release
						!data.players_dead && f.setTimeout(g => {
							flowerSfx.laserLoop.stop();
							flowerSfx.laserEnd.play();
							f.playAnimWithEnd('laser_'+dir+'_back', h => {
								h.playAnim('idle',true);
								flowerSprite.prepareNextAttack();
							})
						}, f.data.laserHoldDuration);
					});
					break;
				case 'FlowerMagicHandsPrepare':
					var flower = data.FlowerBoss,
					flowerSprite = flower.Sprite;
					
					flowerSprite.offBlink();
					flowerSprite.setAtlas(1);
					
					flowerSfx.handsStart.play();
					
					var magicHandsTimes = flower.data.magicHandsTimes[ b5.Maths.randomRange(0, flower.data.magicHandsTimes.length - 1) ],
					magicHandsTimeCount = 0;
					
					flower.preparingMagicHands = false;
					flower.magicHandsDone = false;
					
					flowerSprite.prepareMagicHands = function() {
						var attack = flower.data.magic_hands_attack_list[b5.Maths.randomRange(0,flower.data.magic_hands_attack_list.length - 1)]
						flower.preparingMagicHands = true;
						data.playEvent('FlowerMagicHandsAttack', [attack]);
					}
					
					//Play anim
					flowerSprite.playAnimWithEnd('magic_hands_intro', f => {
						f.playAnim('magic_hands_loop',true);
						
						//Set interval and shoot projectiles at random times
						//and a counter
						f.magicHandsAttackInterval = f.setInterval(function(g) {
							if(data.players_dead) return;
							if(!flower.preparingMagicHands && !flower.magicHandsDone) {
								if(magicHandsTimeCount < magicHandsTimes) {
									flowerSprite.prepareMagicHands();
									g.pause();
									g.running_time = 0;
									magicHandsTimeCount++;
								}
								else {
									flower.magicHandsDone = true;
									flowerSprite.prepareMagicHands();
								}
							}
						},flower.data.magicHandsWait);
						
					})
					break;
				case 'CreateEnemy':
					var flower = data.FlowerBoss,
					enemy = evtData[0],
					id = evtData[1],
					releaseTime = evtData[2],
					target = evtData[3];
					
					switch(enemy) {
						case 'acorn':
							for(var i = 0, as = flower.data.acornAttack.startY, ae = flower.data.acornAttack.endY; i < flower.data.acornAttack.acorns; i++) {
								scene.data.createEnemy(enemy, flower.x - 130, flower.y - b5.Maths.pos(as,ae,i/flower.data.acornAttack.acorns), 2, {
									id: id,
									target: target,
									releaseTime: releaseTime,
									speed: flower.data.acornAttack.acornSpeed
								});
								releaseTime += flower.data.acornAttack.releaseTime;
							}
							break;
						case 'boomerang':
							scene.data.createEnemy(enemy, flower.x - 130, flower.y - 54, 2, {
								id: id,
								speed: flower.data.boomerang.speed,
								releaseTime: flower.data.boomerang.releaseTime,
								turnaround_time: flower.data.boomerang.turnaroundTime
							});
							break;
					}
					
					break;
				case 'FlowerMagicHandsAttack':
					var flower = data.FlowerBoss,
					
					flowerSprite = flower.Sprite,
					attack = evtData[0],
					waitTime = 0;
					
					flowerSprite.setAtlas(1);
					
					flowerSfx.handsOpen.play();
					
					flowerSprite.playAnimWithEnd('magic_hands_open',f => {
						f.playAnim('magic_hands_open_loop',true);
					});
					
					//Spawn enemies
				  	data.playEvent('CreateEnemy',[
						attack,
						data.getId(),
						0.7,
						'cuphead'
					])
					
					flowerSprite.setTimeout(f => data.addFlowerParticle('HandPotSpawn', flower.x - 145, flower.y - 40, 5), 0.1);
					
					switch(attack) {
						case 'acorn': waitTime = flower.data.magicHandsAcornWait; break;
						case 'boomerang': waitTime = flower.data.magicHandsBoomerangWait; break;
					}
					
					//Go back to prepare after..
					flower.setTimeout(function() {
						if(data.players_dead) return;
						if(!flower.magicHandsDone) {
							//Reset timing preventing accumulation
							var tk = flowerSprite.tasks.find(flowerSprite.magicHandsAttackInterval);
							
							//Back to prepare
							flowerSfx.handsEnd.play();
							flowerSprite.playAnimWithEnd('magic_hands_close',g => {
								if(tk) tk.play();
								g.playAnim('magic_hands_loop', true);
								flower.preparingMagicHands = false;
							});
						}
						else {
							//Transition back to idle
							flowerSprite.clearInterval(flowerSprite.magicHandsAttackInterval);
							flowerSprite.playAnimWithEnd('magic_hands_trans_back', h => {
								h.playAnim('idle',true);
								!data.players_dead && flowerSprite.prepareNextAttack();
							});
						}
					}, waitTime);
					break;
				case 'FlowerGattlingStart':
					var flower = data.FlowerBoss,
					flowerSprite = flower.Sprite;
					
					flowerSprite.offBlink();
					flowerSprite.setAtlas(2);
					
					//Start gattling
					flowerSfx.gattlingStart.play();
					
					flowerSprite.playAnimWithEnd('gattling_start', f => {
						f.playAnim('gattling_loop', true);
						
						flowerSfx.gattlingLoop.play();
						
						//Gattling FX
						var gfx = new b5.Actor();
						gfx.atlas = scene.findResource("FlowerGattlingFXAtlas", "brush");
						gfx.playAnim('gattling_seed_fx', true);
						world.PlayerLayer.addActor(gfx);
						gfx._layer = flower.layer - 1;
						gfx._scale = 1.1;
						gfx.setPosition(flower.x, flower.y - 250);
						flower.gfx = gfx;
						
						//Stop after time
						f.setTimeout(function() {
							if(data.players_dead) return;
						  data.playEvent('FlowerGattlingStop');
						}, b5.Maths.randomRange( 
							  flower.data.gattling.durationTimeRanges[0],
							  flower.data.gattling.durationTimeRanges[0],
							  true)
					  );
					});
					break;
				case 'FlowerGattlingStop':
					var flower = data.FlowerBoss,
					flowerSprite = flower.Sprite;
					
					if(flower.gfx) {
						flower.gfx.destroy();
						flower.gfx = null;
					}
					flowerSprite.playAnimWithEnd('gattling_end', g => {
						//Sfx
						flowerSfx.gattlingEnd.play();
						flowerSfx.gattlingLoop.stop();
								
						//Actions
						flowerSprite.setAtlas(1);
						g.playAnim('idle', true);
						!data.players_dead && g.prepareNextAttack();
					});
					break;
				case 'FlowerMorphPH2':
					var flower = data.FlowerBoss;
					
					flower.attacking = false;
					flower.Sprite.offBlink();
					flower.Sprite.tasks.clear();
					flower.Sprite.setAtlas(2);
					data.levelData.flowerCurrentPhase = "PhaseTwo";
					flower.Sprite.playAnimWithEnd('morph_ph3', f => {
						//Idle..
					});
					break;
				case 'Knockout':
					var flower = data.FlowerBoss;
					thisActor.onDeath(flower.x,flower.y);
					scene.data.onBossDeath && scene.data.onBossDeath();
					
					flower.tasks.clear();
					flower.Sprite.tasks.clear();
					
					if(data.levelData.flowerCurrentPhase == 'PhaseOne') {
						//Play anim
						flower.Sprite.offBlink();
						flower.Sprite.setAtlas(2);
						flower.Sprite.playAnimWithEnd('rage_intro', f => f.playAnim('rage',true));
					}
					else {
						flower.Sprite.setAtlas(3);
						flower.Sprite.playAnim('flower_death',true);
					}
					break;
				default:
				  void 0;
			}
		}
		
		data.playEvent('FlowerIntro');
		
		//Basic defeat manager
		var dead = false,
		bossData;

		thisActor.onTick = function() {
			bossData = scene.data.bossData; //Fix object error in guest
			
			if (scene.data.levelData.fightStarted) {
				//Do things
				
				if (bossData.health <= 0 && !dead && !data.FlowerBoss.attacking) {
					dead = true;
					
					data.playEvent('Knockout'); //Handler
				}
			}
			
		}
		
	}
};