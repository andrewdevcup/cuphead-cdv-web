(function(game) {
	
	var bg = new b5.RectActor;
	bg.setSize(1280,720);
	bg.opacity = 0.5;
  bg._av = false;
  bg.fill_style = "black";
	scene_GUI.addActor(bg);
	bg._layer = 5;
	
	// NEW -- Player card (added in update 1.3.2)
	
	//Resources
	game.parseResources({
		bitmap: [{
			name: "cuphead:newJoinCard",
			src: "player2_join_card_cuphead.png"
		}, {
			name: "mugman:newJoinCard",
			src: "player2_join_card_mugman.png"
		}],
		sound: [{
			name: "PlayerJoinedSfx",
			src: "PlayerJoined.wav",
			category: "sfx"
		}]
	}, scene_GUI);
	
  const label = new b5.LabelActor;
	label.font = scene_GUI.findResource('CupheadVogueExtraBoldFont','brush');
  bg.addActor(label);
  label.use_parent_opacity = false;
  label.timer = 0;
  label._scale = 1.32;
  label.fill_style = "white";
  label.line_height = 46;
  label._y = 300;
  label.round_pixels = false;
  
  //Card
  const card = new b5.Actor();
  card.setSize(766,500);
  card.bitmap = scene_GUI.findResource("cuphead:newJoinCard","bitmap");
  bg.addActor(card);
  card.use_parent_opacity = false;
  card.ty = -20;
  
  
  label.onTick = function() {
  	let col = Math.round(0.7+(Math.cos(this.timer*8)*.3));
  	
  	this.text = b5.Game.Texts.texts.player2Joined;
  	
  	this.timer += app.dt*6.5;
  	this.fill_style = PIXI.utils.rgb2string([col,1,col]);
  };
  
  b5.Game.ShowPlayerJoinedScreen = function() {
  	//Animate card
  	card._y = -750;
  	card._rotation = [-0.3,0.3][b5.Maths.randomRange(0,1)];
  	card.TweenTo('_y',card.ty,0.4,b5.Ease.backout);
  	card.TweenTo('_rotation',0,0.4,b5.Ease.backout);
  	
  	//Set bitmap corresponding to p2's character
  	
  	card.bitmap = scene_GUI.findResource(
  		(b5.Game.SaveSlots.currentSaveSlot.isPlayer1Mugman ? 'cuphead':'mugman') + ":newJoinCard",
    	"bitmap"
    );
  	
  	bg._av = true;
  	this.GUI.disableButtons();
  	this.Flags.inPlayerJoinedScreen = true;
  	this.Flags.inPauseMenu && this.PauseMenu.hide(true);
  	var pauseenabled = this.Flags.pausingEnabled;
  	this.Flags.pausingEnabled = false;
  	this.GUI.active = false;
  	sceneMain.active = false;
  	
  	//Play sfx
  	scene_GUI.findResource('PlayerJoinedSfx','sound').play();
  	
  	//Fade in
  	bg.TweenToWithEnd('opacity',.7,0.3,b5.Ease.linear,0,0,function(){
  		//Fade out after time
  		app.setTimeout(function() {
  			bg.TweenToWithEnd('opacity',0,0.3,b5.Ease.linear,0,0,function(){
  				sceneMain.active = true;
  				b5.Game.Flags.pausingEnabled = pauseenabled;
  				b5.Game.GUI.active = true;
  				bg._av = false;
  				b5.Game.Flags.inPlayerJoinedScreen = false;
  				b5.Game.GUI.enableAllButtons();
  			});
  			
  			//Slide card up
  			card.TweenTo('_y',-750,0.2,b5.Ease.backin);
  		},1.8);
  	});
  }
})(b5.Game);