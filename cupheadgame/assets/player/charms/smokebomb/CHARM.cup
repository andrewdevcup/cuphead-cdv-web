return function(thisPlayer, flags, world, scene, game, charmData) {
	//Setup actions
	let dashing = false,
	smokepuffatlas = scene.findResource('PlayerDashSmokeAtlas','brush'),
	addSmoke = function() {
		var p = new b5.Actor();
		p.atlas = smokepuffatlas;
		p.setPosition(thisPlayer.x,thisPlayer.y);
		p.layer = thisPlayer.layer+1;
		thisPlayer.parent.addActor(p);
		p.playAnimWithEnd(b5.Maths.randomRange(0,1)?'dust_a':'dust_b', t => t.destroy());
		p._scale = 0.95;
		
		var dashDust = world.findActor(thisPlayer.name+'-dashDust',true);
		dashDust && (dashDust.opacity = 0);
	}
	
	return {
		onTick: function() {
			//Upddate
			if(dashing != flags.dashing) {
				dashing = flags.dashing;
				addSmoke();
				if(dashing) {
					flags.hittable = false;
					thisPlayer.visible = false;
				}
				else {
					flags.hittable = !game.Multiplayer.isGuest;
					thisPlayer.setTimeout(e => thisPlayer.visible = !dashing,0.04);
				}
			}
		}
	};
};