return {
	walkingDust: function(target, scene, data) {
		var p = new b5.Actor;
		p.atlas = scene.findResource('playerMapDustAtlas','brush');
		p.center_atlas = true;
		p.setPosition(target.x + data.ox,target.y + 26);
		p._scale = 0.9;
		p.round_pixels = false;
		target.parent.addActor(p);
		p.tags = ['particle','playerParticle'];
		p._layer = target.layer;
		//Play random anims
		var anims = ['dustA','dustB','dustC','dustD','dustE','dustF'];
		p.playAnim(anims[b5.Maths.randomRange(0,5)]);
		//Destroy on anim end
		p.onAnimEnd = p.destroy;
		//Go up
		p.vy = -30;
	}
};