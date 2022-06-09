function onCreate(world, scene, data, game) {
	
	if(data._platformAddedId === void	0) data._platformAddedId = 0;
	else data._platformAddedId++;
	
	const platform = new b5.Actor(),
	propellor = new	b5.Actor(),
	shadow = new b5.Actor(),
	base = new b5.Actor();
	
	let id = data._platformAddedId;
	
	platform.atlas =
	propellor.atlas =
	shadow.atlas = scene.findResource('PlatformsAtlas','brush');
	
	platform.playAnim('platform_'+this.name.toLowerCase().replaceAll('platform',''), true);
	
	propellor.playAnim('propellor',true);
	shadow.playAnim('shadow',true);
	
	base.addActor(propellor);
	base.addActor(platform);
	
	this.parent.addActor(shadow);
	
	platform._y = 15;
	propellor.setPosition(3,60);
	
	base._scale = 0.97;
	
	const	lvlfloor = world.findActor('LevelFloor',true),
	thisPlatform = this;
	
	this._playerOnPlatform = false;
	this.setInterval(f => {
		let olp = this.A_overlaps,
		_this = f.data,
		playerOnPlatform = false;
		
		for(var i = 0; i < olp.length; i++) if(olp[i].tag == "player") {
			playerOnPlatform = true;
			break;
		}
		
		if(playerOnPlatform != _this._playerOnPlatform) {
			_this._playerOnPlatform = playerOnPlatform;
			
			//Set to origin / animate
			
			if(playerOnPlatform) {
				//Tween to lower
				base.anim_y = false;
				base.TweenTo('_oy',0,0.15,b5.Ease.backout,0);
			}
			else {
				base.anim_y = true;
				base.time = Math.PI/2;
			}
		//	base.anim_y = !playerOnPlatform;
		}
		
	},1/30);
	
	base.anim_ry = 8;
	base.anim_y = true;
	base.anim_spd =1.8;
	base.time = b5.Maths.even(id) ? Math.PI/2 : 0;
	
	base.onTick = function() {
		if(!this.anim_y) return;
		this.time += app.dt;
		this._oy = -(this.anim_ry + (Math.cos(this.time*this.anim_spd)*this.anim_ry));
	}
	
	shadow.onTick	= function() {
		this.setPosition(
			thisPlatform.x,
			lvlfloor.y - lvlfloor.h
		);
	};
	
	this.addActor(base);
}