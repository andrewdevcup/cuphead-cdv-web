//SCREENFX

(function() {

	var scfx = b5.Game.screenfx = new b5.Actor();
	scfx.atlas = new b5.ImageAtlas('screenfx_atlas', []);
	scene_GUI.addActor(scfx);

	scfx.enabled = b5.Game.cfg.Video.screenfx_enabled;
	scfx.activated = false;

	//Secondary (darks) screen effect
	//Lags some frames behind
	var scfxd = new b5.Actor();
	scfxd.atlas = scfx.atlas;
	scfx.addActor(scfxd);

	//loading screen because game can lag for quite some time loading all the textures
	var omp = new b5.RectActor(),
	ompl = new b5.Actor();
	omp.addActor(ompl);
	omp.fill_style = '#000000aa';
	omp.setSize(1280,720);
	ompl.bitmap = new b5.Bitmap('onemoment', b5.Paths.assets+'loading.png');
	ompl.setSize(512, 256);
	ompl._scale = 1.6;
	omp.layer = 6; //Above gui
	omp._av = false;
	scene_GUI.addActor(omp);

	//Use actor to update sprite animations,
	//Use a filter to mix the texture

	b5.Filters.screenfx = new b5.Shader('ScreenFXFilter', b5.Paths.shaders + 'ScreenFX.ish', false);

	scfx.frame_speed = 48;
	scfx.data.loop_count = 0;
	scfx.data.flipX = false;
	scfx.data.flipY = false;

	scfxd.frame_speed = 48;
	scfxd.data.loop_count = 2;
	scfxd.current_frame = 50;
	scfxd.data.flipX = false;
	scfxd.data.flipY = false;

	scfx.visible = true;
	scfx.ignore_atlas_size = true;
	scfxd.ignore_atlas_size = true;
	scfx.setSize(0, 0);
	scfxd.setSize(0, 0);

	//Animate
	scfx.onTick = function() {
		var filter = b5.Filters.screenfx;
		filter.screenfxTextureLight = this.sprite.texture || PIXI.Texture.WHITE;
		filter.screenfxTextureDark = scfxd.sprite.texture || PIXI.Texture.WHITE;
		filter.textureSize = [1/640, 1/320]; //texture size
		filter.sourceSize = [1/(app.design_width*.5), 1/(app.design_height*.5)]; //app size
		filter.flipX = this.data.flipX;
		filter.flipY = this.data.flipY;

	};

	scfx.onAnimRepeat = function() {
		//Flip the image on every loop
		switch (this.data.loop_count) {
			case 0:
				this.data.flipX = false;
				this.data.flipY = false;
				break;
			case 1:
				this.data.flipX = true;
				this.data.flipY = false;
				break;
			case 2:
				this.data.flipX = false;
				this.data.flipY = true;
				break;
			case 3:
				this.data.flipX = true;
				this.data.flipY = true;
				break;
		}
		this.data.loop_count < 3 ?
		this.data.loop_count++: this.data.loop_count = 0;
	}

	scfxd.onAnimRepeat = function() {
		//Flip the image on every loop
		switch (this.data.loop_count) {
			case 0:
				this.data.flipX = false;
				this.data.flipY = false;
				break;
			case 1:
				this.data.flipX = true;
				this.data.flipY = false;
				break;
			case 2:
				this.data.flipX = false;
				this.data.flipY = true;
				break;
			case 3:
				this.data.flipX = true;
				this.data.flipY = true;
				break;
		}
		this.data.loop_count < 3 ?
		this.data.loop_count++: this.data.loop_count = 0;
	}

	scfx.activate = function() {
		//Load resources
		if (!this.activated) {
			this.activated = true;
			omp._av = true;
			app.setTimeout(() => {
				for (var i = 0, b = scfx.atlas.bitmaps, c = null; i <= 126; i++) {
					b.push(
						scene_GUI.addResource(
							c = new b5.Bitmap('ScreenFXBitmap'+i, b5.Paths.assets + 'screenfx/cuphead_screen_fx_'+i+'.jpg'),
							'bitmap'
						)
					);
					
				}
				var fr = new b5.Raw('frames', b5.Paths.assets + 'screenfx/screenfx.frames.json', true, frames =>{
					scfx.atlas.parseFrames(frames, true)
				},true);
				app.addFilter(b5.Filters.screenfx.filter);
				b[b.length-1].onload=a => omp._av = false;
			}, app.dt);
		}
	};
	scfx.deactivate = function() {
		if (this.activated) {
			this.activated = false;
			for (var i = 0, b = this.atlas.bitmaps; i < b.length; i++) {
				b[i].texture.baseTexture.dispose();
				b[i].destroy();
			}
			this.atlas.bitmaps = [];
			this.atlas.frames = [];
			this.sprite.texture = PIXI.Texture.WHITE;
			this.atlasTex = null;
			app.removeFilter(b5.Filters.screenfx.filter);
		}
	}

	scfx.enabled && scfx.activate();

	//SFX
	var opticalstart1 = new b5.Sound('OpticalStart1', b5.Paths.assets + 'sfx_Optical_Start_001.ogg', false, false);
	scene_GUI.addResource(opticalstart1, 'sound');
	opticalstart1.global_stream = true;
	b5.Game.Sfx.add(opticalstart1);

	var opticalstart2 = new b5.Sound('OpticalStart2', b5.Paths.assets + 'sfx_Optical_Start_002.ogg', false, false);
	scene_GUI.addResource(opticalstart2, 'sound');
	opticalstart2.global_stream = true;
	b5.Game.Sfx.add(opticalstart2);

	var opticalLoop = new b5.Sound('OpticalLoop', b5.Paths.assets + 'sfx_OpticalLoop.ogg', false, false);
	scene_GUI.addResource(opticalLoop, 'sound');
	b5.Game.Sfx.add(opticalLoop);
	opticalLoop.loop = true;
	opticalLoop.auto_play = true;
	opticalLoop.global_stream = true;

	//Play either at start
	b5.Maths.randomChance(0.5) ? opticalstart1.auto_play = true: opticalstart2.auto_play = true;

	var timer = 0;
	app.addTask('OpticalStartIntervalTask', b5.Maths.randomRange(0.1, 2), Infinity, function() {
		//OpticalStart 1/2 plays every 32 seconds (as in the original game)
		timer < 1920 ? timer += b5.Game.speed: (//1860f = 32s @ 60fps
			//Play either 1 or 2 randomly
			b5.Maths.randomChance(0.5) ? opticalstart1.play(): opticalstart2.play(),
			timer = 0
		);
	});
})();