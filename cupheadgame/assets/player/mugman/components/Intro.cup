return function(thisPlayer, flags, input, world, scene, game, data) {
	
	//Load extra resources if introFlag is 2 (cookie)
	
	if(flags.introFlag == 2) {
		game.parseResources(
			JSON.parse(b5.File.readSync(b5.Paths.player + thisPlayer.name + '/dlc/resources.json'))
		,scene);
	}
	thisPlayer.playIntroAnimation = function(introFlag) {
		switch(introFlag) {
			case 0: //Normal intro
			case 1: //Cookie intro
				var intro = ['a','b'][b5.Maths.randomRange(0,1)];
				thisPlayer.setTimeout(f => {
					thisPlayer.visible = true;
					thisPlayer.Sprite.playAnimWithEnd('intro_'+intro, x => {
						x.parent.updateAnimations = true;
					});
				},0.5);
			break;
			
			case 2: //No-Cookie intro
			
			  var plyr = new b5.Actor(),
			  cookie = new b5.Actor();
			  
			  plyr.atlas = scene.findResource(thisPlayer.name + ':IntroDLCAtlas','brush');
				thisPlayer.parent.addActor(plyr);
				
				plyr.setPosition(thisPlayer.x,thisPlayer.y);
				plyr.setScale(thisPlayer.scale_x*.95, thisPlayer.scale_y*.95);
				plyr._oy = thisPlayer.Sprite.oy;
				plyr.ox = 2;
				plyr._layer = thisPlayer.layer;
				
				cookie.atlas = plyr.atlas;
				thisPlayer.parent.addActor(cookie);
				
				cookie.setPosition(plyr.x,plyr.y);
				cookie._oy = -26;
				cookie.layer = thisPlayer.layer;
				
				plyr.visible = false;
				thisPlayer.visible = false;
				cookie.visible = false;
				
				plyr.setTimeout(f=>{
					plyr.visible = true;
					
					plyr.playAnimWithEnd('intro_no_cookie', m => {
						thisPlayer.visible = true;
						m.destroy();
					});
					
					//Cookie
					plyr.setTimeout(x => {
						cookie.visible = true;
						cookie.playAnimWithEnd('cookie', r => {
							r.TweenToWithEnd('opacity',0,0.6,b5.Ease.linear,false,0.8,g=>g.destroy());
						});
					},0.95);
					
				},0.4);
			  
			break;
			
			case 3: //Intro scared
			case 4:
				thisPlayer.setTimeout(f => {
					thisPlayer.Sprite.playAnimWithEnd('intro_scared', x => {
						x.parent.updateAnimations = true;
					});
				},0.5);
			break;
		}
		
	};
	
	return function(thisPlayer, flags, input, world, scene, game, data) {
	};
};