b5.export = function(world, scene, data, game) {
	var myexports = {
	};
	
	//Import resources for level
	var resources = JSON.parse(b5.File.readSync(b5.Paths.sceneRes + 'common_level/resources.json'));
	
	game.parseResources(resources, scene);
	
	data.createBossExplosionsEmitter = function(x,y,radius,duration) {
		let emitterData = {
			x: x, y: y, radius: radius, duration: duration,
			atlas: scene.findResource('BossExplosionAtlas','brush')
		};
		emitterData.timer = world.setInterval(()=>{
			var explosion = new b5.Actor();
			explosion.atlas = emitterData.atlas;
			explosion.x = emitterData.x + b5.Maths.randomRange(-emitterData.radius,emitterData.radius);
			explosion.y = emitterData.y + b5.Maths.randomRange(-emitterData.radius,emitterData.radius);
			explosion.frame_speed = 24;
			explosion.frames_repeat = false;
			explosion.cull = false;
			explosion._scale = .8;
			explosion.layer = data.view.playerSubLayer || 3;
			explosion.rotation = Math.PI * b5.Maths.randomRange(-1,1,true);
			explosion.onAnimEnd = explosion.destroy;
			world.findActor('Layer'+data.view.playerLayer,true).addActor(explosion);
			
			data.shakeCamera(7,0,12);
			
			emitterData.onExplosion && emitterData.onExplosion();
		},0.3);
		
		world.setTimeout(t => {
			!data.players_dead && world.clearInterval(emitterData.timer);
		}, emitterData.duration);
		
		world.setTimeout(e => scene.findResource('KnockoutBoomSfx','sound').play(),app.dt);
		
		return emitterData;
	};
	
	return myexports;
};