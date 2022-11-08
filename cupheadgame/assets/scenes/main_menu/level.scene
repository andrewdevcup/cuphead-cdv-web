b5.LoadScene = function(world, scene, data, game) {
	//scene is the main scene where resources and actors will be added
	//game is equivalent to b5.Game where there's things like the loading screen, scene loader, player, configs and	more.
	//you should add local variables on data object, for them to be removed when another scene is being loaded, for global variables add them to game or write it to a file.

	game.GUI.disableButtons('Pause');
	
	//Update presence in discord
	game.DiscordSession.updateActivity({
  	details: "Main Menu",
  	state: "Don't Deal With The Devil"
  });

	//Background
	var bg = new b5.Actor;
	bg.x = bg.y = 0;
	bg.setSize(1414, 841);
	bg._scale = 0.98;
	bg.name = 'SecTitleScreenBG';
	bg.bitmap = scene.findResource('CupheadSecondaryTitleScreen', 'bitmap');
	world.addActor(bg);
	bg.fit = b5.Actor.FitBest;
	
	if(game.Flags.spookyMode) bg.tint_colour = 'salmon';

	bg.shake_funcX = b5.generateRandomMovement(20);
	bg.shake_funcY = b5.generateRandomMovement(20);
	bg.timer = 0;
	bg.onTick = function() {
		this.timer += 0.02 * game.speed;
		this._x = this.shake_funcX(this.timer)*11;
		this._y = this.shake_funcY(this.timer)*11;
	}
	
	data.createSlot = function(index) {
		//Slot background (1=outline,2=cuphead,3=mugman)
		var slot = new b5.Actor;
		slot.atlas = scene.findResource('SactxSlotSelectAtlas', 'brush');
		slot.name = "Slot-"+index;
		slot.current_frame = 1;
		slot.id = index;
		slot.name_slot = "";
		
		switch(index) {
			case 0: slot.name_slot = "A"; break;
			case 1: slot.name_slot = "B"; break;
			case 2: slot.name_slot = "C";
		}
		
		slot.selected = false;
		slot.data = {mapDataManager:{currentMap:3}}; //game.s["slot"+index];
		slot.completion = 0;//Math.round(game.SlotUtils.getSlotCompletion(index)*100);
		
		//Slot index label (player name, completion)
		var slotLabel = new b5.LabelActor;
		slotLabel.font = scene_GUI.findResource('CupheadVogueExtraBoldFont','brush');
		slotLabel.fill_style = "#1e1e1e";
		slotLabel._scale = 0.85;
		slot.addActor(slotLabel);
		
		//Current map 
		var slotsub = new b5.LabelActor;
		slotsub.font = scene_GUI.findResource('CupheadVogueBoldFont','brush');
		slotsub.fill_style = "#1e1e1e";
		slotsub._scale = 0.8;
		slot.addActor(slotsub);
		slot.mainLabel = slotLabel;
		slot.subLabel = slotsub;
		
		//Star
		var slotstar = new b5.Actor();
		slotstar.atlas = slot.atlas;
		slotstar.x = 235;
		slotstar.y = 30;
		slotstar.current_frame = 6;
		slotstar.visible = false;
		slot.addActor(slotstar);
		
		slot.star = slotstar;
		
		slot.select = function() {
			this.mainLabel.fill_style = 
			this.subLabel.fill_style = "#d5c2b0";
			this.selected = true;
			
			//Completion star
			this.star.visible = !this.is_new && this.completion >= 100;
			if(this.completion >= 100 && this.completion < 200) this.star.current_frame = 7;
			else if(this.completion >= 200) this.star.current_frame = 9;
		}
		
		slot.deselect = function() {
			this.current_frame = 1;
			this.mainLabel.fill_style =
			this.subLabel.fill_style = "#1e1e1e";
			this.selected = false;
			
			//Completion star
			this.star.visible = !this.is_new && this.completion >= 100;
			if(this.completion >= 100 && this.completion < 200) this.star.current_frame = 6;
			else if(this.completion >= 200) this.star.current_frame = 8;
		}
		
		slot.setNew = function() {
			this.mainLabel._y = 10;
			this.subLabel.visible = false;
			this.star.visible = false;
			this.is_new = true;
		}
		
		slot.setGeneral = function() {
			this.mainLabel._y = -10;
			this.subLabel._y = 34;
			this.subLabel.visible = true;
			this.is_new = false;
		}
		
		slot.onTick = function() {
			var txt = game.Texts.texts;
			
			if(game.SaveSlots['slot'+this.id]) {
				slot.data = game.SaveSlots["slot"+this.id];
	    	slot.completion = Math.round(game.SlotUtils.getSlotCompletion(index)*100);
	    	
	    	this.current_frame = this.selected ? this.data.isPlayer1Mugman ? 3 : 2 : 1;
			}
			if(this.is_new) this.mainLabel.text = txt.slot_select_new;
			else {
				this.mainLabel.text = (this.data.isPlayer1Mugman ?
					txt.mugman : txt.cuphead) + ' - '+
					this.completion + '%';
				this.subLabel.text = txt[txt["slot_select_map_" + this.data.mapDataManager.currentMap]];
			}
		}
		
		slot.setNew();
		
		return slot;
	}
  
	//Text
	var menulabel = new b5.LabelActor;
	menulabel.font = scene_GUI.findResource('CupheadVogueExtraBoldFont', 'brush');
	menulabel.name = "MainMenuLabel";
	menulabel.line_height = 45; //42
	menulabel._scale = 0.85;//
	menulabel.y2 = -120;//-100
	menulabel.round_pixels = false;
	world.addActor(menulabel);
	menulabel.text = "placeholder";
	menulabel.fill_style = "#575755";
	//Text selection
	data.menu_label_selection = 1;
	data.menu_option_length = 4;
	//Draw
	menulabel.onDraw = function() {
		var txt = game.Texts.texts;
		
		this.text = txt.main_menu_start + "\n"+
		            txt.main_menu_options + "\n"+
		            (game.DiscordLogged ? txt.main_menu_discord_off : txt.main_menu_discord_on) +"\n"+
		         //   txt.main_menu_dlc +"\n"+
		            txt.main_menu_credits;

		this.setFormatLine(data.menu_label_selection-1, 0, 0, ['white'], true);
	}

	//Input data
	data.axis_y_pressed = true;
	data.btnA_pressed = true;

  //Discord user avatar and name
  let Davatar = new b5.Actor(),
  Dname = new b5.LabelActor();
  
  Davatar.setSize(110,110);
  Davatar.setPosition(480,-230);
  Dname.setPosition(480,-145);
  Dname._scale = 0.55;
  Dname.line_height = 45;
  Davatar.name = "DiscordAvatar"
  Dname.name = "DiscordName";
  Dname.font = scene_GUI.findResource('CupheadMemphisFont','brush');
  
  world.addActor(Davatar);
  world.addActor(Dname);
  
  Davatar.visible = Dname.visible = false;
  
  if(game.DiscordLogged) {
  	if(!game.DiscordSession.started) void 0;/* game.DiscordSession.start(game.DiscordSession.data.token, true).then(fg => {
	 	 Davatar.visible = Dname.visible = true;
    
	   Davatar.bitmap = scene.addResource(
  	  	new	b5.Bitmap('davatar', game.DiscordSession.data.avatarUrl),
    	  'bitmap');
      
  	  Dname.text = game.DiscordSession.data.username + "\n" + (game.DiscordSession.data.discriminator||"");
  	});*/
  	else {
  		Davatar.visible = Dname.visible = true;
    
	   Davatar.bitmap = new b5.Bitmap('davatar', game.DiscordSession.data.avatarUrl);
      
  	  Dname.text = game.DiscordSession.data.username// + "\n" + (game.DiscordSession.data.discriminator||"");

  	}
  }

	//Prepare save data
	/*
	scene.findResource('SaveSlot0Data', 'raw').onload = function(data) {
		game.SaveSlots.slot0 = JSON.parse(this.data);
	};
	scene.findResource('SaveSlot1Data', 'raw').onload = function() {
		game.SaveSlots.slot1 = JSON.parse(this.data);
	};
	scene.findResource('SaveSlot2Data', 'raw').onload = function() {
		game.SaveSlots.slot2 = JSON.parse(this.data);
	};*/

	//Save created check
	data.checkSessionStarted = function(slotData, output) {
		var mapDataManager = slotData.mapDataManager;
		if (mapDataManager.mapData == "") {
			output && output({
				sessionStarted: false,
				currentMap: mapDataManager.currentMap
			});
			return false;
		}
		for (var i = 0; i < mapDataManager.mapData.length; i++) {
			if (mapDataManager.currentMap == mapDataManager.mapData[i].mapId &&
				mapDataManager.mapData[i].sessionStarted) {
				output && output({
					sessionStarted: true,
					currentMap: mapDataManager.currentMap
				});
				return true;
			}
		}
	};

	//Save slots screen

	data.selected_slot = 1;
	
	var slotsCard = new b5.Actor;
	slotsCard.atlas = scene.findResource('SactxSlotSelectAtlas', 'brush');
	slotsCard.current_frame = 0;
	slotsCard.name = "SlotSelectionBG";
	world.addActor(slotsCard);
	slotsCard._av = false;

	//Slots page (for multiplayer)
	data.slot_page = "LocalSaves";
	
	var s0 = data.createSlot(0),
	s1 = data.createSlot(1),
	s2 = data.createSlot(2);
	
	s0.y = -190;
	s1.y = s0.y + 159;
	s2.y = s1.y + 159;
	
	slotsCard.addActor(s0);
	slotsCard.addActor(s1);
	slotsCard.addActor(s2);

	//PLAYER SELECTION

	//Slot selection bg bottom character
	var slotbgch = new b5.Actor;
	slotbgch.atlas = scene.findResource('SactxSlotSelectAtlas', 'brush');
	slotbgch.current_frame = 4; //Alignment
	slotbgch.name = "SlotSelectionBottomCharacter";
	slotbgch.y = 238;
	slotbgch.x = 1;
	slotbgch.round_pixels = false;
	slotsCard.addActor(slotbgch);
	slotbgch.visible = false;

	//Player select screen

	data.current_player = 0;

	var pselectscr = new b5.RectActor;
	pselectscr.setSize(1280, 720);
	pselectscr.fill_style = "black";
	pselectscr.name = "PlayerSelectScreen";
	pselectscr.opacity = 0.5;
	pselectscr._av = false;
	world.addActor(pselectscr);

	//Selection background

	var pselectbg = new b5.Actor;
	pselectbg.atlas = scene.findResource('SactxSlotSelectAtlas', 'brush');
	pselectbg.current_frame = 2; //Alignment (cuphead);
	pselectbg.name = "PlayerSelectBG"
	pselectscr.addActor(pselectbg);
	pselectbg.round_pixels = false;
	pselectbg.use_parent_opacity = false;
	pselectbg.scale = 1;

	//Selection background position
	data.player_select_bg_y = 0;

	//Select player label
	var pselectlab = new b5.LabelActor;
	pselectlab.font = scene_GUI.findResource('CupheadVogueBoldFont', 'brush');
	pselectbg.addActor(pselectlab);
	pselectlab.setPosition(-135, -10);
	pselectlab._scale = .75;
	pselectlab.line_height = 45;
	pselectlab.fill_style = "#d5c2b0";
	pselectlab.name = "PlayerSelectLabel"
	pselectlab.onTick = function() {
		this.text = game.Texts.texts.player_select;
	}

	//Player selection characters
	//Now based on characters on player/players.json
	data.character_select_index = 0;
	data.playersSelect = [];
	
	var plist = scene.findResource('PlayersList','raw');
	
	if(plist) {
		plist = JSON.parse(plist.data).characters;
		for(var i = 0, x = 57.5, y = 0; i < plist.length; i++) {
			var p = new b5.Actor();
			p.atlas = scene.findResource(plist[i]+':PLAYER_SELECT', "brush"),
			p.name = plist[i];
			p.setPosition(x,y + (i == 0 ? 3 : 0));
			p.playAnim('idle_lines',true);
			p.onAnimEnd = function() {
				this.playAnim('idle',true);
			}
			x += 128;
			pselectbg.addActor(p);
			data.playersSelect.push(p);
		}
	}

	//Called when player has been selected
	//Load either book introduction scene (if not sessionStarted) or last scene (mapId and currentMap)
	data.startGame = function() {
		//Set as current save slot
		game.setCurrentSaveSlot(data.selected_slot-1);
		data.checkSessionStarted(game.SaveSlots.currentSaveSlot,
			function(savedata) {
				//Stop updating slots data
				slotsCard.active = false;
				//Set player1 as mugman or cuphead
				game.SaveSlots.currentSaveSlot.isPlayer1Mugman = !!data.current_player;

				if (!savedata.sessionStarted) {
					//Load book	introduction
					game.LoadScene('intro_book_cutscene', false, true, {
						show_anim: 'fade', show_speed: 0.35, hide_anim: 'fade', hide_speed: 1.1
					});

				} else {
					//Load last map
					app.debug && console.log('Load: '+savedata.currentMap);
					game.LoadScene(game.contents.maps[savedata.currentMap], false, true, {
						show_anim: 'fade', show_speed: 0.35, hide_anim: 'open',	hourglass: true
					});
				}
			});
	}
};

b5.onLoadingScreenOut = function(world, scene, data, game) {
	//Called when the loading screen is fading out, here you can start animating your actors and do whatever you want!

	var slotsCard = world.findActor('SlotSelectionBG');

	//Indicate that user is in a menu
	game.Flags.inSomeMenu = true;
	//Udpate input for selection
	world.findActor('MainMenuLabel').onTick = function() {
		var axis_y = Math.round(game.Input.player1.axis_y);
		btnA = game.Input.player1.A;

		//Don't do anything if user is in PauseMenu
		if (!game.Flags.inPauseMenu && !slotsCard.visible) {
			//Update main label index
			if (axis_y && !data.axis_y_pressed) {
				data.axis_y_pressed = true;
				//On Axis
				data.menu_label_selection += axis_y;
				if (data.menu_label_selection == data.menu_option_length+1) data.menu_label_selection = 1; //Reset to first
				if (data.menu_label_selection == 0) data.menu_label_selection = data.menu_option_length; //Set to last
				//Play select sfx (reuse from PauseMenu)
				game.PauseMenu.playSfx();
			} else if (!axis_y) data.axis_y_pressed = false; //Reset

			//ButtonA
			if (btnA && !data.btnA_pressed) {
				data.btnA_pressed = true;
				//Play select sfx (reuse from PauseMenu)
				game.PauseMenu.playSfx();
				//Do actions
				switch (data.menu_label_selection) {
					case 1: //Start
						slotsCard._av = true;
						this._av = false;
						game.Flags.pausingEnabled = false;
						break;
					case 2: //Options
						//Show pause menu
						game.PauseMenu.show();
						break;
					case 3: //Discord
						if(!game.DiscordLogged) {
							var ps = promptAsync(game.Texts.texts.discord_token);
							sceneMain.active = false;
							
							ps.then(tk => {
					  		if(tk) game.DiscordSession.start(tk, true).then(f => {
									game.DiscordLogged = true;
								
									var dav = world.findActor('DiscordAvatar',true),
									dna = world.findActor('DiscordName',true);
								
									dav.visible = dna.visible = true;
								
								  dav.bitmap = scene.addResource(
  								 	new	b5.Bitmap('davatar', game.DiscordSession.data.avatarUrl),
  						  	 'bitmap');
      
  								 dna.text = game.DiscordSession.data.username;// + "\n" + game.DiscordSession.data.discriminator;
								});
								sceneMain.active = true;
							});
							ps.catch(tk => {
								sceneMain.active = true;
							});
						}
						else {
							//Logout
							game.DiscordSession.logout();
							var dav = world.findActor('DiscordAvatar',true),
							dna = world.findActor('DiscordName',true);
								
							dav.visible = dna.visible = false;
						}
						break;
				/*	case 4: //DLC
					
					break;*/
					case 4: //Credits
					  if(!game.SceneLoader.load_scene) game.LoadScene('credits',true,true,{
					  	hide_anim: 'fade',
					  	hide_speed: 0.3,
					  	show_anim: 'fade',
					  	show_speed: 0.3,
					  	hourglass: false
					  });
				//		navigator.app ? navigator.app.exitApp(): window.close();
						break;
				}
			} else if (!btnA) data.btnA_pressed = false;

		}
	};

	//Slots and data

	var playselectscr = world.findActor('PlayerSelectScreen'),
	playselectbg = playselectscr.findActor('PlayerSelectBG');

	//Slots update

	slotsCard.onAVChanged = function(av) {
		//When showing the slots, set all inputs to be registered as pressed to prevent registering an input when holding the	button
		this.axis_y_pressed = true;
		this.btnA_pressed = true;
		this.btnB_pressed = true;
		this.btnR_pressed = true;
		this.btnX_pressed = true;
		
		if(av) {
			//Set ui buttons
			b5.Game.UiButtons.setButtons([
				{
					"text": "texts.ui_multiplayer",
					"actionButton": "lock"
				},
				{
					"text": "texts.ui_confirm",
					"actionButton": "jump"
				},
				{
					"text": "texts.ui_delete",
					"actionButton": "dash"
				},
				{
					"text": "texts.general_back",
					"actionButton": "shoot"
				}
			]);
			b5.Game.UiButtons.show();
		}
		
	}
	
	data.onresumeevt = app.events.on('resume', u=>{
		b5.Game.UiButtons.show();
		b5.Game.UiButtons.setButtons([
/*			{
				text: b5.Game.DiscordLogged ? "texts.main_menu_discord_off":"texts.main_menu_discord_on",
				actionButton: "wpn"
			},*/
			{
				"text": "texts.ui_confirm",
				"actionButton": "jump"
			}
		]);
		
	});
	
	data.onresumeevt.func();
	
	var s0 = slotsCard.findActor('Slot-0'),
	s1 = slotsCard.findActor('Slot-1'),
	s2 = slotsCard.findActor('Slot-2');
	
	s0.select();
	
	//Check session
	game.SlotUtils.isSessionStarted(0) && s0.setGeneral();
	game.SlotUtils.isSessionStarted(1) && s1.setGeneral();
	game.SlotUtils.isSessionStarted(2) && s2.setGeneral();
	
	//Update selection
	slotsCard.onTick = function() {
		var axis_y = Math.round(game.Input.player1.axis_y),
		btnA = game.Input.player1.A,
		btnB = game.Input.player1.B,
		btnR = game.Input.player1.R,
		btnX = game.Input.player1.X;

		//Update slot selection

		//For local saves
		switch (data.slot_page) {
			case "LocalSaves":

				if (axis_y && !this.axis_y_pressed) {
					this.axis_y_pressed = true;
					//On Axis
					data.selected_slot += axis_y;
					if (data.selected_slot == 4) data.selected_slot = 1; //Reset to first
					if (data.selected_slot == 0) data.selected_slot = 3; //Set to last
					//Play select sfx (reuse from PauseMenu)
					game.PauseMenu.playSfx();
					
					switch(data.selected_slot) {
						case 1: 
							s0.select();
							s1.deselect();
							s2.deselect();
							break;
						case 2:
							s0.deselect();
							s1.select();
							s2.deselect();
							break;
						case 3:
							s0.deselect();
							s1.deselect();
							s2.select();
							break;
					}
				} else if (!axis_y) this.axis_y_pressed = false; //Reset

				//BUTTON B

				if (btnB && !this.btnB_pressed) {
					this.btnB_pressed = true;
					//Go back
					slotsCard._av = false;
					world.findActor('MainMenuLabel')._av = true;
					game.PauseMenu.playSfx();
					game.Flags.pausingEnabled = true;
					
					b5.Game.UiButtons.setButtons([{
						"text": "texts.ui_confirm",
						"actionButton": "jump"
					}]);
		
				} else if (!btnB) this.btnB_pressed = false; //Reset

				//BUTTON A

				if (btnA && !this.btnA_pressed) {
					this.btnA_pressed = true;
					//Select slot
					playselectscr._av = true;
					playselectbg._av = true;
					
					//Stop updating this section
					this.active = false;

					playselectbg._y = s0.y + ((data.selected_slot-1) * 159);

					var isPlayer1Mugman = game.SaveSlots['slot' + (data.selected_slot-1)].isPlayer1Mugman;
					//Set color
					playselectbg.current_frame = isPlayer1Mugman ? 3: 2;
					//Animate
					playselectbg.tweening = true;
					playselectbg.TweenFrom('opacity', 0, 0.22, b5.Ease.cubicout);
					playselectbg.TweenFromWithEnd('_scale', 1.3, 0.22, b5.Ease.cubicout, false, function() {
						playselectbg.tweening = false; //Enable input listening
					});

					//Display bottom character
					var ssbottomch = slotsCard.findActor('SlotSelectionBottomCharacter');
					ssbottomch._av = true;
					//Set character text
					ssbottomch.current_frame = playselectbg.current_frame +2;
					
					data.current_player = isPlayer1Mugman ? 1 : 0;
					
					//Set active character
					for(var i = 0, s = data.playersSelect; i < s.length; i++)
						i != data.current_player ? (s[i].current_anim != "idle_lines" && s[i].playAnim('idle_lines',true))
						: s[i].playAnim('idle',true);
						
					game.PauseMenu.playSfx();
				} else if (!btnA) this.btnA_pressed = false; //Reset

				//BUTTON X (DELETE)
				if(btnX && !this.btnX_pressed) {
					this.btnX_pressed = true;
					
					//Find selected slot 
					const selsl = data.selected_slot-1,
					sl = slotsCard.findActor('Slot-' + selsl, true),
					saveName = sl.mainLabel.text,
					sav = b5.Paths.saves + 'cuphead_player_data_v1_slot_'+ selsl + '.sav';
					
					//If slot is new don't show delete dialog
					if(sl.is_new) return;
					
					data.slot_page = "SlotDeleteConfirm";
					
					let confirmPromise = game.Confirm(
						game.Texts.texts.slot_delete,
						saveName,
						game.Texts.texts.confirm_yes,
						game.Texts.texts.confirm_no
					);
					
					game.PauseMenu.playSfx();
					//Yes
					confirmPromise.then( f => {
						sl.setNew();
						data.slot_page = "LocalSaves";
						slotsCard.btnA_pressed = true;
						
						//Copy default slot data
						console.log("Saving data... " + selsl);
						b5.File.delete(sav, 'file');
		      	setTimeout(f => 
		      	  b5.File.extractAsset(internalDir + 'saves/cuphead_player_data_v1_slot_'+selsl+'.sav', sav, g =>
		      	    game.SaveSlots["slot" + selsl] = JSON.parse(b5.File.readSync(sav))
		      	  )
		      	, 50);
					});
					//No
					confirmPromise.catch( f => {
						data.slot_page = "LocalSaves";
						slotsCard.btnA_pressed = true;
						slotsCard.btnB_pressed = true;
					});
					
				}
				else if (!btnX) this.btnX_pressed = false;

				//BUTTON R (Switch to Multiplayer)

				if (btnR && !this.btnR_pressed) {
					this.btnR_pressed = true;
					game.PauseMenu.playSfx();
					data.slot_page = "MultiplayerRoom";
					

					//Look for rooms
					
					game.Multiplayer.setGuest(function() {
						//Query host slot data and set it as current
						var mul = game.Multiplayer,
						slotDataGetEvt = mul.events.on('guest:onmessage', function(m) {
							var r = m.split("Ξ");
							if(+r[0] == 0) {
								//Set slot data
								var data = JSON.secParse(r[1]);

								game.SaveSlots.currentSaveSlot = data.saveslot;
								game.SlotUtils.parseDialoguerVariables();
								game.Flags = data.flags;
								game.Flags.inLevel = false;
								game.Flags.inWorldmap = false;
								game.Flags.pausingEnabled = false;
								
								mul.events.off(slotDataGetEvt);
								
								//Load scene where player 1 is at
								mul.guest.send('1Ξ');
								
								var curLevelEvt = mul.events.on('guest:onmessage', function(l) {
									var r = l.split("Ξ");
									if(+r[0] == 1) {
										var data = JSON.secParse(r[1]);
										
										mul.startGuest();
										
										game.LoadScene(data.currentScene, false, true, {
											show_anim: 'fade', show_speed: 0.34, hide_anim: 'open', hourglass: true
										});
										
										mul.events.off(curLevelEvt);
									}
								});
							}
						});
						mul.isGuest = true;
						var openEvt = mul.events.on('guest:open', function() {
					  	mul.guest.send('0Ξ'); //Query slot data
					  	mul.events.off(openEvt);
						});
						
					}, function() {
						sceneMain.active = true;
						b5.Game.Multiplayer.isGuest = false;
						data.slot_page = "LocalSaves";
					});
				  
				} else if (!btnR) this.btnR_pressed = false;
				
				if (btnR && !this.btnR_pressed) {
					this.btnR_pressed = true;
					
				} else if (!btnR) this.btnR_pressed = false;

				break;
			  case "MultiplayerRoom":
			  	if (btnB && !this.btnB_pressed) {
					this.btnB_pressed = true;
					//Go back
					slotsCard._av = false;
					world.findActor('MainMenuLabel')._av = true;
					game.PauseMenu.playSfx();
					game.Flags.pausingEnabled = true;
					
					b5.Game.UiButtons.setButtons([{
						"text": "texts.ui_confirm",
						"actionButton": "jump"
					}]);
					
					b5.Game.Multiplayer.guest.close();
					b5.Game.Multiplayer.isGuest = false;
					data.slot_page = "LocalSaves";
		
				} else if (!btnB) this.btnB_pressed = false; //Reset
			  break;
		}
	}

	//PLAYER SELECT SCREEN

	playselectscr.onAVChanged = function() {
		playselectbg.axis_x_pressed = true;
		playselectbg.btnA_pressed = true;
		playselectbg.btnB_pressed = true;
	}

	playselectbg.onTick = function() {
		var axis_x = Math.round(game.Input.player1.axis_x),
		btnA = game.Input.player1.A,
		btnB = game.Input.player1.B;

		//Wait for tween animation to end
		if (!this.tweening && !data.start_game) {
			//Update player select
			if (axis_x && !this.axis_x_pressed) {
				this.axis_x_pressed = true;
				//Select player
				data.current_player += axis_x;
				data.current_player >= data.playersSelect.length && (data.current_player = 0);
				data.current_player < 0 && (data.current_player = data.playersSelect.length-1);

				//Set active character
				for(var i = 0, s = data.playersSelect; i < s.length; i++)
					i != data.current_player ? (s[i].current_anim != "idle_lines" && s[i].playAnim('idle_lines',true))
					: s[i].playAnim('idle',true);

				//Change Background color
				playselectbg.current_frame = !data.current_player ? 2: 3;

				//Set character text
				var ssbottomch = slotsCard.findActor('SlotSelectionBottomCharacter');
				ssbottomch.current_frame = playselectbg.current_frame +2;

				game.PauseMenu.playSfx();
			} else if (!axis_x) this.axis_x_pressed = false;

			//BUTTON A SELECT PLAYER AND START

			if (btnA && !this.btnA_pressed) {
				this.btnA_pressed = true;

				//THIS STOPS ALL
				data.start_game = true;
				
				var completion = slotsCard.findActor('Slot-'+(data.selected_slot-1)).completion;
				data.playersSelect[data.current_player].playAnim(
					completion < 100 ? 'wink' :
					completion < 200 ? 'excited' :
					'ok'
				);
				
				world.setTimeout(a => data.startGame(),0.8);

				game.PauseMenu.playSfx();
			} else if (!btnA) this.btnA_pressed = false;

			//BUTTON B
			if (btnB && !this.btnB_pressed) {
				this.btnB_pressed = true;
				//Go back

				//Animate	background scale
				this.tweening = true;
				this.TweenToWithEnd('_scale', 1.3, 0.2, b5.Ease.cubicin, true, 0, function() {
					//On back animaton end
					playselectscr._av = false;
					playselectbg._av = false;
					//Enable slots
					slotsCard.active = true;
					//Restore values
					playselectscr.opacity = 0.5;
					playselectbg.tweening = false;
					playselectbg._scale = 1;
					var ssbottomch = slotsCard.findActor('SlotSelectionBottomCharacter');
					ssbottomch._av = false;
			});

			game.PauseMenu.playSfx();
		} else if (!btnB) this.btnB_pressed = false; //Reset
	}

};


};

b5.addSceneResources = function(scene, data, game) {
//Resources that will be added to scene, this will be called before LoadScene

//Background
var sec_bg = new b5.Bitmap('CupheadSecondaryTitleScreen', data.resourcePath + 'cuphead_secondary_title_screen.png', false);
scene.addResource(sec_bg, 'bitmap');

//SlotSelect Menu bitmap and atlas
var slot_select_bitmap = new b5.Bitmap('SactxSlotSelectBitmap', data.resourcePath + 'sactx_BC7_Slot_Select-optimized.png', false);
scene.addResource(slot_select_bitmap, 'bitmap');

var slot_select_atlas = new b5.ImageAtlas('SactxSlotSelectAtlas', [slot_select_bitmap]);
slot_select_atlas.parseFrames(b5.File.readSync(data.resourcePath + 'sactx_BC7_Slot_Select-optimized.csv'));
slot_select_atlas.parseAnims(b5.File.readSync(data.resourcePath + 'anims/player_select-outline.atlas.json'));
scene.addResource(slot_select_atlas, 'brush');

//Read save data
var slot0data = new b5.Raw('SaveSlot0Data', b5.Paths.saves + game.contents.sav[0], true, sd => {
	game.SaveSlots.slot0 = typeof sd == "string" ? JSON.parse(sd) : sd;
});
scene.addResource(slot0data, 'raw');

var slot1data = new b5.Raw('SaveSlot1Data', b5.Paths.saves + game.contents.sav[1], true, sd => {
	game.SaveSlots.slot1 = typeof sd == "string" ? JSON.parse(sd) : sd;
});
scene.addResource(slot1data, 'raw');

var slot2data = new b5.Raw('SaveSlot2Data', b5.Paths.saves + game.contents.sav[2], true, sd => {
	game.SaveSlots.slot2 = typeof sd == "string" ? JSON.parse(sd) : sd;
});
scene.addResource(slot2data, 'raw');

scene.addResource(
	new b5.Raw('PlayersList', b5.Paths.player + 'players.json', true, data => {
		var chars = JSON.parse(data).characters;
	  for(var i = 0; i < chars.length; i++)
	  	scene.addResource(
	  		new b5.Raw(chars[i]+'SelectRes', b5.Paths.player + chars[i] + '/player_select.json',true, pres => {
	  			game.parseResources(pres, scene);
	  		},true),
	  		'raw'
	  	);
	}, true),
	'raw'
);

};
b5.onSceneUnload = function(world, scene, data, game, clearResources) {
//Called when app is about to remove the scene, if clearResources is true, that means the app will clean the resources of the scene
//You can also remove created objects in b5.Game if they were created and used on the scene.

//Clear background music from previous scene (title)
//scene.removePersistentResources('raw'); //Data is now stored in game.SaveSlots
//For sounds, scene loader does it automatically when calling stopMusic or fadeOutMusic

  app.events.off(data.onresumeevt);
  app.events.off(data.discordlogevt)
};

