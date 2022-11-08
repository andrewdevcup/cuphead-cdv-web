return {
	Urn: function(thisActor, world, scene, data, game) {
	
		var bossData = scene.data.bossData,
		urn = thisActor,
		legendaryChalice = scene.findActor('NPC_LegendaryGhost', true);
		
		urn.initBody("collider");
		urn.addFixture({
			type: b5.Shape.TypeCircle,
			width: 50,
			is_sensor: true
		});
	
		legendaryChalice.npc_active = false;
		
		urn.playAnim("idle");
	
		var sparks = new b5.Actor();
		sparks.setPosition(20,-40);
		sparks._scale = 0.9;
		sparks.visible = false;
		urn.addActor(sparks);
		
		urn.sparks = sparks;
		
		//Random shake at random intervals
		urn.shaking_anim = false;
		urn.prev_times = 1;
		urn.repeat_frames = false;
		
		urn.playShakeAnim = function(name, times) {
			this.shaking_anim = true;
			
			this.playAnimWithEnd(name, f => {
				urn.prev_times--;
				if(urn.prev_times <= 0) {
					urn.prev_times = 0;
					urn.shaking_anim = false;
					urn.playAnim("idle");
				}
				else {
					urn.playShakeAnim(name, urn.prev_times);
				}
			});
		}
		
		urn.setInterval(f => {
			var ans = ["urn_shake", "urn_vibrate_big", "urn_vibrate_small"],
			times = b5.Maths.randomRange(1,2),
			sh;
			
			!urn.shaking_anim && (
				urn.prev_times = times,
				urn.playShakeAnim(ans[ b5.Maths.randomRange(0,2) ], times),
				sh = scene.findResource('jarShakeSfx','sound'),
				sh.setGain(0.4),
				sh.play()
			);
		},3);
		
		//Sign
		urn.createSign = function(yoffs) {
			var s = new b5.Actor();
			s.atlas = scene.findResource("LegendaryGhostFXAtlas", "brush");
			s.playAnim("help");
			s.onAnimEnd = s.destroy;
			s.setPosition(this.x, this.y - yoffs);
			this.parent.addActor(s);
			s._layer = this.layer + 1;
			return s;
		}
		
		data.levelData.id = 0;
		data.getId = function() {
			//Generate and increment an id for enemies
			//It'll be used to identify objects on local mp
			return data.levelData.id++;
		}
		
		//Online Sync
		scene.events.on('playEvent',e =>data.playEvent(e[0],e[1],true));
		
		//Event system to synchronize host and guest
		
		data.playEvent = function(evt, evtData, eventFromHost) {
			if(game.Multiplayer.isHosting)
				game.Multiplayer.sendToGuest('PLAY_EVENT',[evt,evtData]);
				
			if(!game.Multiplayer.isGuest || eventFromHost) switch(evt) {
				case "urnIntro":
					urn.setTimeout(f => urn.createSign(110), 0.2);
					
					urn.setInterval(f => {
						var ghostType;
						
						if(data.levelData.fightStarted) for(var i = 1; i <= (b5.Maths.randomChance(bossData.ghosts.spawnRandomTwice) ? 2 : 1); i++) {
							//After n parries, spawn only small ghosts, then spawn them both
							if(bossData.parried < bossData.ghosts.smallGhostPhaseFrom)
							  ghostType = 'ghost';
							else if(bossData.parried >= bossData.ghosts.smallGhostPhaseFrom && bossData.parried <= bossData.ghosts.smallGhostPhaseTo)
							  ghostType = 'smallGhost';
							else ghostType = ['ghost','smallGhost'][b5.Maths.randomRange(0,1)];

							sceneMain.data.playEvent("spawnGhost",
								[ ghostType,
									bossData.ghosts.spawnRadius * (b5.Maths.randomChance(0.5) ? -1:1),
									b5.Maths.randomRange(bossData.ghosts.spawnYRange[0], bossData.ghosts.spawnYRange[1],
								)
							]);
						}
						f.delay = b5.Maths.randomRange(
							bossData.ghosts.spawnRandomInterval[0],
							bossData.ghosts.spawnRandomInterval[1],
							true
						)
					},bossData.ghosts.spawnRandomInterval[1]);
				break;
				case "spawnGhost":
					var type = evtData[0],
					pos = {
						x: evtData[1],
						y: evtData[2]
					},
					facing = pos.x > 0 ? -1 : 1,
					angle = b5.Maths.posAngle(pos.x, pos.y, urn.x, urn.y),
					gData = bossData.ghosts[type];
					
					switch(type) {
						case "ghost":
						var g = new b5.Actor();
						g.atlas = scene.findResource("GhostAtlas", "brush");
						g.playAnim("ghost_" + (b5.Maths.randomChance(0.5) ? 'a':'b'), true);
						g.setPosition(pos.x, pos.y);
						g.rotation = angle;
						world.PlayerLayer.addActor(g);
						g.tags = ["Parryable", "ghost"];
						g.tag = "ghost";
						g.id = data.getId();
						g.initBody("kinematic");
						g.radius = gData.size;
						g._layer = urn.layer + 1;
						g.parryScore = 1;
						g._scale = 0.97;
						g.addFixture({
							type: b5.Shape.TypeCircle,
							width: gData.size,
							height: gData.size,
							is_sensor: true
						});
						
						if(facing == 1) g._scale_x = -1;
						else g._scale = facing;
						
						g.body.m_linearVelocity.x = Math.cos(angle) * gData.speed;
						g.body.m_linearVelocity.y = Math.sin(angle) * gData.speed;
						
						g.onParry = function() {
							bossData.health--;
							bossData.parried++;
							
							this.release(true);
						}
						break;
						case "smallGhost":
						var g = new b5.Actor();
						g.atlas = scene.findResource("GhostAtlas", "brush");
						g.playAnim("fast_ghost", true);
						g.setPosition(pos.x, pos.y);
						g.rotation = angle;
						world.PlayerLayer.addActor(g);
						g.tags = ["Parryable", "ghost"];
						g.tag = "ghost";
						g._scale = 0.97;
						g.id = data.getId();
						g.initBody("kinematic");
						g.radius = gData.size;
						g._layer = urn.layer + 1;
						g.parryScore = 1;
						g.addFixture({
							type: b5.Shape.TypeCircle,
							width: gData.size,
							height: gData.size,
							is_sensor: true
						});
						
						if(facing == 1) g._scale_x = -1;
						else g._scale = facing;
						
						g.body.m_linearVelocity.x = Math.cos(angle) * gData.speed;
						g.body.m_linearVelocity.y = Math.sin(angle) * gData.speed;
						
						g.onParry = function() {
							bossData.health--;
							bossData.parried++;
							
							//Hat
							var gh = new b5.Actor();
							gh.atlas = this.atlas;
							gh.playAnim('hat_fall_' + (b5.Maths.randomChance(0.5) ? 'a':'b'), true);
							this.parent.addActor(gh);
							gh._layer = this.layer;
							
							gh.setPosition(this.x, this.y);
							
							gh.vy = -950;
							gh.vx = b5.Maths.randomRange(-300,300);
							gh.onTick = function() {
								this.vy += 100 * game.speed;
								this.vy > 1400 && (this.vy = 1400);
								if(this.y > 500) this.destroy();
							}
							
							this.release(true);
						}
						break;
					}
				break;
				case 'Victory':
					world.setTimeout(f => data.playFightText('Victory', g=>game.Flags.pausingEnabled=false), 0.1);
					urn.tasks.clear();
					for(var i = 0, g = world.findActorsByTagName("ghost", true); i < g.length; i++) g[i].destroy();
					
					sparks.atlas = scene.findResource( 'LegendaryGhostFXAtlas', 'brush' );
					sparks.playAnim('urn_sparks', true);
					sparks.visible = true;
					
				  scene.setTimeout(f => {
				  	scene.findResource( 'Mus_Mausoleum', 'sound' ).stop()
				  	scene.findResource('Mus_LegendaryGhost','sound').play();
				  }, 0.25);
					
					world.setTimeout(f => {
						data.playEvent("UrnAnim");
					},3);
				break;
			  case 'UrnAnim':
			  	urn.playAnim('urn_no_cover');
			  	
			  	//Cover and bg
			  	var uCover = new b5.Actor(),
			  	bgCover = new b5.Actor(),
			  	urnEX = new b5.Actor();
			  	soulFX = new b5.Actor();
			  	
			  	//Animate	cover
			  	uCover.atlas = urn.atlas;
			  	uCover.playAnim('urn_cover_glow');
			  	urn.parent.addActor(uCover);
			  	uCover._layer = urn.layer+1;
			  	uCover._y = -55;
			  	uCover.vr = 5;
			  	uCover.vy = -400;
			  	uCover.onTick = function() {
			  		if(this.y < -500) this.destroy();
			  	}
			  	
			  	urn.playAnim('urn_no_cover_noglow');
			  	bgCover.playAnim('urn_cover_bg');
			  	
			  	//sfx
			  	scene.findResource('ghostJarBurstSfx','sound').play();
			  			
			  	//FX
			  	urnEX.atlas = scene.findResource( 'LegendaryGhostFXAtlas', 'brush' );
			  	urnEX._y = -55;
			  	urnEX.playAnimWithEnd('spark_ex', e => e.destroy());
			  	urn.parent.addActor(urnEX);
			  	urnEX._layer = urn.layer + 1;
			  	
			  	//Cover BG
			  	bgCover.atlas = urn.atlas;
			  	bgCover.y = -46;
			  	bgCover.playAnim('urn_cover_bg_glow');
			  	urn.parent.addActor(bgCover);
			  	bgCover._layer = urn.layer - 2;
			  	
			  	urn.coverbg = bgCover;
			  	
			  	//Soul
			  	soulFX.atlas = urnEX.atlas;
			  	soulFX.playAnim('ghost_spark',true);
			  	urn.parent.addActor(soulFX);
			  	soulFX._layer = urn.layer - 1;
			  	soulFX._y = -40;
			  	
			  	soulFX.afterTween = function() {
			  		this.playAnimWithEnd('ghost_appear', f => {
			  	  	f.destroy();
			  			
			  			legendaryChalice.triggerInteract = true;
			  			legendaryChalice.atlas = scene.findResource('LegendaryGhostAtlas','brush');
			  			legendaryChalice.playAnim('chalice_idle',true);
			  			
			  		});
			  		
			  		scene.findResource('queenGhostAppearSfx','sound').play();
			  	}
			  	
			  	soulFX.setTimeout(f => {
			  		soulFX.TweenToWithEnd('_x',420,2, b5.Ease.quadinout, false,	0, g => soulFX.afterTween());
			  		soulFX.TweenToWithEnd('_y',-160,1, b5.Ease.quadinout, false, 0, function() {
			  			soulFX.TweenTo('_y',0,1,b5.Ease.quadinout)
			  		});
			  		
			  		scene.findResource('ghostJarTravelSfx','sound').play();
			  		
			  		//Animate urn
			  		urn.sparks.frames_repeat = false;
			  		urn.sparks.onAnimEnd = g => {
			  			urn.sparks.destroy();
			  			urn.sparks = null;
			  		}
			  		
			  	},1.2);
			  break;
			  case 'YouFailed':
			  	data.mausDeadScreen();
			  break;
			}
			
		}
		
		data.playEvent("urnIntro");
		
		data.mausDeadScreen = function() {
			scene.findResource('FailedTempSfx','sound').play();
			
			data.playFightText("YouDied", f=> data.showDeathCard() );
			scene.data.players_dead = true;
			game.Flags.pausingEnabled = false;
			for(var i = 0, g = world.findActorsByTagName("ghost", true); i < g.length; i++) g[i].destroy();
			for(var i = 0, g = data.getActivePlayers(), s; i < g.length; i++) {
			  g[i].data.diedAt = bossData.maxHealth - bossData.health;
			  g[i].body.SetActive(false);
			  g[i].flags.controllable = false;
			  g[i].active = false;
			  s = Math.abs(g[i].Sprite._scale_x);
			  g[i].Sprite._scale_x = g[i].x > 0 ? -s : s;
			  g[i].Sprite.playAnim('scared_mausoleum');
			}
			
			urn.tasks.clear();
			scene.findResource('voMausFailSfx' + b5.Maths.randomRange(1,6), "sound").play();
		}
		
		app.events.once("sceneunload", f => {
			game.Flags.pausingEnabled = true;
		});
		
		var dead = false;
		
		urn.onTick = function() {
			var ols = this.A_overlaps;
			for(var i = 0, o; i < ols.length; i++) {
				var o = ols[i];
				if(o.tag == "ghost") {
					data.playEvent('YouFailed');
					this.active = false;
					break;
				}
			}

	  	if (scene.data.levelData.fightStarted) {
		  	//Do things
				
		  	if (bossData.health <= 0 && !dead) {
  				dead = true;
				
			  	data.playEvent('Victory');
		  	}
	  	}
		}
		
	}
}