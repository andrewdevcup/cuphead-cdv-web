return {
	largeExplosion: function(target, scene) {
		var p = new b5.Actor;
		p.atlas = scene.findResource('GenericLGExplosionAtlas','brush');
		p.center_atlas = true;
		p.setPosition(target.x,target.y);
		p._scale = 0.9;
		p.round_pixels = false;
		target.parent.addActor(p);
		p.tags = ['particle','levelParticle'];
		p.layer = scene.data.view.playerLayer+2;
		p.tag = p.tags[0];
		//Play random anims
		var anims = ['lg_explosion_A','lg_explosion_B','lg_explosion_C'];
		p.playAnim(anims[b5.Maths.randomRange(0,2)]);
		//Destroy on anim end
		p.onAnimEnd = p.destroy;
	},
	coinGrab: function(target, scene) {
		var p = new b5.Actor;
		p.atlas = scene.findResource('CoinGrabAtlas','brush');
		p.center_atlas = true;
		p.setPosition(target.x,target.y);
		p.round_pixels = false;
		target.parent.addActor(p);
		p.tags = ['particle','levelParticle'];
		p._layer = target.layer;
		p.tag = p.tags[0];
		
		p.frame_speed = 24;
		p.frames_repeat = false;
		p.onAnimEnd = p.destroy;
	}
};