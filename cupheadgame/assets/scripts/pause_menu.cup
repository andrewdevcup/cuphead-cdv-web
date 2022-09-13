(function() {
	var pauseMenu = new b5.Actor();
	pauseMenu.x = pauseMenu.y = 0;
	pauseMenu.w = 1280;
	pauseMenu.h = 720;
	pauseMenu.data = {
		main_index: 1,
		opt_snd_index: 1,
		opt_vis_index: 1,
		opt_lang_index: 1,
		main_lvl_index: 1,
		main_wldm_index: 1,
		main_ctrls_index: 1,
		opt_ctrl_gui_index: 1,
		tweening: false,
		visible_time: 0,
		resolutions: [], //JSON.parse(b5.File.readSync(b5.Paths.scripts + 'resolutions.json')),
		language_list: [], //JSON.parse(b5.File.readSync(b5.Paths.texts + 'lang_list.json')),
		aspect_ratios: [],
		CreateOptionsLabel: function(name) {
			var container = new b5.Actor(),
			textPart = new b5.LabelActor(),
			optionPart = new b5.LabelActor();
			
			container.name = name;
			container._scale = 0.9;
			textPart.name = name +"-Text";
		  optionPart.name = name+"-Options";
		  textPart.fill_style = optionPart.fill_style = textColor;
	    textPart.line_height = optionPart.line_height = 41;
	    textPart.font = optionPart.font = voguefont;
	    
	    textPart.text_align = "right";
	    optionPart.text_align = "left";
	    
	    container.addActor(textPart);
	    container.addActor(optionPart);
	    
	    container.textPart = textPart;
	    container.optionPart = optionPart;
	    
	    return container;
		}
	};
	
	//Read resolutions
	new b5.Raw('PMResolutions',b5.Paths.scripts + 'resolutions.json',true, resolutions => {
		pauseMenu.data.resolutions = JSON.parse(resolutions);
	},true); //Sync
	
	//Read language list
	new b5.Raw('PMLanguageList',b5.Paths.texts + 'lang_list.json',true, list => {
		pauseMenu.data.language_list = JSON.parse(list);
	},true); //Sync
	
	//Read aspect ratios
	new b5.Raw('PMAspectRatios',b5.Paths.scripts + 'aspect_ratios.json',true, ratios => {
		pauseMenu.data.aspect_ratios = JSON.parse(ratios);
	},true); //Sync
	
	//Styles
	new b5.Raw('TextStyles',b5.Paths.scripts + 'styles.json',true, styles => {
		b5.Game.Styles = JSON.parse(styles);
	},true); //Sync
	
	scene_GUI.addActor(pauseMenu);
	pauseMenu.name = "PauseMenu";
	pauseMenu._layer = 4;

	var holdertext = "loading",
	textColor = b5.Game.Styles.text_pausemenu,
	textSelColor = b5.Game.Styles.text_pausemenu_selected,
	textGrayColor = b5.Game.Styles.text_pausemenu_gray;

	//Background dim
	var bg = new b5.RectActor();
	bg.w = 1280;
	bg.h = 720;
	bg.x = bg.y = 0;
	bg.fill_style = b5.Game.Styles.black_bg;
	bg.opacity = 0.45;
	bg.name = "PauseMenuBG";
	bg.fit = b5.Actor.FitSize;
	pauseMenu.addActor(bg);
	
	/**/
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
  
  pauseMenu.addActor(Davatar);
  pauseMenu.addActor(Dname);
  
  //For player 2
  let Davatar2 = new b5.Actor(),
  Dname2 = new b5.LabelActor();
  
  Davatar2.setSize(110,110);
  Davatar2.setPosition(480,-50);
  Dname2.setPosition(480,35);
  Dname2._scale = 0.55;
  Dname2.line_height = 45;
  Davatar2.name = "DiscordAvatar2"
  Dname2.name = "DiscordName2";
  Dname2.font = scene_GUI.findResource('CupheadMemphisFont','brush');
  
  pauseMenu.addActor(Davatar2);
  pauseMenu.addActor(Dname2);
  
  Davatar2.visible = Dname2.visible = !false;
  Davatar.visible = Dname.visible = !false;
  
  b5.Game.parseResources({
  	bitmap: [{
  		name: "playerOne:DiscordAvatarBitmap",
  		src: ""
  	}, {
  		name: "playerTwo:DiscordAvatarBitmap",
  		src: ""
  	}]
  }, scene_GUI);
  
  Davatar.bitmap = scene_GUI.findResource('playerOne:DiscordAvatarBitmap','bitmap');
  Davatar2.bitmap = scene_GUI.findResource('playerTwo:DiscordAvatarBitmap','bitmap');
  
  Dname.text = Dname2.text = "";
 
  pauseMenu.setDiscordAvatarsAndNames = function(p1Avt, p1N, p2Avt, p2N) {
  	if(p1Avt && p1N) {
  		Davatar.visible = Dname.visible = true;
  		Davatar.bitmap.reload(p1Avt);
  		Dname.text = p1N;
  	}
  	else Davatar.visible = Dname.visible = false;
  	
  	if(p2Avt && p2N) {
  		Davatar2.visible = Dname2.visible = true;
  		Davatar2.bitmap.reload(p2Avt);
  		Dname2.text = p2N;
  	}
  	else Davatar2.visible = Dname2.visible = false;
  }
  
  pauseMenu.updateAvatarDisplays = function() {
    //Update discord avatars and names
			let guest = b5.Game.Multiplayer.isGuest,
			logged = b5.Game.DiscordLogged,
			session = b5.Game.DiscordSession.data,
			p1Avt, p1Name, p2Avt, p2Name;
			
			if(!guest) {
				//Query host discord avatar and name (if logged)
				b5.Game.Multiplayer.sendToGuest('QUERY_DISCORD_UDATA');
			}
			else b5.Game.Multiplayer.sendToHost('QUERY_DISCORD_UDATA');
			
			if(!guest) {
				if(logged) {
					p1Avt = session.avatarUrl;
					p1Name = session.username;
					
					p2Avt = b5.Game.Multiplayer.guestAvatarUrl;
					p2Name = b5.Game.Multiplayer.guestUsername;
				}
			}
			else {
				if(logged) {
					p2Avt = session.avatarUrl;
					p2Name = session.username;
					
					p1Avt = b5.Game.Multiplayer.guestAvatarUrl;
					p1Name = b5.Game.Multiplayer.guestUsername;
				}
			}
			
			this.setDiscordAvatarsAndNames(
				p1Avt, p1Name, p2Avt, p2Name
			);
  }
  
  
  /**/

	//Pause card
	var pcardbtm = new b5.Bitmap('pauseCardBitmap', b5.Paths.assets + 'pause_menu.png', false);
	scene_GUI.addResource(pcardbtm, 'bitmap');

	var maincard = new b5.Actor();
	maincard.bitmap = pcardbtm;
	maincard.x = maincard.y = 0;
	maincard.w = 512;
	maincard.h = 296;
	pauseMenu.addActor(maincard);
	maincard.layer = 1;
	pauseMenu.mainCard = maincard;
	maincard.name = 'MainOptionsCard';

	//Load fonts
	
	var voguefont = scene_GUI.findResource('CupheadVogueExtraBoldFont','brush');
	
	//Menu Sfx
	var menuselectsfx = new b5.Sound('MenuSelectSfx', b5.Paths.assets + 'Menu_Category_Select.ogg', false, true);
	menuselectsfx.global_stream = true;
	scene_GUI.addResource(menuselectsfx, 'sound');
	b5.Game.Sfx.add(menuselectsfx);
	
	var menumovesfx = new b5.Sound('MenuSelectLevelSfx', b5.Paths.assets + 'Menu_Move.ogg', false, true);
	menumovesfx.global_stream = true;
	scene_GUI.addResource(menumovesfx, 'sound');
	b5.Game.Sfx.add(menumovesfx);

	//Options card

	var optcardbtm = new b5.Bitmap('OptionsCardBitmap', b5.Paths.assets + 'options_bg.png', false);
	scene_GUI.addResource(optcardbtm, 'bitmap');

	var optcard = new b5.Actor();
	optcard.w = 592;
	optcard.h = 524;
	optcard.bitmap = optcardbtm;
	pauseMenu.addActor(optcard);
	optcard.layer = 2;
	pauseMenu.optionsCard = optcard;
	optcard._av = false;

	optcard.slider = function(value) {
		var slider = '-----------'.split('');
		for (var i = 0; i < slider.length; i++) {
			if (i/slider.length > value - 0.1) {
				slider[i] = '|';
				return slider.join('');
			}
		}
	}
	optcard.yesno = function(bool, txtyes, txtno) {
		return txtyes && txtno ? (bool?txtyes:txtno) : b5.Game.Texts.texts['general_'+(bool?'on':'off')]
	}
	
	//WARNING / DIALOG CARD
	

	/*
	*
	* LABELS AND SECTIONS
	*
	*/

	//Labels for maincard pause menu
	var mainlabel = new b5.LabelActor();
	mainlabel.font = voguefont;
	mainlabel.x = mainlabel.y = 0;
	maincard.addActor(mainlabel);
	mainlabel.fill_style = textColor;
	mainlabel._scale = 0.9;
	mainlabel.line_height = 41;
	mainlabel.y2 = -77;
	mainlabel.text = holdertext;

	mainlabel.onAVChanged = function(av) {
		this.axis_y_pressed = true;
		this.timer = 0;
		this.btnA_pressed = true;
		this.btnB_pressed = true;
		if(av) pauseMenu.data.main_index = 1;
	}

	mainlabel.onTick = function() {
		var input = b5.Game.Input,
		isGuest = b5.Game.Multiplayer.isGuest,
		axis_y = Math.round(isGuest ? input.player2.axis_y : input.player1.axis_y || input.player2.axis_y),
		btnA = isGuest ? input.player2.A : input.player1.A || input.player2.A,
		btnB = isGuest ? input.player2.A : input.player1.B || input.player2.B,
		data = pauseMenu.data;

		//Update index
		if (!this.axis_y_pressed && axis_y) {
			this.axis_y_pressed = true;
			data.main_index += axis_y;
			data.main_index == 0 && (data.main_index = 5); //Set to last
			data.main_index == 6 && (data.main_index = 1); //Set to first
			pauseMenu.playSfx(); //Play sfx on index change

		} else if (!axis_y) {
			//Reset when axis value is zero (not holding)
			this.timer = 0;
			this.axis_y_pressed = false;
		}
		//Set index every few milliseconds when axis is holded
		this.axis_y_pressed && (this.timer < 9 ? this.timer += 1*b5.Game.speed: (this.timer = 0, this.axis_y_pressed = false));

		//Selection test
		if (btnA && !this.btnA_pressed) {
			var gv = b5.Game.Flags;
			this.btnA_pressed = true;
			pauseMenu.playSfx();
			(data.main_index != 5 || gv.inLevel || gv.inWorldmap) && (this._av = false);
			//Do actions
			switch (data.main_index) {
				case 1: //Audio
					optcard._av = true;
					aud_labelsec._av = true;
					data.opt_snd_index = 1;
					break;
				case 2: //Visual
					optcard._av = true;
					vis_labelsec._av = true;
					data.opt_vis_index = 1;
					break;
				case 3: //Controls
				  ctrlslabel._av = true;
				  ctrllabelsec._av = true;
					break;
				case 4: //Language
				  langlabelsec._av = true;
				  langlabelopt._av = true;
				  data.opt_lang_index = 1;
					break;
				case 5: //Back
					if(!gv.inWorldmap && !gv.inLevel) pauseMenu.hide();
					else {
						//Go back to wordmap or level menu
						gv.inWorldmap ? worldmaplabel._av = true : gv.inLevel && (levellabel._av = true);
					}
					break;
			}
		} else if (!btnA) this.btnA_pressed = false; //Reset

		if (btnB && !this.btnB_pressed) {
			this.btnB_pressed = true;
			pauseMenu.playSfx();
			var gv = b5.Game.Flags;
			//Go back to worldmap or level menu or close pause menu
			if(!gv.inWorldmap && !gv.inLevel) pauseMenu.hide();
			else {
				this._av = false;
				gv.inWorldmap ? worldmaplabel._av = true : gv.inLevel && (levellabel._av = true);
			}
		} else if (!btnB) this.btnB_pressed = false; //Reset
		
		//Text and format!
		var txt = b5.Game.Texts.texts;
		
		this.text = txt.pause_card_sound + "\n"+
		            txt.pause_card_visual + "\n"+
		            txt.pause_card_controls +"\n"+
		            txt.pause_card_language + "\n"+
		            txt.general_back;
		
	  this.setFormatLine(pauseMenu.data.main_index-1, 0, 0, [textSelColor], true);
	}
	maincard.label = mainlabel;

	//OPTIONS

	//AUDIO OPTIONS

	var aud_labelsec = new b5.LabelActor();
	aud_labelsec.font = voguefont;
	aud_labelsec.x = aud_labelsec.y = 0;
	optcard.addActor(aud_labelsec);
	aud_labelsec.name = "AudioLabelSection";
	aud_labelsec.fill_style = textColor;
	aud_labelsec.line_height = 41;
	aud_labelsec.y2 = -165;
	aud_labelsec._scale = .9;
	aud_labelsec.text = holdertext;
	aud_labelsec._av = false;
	
	aud_labelsec.onDraw = function() {
		var txt = b5.Game.Texts.texts,
		acfg = b5.Game.cfg.Audio,
		ix = pauseMenu.data.opt_snd_index-1,
		ox = txt.sett_sound_label_x;
		
		this.text = txt.sett_sound_master + ": " + optcard.slider(acfg.master)+"\n"+
								txt.sett_sound_sfx + ": " + optcard.slider(acfg.sfx)+"\n"+
								txt.sett_sound_mus + ": " + optcard.slider(acfg.music)+"\n"+
								txt.sett_sound_reverb + ': ' + optcard.yesno(acfg.reverb)+'\n'+
								"\n"+
								txt.general_back;
	  
	  this.clearFormat();
	  
		this.setFormatLine(0, 0, 0, [,,ox,,,,,,,'right']);
		this.setFormatLine(1, 0, 0, [,,ox,,,,,,,'right']);
		this.setFormatLine(2, 0, 0, [,,ox,,,,,,,'right']);
		this.setFormatLine(3, 0, 0, [,,ox - 585,,,,,,,'left']);
		
		this.setFormatLine(5, 0, 0, [ix == 4 ? textSelColor : textColor]);
		
		//Color
		this.applyFormatLine(0, (txt.sett_sound_master+"").length+2, 0, [ix == 0 ? textSelColor : textColor]);
		this.applyFormatLine(1, (txt.sett_sound_sfx+"").length+2, 0, [ix == 1 ? textSelColor : textColor]);
		this.applyFormatLine(2, (txt.sett_sound_mus+"").length+2, 0, [ix == 2 ? textSelColor : textColor]);
		this.applyFormatLine(3, (txt.sett_sound_reverb+"").length+2, 0, [ix == 3 ? textSelColor : textColor]);
	}


	aud_labelsec.onAVChanged = function() {
		this.axis_x_pressed = true;
		this.axis_y_pressed = true;
		this.timer = 0;
		this.slider_timer = 0;
		this.btnA_pressed = true;
		this.btnB_pressed = true;
	}

	aud_labelsec.onTick = function() {
		var input = b5.Game.Input,
		isGuest = b5.Game.Multiplayer.isGuest,
		axis_x = Math.round(isGuest ? input.player2.axis_x : input.player1.axis_x || input.player2.axis_x),
		axis_y = Math.round(isGuest ? input.player2.axis_y : input.player1.axis_y || input.player2.axis_y),
		btnA = isGuest ? input.player2.A : input.player1.A || input.player2.A,
		btnB = isGuest ? input.player2.A : input.player1.B || input.player2.B,
		data = pauseMenu.data;

		//UPDATE INDEX
		if (!this.axis_y_pressed && axis_y) {
			this.axis_y_pressed = true;
			data.opt_snd_index += axis_y;
			data.opt_snd_index == 0 && (data.opt_snd_index = 5); //Set to last
			data.opt_snd_index == 6 && (data.opt_snd_index = 1); //Set to first
			pauseMenu.playSfx(); //Play sfx on index change

		} else if (!axis_y) {
			//Reset when axis value is zero (not holding)
			this.timer = 0;
			this.axis_y_pressed = false;
		}
		//Set index every few milliseconds when axis is holded
		this.axis_y_pressed && (this.timer < 9 ? this.timer += 1*b5.Game.speed: (this.timer = 0, this.axis_y_pressed = false));

		//UPDATE SLIDER
		if (!this.axis_x_pressed && axis_x) {
			this.axis_x_pressed = true;
			var acfg = b5.Game.cfg.Audio;
			pauseMenu.playSfx();
			switch (data.opt_snd_index) {
				case 1: //MASTER
					acfg.master += axis_x * 0.1;
					acfg.master = b5.Maths.cap(acfg.master, 0, 1);
				break;
				case 2: //SFX
					acfg.sfx += axis_x * 0.1;
					acfg.sfx = b5.Maths.cap(acfg.sfx, 0, 1);
				break;
				case 3: //MUSIC
					acfg.music += axis_x * 0.1;
					acfg.music = b5.Maths.cap(acfg.music, 0, 1);
				break;
				case 4: //REVERB
				acfg.reverb = !acfg.reverb;
			}
			b5.Game.applyConfig("audio");
		} else if (!axis_x) {
			//Reset when axis value is zero (not holding)
			this.slider_timer = 0;
			this.axis_x_pressed = false;
		}
		//Set index every few milliseconds when axis is holded
		this.axis_x_pressed && (this.slider_timer < 9 ? this.slider_timer += 1*b5.Game.speed: (this.slider_timer = 0, this.axis_x_pressed = false));

		//Button A
		if (btnA && !this.btnA_pressed) {
			this.btnA_pressed = true;
			pauseMenu.playSfx();
			//Do actions
			if (data.opt_snd_index == 5) {
				//Back
				optcard._av = false;
				this._av = false;
				aud_labelsec._av = false;
				mainlabel._av = true;
			}
		} else if (!btnA) this.btnA_pressed = false; //Reset

		//Button B
		if (btnB && !this.btnB_pressed) {
			this.btnB_pressed = true;
			pauseMenu.playSfx();
			//Do actions
			//Back
			optcard._av = false;
			this._av = false;
			aud_labelsec._av = false;
			mainlabel._av = true;
		} else if (!btnB) this.btnB_pressed = false; //Reset
	}
	
	

	//VISUAL OPTIONS
	
	var vis_labelsec = pauseMenu.data.CreateOptionsLabel("VisualLabelSection");
	optcard.addActor(vis_labelsec);
	vis_labelsec.y2 = -165;
	vis_labelsec._av = false;
	
	vis_labelsec.onDraw = function() {
		var txt = b5.Game.Texts.texts,
		vcfg = b5.Game.cfg.Video,
		AR = vcfg.aspectRatio.split(':'),
		ix = pauseMenu.data.opt_vis_index-1,
		ox = txt.sett_visual_label_x;
		
		this.textPart.text = txt.sett_visual_resolution + ": \n"+
								txt.sett_visual_aspectratio +': \n' +
								txt.sett_visual_screenfx +": \n"+
								txt.sett_visual_postfx +": \n"+
								txt.sett_visual_brightness + ": \n"+
								txt.sett_visual_overscan + ": \n"+
								txt.sett_visual_texquality +": \n"+
								txt.sett_visual_titlemode + ": \n"+ 
								"\n"+
								txt.general_back;
		
		this.textPart.clearFormat();
		for(var i=0;i<9;i++) this.textPart.setFormatLine(i, 0, 0, [, , ox])
		
	  this.textPart.setFormatLine(9, 0, 0, [ix == 8 ? textSelColor:textColor,,,,,,,,,'center']);
	  
	  this.optionPart.text = (Math.round(vcfg.resolution * (AR[0]/AR[1])) + 'x' + vcfg.resolution) +"\n"+
	  											 vcfg.aspectRatio +'\n'+
	  											 optcard.yesno(vcfg.screenfx_enabled)+"\n"+
	  											 optcard.yesno(vcfg.colorFX)+"\n"+
	  											 optcard.slider(vcfg.brightness) +"\n"+
	  											 optcard.slider(vcfg.overscan)+"\n"+
	  											 optcard.slider(vcfg.textureQuality)+"\n"+
	  											 optcard.yesno(b5.Game.cfg.Game.dlc_title, txt.sett_visual_titledlc, txt.sett_visual_titlenodlc)
	  											 
	  this.optionPart.clearFormat();
	  for(var i=0;i<9;i++) this.optionPart.setFormatLine(i, 0, 0, [,,ox]);
	  
	  this.optionPart.applyFormatLine(ix, 0, 0, [textSelColor]);
	}
	
	vis_labelsec.onAVChanged = function() {
		this.axis_x_pressed = true;
		this.axis_y_pressed = true;
		this.timer = 0;
		this.slider_timer = 0;
		this.btnA_pressed = true;
		this.btnB_pressed = true;
	}

	vis_labelsec.onTick = function() {
		var input = b5.Game.Input,
		isGuest = b5.Game.Multiplayer.isGuest,
		axis_x = Math.round(isGuest ? input.player2.axis_x : input.player1.axis_x || input.player2.axis_x),
		axis_y = Math.round(isGuest ? input.player2.axis_y : input.player1.axis_y || input.player2.axis_y),
		btnA = isGuest ? input.player2.A : input.player1.A || input.player2.A,
		btnB = isGuest ? input.player2.A : input.player1.B || input.player2.B,
		data = pauseMenu.data;

		//UPDATE INDEX
		if (!this.axis_y_pressed && axis_y) {
			this.axis_y_pressed = true;
			data.opt_vis_index += axis_y;
			data.opt_vis_index == 0 && (data.opt_vis_index = 9); //Set to last
			data.opt_vis_index == 10 && (data.opt_vis_index = 1); //Set to first
			pauseMenu.playSfx(); //Play sfx on index change

		} else if (!axis_y) {
			//Reset when axis value is zero (not holding)
			this.timer = 0;
			this.axis_y_pressed = false;
		}
		//Set index every few milliseconds when axis is holded
		this.axis_y_pressed && (this.timer < 9 ? this.timer += 1*b5.Game.speed: (this.timer = 0, this.axis_y_pressed = false));

		//UPDATE SLIDER / OPTIONS
		if (!this.axis_x_pressed && axis_x) {
			this.axis_x_pressed = true;
			var vcfg = b5.Game.cfg.Video;
			pauseMenu.playSfx();
			switch (data.opt_vis_index) {
				case 1: //RESOLUTION
				  var resolutions = pauseMenu.data.resolutions,
				  index = resolutions.indexOf(vcfg.resolution);
				  index += axis_x;
				  index = b5.Maths.cap(index, 0, resolutions.length-1);
				  vcfg.resolution = resolutions[index];
				break;
				case 2: //ASPECT RATIO
				  var aspect_ratios = pauseMenu.data.aspect_ratios,
				  index = aspect_ratios.indexOf(vcfg.aspectRatio);
				  index += axis_x;
				  index = b5.Maths.cap(index, 0, aspect_ratios.length-1);
				  vcfg.aspectRatio = aspect_ratios[index];
				  break;
				case 3: //NOISE
				  vcfg.screenfx_enabled = !vcfg.screenfx_enabled;
			  break;
			  case 4: //POSTPROCESS FX
					vcfg.colorFX = !vcfg.colorFX;
				break;
				case 5: //Brightness
					vcfg.brightness += axis_x*0.1;
					vcfg.brightness = b5.Maths.cap(vcfg.brightness,0,1);
				break;
			  case 6: // OVERSCAN 
			    vcfg.overscan += axis_x*0.1;
			    vcfg.overscan = b5.Maths.cap(vcfg.overscan,0,1);
			  break;
			  case 7: //TEXTURE QUALITY
			    vcfg.textureQuality += axis_x*0.1;
			    vcfg.textureQuality = b5.Maths.cap(vcfg.textureQuality,0.1,1);
			  break;
			  case 8: //TITLE MODE
			    b5.Game.cfg.Game.dlc_title = !b5.Game.cfg.Game.dlc_title;
			  break;
			}
			b5.Game.applyConfig("video");
		} else if (!axis_x) {
			//Reset when axis value is zero (not holding)
			this.slider_timer = 0;
			this.axis_x_pressed = false;
		}
		//Set index every few milliseconds when axis is holded
		//Don't do it on screenfx cfg (index 3)
		this.axis_x_pressed && (this.slider_timer < (data.opt_vis_index == 3 ? 99999999: 9) ? this.slider_timer += 1*b5.Game.speed: (this.slider_timer = 0, this.axis_x_pressed = false));
  	
  	//Button A
		if (btnA && !this.btnA_pressed) {
			this.btnA_pressed = true;
			pauseMenu.playSfx();
			//Do actions
			if (data.opt_vis_index == 9) {
				//Back
				optcard._av = false;
				this._av = false;
				vis_labelsec._av = false;
				mainlabel._av = true;
			}
		} else if (!btnA) this.btnA_pressed = false; //Reset

		//Button B
		if (btnB && !this.btnB_pressed) {
			this.btnB_pressed = true;
			pauseMenu.playSfx();
			//Do actions
			//Back
			optcard._av = false;
			this._av = false;
			vis_labelsec._av = false;
			mainlabel._av = true;
		} else if (!btnB) this.btnB_pressed = false; //Reset
	}
	
	//LANGUAGE OPTIONS

	var langlabelsec = new b5.LabelActor();
	langlabelsec.font = voguefont;
	langlabelsec.x = langlabelsec.y = 0;
	maincard.addActor(langlabelsec);
	langlabelsec.name = "LanguageLabelSection";
	langlabelsec._scale = .5;
	langlabelsec.y2 = -77;
	langlabelsec.fill_style = textGrayColor;
	langlabelsec.text = holdertext;
	
	langlabelsec.onTick = function() {
		this.text = b5.Game.Texts.texts.pause_card_language + ':';
	}
	langlabelsec._av = false;
	
	var langlabelopt = new b5.LabelActor();
	langlabelopt.font = voguefont;
	langlabelopt.x = langlabelopt.y = 0;
	maincard.addActor(langlabelopt);
	langlabelopt.name = "LanguageLabelOptions";
	langlabelopt._scale = 0.9;
	langlabelopt.line_height = 82;
	langlabelopt.y2 = -30;
	langlabelopt.fill_style = textColor
	langlabelopt.text = holdertext;
	langlabelopt._av = false;
	
	langlabelopt.onDraw = function() {
		var txt = b5.Game.Texts.texts,
		lcfg = b5.Game.cfg.Language,
		ix = pauseMenu.data.opt_lang_index-1;
		
		this.text = txt.sett_language +"\n"+txt.general_back;
		
		this.clearFormat();
		this.setFormatLine(ix,0,0,[textSelColor])
	}
	
	langlabelopt.onAVChanged = function() {
		this.axis_x_pressed = true;
		this.axis_y_pressed = true;
		this.timer = 0;
		this.slider_timer = 0;
		this.btnA_pressed = true;
		this.btnB_pressed = true;
	}
	
	langlabelopt.onTick = function() {
		var input = b5.Game.Input,
		isGuest = b5.Game.Multiplayer.isGuest,
		axis_x = Math.round(isGuest ? input.player2.axis_x : input.player1.axis_x || input.player2.axis_x),
		axis_y = Math.round(isGuest ? input.player2.axis_y : input.player1.axis_y || input.player2.axis_y),
		btnA = isGuest ? input.player2.A : input.player1.A || input.player2.A,
		btnB = isGuest ? input.player2.A : input.player1.B || input.player2.B,
		data = pauseMenu.data;

		//UPDATE INDEX
		if (!this.axis_y_pressed && axis_y) {
			this.axis_y_pressed = true;
			data.opt_lang_index += axis_y;
			data.opt_lang_index == 0 && (data.opt_lang_index = 2); //Set to last
			data.opt_lang_index == 3 && (data.opt_lang_index = 1); //Set to first
			pauseMenu.playSfx(); //Play sfx on index change

		} else if (!axis_y) {
			//Reset when axis value is zero (not holding)
			this.timer = 0;
			this.axis_y_pressed = false;
		}
		//Set index every few milliseconds when axis is holded
		this.axis_y_pressed && (this.timer < 9 ? this.timer += 1*b5.Game.speed: (this.timer = 0, this.axis_y_pressed = false));
    
    //UPDATE LANGUAGE
		if (!this.axis_x_pressed && axis_x) {
			this.axis_x_pressed = true;
			pauseMenu.playSfx();
			if(data.opt_lang_index == 1) {
			  var lcfg = b5.Game.cfg.Language,
			  langs = pauseMenu.data.language_list,
		    index = langs.indexOf(lcfg.lang);
			
	  		index += axis_x;
	  	  index <= -1 ? index = langs.length-1 : index >= langs.length && (index = 0);
  			lcfg.lang = langs[index];
	  		b5.Game.setLanguage(lcfg.lang);
			}
		}else if (!axis_x) {
			//Reset when axis value is zero (not holding)
			this.slider_timer = 0;
			this.axis_x_pressed = false;
		}
		//Set index every few milliseconds when axis is holded
		this.axis_x_pressed && (this.slider_timer < 9 ? this.slider_timer += 1*b5.Game.speed: (this.slider_timer = 0, this.axis_x_pressed = false));

		//Button A
		if (btnA && !this.btnA_pressed) {
			this.btnA_pressed = true;
			pauseMenu.playSfx();
			//Do actions
			if (data.opt_lang_index == 2) {
				//Back
				this._av = false;
				langlabelsec._av = false;
				mainlabel._av = true;
			}
		} else if (!btnA) this.btnA_pressed = false; //Reset

		//Button B
		if (btnB && !this.btnB_pressed) {
			this.btnB_pressed = true;
			pauseMenu.playSfx();
			//Do actions
			//Back
			this._av = false;
			langlabelsec._av = false;
			mainlabel._av = true;
		} else if (!btnB) this.btnB_pressed = false; //Reset
	}
	
	//CONTROLS
	
	//Coming soon
 /*
	*
	*
	*
	*/
	
	// ON LEVEL PAUSE MENU LABEL (RESUME, RETRY, OPTIONS, EXIT TO MAP)
	//INSTEAD OF LEAVING AN EMPTY SPACE, USE IT TO SETUP WI-FI MULTIPLAYER

	var levellabel = new b5.LabelActor();
	levellabel.font = voguefont;
	levellabel.x = levellabel.y = 0;
	maincard.addActor(levellabel);
	levellabel.fill_style = textColor;
	levellabel.line_height = 41;
	levellabel.y2 = -77;
	levellabel._scale = 0.9;
	levellabel._av = false;
	levellabel.name = "LevelLabel";
	levellabel.round_pixels = false;
	levellabel.text = holdertext;
	
	levellabel.onDraw = function() {
		var txt = b5.Game.Texts.texts,
		ix = pauseMenu.data.main_lvl_index-1,
		mptext = b5.Game.Multiplayer.player2Joined ? txt.pause_card_removep2
		  : b5.Game.Multiplayer.data.HOST_CODE != "" ? txt.host_roomcode + ": "+b5.Game.Multiplayer.data.HOST_CODE : txt.pause_card_createroom;
		
		this.text = txt.pause_card_resume +"\n"+
								txt.pause_card_retry +"\n"+
								txt.main_menu_options +"\n"+
								mptext +"\n"+
								txt.pause_card_exitmap;
								
		this.clearFormat();
		this.setFormatLine(ix, 0, 0, [textSelColor]);
	}

	levellabel.onAVChanged = function() {
		this.axis_y_pressed = true;
		this.timer = 0;
		this.btnA_pressed = true;
		this.btnB_pressed = true;
		pauseMenu.data.main_lvl_index = 1;
	}

	levellabel.onTick = function() {
		var input = b5.Game.Input,
		isGuest = b5.Game.Multiplayer.isGuest,
		axis_y = Math.round(isGuest ? input.player2.axis_y : input.player1.axis_y || input.player2.axis_y),
		btnA = isGuest ? input.player2.A : input.player1.A || input.player2.A,
		btnB = isGuest ? input.player2.A : input.player1.B || input.player2.B,
		data = pauseMenu.data;
		
		//Update index
		if (!this.axis_y_pressed && axis_y) {
			this.axis_y_pressed = true;
			data.main_lvl_index += axis_y;
			data.main_lvl_index == 0 && (data.main_lvl_index = 5); //Set to last
			data.main_lvl_index == 6 && (data.main_lvl_index = 1); //Set to first
			pauseMenu.playSfx(); //Play sfx on index change

		} else if (!axis_y) {
			//Reset when axis value is zero (not holding)
			this.timer = 0;
			this.axis_y_pressed = false;
		}
		//Set index every few milliseconds when axis is holded
		this.axis_y_pressed && (this.timer < 9 ? this.timer += 1*b5.Game.speed: (this.timer = 0, this.axis_y_pressed = false));

		//Selection test
		if (btnA && !this.btnA_pressed) {
			var p2joined = b5.Game.Multiplayer.player2Joined;
			this.btnA_pressed = true;
			pauseMenu.playSfx();
			
	    this.active = false;
			switch(data.main_lvl_index) {
				case 1: //RESUME
				  pauseMenu.hide();
				break;
				case 2: //RETRY
				  if(!b5.Game.Multiplayer.isGuest) {
				  	b5.Game.ReloadScene({show_anim:"fade",show_speed:0.45,hide_anim:"open"});
				    b5.Game.Sfx.resumeAll();
			  	  b5.Game.Music.fade_out(.4);
				  }
				break;
				case 3: //OPTIONS
				  this._av = false;
				  mainlabel._av = true;
				break;
				case 4: //REMOVE PLAYER OR MULTIPLAYER
				  this.active = true;
				  p2joined ? (b5.Game.Multiplayer.removePlayer2(),pauseMenu.hide()) : b5.Game.Multiplayer.setHost();
				break;
				case 5: //EXIT TO MAP
				  !b5.Game.Multiplayer.isGuest && b5.Game.LoadScene(b5.Game.contents.maps[b5.Game.SaveSlots.currentSaveSlot.mapDataManager.currentMap], false, true, 
				    {music_fade_speed:0.35,show_anim:"close",hide_anim:"open",hourglass:true},
				    {fromLevel: b5.Game.SceneLoader.sceneId});
				break;
			}
		}
		else if(!btnA) this.btnA_pressed = false;
		
		//BUTTON B
		if (btnB && !this.btnB_pressed && app.now - pauseMenu.data.visible_time > 200) {
			this.btnB_pressed = true;
			this.active = false;
			pauseMenu.playSfx();
			//Close
			pauseMenu.hide();
		}else if(!btnB) this.btnB_pressed = false;
	}

	
		// ON WORLDMAP PAUSE MENU LABEL (RESUME, OPTIONS, EXIT TO TITLE, EXIT GAME)
	//INSTEAD OF LEAVING AN EMPTY SPACE, USE IT TO SETUP WI-FI MULTIPLAYER

	var worldmaplabel = new b5.LabelActor();
	worldmaplabel.font = voguefont;
	worldmaplabel.x = worldmaplabel.y = 0;
	maincard.addActor(worldmaplabel);
	worldmaplabel.fill_style = textColor;
	worldmaplabel.line_height = 41;
	worldmaplabel.y2 = -77;
	worldmaplabel._scale = 0.9;
	worldmaplabel._av = false;
	worldmaplabel.name = "LevelLabel";
	worldmaplabel.text = holdertext;
	
	worldmaplabel.onDraw = function() {
		var txt = b5.Game.Texts.texts,
	  ix = pauseMenu.data.main_wldm_index-1,
	  mptext = b5.Game.Multiplayer.player2Joined ? txt.pause_card_removep2
		  : b5.Game.Multiplayer.data.HOST_CODE != "" ? txt.host_roomcode + ': '+b5.Game.Multiplayer.data.HOST_CODE : txt.pause_card_createroom;
	  
	  this.text = txt.pause_card_resume +"\n"+
	  						txt.main_menu_options +"\n"+
	  						mptext +"\n"+
	  						txt.pause_card_exittitle+"\n"+
	  						txt.pause_card_exitgame;
	  						
	  this.clearFormat();
	  this.setFormatLine(ix, 0, 0, [textSelColor])
	}

	worldmaplabel.onAVChanged = function() {
		this.axis_y_pressed = true;
		this.timer = 0;
		this.btnA_pressed = true;
		this.btnB_pressed = true;
		pauseMenu.data.main_wldm_index = 1;
	}

	worldmaplabel.onTick = function() {
  	var input = b5.Game.Input,
		isGuest = b5.Game.Multiplayer.isGuest,
		axis_y = Math.round(isGuest ? input.player2.axis_y : input.player1.axis_y || input.player2.axis_y),
		btnA = isGuest ? input.player2.A : input.player1.A || input.player2.A,
		btnB = isGuest ? input.player2.A : input.player1.B || input.player2.B,
		data = pauseMenu.data;
		
		//Update index
		if (!this.axis_y_pressed && axis_y) {
			this.axis_y_pressed = true;
			data.main_wldm_index += axis_y;
			data.main_wldm_index == 0 && (data.main_wldm_index = 5); //Set to last
			data.main_wldm_index == 6 && (data.main_wldm_index = 1); //Set to first
			pauseMenu.playSfx(); //Play sfx on index change

		} else if (!axis_y) {
			//Reset when axis value is zero (not holding)
			this.timer = 0;
			this.axis_y_pressed = false;
		}
		//Set index every few milliseconds when axis is holded
		this.axis_y_pressed && (this.timer < 9 ? this.timer += 1*b5.Game.speed: (this.timer = 0, this.axis_y_pressed = false));

		//Selection test
		if (btnA && !this.btnA_pressed) {
			var p2joined = b5.Game.Multiplayer.player2Joined;
			this.btnA_pressed = true;
			pauseMenu.playSfx();
			
	    this.active = false;
			switch(data.main_wldm_index) {
				case 1: //RESUME
				  pauseMenu.hide();
				break;
				case 2: //OPTIONS
				  this._av = false;
				  mainlabel._av = true;
				break;
				case 3: //REMOVE PLAYER OR MULTIPLAYER
				  this.active = true;
				  p2joined ? (b5.Game.Multiplayer.removePlayer2(),pauseMenu.hide()) : b5.Game.Multiplayer.setHost();

				break;
				case 4: //EXIT TO TITLE
				  b5.Game.LoadScene('title', false, true, {music_fade_speed:0.35,show_anim:"close",hide_anim:"open",hourglass:false});
				  b5.Game.Multiplayer.host.close();
				  b5.Game.Multiplayer.HostStarted = false;
				break;
				case 5: //EXIT GAME
					navigator.app ? navigator.app.exitApp(): window.close();
			}
		}
		else if(!btnA) this.btnA_pressed = false;
		
		//BUTTON B
		if (btnB && !this.btnB_pressed && app.now - pauseMenu.data.visible_time > 200) {
			this.btnB_pressed = true;
			this.active = false;
			pauseMenu.playSfx();
			//Close
			pauseMenu.hide();
		}else if(!btnB) this.btnB_pressed = false;
	}
	
	// CONTROLS LABEL FOR SELECTING INPUT (GUI, KEYBOARD, GAMEPAD)
	
	var ctrlslabel = new b5.LabelActor();
	ctrlslabel.font = voguefont;
	ctrlslabel.x = ctrlslabel.y = 0;
	maincard.addActor(ctrlslabel);
	ctrlslabel.fill_style = textColor;
	ctrlslabel._scale = 0.9;
	ctrlslabel.line_height = 41;
	ctrlslabel.y2 = -55;
	ctrlslabel._av = false;
	ctrlslabel.name = "ControlsLabel";
	ctrlslabel.text = holdertext;
	
	var ctrllabelsec = new b5.LabelActor();
	ctrllabelsec.font = voguefont;
	ctrllabelsec.x = ctrllabelsec.y = 0;
	maincard.addActor(ctrllabelsec);
	ctrllabelsec.name = "ControlsLabelSection";
	ctrllabelsec._scale = .5;
	ctrllabelsec.y2 = -95;
	ctrllabelsec.fill_style = textGrayColor;
	ctrllabelsec.text = holdertext;
	
	ctrllabelsec.onTick = function() {
		this.text = b5.Game.Texts.texts.pause_card_controls + ':';
	}
	ctrllabelsec._av = false;
	
	ctrlslabel.onDraw = function() {
		var txt = b5.Game.Texts.texts,
		ix = pauseMenu.data.main_ctrls_index-1;
		
		this.text = txt.sett_ctrl_gui +"\n"+
								txt.sett_ctrl_keyboard +"\n"+
								txt.sett_ctrl_gamepad +"\n"+
								txt.general_back;
								
		this.clearFormat();
		this.setFormatLine(ix, 0, 0, [textSelColor])
	}
	
	ctrlslabel.onAVChanged = function() {
		this.axis_y_pressed = true;
		this.timer = 0;
		this.btnA_pressed = true;
		this.btnB_pressed = true;
		pauseMenu.data.main_ctrls_index = 1;
	}
	
	ctrlslabel.onTick = function() {
  	var input = b5.Game.Input,
		isGuest = b5.Game.Multiplayer.isGuest,
		axis_y = Math.round(isGuest ? input.player2.axis_y : input.player1.axis_y || input.player2.axis_y),
		btnA = isGuest ? input.player2.A : input.player1.A || input.player2.A,
		btnB = isGuest ? input.player2.A : input.player1.B || input.player2.B,
		data = pauseMenu.data;
		
		//Update index
		if (!this.axis_y_pressed && axis_y) {
			this.axis_y_pressed = true;
			data.main_ctrls_index += axis_y;
			data.main_ctrls_index == 0 && (data.main_ctrls_index = 4); //Set to last
			data.main_ctrls_index == 5 && (data.main_ctrls_index = 1); //Set to first
			pauseMenu.playSfx(); //Play sfx on index change

		} else if (!axis_y) {
			//Reset when axis value is zero (not holding)
			this.timer = 0;
			this.axis_y_pressed = false;
		}
		//Set index every few milliseconds when axis is holded
		this.axis_y_pressed && (this.timer < 9 ? this.timer += 1*b5.Game.speed: (this.timer = 0, this.axis_y_pressed = false));

		//Selection test
		if (btnA && !this.btnA_pressed) {
			this.btnA_pressed = true;
			pauseMenu.playSfx();
			
	    this.active = false;
	    ctrllabelsec.active = false;
	    console.log(data.main_ctrls_index)
			switch(data.main_ctrls_index) {
				case 1: //GUI BUTTONS (SCREEN)
				  optcard._av = true;
				  ctrl_gui_labelopt._av = true;
				  ctrl_gui_labelopt._av = true;
				break;
				case 2: //KEYBOARD
				  this.active = true;
				break;
				case 3: //GAMEPAD
				  this.active = true;
				break;
				case 4: //BACK
		  		this._av = false;
	     		ctrllabelsec._av = false;
				  mainlabel._av = true;
				break;
			}
		}
		else if(!btnA) this.btnA_pressed = false;
		
		//BUTTON B
		if (btnB && !this.btnB_pressed) {
			this.btnB_pressed = true;
			this._av = false;
			ctrllabelsec._av = false;
			mainlabel._av = true;
			pauseMenu.playSfx();
		}else if(!btnB) this.btnB_pressed = false;
	}
	
	//GUI CONTROLS OPTIONS
	
	var ctrl_gui_labelopt = pauseMenu.data.CreateOptionsLabel("GuiControlsLabelSection");
	optcard.addActor(ctrl_gui_labelopt);
	ctrl_gui_labelopt.y2 = -165;
	ctrl_gui_labelopt._av = false;
	
	ctrl_gui_labelopt.onDraw = function() {
		var txt = b5.Game.Texts.texts,
		gcfg = b5.Game.cfg.GUI,
		ix = pauseMenu.data.opt_ctrl_gui_index-1,
		ox = txt.sett_ctrl_gui_label_x;
		
		this.textPart.text = txt.sett_ctrl_gui_btn_size +": \n"+
												 txt.sett_ctrl_gui_dpad_size + ": \n"+
												 txt.sett_ctrl_gui_padding + ": \n"+
												 txt.sett_ctrl_gui_width + ": \n"+
												 txt.sett_ctrl_gui_opacity + ": \n"+
												 txt.sett_ctrl_gui_left + ": \n"+
												 "\n"+
												 txt.general_back;
												 
		this.textPart.clearFormat();
		for(var i=0;i<6;i++) this.textPart.setFormatLine(i, 0, 0, [, , ox]);
		this.textPart.setFormatLine(7, 0, 0, [ix == 6 ? textSelColor:textColor,,,,,,,,,'center']);
		
		this.optionPart.text = optcard.slider(gcfg.button_scale-1) +"\n"+
													 optcard.slider(gcfg.dpad_scale-1) +"\n"+
      										 optcard.slider(gcfg.button_spacing-1) +"\n"+
													 optcard.slider(gcfg.width) +"\n"+
													 optcard.slider(gcfg.opacity) +"\n"+
													 (gcfg.left_handed ? txt.general_on : txt.general_off);
													 
		this.optionPart.clearFormat();
	  for(var i=0;i<6;i++) this.optionPart.setFormatLine(i, 0, 0, [,,ox]);
	  
	  this.optionPart.applyFormatLine(ix, 0, 0, [textSelColor]);

	}
	
	ctrl_gui_labelopt.onAVChanged = function() {
		this.axis_x_pressed = true;
		this.axis_y_pressed = true;
		this.timer = 0;
		this.slider_timer = 0;
		this.btnA_pressed = true;
		this.btnB_pressed = true;
		pauseMenu.data.opt_ctrl_gui_index = 1;
	}

	ctrl_gui_labelopt.onTick = function() {
		var input = b5.Game.Input,
		isGuest = b5.Game.Multiplayer.isGuest,
		axis_x = Math.round(isGuest ? input.player2.axis_x : input.player1.axis_x || input.player2.axis_x),
		axis_y = Math.round(isGuest ? input.player2.axis_y : input.player1.axis_y || input.player2.axis_y),
		btnA = isGuest ? input.player2.A : input.player1.A || input.player2.A,
		btnB = isGuest ? input.player2.A : input.player1.B || input.player2.B,
		data = pauseMenu.data;

		//UPDATE INDEX
		if (!this.axis_y_pressed && axis_y) {
			this.axis_y_pressed = true;
			data.opt_ctrl_gui_index += axis_y;
			data.opt_ctrl_gui_index == 0 && (data.opt_ctrl_gui_index = 7); //Set to last
			data.opt_ctrl_gui_index == 8 && (data.opt_ctrl_gui_index = 1); //Set to first
			pauseMenu.playSfx(); //Play sfx on index change

		} else if (!axis_y) {
			//Reset when axis value is zero (not holding)
			this.timer = 0;
			this.axis_y_pressed = false;
		}
		//Set index every few milliseconds when axis is holded
		this.axis_y_pressed && (this.timer < 9 ? this.timer += 1*b5.Game.speed: (this.timer = 0, this.axis_y_pressed = false));

		//UPDATE SLIDER / OPTIONS
		if (!this.axis_x_pressed && axis_x) {
			this.axis_x_pressed = true;
			var gcfg = b5.Game.cfg.GUI;
			pauseMenu.playSfx();
			switch (data.opt_ctrl_gui_index) {
				case 1: //BUTTON SCALE
				  gcfg.button_scale += axis_x*0.1;
			    gcfg.button_scale = b5.Maths.cap(gcfg.button_scale,1,2);
				break;
				case 2: //DPAD SCALE
					gcfg.dpad_scale += axis_x*0.1;
			    gcfg.dpad_scale = b5.Maths.cap(gcfg.dpad_scale,1,2);
				break;
				case 3: //PADDING
				  gcfg.button_spacing += axis_x*0.1;
			    gcfg.button_spacing = b5.Maths.cap(gcfg.button_spacing,1,2);
			  break;
			  case 4: //WIDTH
					gcfg.width += axis_x*0.1;
			    gcfg.width = b5.Maths.cap(gcfg.width,0,1);
				break;
			  case 5: //OPACITY
			    gcfg.opacity += axis_x*0.1;
			    gcfg.opacity = b5.Maths.cap(gcfg.opacity,0,1);
			  break;
			  case 6: //LEFT HANDED
			    gcfg.left_handed = !gcfg.left_handed;
			    b5.Game.GUI.buttons.DPAD.onEndTouch();
			  break;
			}
	   b5.Game.GUI.organize();
		} else if (!axis_x) {
			//Reset when axis value is zero (not holding)
			this.slider_timer = 0;
			this.axis_x_pressed = false;
		}
		//Set index every few milliseconds when axis is holded
		this.axis_x_pressed && (this.slider_timer < 9 ? this.slider_timer += 1*b5.Game.speed: (this.slider_timer = 0, this.axis_x_pressed = false));
  	
  	//Button A
		if (btnA && !this.btnA_pressed) {
			this.btnA_pressed = true;
			pauseMenu.playSfx();
			//Do actions
			if (data.opt_ctrl_gui_index == 7) {
				//Back
				optcard._av = false;
				this._av = false;
				ctrl_gui_labelopt._av = false;
				
				ctrllabelsec._av = true;
				ctrlslabel._av = true;
			}
		} else if (!btnA) this.btnA_pressed = false; //Reset

		//Button B
		if (btnB && !this.btnB_pressed) {
			this.btnB_pressed = true;
			pauseMenu.playSfx();
			//Do actions
			//Back
			optcard._av = false;
			this._av = false;
			ctrl_gui_labelopt._av = false;
			ctrllabelsec._av = true;
			ctrlslabel._av = true;
		} else if (!btnB) this.btnB_pressed = false; //Reset
	}
	
    pauseMenu.showPage = function(page) {
    	if(page == "level") levellabel._av = true;
    	else if(page == "worldmap") worldmaplabel._av = true;
    }
    
    pauseMenu.playSfx = function() {
    	var inLevel = b5.Game.Flags.inLevel;
    	!inLevel ? menuselectsfx.play() : menumovesfx.play();
    }
    
    pauseMenu.TweenMusic = function(fade_in) {
    	if(fade_in) for (var i = 0, snd = b5.Game.Music.sounds; i < snd.length; i++) {
    		if(snd[i].equalizer) {
    			snd[i].setEqualizer('highpass',0,0,0,0);
    			snd[i].Tween('frequency:eq',1060, 0.3);
    			snd[i].Tween('Q:eq', 14, 0.3);
    			snd[i].Tween('detune:eq', 350, 0.3);
    		}
    		
    		if(snd[i].limiter) {
    			snd[i].setCompressor(-60,0,0,0.03,0.06);
    			snd[i].Tween('ratio:limiter',20,0.3);
    		}
    	}
    	else for (var i = 0, snd = b5.Game.Music.sounds; i < snd.length; i++) {
    		if(snd[i].equalizer) {
    			snd[i].setEqualizer('highpass',1060, 0, 5.5, 350);
    			snd[i].Tween('frequency:eq',0, 0.3);
    			snd[i].Tween('Q:eq', 0, 0.3);
    			snd[i].Tween('detune:eq', 0, 0.3);
    		}
    		
    		if(snd[i].limiter) {
    			snd[i].setCompressor(-60,0,20,0.03,0.06);
    			snd[i].Tween('ratio:limiter',0,0.3);
    		}
    	}
    }
    
		pauseMenu.onTick = function() {
			//Blur
			if (b5.Game.Flags.inLevel || b5.Game.Flags.inWorldmap) {
				sceneMain.BLUR_MULTIPLIER = this.opacity * 1.4;
			}
		}

		pauseMenu.show = function(page) {
			if(b5.Game.loadingScreen.state == "closed" || b5.Game.loadingScreen.state == "opening") return;
			var fade = (b5.Game.Flags.inLevel || b5.Game.Flags.inWorldmap),
			dc = 0,
			btns = b5.Game.GUI.buttons;
			this._av = true;
			this.state = "showing";
			!page ? this.mainCard.label._av = true : this.showPage(page);
			b5.Game.Sfx.pauseAll();
			b5.Game.Flags.inPauseMenu = true;
			btns.B.onEndTouch();
			btns.Pause.onEndTouch();
			btns.Pause.visible = false;
			this.data.visible_time = app.now;
			//Pause on guest
			b5.Game.Multiplayer.isHosting && b5.Game.Multiplayer.sendToGuest('PAUSE',true);
			
			//Set ui buttons
			b5.Game.UiButtons.setButtons([
				{
					"text": "texts.ui_confirm",
					"actionButton": "jump"
				},
				{
					"text": "texts.general_back",
					"actionButton": "shoot"
				}
			]);
			
			this.updateAvatarDisplays();
			
			app.events.dispatch('pause');
			sceneMain.events.dispatch('pause');
			
			if (fade) {
				sceneMain.active = false;
				this.opacity = 0;
				this.mainCard.label.active = false;
				
				b5.Game.UiButtons.show(true);
				
				//Music effects
				this.TweenMusic(true);
				//Animate
				this.TweenToWithEnd('opacity', 1, 0.16, b5.Ease.linear, true, 0, function() {
					pauseMenu.state = "visible";
					!page ? b5.Game.PauseMenu.mainCard.label.active = true : b5.Game.PauseMenu.showPage(page);
					sceneMain.onChildrenDrawEnd = null;
				});
			}else {
				b5.Game.UiButtons.show();
				this.opacity = 1;
				sceneMain.onChildrenDrawEnd = null;
				pauseMenu.state = "visible";
			}
			this.data.main_index = 1;

		};
		
		pauseMenu.hide = function(hideBecauseLoadingScene) {
			var fade = (b5.Game.Flags.inLevel || b5.Game.Flags.inWorldmap);
			//sceneMain._av = true;
			b5.Game.Flags.inPauseMenu = false;
			//Save 
			b5.Game.saveConfig();
			this.state = "hiding";
			//Pause on guest
			b5.Game.Multiplayer.isHosting && b5.Game.Multiplayer.sendToGuest('PAUSE',false);
			
			if (fade) {
				this.opacity = 1;
				this.mainCard.label.active = false;
				
				b5.Game.UiButtons.hide(true);
				
				!hideBecauseLoadingScene && this.TweenMusic(false)
				
				b5.Game.GUI.buttons.Pause.visible = !b5.Game.Multiplayer.isGuest;
				
				//Animate
				this.TweenToWithEnd('opacity', 0, 0.16, b5.Ease.linear, true, 0, function() {
					pauseMenu.state = "hidden";
					b5.Game.Flags.inPlayerJoinedScreen ? sceneMain.visible = true: sceneMain._av = true;
					pauseMenu._av = false;
					pauseMenu.mainCard.label._av = false;
					levellabel._av = false;
					worldmaplabel._av = false;
					sceneMain.onChildrenDrawEnd = null;
					sceneMain.BLUR_MULTIPLIER = 0;
					b5.Game.Sfx.resumeAll();
				});
			} else {
				b5.Game.UiButtons.hide();
				this._av = false;
				this.mainCard.label._av = false;
				levellabel._av = false;
				worldmaplabel._av = false;
				sceneMain.onChildrenDrawEnd = null;
				pauseMenu.state = "hidden";
			}
			
			!hideBecauseLoadingScene && (
				app.events.dispatch('resume'),
				sceneMain.events.dispatch('resume')
			);
		};
		b5.Game.PauseMenu = pauseMenu;
		pauseMenu.hide();
	})();