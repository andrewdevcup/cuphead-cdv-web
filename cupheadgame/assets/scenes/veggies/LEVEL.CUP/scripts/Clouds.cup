function onCreate(world, scene, data, game) {
	this.createCloud = function(x,y,cl,vx) {
		var cloud = new b5.Actor();
		cloud.atlas = this.atlas;
		cloud.setPosition(x,y);
		cloud.current_frame = [12,13,14,15,16,17,18][cl];
		this.parent.addActor(cloud);
		cloud.name = "Cloud-"+cl;
		cloud._scale = 1.1;
		
		cloud.vx = vx;
		cloud.cull = false;
		cloud.onTick = function() {
			if(this.x < -1000) {
				this.x = 1000;
				this.vx = b5.Maths.randomRange(-1,-3,true) * 10;
			}
		}
	};
	
	for(var i = 0, x = -640, y = -150,a = 0; i < 10; i++) {
		a > 4 && (a = 0);
		this.createCloud(x,y,a, b5.Maths.randomRange(-1,-3,true)*10);
		x += b5.Maths.randomRange(200, 300);
		a++;
	}
}