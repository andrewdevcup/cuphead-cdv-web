b5.export = function(world, scene, data, game) {
	var myexports = {
	};
	
	data.showDeathCard = function() {
  	//Vinyl scratch
	  scene.findResource('SfxVinylScratch'+b5.Maths.randomRange(1,2),'sound').play();
	  
	  game.Flags.inSomeMenu = true;
	  
	  //Set ui buttons
		b5.Game.UiButtons.setButtons([
			{
				text: "texts.ui_equip",
				actionButton: "dash"
			},
			{
				text: "texts.ui_confirm",
				actionButton: "jump"
			}
		]);
		b5.Game.UiButtons.show(true);

	  //Card
	  var dCard = new b5.Actor();
	  dCard.bitmap = sceneMain.findResource('DeathCardBG' + (data.levelData.bossSecretPhase ? '_Secret':''), 'bitmap');
	  dCard.setSize(595,668);
	  
	  dCard.layer = 3;
	  dCard.opacity = 0;
	  dCard.name = "DeathCardBG";
	  dCard.rotation = -0.45;
	  
	  scene_GUI.addActor(dCard);
	  
	  dCard.TweenTo('_rotation', -0.07, 0.4, b5.Ease.quadout);
	  dCard.TweenTo('opacity',1,0.3);
	  
	  dCard.min_x = -218;
	  dCard.max_x = 215;
	  dCard.m_y = 53;
	  
	  dCard.createMarker = function(x) {
	  	var mk = new b5.Actor();
	  	mk.atlas = scene.findResource('DeathCardMarkers','brush');
	  	mk.current_frame = b5.Maths.randomRange(0,1);
	  	mk.setPosition(x,this.m_y);
	  	this.addActor(mk);
	  }
	  
	  dCard.createRunner = function(sprite, x) {
	  	var r = new b5.Actor();
	  	r.atlas = sprite.atlas;
	  	r.center_atlas = sprite.center_atlas;
	  	r.setPosition(this.min_x, this.m_y-12);
	  	r._scale = .4;
	  	r.playAnim('run',true);
	  	r.frame_speed = 28;
	  	this.addActor(r);
	  	r.TweenTo('_x',isNaN(x)?r.x:x,2,b5.Ease.quadout);
	  	
	  	//Color tint shader
	    var tintFilter = scene.findResource('TintModesShader','shader');
	    r.addFilter(tintFilter.filter);
	    r.onPreDraw = function() {
	    	var rgb = PIXI.utils.string2rgb(sprite.parent.data.color),
	    	t = tintFilter.tint;
	    	
	    	t[0] = rgb[0];
	    	t[1] = rgb[1];
	    	t[2] = rgb[2];
	    	t[3] = 1;
	    	
	    	tintFilter.mode = 0;
	    }
	  }
	  
	  var currentPhase,
	  phases = data.bossData.difficultyAndPhases && data.bossData.difficultyAndPhases[data.Statistics.skill].phases;
	  
	  if(phases) for(var i = 0; i < phases.length; i++) data.bossData.maxHealth - data.bossData.health >= phases[i].health && (currentPhase = phases[i]);
	  
	  if(!data.levelData.bossSecretPhase) {
	  	//Phase markers
		  if(phases) for(var i = 0; i < phases.length; i++) {
		  	var phaseHealth = phases[i].health / data.bossData.maxHealth,
		    position = b5.Maths.pos(dCard.min_x, dCard.max_x, phaseHealth);
		  	
		  	phases[i].health != 0 && phases[i].health != data.bossData.maxHealth && dCard.createMarker(position);
		  }
		  
		  //Runners
		  for(var i = 0, players = world.findActorsByTagName('player',true); i < players.length; i++) {
		  	var progress = players[i].data.diedAt / data.bossData.maxHealth;
		  	position = b5.Maths.pos(dCard.min_x, dCard.max_x, progress);
		  	
		  	dCard.createRunner(players[i].Sprite, position);
		  }
	  }
	  
	  //Mugshot
	  var mgsh = new b5.Actor();
	  mgsh.available = phases && currentPhase && currentPhase.mugshot;
	  mgsh.bitmap = (mgsh.available && scene.findResource(currentPhase.mugshot.bitmap,'bitmap')) || b5.Bitmap.SOLID;
	  mgsh.bitmap === b5.Bitmap.SOLID && mgsh.available && (mgsh.atlas = scene.findResource(currentPhase.mugshot.atlas,'brush'), mgsh.current_frame = currentPhase.mugshot.frame || 0);
	  
	  mgsh.setSize(220,215);
	  mgsh.onTick = function() {
	  	this.bitmap && this.available && this.setSize(215*(this.bitmap.resource.width/this.bitmap.resource.height),215);
	  }
	  mgt = mgsh
	  mgsh.ignore_atlas_size = true;
	  mgsh.x = mgsh.available ? currentPhase.mugshot.offset[0] : 0;
	  mgsh.y = -170 + (mgsh.available ? currentPhase.mugshot.offset[1] : 0);
	  dCard.addActor(mgsh);
	  
	  data.bossData.deathMessage = currentPhase && currentPhase.deathCardMessage;
	  //Message
	  var mgms = new b5.LabelActor();
	  mgms.font = scene_GUI.findResource('CupheadMemphisFont','brush');
	  mgms.setTextFmt(data.Texts["deathCardMessage:" + (data.bossData.deathMessage || 'default')] || "");
	  mgms.line_height = 48;
	  mgms._scale = 0.6;
	  mgms.y = -37;
	  mgms.fill_style = b5.Game.Styles.text_pausemenu;
	  
	  dCard.addActor(mgms);
	  
	  //Sfx
	  var sfxtween = game.Sfx.fade_out(1.5, false, true);
	  
	  //Blur effect
	  new b5.Tweener(sceneMain,'BLUR_MULTIPLIER',null,0,1.4,0.4).start();
	  
	  //Music effects
	  //Slow down
	  for(var i=0, snd = game.Music.sounds; i < snd.length; i++) {
	  	snd[i].Tween('playbackRate',snd[i].playback_speed*0.7,1.12);
	  	snd[i].limiter && snd[i].setCompressor(-60,0,0.01,0.03,0.06);
	  }
	  
	  scene.setTimeout(()=>{
		  //Filter - low pass
		  for(var i=0, snd = game.Music.sounds; i < snd.length; i++) {
	  		snd[i].equalizer && (
	  			snd[i].setEqualizer('lowpass',8000,0,0,350),
					snd[i].Tween('frequency:eq',1400,1.9),
					snd[i].Tween('Q:eq',2,1.9)
			 	);
		  }
	  },1.8);
	  
	  scene.setTimeout(()=>{
	  	for(var i=0, snd = game.Music.sounds; i < snd.length; i++) {
	  		snd[i].equalizer && (
	  			snd[i].Tween('frequency:eq',6000,0.2),
	  			snd[i].Tween('detune:eq',-350,0.2),
	  			snd[i].Tween('gain:main',0.65,0.2)
	  		);
	  	}
	  },1.8+2.2);
	  	
	  scene.setTimeout(t=>{
	  	//Filter - high pass
	  	for(var i=0, snd = game.Music.sounds; i < snd.length; i++) {
	  		snd[i].equalizer && (
	  			snd[i].setEqualizer('highpass',0,0,2,-350),
	  			snd[i].Tween('frequency:eq',1060,2.1),
	  			snd[i].Tween('detune:eq',350,2.1),
	  			snd[i].Tween('Q:eq',14,2.1),
	  			snd[i].Tween('gain:main',1.5,2.1)
	  		);
	  		
	  		snd[i].limiter && snd[i].Tween('ratio:limiter',20,2);
	  	}
	  },1.8+2.2+0.35);
	  
	  dCard.remove = function() {
	  	if(!this.removing) {
	  		dCard.destroy();
	  		sceneMain.BLUR_MULTIPLIER = 0;
	    	b5.Game.Sfx.resetVolume();
	  		this.removing = true;
	  	}
	  }
	  
	  app.events.once('sceneunload',e=>dCard.remove());
	  
	  
	  /* CONTROL TEXTS
	  *
	  * Retry
	  * Exit to Map
	  * Exit Game
	  */
	  
	  var dCardLabel = new b5.LabelActor();
	  dCardLabel.font = scene_GUI.findResource('CupheadVogueExtraBoldFont','brush');
	  dCardLabel.text = "loading";
	  dCardLabel.fill_style = b5.Game.Styles.text_pausemenu;
	  dCardLabel._scale = 0.92;
	  dCardLabel.y = 139;
	  dCardLabel.line_height = 45;
	  dCard.addActor(dCardLabel);
	  dCardLabel.name = "DeathCardMenuLabel";
	  
	  dCardLabel.sel_index = 0;
	  
	  dCardLabel.onDraw = function() {
	  	var txt = game.Texts.texts;
	  	this.text = txt.pause_card_retry +"\n"+
	  							txt.pause_card_exitmap +"\n"+
	  							txt.pause_card_exitgame;
	  	
	  	this.clearFormat();
	  	this.setFormatLine(this.sel_index, 0, 0, [b5.Game.Styles.text_pausemenu_selected])
	  }
	  
	  dCardLabel.last_A = 0;
	  dCardLabel.last_AY = 0;
	  dCardLabel.selected_something = false;
	  
	  //Sfx
	  var movesfx = scene_GUI.findResource('MenuSelectLevelSfx','sound');
	  
	  dCardLabel.onTick = function() {
	  	var input = game.Input,
	  	axis_y = Math.round(input.player1.axis_y || input.player2.axis_y),
	  	btn_A = input.player1.A || input.player2.A,
	  	btn_X = input.player1.X || input.player2.X;
	  	
	  	if(this.selected_something) return;
	  	
	  	if(axis_y != this.last_AY) {
	  		this.last_AY = axis_y;
	  		
	  		if(axis_y != 0) {
	  			this.sel_index += axis_y;
	  			
	  			this.sel_index < 0 && (this.sel_index = 2);
	  			this.sel_index > 2 && (this.sel_index = 0);
	  			
	  			movesfx.play();
	  		}
	  	}
	  	
	  	if(btn_A != this.last_A) {
	  		this.last_A = btn_A;
	  		
	  		if(btn_A > 0) {
	  			movesfx.play();
	  			this.selected_something = true;
	  			
	  			//Remove from scene in sceneunload
	  			
	  			switch(this.sel_index) {
	  				case 0: //Retry
	  					if(!game.Multiplayer.isGuest) {
	  						game.ReloadScene({show_anim:"fade",show_speed:0.4,hide_anim:"open"});
	  			  		game.Music.fade_out(0.4);
	  				  	game.Flags.inSomeMenu = false;
	  					}
	  					break;
	  				case 1: //Exit to map
	  					if(!game.Multiplayer.isGuest) game.LoadScene(game.contents.maps[game.SaveSlots.currentSaveSlot.mapDataManager.currentMap], false, true, 
				  		  {music_fade_speed:0.35,show_anim:"close",hide_anim:"open",hourglass:true},
				  		  {fromLevel: b5.Game.SceneLoader.sceneId});
				  		game.Flags.inSomeMenu = false;
				  		break;
				  	case 2: //Exit game
				  	  navigator.app ? navigator.app.exitApp(): window.close();
	  			}
	  		}
	  	}
	  	
	  	if(btn_X != this.last_X) {
	  		this.last_X = btn_X;
	  		
	  		if(btn_X) {
	  			//Disable selection
	  			this.selected_something = true;
	  			//Open equip menu
	  			sceneMain.data.EquipCardsManager.show();
	  			
	  			//Tween down
	  			this.parent._y = 0;
	  			this.parent.TweenTo('_y', scene_GUI.h, 0.2);//,true,0, function(t) {
	  		}
	  	}
	  	
	  }
	  
	  sceneMain.events.on('hideequipcard', function() {
	  	dCard.TweenToWithEnd('_y', 0, 0.35, b5.Ease.circout, true, 0, function(t) {
	  		dCardLabel.selected_something = false;
	  	});
	  	//Set ui buttons
			b5.Game.UiButtons.setButtons([
				{
					text: "texts.ui_equip",
					actionButton: "dash"
				},
				{
					text: "texts.ui_confirm",
					actionButton: "jump"
				}
			]);
			b5.Game.UiButtons.show();
	  });
	  
	}
	
	return myexports;
};