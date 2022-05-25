return function(thisPlayer, flags, world, scene, game, charmData) {
	//Setup actions
	var basePath = 'player/'+thisPlayer.name + "/extras/" + thisPlayer.data.level_type,
	prevJumpState = 0,
	parried = false,
	axeActive = false;
	
	let damage = 20;
	
	//Load player specific resources
	game.parseResources({
		bitmap: [
			{
				name: thisPlayer.name + "ParryAxeBitmap",
				src: basePath + "_ParryAxe-0.png"
			}
		],
		brush: [
			{
				name: thisPlayer.name + "ParryAxeAtlas",
			  bitmaps: [thisPlayer.name + "ParryAxeBitmap"],
			  frames: basePath + "_ParryAxe.csv",
			  anims: "player/charms/whetstone/ParryAxe.anims.json"
			}
		]
	}, scene);
	scene.tryLoadNextResource();
	
	//Add sprite to player
	var axeSprite = new b5.Actor();
	axeSprite.atlas = scene.findResource(thisPlayer.name + "ParryAxeAtlas", "brush");
	axeSprite.y = -15;
	thisPlayer.addActor(axeSprite);
	axeSprite.name = "AxeSprite";
	axeSprite.visible = false;
	
	let deactivate = function() {
		thisPlayer.Sprite.visible = true;
		axeSprite.visible = false;
		axeSprite.active = false;
		axeActive = false;
	},
	spawnSpark = function(o) {
		var p = new	b5.Actor();
		p.atlas = axeSprite.atlas;
		p.setPosition(
			b5.Maths.pos(thisPlayer.x, o.x, 0.25),
			b5.Maths.pos(thisPlayer.y, o.y, 0.25)
		);
		p.layer = thisPlayer.layer -1;
		p.rotation = Math.PI * b5.Maths.randomRange(-1,1,true);
		world.PlayerLayer.addActor(p);
		p.onAnimEnd = p.destroy;
		p.playAnim('spark');
	};
	
	return {
		onTick: function() {
			//Upddate
			
			if(prevJumpState != flags.jumpState) {
				prevJumpState = flags.jumpState;
				
				if(prevJumpState == 3 && !parried) {
					thisPlayer.Sprite.visible = false;
					axeSprite.visible = true;
					axeSprite.active = true;
					parried = true;
					axeActive = true;
					axeSprite._scale_x = Math.sign(thisPlayer.Sprite.scale_x);
					axeSprite.playAnimWithEnd('jump', s => deactivate());
					
					scene.findResource('ParryAxeSfx'+b5.Maths.randomRange(1,3),'sound').play();
				}
				else {
					deactivate();
					if(flags.jumpState == 0) parried = false;
				}
				
			}
			
			//Behavior
			if(prevJumpState == 3 && axeActive) {
				for(var i = 0, h = thisPlayer.hitboxes[5].A_overlaps, obj; i < h.length; i++) {
					if((obj = h[i]).tags.indexOf('hittableEnemy') != -1) {
						axeActive = false;
						
						thisPlayer.parry(0);
						
						if(obj && obj.onBulletHit) {
							spawnSpark(obj);
							obj.onBulletHit({damage});
						}
					}
				}
				axeSprite._scale_x = Math.sign(thisPlayer.Sprite.scale_x);
			}
			
		}
	};
};