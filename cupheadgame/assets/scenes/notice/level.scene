
b5.LoadScene = function(world, scene, data, game) {
	//scene is the main scene where resources and actors will be added
	//game is equivalent to b5.Game where there's things like the loading screen, scene loader, player, configs and	more.
	//you should add local variables on data object, for them to be removed when another scene is being loaded, for global variables add them to game or write it to a file.
  
  world.camera_update = false;
  game.Flags.pausingEnabled = false;
  //Allow touchscreen
  world.touchable = true;
  game.GUI.disableButtons();
  
	var bg = new b5.RectActor();
	bg.setSize(2000,1000);
	bg.fill_style = "#ffcf11";
	world.addActor(bg);
	bg.name = "BG";
	
	var label = new b5.LabelActor();
	label.text = data.text;
	label.font = scene_GUI.findResource('CupheadVogueExtraBoldFont', 'brush');
	label.fill_style = "black";
	label.line_height = 45;
	label.y = -260;
	world.addActor(label);
	label.cull = false;
	
	data.label = label;
	
	var silh = new b5.Actor;
	silh.setSize(644,429);
	silh.setPosition(250,200);
	silh.bitmap = scene.findResource('CupheadSilhouette', 'bitmap');
	bg.addActor(silh);
	silh.tint_colour = "#9e7e00";
	silh.cull = false;
	
	scene.findResource('TweenAnim', 'raw').onload = function(data) {
		world.timelines.parse(data);
	}
	
	var labelC = new b5.Actor;
	world.addActor(labelC);
	labelC.opacity=0
	
	var checkLabel = new b5.LabelActor;
	checkLabel.text = "Don't miss an UPDATE!\n     tap the screen to start";
	checkLabel.font = scene_GUI.findResource('CupheadVogueExtraBoldFont', 'brush');
	labelC.addActor(checkLabel);
	
	checkLabel._rotation = 90* b5.Maths.DtoRad;
	checkLabel.line_height = 550;
	checkLabel.setPosition(400,170);
  checkLabel._scale = .3;
  
  checkLabel.name = "CheckLabel";
  
  // Thanks label
  
  var thanksLabel = new b5.LabelActor;
	thanksLabel.text = "THANK\nYOU!";
	thanksLabel.font = scene_GUI.findResource('CupheadVogueExtraBoldFont', 'brush');
	labelC.addActor(thanksLabel);
	
	thanksLabel._rotation = 90* b5.Maths.DtoRad;
	thanksLabel.line_height = 40;
	thanksLabel.setPosition(385,-20);
  thanksLabel._scale = 0.8;
  thanksLabel.stroke_thickness = 3;
  thanksLabel.stroke_filled = true;
  thanksLabel.stroke_style = "black";
  thanksLabel.name = "ThanksLabel";
  
  //Thanks!
  var creditsLb = new b5.LabelActor;
	creditsLb.setTextFmt(scene.findResource('Credits','raw').data);
	creditsLb.font = scene_GUI.findResource('CupheadVogueExtraBoldFont', 'brush');
	labelC.addActor(creditsLb);
	
	creditsLb._rotation = 90* b5.Maths.DtoRad;
	creditsLb.line_height = 45;
	creditsLb.setPosition(330,-75);
	creditsLb.text_align = "left";
  creditsLb._scale = 0.25;
  creditsLb.name = "CreditsLabel";
  
  
  var wsb = new b5.Actor;
  wsb.bitmap = scene.findResource('ButtonWebsite','bitmap');
  wsb.setSize(849,392);
  wsb.setPosition(300,170);
  wsb._scale = .11;
  wsb.cull=false;
  wsb.rotation = checkLabel.rotation;
  labelC.addActor(wsb)
  
  var dsb = new b5.Actor;
  dsb.bitmap = scene.findResource('ButtonDiscord','bitmap');
  dsb.setSize(725,197);
  dsb.setPosition(360,115);
  dsb._scale = .11;
  dsb.cull=false
  dsb.rotation = checkLabel.rotation;
  labelC.addActor(dsb)
  
  var ytb = new b5.Actor;
  ytb.bitmap = scene.findResource('ButtonYT','bitmap');
  ytb.setSize(1180,222);
  ytb.setPosition(361,230);
  ytb._scale = .08;
  ytb.cull=false;
  ytb.rotation = checkLabel.rotation;
  labelC.addActor(ytb);
  
  //Map buttons
  var wsb_t = new b5.RectActor;
  wsb_t.setSize(300,150);
  wsb_t.setPosition(240,50);
  wsb_t.name = "WebsiteButtonTouchable"
  scene.addActor(wsb_t);
  wsb_t.opacity=0
  wsb_t.onBeginTouch=()=>{
  	open('https://andrewdev.wixsite.com/cupheadcdv')
  }
  
  var dsb_t = new b5.RectActor;
  dsb_t.setSize(260,100);
  dsb_t.setPosition(60,-165);
  dsb_t.name = "DiscordButtonTouchable";
  scene.addActor(dsb_t);
  dsb_t.opacity=0;
  dsb_t.onBeginTouch=()=>{
  	open('https://discord.gg/5URer9VfQS')
  }
  
  var ytb_t = new b5.RectActor;
	ytb_t.setSize(300,100);
	ytb_t.setPosition(460,-160);
  ytb_t.name = "YoutubeButtonTouchable";
  scene.addActor(ytb_t);
  ytb_t.opacity=.0
  ytb_t.onBeginTouch=()=>{
  	open('https://youtube.com/channel/UCTnVFq_ZyE6THIfFEBMxBAA')
  }
	
};
b5.onLoadingScreenOut = function(world, scene, data, game) {
	//Called when the loading screen is fading out, here you can start animating your actors and do whatever you want!
	
	var bg = world.findActor("BG"),
	chkl = world.findActor('CheckLabel',true),
	thnkl = world.findActor('ThanksLabel',true);
	
	bg.touchable = true;
	bg.onBeginTouch = function() {
	 if(!this.phase) {
	 	this.phase = 1;
		//Animate
		world.timelines.timelines[0].play();
	  
	  scene.setTimeout(()=>{
			scene.findActor('WebsiteButtonTouchable').touchable = 
			scene.findActor('DiscordButtonTouchable').touchable = 
			scene.findActor('YoutubeButtonTouchable').touchable = true;
		},.9);
		
		new b5.Tweener(data.label,'opacity',null,1,0,.5,b5.Ease.linear,.2).start();
		new b5.Tweener(chkl.parent,'opacity',null,0,1,.5,b5.Ease.linear,.2).start();
	  
		//Grayscale filter
		var gsf = new PIXI.filters.ColorMatrixFilter();
		bg.addFilter(gsf);
		
		gsf.ac_gs = 0;
		
		//Animate	more
		new b5.Tweener(gsf, 'ac_gs', null, 0, -1, 1.2, b5.Ease.quadinout).start();
		chkl.setInterval(()=>{
	    gsf.brightness(1-(-gsf.ac_gs*.5));
	    gsf.saturate(gsf.ac_gs,true); //ADD
	    
	    //Animate text
	    var line1 = chkl.getLineIndexes(0);
	      
	    for(var i = line1[0], t = app.now*.0035, m=10; i < line1[1]+1; i++) {
	    	var a = t + (i*.2);
	    	chkl.setFormatIndex(i, [ , , 0, Math.sin(a)*m,1,1+(Math.cos(a)*.2)]);
	    }
	    
	    var line2 = chkl.getLineIndexes(1);
	    
	    for(var i = line2[0], t = app.now*.001,m=.6, x = Math.random()*4, y=Math.random()*4; i<line2[1]+1; i++) {
	      m *= 1.04
	    	chkl.setFormatIndex(i, [ , , x, y,m , m])
	    }
	    
	    //Thanks label
	    for(var i = 0, k = 0, t = -app.now*.006, m=4; i < thnkl.text.length; i++) {
	    	thnkl.text[i] == "\n" && (k = 0);
	    	var a = t + (k*.5),
	    	c = PIXI.utils.rgb2string( PIXI.utils.rotateRGB(a) );
	    	thnkl.setFormatIndex(i, [c , , Math.cos(a)*m, Math.sin(a)*m]);
	    	k++;
	    }
	    
		},0);
	 }
	 else if(this.phase === 1 && chkl.parent.opacity > 0.5) {
	 	this.phase = 2;
	 	b5.Game.LoadScene('title', false, false, {show_anim: 'fade', show_speed: 0.4, hide_anim: 'fade', hide_speed: 1.4});
	 }
	}
	//Listen also to input
	bg.onTick = function() {
		for(var i in game.Input.player1) Math.round(game.Input.player1[i]) && this.touchable && this.onBeginTouch();
	}
};
b5.addSceneResources = function(scene, data, game) {
	//Resources that will be added to scene, this will be called before LoadScene
	data.text =b5.File.readSync(b5.Paths.texts + 'notice.txt');
	
	scene.addResource(new b5.Bitmap('CupheadSilhouette',data.resourcePath + 'silhouettew.png'), 'bitmap');
	
	scene.addResource(new b5.Raw('TweenAnim', data.resourcePath + 'TweenToSilhouette.timeline.json'), 'raw');
	
	scene.addResource(new b5.Bitmap('ButtonWebsite', data.resourcePath + 'buttonw.png'),'bitmap');
	scene.addResource(new b5.Bitmap('ButtonDiscord', data.resourcePath + 'discordw.png'),'bitmap');
	scene.addResource(new b5.Bitmap('ButtonYT', data.resourcePath + 'ytw.png'),'bitmap');
	
	scene.addResource(new b5.Raw('Credits', b5.Paths.texts +'credits.txt',true,null,true), 'raw');
};
b5.onSceneUnload = function(world, scene, data, game, clearResources) {
    //Called when app is about to remove the scene, if clearResources is true, that means the app will clean the resources of the scene
    //You can also remove created objects in b5.Game if they were created and used on the scene.
};
b5.UpdateScene = function(world, scene, data, game) {
	//For updating actors and behaviors on your scene every frame
};