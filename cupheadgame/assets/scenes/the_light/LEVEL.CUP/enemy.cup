return {
	jaredHead: function(world, scene, data) {
		var j = new b5.Actor;
		j.bitmap = scene.findResource('Jared','bitmap');
		j.setSize(100,139);
		j.tag = "enemy";
		j.tags = ["enemy"];
		j.name = "jaredHead";
		world.findActor('Layer'+scene.data.view.playerLayer).addActor(j);
		
		j.initBody('collider',true);
		var ft = j.getFixtureSelf();
		ft.height = 50;
		ft.width = 50;
		j.addFixture(ft);
		
		j._layer = data.layer;
		j.setPosition(data.pos.x,data.pos.y);
		j.data = data.data;
		j.time = 3;
		j.round_pixels = false;
		j.w *= 0.6;
		j.h *= 0.6;
		j.name = j.data.name;
		j.scale_x *= data.facing;
		j.start_x = j.x;
		j.range = 200;
		j.onTick = function() {
			this.time += b5.Game.speed*0.014;
			this.setPosition(this.start_x + (this.range+Math.cos(this.time)*this.range)*(this.data.inverted?-1:1),this.y);
		};
		return j;
	}
};