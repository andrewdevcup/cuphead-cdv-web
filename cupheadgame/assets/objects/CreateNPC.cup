b5.export = function(world, scene, sceneData, game) {
	var myexports = {
		initNpcs: function() {
			if (sceneData.npc)
				for (var i in sceneData.npc) {
				var npc = world.findActor(i, true);

				//Load script
				if (npc) {
					npc.onInteract = Function(b5.File.readSync(sceneData.levelDataPath + sceneData.npc[i].script))();
					
					//Common NPC behavior
					(function(thisNpc, world, scene, game, data) {
						var focus = false,
						glyph = null,
						A_press = true,
						bA = false,
						active = true,
						p = null;
						
						thisNpc.data = data.npc[thisNpc.name];

						thisNpc.interacting = false;
						thisNpc.npc_active = true;

						thisNpc.onTick = function() {
							//On player focus (overlapping)
							if (focus != thisNpc.player_focus && thisNpc.npc_active) {
								focus = thisNpc.player_focus;

								A_press = true;

								if (focus) {
									if(!thisNpc.data.isTrigger) {
										//Show glyph
										game.Flags.inLevel && (glyph = data.showNpcGlyph(thisNpc, data.Texts.tutorial));
									
										p = world.findActor(thisNpc.player, true);
										p && p.onNpcFocus && p.onNpcFocus(thisNpc);
									}
									else thisNpc.onInteract && thisNpc.onInteract(thisNpc, world, scene, game, data);
								} else {
									if(!thisNpc.data.isTrigger) {
										p && p.onNpcBlur && p.onNpcBlur(thisNpc);
										game.Flags.inLevel && glyph && glyph.hide();
									}
									else thisNpc.onInteract && thisNpc.onInteract(thisNpc, world, scene, game, data);
								}
								
							}

							if (active != thisNpc.npc_active && !thisNpc.data.isTrigger) {
								active = thisNpc.npc_active;
								if (!active) {
									glyph && glyph.hide();
									p && p.onNpcBlur && p.onNpcBlur(thisNpc);
								}
							}

							if ((focus || thisNpc.triggerInteract) && !thisNpc.data.isTrigger) {
								//Listen to input
								bA = (game.Input[(world.findActor(thisNpc.player, true) || {})._playerInput] || {}).A;
								
								bA && game.Multiplayer.isGuest && (bA = false);
								
								if ((bA || thisNpc.triggerInteract) && !A_press && !thisNpc.interacting && !game.Flags.inEquipCard) {
									A_press = true;
									thisNpc.triggerInteract = false;
									
									//WiFi Multiplayer sync
									game.Multiplayer.isHost && game.Multiplayer.sendToGuest('DISPATCH_EVENT',["npcinteract",[thisNpc.name, (thisNpc.player||{}).name]]);
									
									//Execute action
									thisNpc.interacting = true;
									thisNpc.onInteract && thisNpc.onInteract(thisNpc, world, scene, game, data);
									glyph && glyph.hide();
									p && p.onNpcBlur && p.onNpcBlur(thisNpc);
									sceneData.npc.currentNpc = thisNpc.name;

									//Players go to position
									var plyrs = world.findActorsByTagName('player', true),
									plyr = null,
									pTargetPos = thisNpc.data.playerTalkPosition,
									pTargetFacing = thisNpc.data.playerFacing;
									
									if (pTargetPos !== false) {
										for (var a = 0; a < plyrs.length; a++) {
											plyr = plyrs[a];
											plyr.flags.controllable = false;
											plyr.flags.shooting = false;
											plyr.updateAnimations = true;
											plyr._npc_targetPos = !plyrs[a-1] ? pTargetPos: pTargetPos - (plyrs[a-1].Sprite.w+30);
											plyr.onRemove && plyr.onRemove();
											plyr._npc_positioned = false;
											plyr._axis_wait = undefined;
										}
										//Check	for all players to reach position
										world.removeTask('PlayersReachedPosition-'+thisNpc.name);
										world.addTask('PlayersReachedPosition-'+thisNpc.name, 0, Infinity, function() {
											plyrs = world.findActorsByTagName('player', true);
											for (var a = 0, positioned = plyrs.length; a < plyrs.length; a++) {
												plyr = plyrs[a];
												if (data[plyr.name]) {
													var pf = plyr.flags,
													pv = plyr.data;

													//If player joined after dialog started
													if (plyr._axis_wait === undefined) {
														pf.controllable = false;
														pf.shooting = false;
														plyr.updateAnimations = true;
														plyr._npc_targetPos = !plyrs[a-1] ? pTargetPos: pTargetPos - (plyrs[a-1].Sprite.w+30);
														plyr.onRemove && plyr.onRemove();
														plyr._npc_positioned = false;
														plyr._axis_wait = 18;
													}
														!plyr._npc_positioned ? (plyr.x > plyr._npc_targetPos - plyr.Sprite.w/3 && plyr.x < plyr._npc_targetPos + plyr.Sprite.w/3) ? (
														positioned--,
														plyr._npc_positioned = true,
														pTargetFacing ? (pf.move_x_axis = pTargetFacing,
															plyr._baseSpeed = pv.baseSpeed,
															pv.baseSpeed = 0,
															//Face to direction
															plyr.setTimeout(function(task) {
																task.data.flags.move_x_axis = 0;
																task.data.setTimeout(function(tp) {
																	tp.data.data.baseSpeed = tp.data._baseSpeed;
																	delete tp.data._axis_wait;
																}, 0.5);
															}, 1/60)
														): pf.move_x_axis = 0
													): (pf._axis_wait < 18 ? pf._axis_wait++: (pf._axis_wait = 0, pf.move_x_axis = plyr.x < plyr._npc_targetPos ? 1: -1)): positioned--;

												}
											}

											if (positioned <= 0) {
												world.removeTask('PlayersReachedPosition-'+thisNpc.name);
												thisNpc.onPlayersReachedPosition && thisNpc.onPlayersReachedPosition();
												return;
											}
										});
									}

								} else if (!bA) A_press = false;

							}
							thisNpc.player_focus = false;
							
						}
					})(npc,
						world,
						scene,
						game,
						sceneData);

				}
			}
		}
	}
	
	//Sync event
	scene.events.on('npcinteract', evtdata => {
		if(game.Multiplayer.isGuest) {
			var npc = world.findActor(evtdata[0],true),
			player = world.findActor(evtdata[1],true);
			if(npc) {
				npc.player = player;
				npc.interacting = false;
				npc.player_focus = true;
				npc.triggerInteract = true;
			}
		}
	});
	
	return myexports;
};