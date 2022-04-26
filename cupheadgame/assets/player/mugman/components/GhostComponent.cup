return function(thisPlayer, flags, input, world, scene, game, data) {
	//Setup local variables here
	//This function will be called when player is first created
	//For executing actions when loading screen is being hidden,
	//add the method thisPlayer.onLoadingScreenOut = function(){...}
	//var myvar = flags.jumping
	
	//Add ghost resources to the level
	var ghostPath = b5.Paths.player + thisPlayer.name + "/ghost/resources.json";

	//Load resources
	game.parseResources(b5.File.readSync(ghostPath),scene);
	
	thisPlayer.spawnGhost = function(speed_y) {
		var ghost = new b5.Actor(),
		parryObj = new b5.RectActor();
		
		ghost.atlas = scene.findResource('MugmanGhostAtlas','brush');
		ghost.playAnim('idle',true);
		
		ghost.y = -20;
		ghost._scale = 0.94;
		ghost.cull = false;
		
		parryObj.setSize(40,40);
		parryObj.fill_style = "transparent";
		parryObj.tags = ["Parryable"];
		parryObj.parryScore = 100;
		parryObj.addActor(ghost);
		parryObj.cull = false;
		parryObj.id = thisPlayer.name + "ghost";
		
		parryObj.setPosition(this.x,this.y);
		
		parryObj.onParry = function() {
			this.tags = [];
			this.body.m_linearVelocity.y = 0;
			flags.damageHit = false;
			flags.heartPoints = 1;
			scene.findResource('PlayerReviveSfx','sound').play();
			this.actors[0].playAnimWithEnd('thank_you',_this=>{
				var reviveEff = data.spawnPlayerParticle("playerReviveEffect", _this.parent);
				_this.parent.destroy();
				reviveEff.onAnimEnd = function() {
					thisPlayer.revive(this.x,this.y-30);
					this.destroy();
				}
			});
		}
		
		thisPlayer.parent.addActor(parryObj);
		parryObj.layer = thisPlayer.layer;
		
		parryObj.initBody('collider',true);
		parryObj.addFixtureSelf();
		
		parryObj.body.m_linearVelocity.y = speed_y || -8;
	}
	
	thisPlayer.revive = function(x,y) {
		this.visible = true;
		this.setPosition(x,y);
		
		this.Sprite.playAnimWithEnd('revive_finale',_this => {
			thisPlayer.updateAnimations = true;
			flags.controllable = true;
			flags.intangible = false;
			thisPlayer.body.SetActive(true);
			thisPlayer.body.m_linearVelocity.y = -70;
			thisPlayer.setIntangible();
		});
	}
	
	return function(thisPlayer, flags, input, world, scene, game, data) {
		//This is a loop function
		//It will be called consecutively when loadingScreenOut
 
	};
};