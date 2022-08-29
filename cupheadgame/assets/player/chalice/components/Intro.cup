return function(thisPlayer, flags, input, world, scene, game, data) {
	
	//Load extra resources if introFlag is 1 or 4
	if(flags.introFlag == 1 || flags.introFlag == 4) {
		game.parseResources(
			JSON.parse(b5.File.readSync(b5.Paths.player + thisPlayer.rname + '/dlc/resources.json'))
		,scene);
	}
	thisPlayer.playIntroAnimation = function(introFlag) {
		switch(introFlag) {
			case 0: //Normal intro
			case 1:
			case 2:
				thisPlayer.visible = false;
				
				//Create player sprite (cookie)
				var plyr = new b5.Actor(),
				portal = new b5.Actor();
				
				portal.atlas = scene.findResource('PortalIntroAtlas','brush');
				thisPlayer.parent.addActor(portal);
				
				//Adjust to player position and size
				portal.setPosition(thisPlayer.x,thisPlayer.y);
				portal._scale = thisPlayer.Sprite.scale;//setScale(thisPlayer.scale_x, thisPlayer.scale_y);
				portal._oy = -12;
				portal._ox = 1;
				portal._layer = thisPlayer.layer;
				
				plyr.atlas = scene.findResource(thisPlayer.rname + ':IntroDLCAtlas','brush');
				thisPlayer.parent.addActor(plyr);
				
				plyr.setPosition(thisPlayer.x,thisPlayer.y);
				plyr.setScale(thisPlayer.scale_x*.9, thisPlayer.scale_y*.9);
				plyr._oy = -12;
				plyr._layer = thisPlayer.layer+1;
				
				//Animation
				portal.visible = false;
				portal.frames_repeat = false;
				plyr.visible = false;
				portal.onAnimEnd = function() {
					this.destroy();
				}
				plyr.setTimeout(z=> {
					plyr.visible = true;
					plyr.playAnimWithEnd("intro_cookie", m => {
						portal.visible = true;
						portal.frame_speed = 24;
						plyr.playAnimWithEnd('intro_portal', h => h.destroy());
						plyr._scale = 0.99;
						plyr._oy = -5;
						plyr._ox = 1;
					});
				},0.4);
				
				thisPlayer.setTimeout(f => {
					thisPlayer.visible = true;
					thisPlayer.Sprite.playAnimWithEnd('intro_a', x => {
						x.parent.updateAnimations = true;
					});
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