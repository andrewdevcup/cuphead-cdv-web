/*
*
* CUPHEAD CDV
* AUTHOR: ANDREWDEV
* YOU ARE FREE TO MODIFY THE CODE AS YOU WANT
* THE SOURCE CODE MAY SUFFER IMPORTANT CHANGES IN EVERY RELEASE
* MAKE SURE TO UPDATE YOUR MODS ASWELL
* PLEASE DO NOT CLAIM THE SOURCE CODE / PARTS OF IT AS YOURS
*
*/
RELEASE_CODENAME = "Pre-Beta";
RELEASE_VER = "2.5.5";

b5.Splash = function() {
	var div = document.createElement('div'),
  img = new Image(),
  lb = document.createElement('div'),
  lbp = document.createElement('div');
	img.src = internalDir + 'engine/res/logo_dark.png';
	div.onresize = function() {
		var s = this.style, e = b5.app.canvas.style;
		s.width = e.width,
		s.height = e.height,
		s.top = e.top,
		s.left = e.left,
		s.position = 'absolute',
		s.backgroundColor = '#222',
		s.display = "grid";
		s.alignItems = s.justifyItems = "center";
		
		img.style.width = "25%";
		
	  lb.style.width = "86%";
	  
	  lb.style.top = "82%"
	  lb.style.position = "absolute";
	//  lb.style.backgroundColor = "gray";
	  
	  lbp.style.height = "9px";
	  lbp.style.backgroundColor = "white"
	}
	b5.app.onResize = ()=>{div.onresize()};
	div.id = "splashscreen";
	div.appendChild(img);
	div.appendChild(lb);
	lb.appendChild(lbp);
	lbp.style.width = "0%"
	lb.setPercent=function(p) {
		lbp.style.width = Math.round(p*100)+"%"
	}
	div.destroy = function() {
		try{document.body.removeChild(this);}catch(e){}
		img.src = "";
	}
	div.loadingBar = lb;
	return document.body.appendChild(div), div;
}



b5.onload = function() {
	
//Add buttons for mobile devices to flip the screen
if(b5.Utils.IsMobile() && (cordova.platformId == "browser"|| window.DebugBuild)) {
var mbtn = document.createElement('button');
mbtn.textContent = "Fullscreen";
document.body.appendChild(mbtn);
mbtn.onclick = function() {
	b5.Utils.SetFullscreen(true);
	b5.Utils.SetOrientation('landscape');
}
}

//Extensions
//b5.Utils.loadJS(internalDir +'engine/extensions/xml2js.js').onload = function() {
	b5.XML = {};
	b5.XML.parse = function(xml) {
		var a = null;
		_xml2js.parseString(xml,(e,t)=>{a=t});
		return a;
	};
	b5.XML.stringify = function(o) {
		return new _xml2js.Builder().buildObject(o);
	}
//};

b5.loadgame()

/*
b5.dbgtxt = document.createElement('p');
b5.dbgtxt.style.position='absolute';
document.body.appendChild(b5.dbgtxt);
b5.dbgtxt.style.color = "#ffffffcc";

new FontFace('CupheadVogueExtraBold', `url("${internalDir+'assets/fonts/truetype/CupheadVogue-ExtraBold-merged.otf'}")`).load().then(font=>{document.fonts.add(font)})
b5.dbgtxt.style.font = "8pt CupheadVogueExtraBold";
b5.dbgtxt.style.textAlign = "center";
b5.dbgtxt.style.paddingLeft = "0%";
self.addEventListener('resize',a => b5.dbgtxt.style.marginTop = "2%",!1);
b5.dbgtxt.style.width = "inherit"
b5.dbgtxt.style.marginBlock = "inherit";
b5.dbgtxt.style.overflow = "hidden";
*/

b5.dbgtxt = new b5.LabelActor();
b5.dbgtxt._scale = 0.5;
b5.dbgtxt.dock_y = b5.Actor.Dock_Top;
b5.dbgtxt.oy = -60;
b5.dbgtxt.y2 = 40;
}

b5.loadgame = function() {
	console.hide();
	window.onerror = function (e, t, o, a) {
		console.show();
		console.error(e+'\n'+t+'\n'+o+':'+a);
		app.splash.destroy();
		switch(true) {
			case +o == 86 && +a == 68:
				console.log('CLEAR APP DATA');
				break;
			case e.indexOf('replaceAll is') > -1:
				console.log('UPDATE WEBVIEW');
				break;
			case e.indexOf('Video') > -1:
				console.log('STORAGE ERROR');
				break;
		}
	};

	//Create the app
	app = new b5.App(document.getElementById("gamecanvas"),
	true, true);
	app.debug = !true;
	app.prevent_default = true;
	app.adapt_resolution = false;
	app.disable_dock_screen = true;
	app.global_font_scale = .55;
	app.physics_step = 2;
	app.min_speed = 1/12;
	app.hide_cursor = true;
	app.texture_resolution = 1;
	//Fill canvas to screen
	app.setCanvasScalingMethod(b5.App.FitBest);

	//Initialize Audio
	b5.Sound.init(null, {
	/*	sampleRate: 44100, CAUSES UNMATCHING RATES ON ANDROID 11*/
	latencyHint: "interactive"
	});
	
	app.splash = b5.Splash();


	dev = {
		fastcoding: 0,
		loadscene: 'notice2', //8
		data: {}
	};
	
	// Beta tester methods
	
	salaDeArmas = function() {
		b5.Game.LoadScene('betatestloadout',false,true,{
			hourglass:true
		});
	}
	
	MultiplayerReSync = function() {
		b5.Game.Multiplayer.sendToGuest('HIDE_LS');
		b5.Game.SceneLoader.AllLoaded();
	}
	


	//Set screen mode
	b5.Utils.SetBackButtonEnabled(false);
	b5.Utils.SetFullscreen(true);

	//Paths to game resources
	b5.Paths = {
		assets: internalDir + 'assets/',
		saves: appResDir + 'saves/',
		config: appResDir + 'config.ini'
	};
	b5.Paths.scripts = b5.Paths.assets + 'scripts/',
	b5.Paths.scenes = b5.Paths.assets + 'scenes/',
	b5.Paths.sceneRes = b5.Paths.assets +'scenes/',
	b5.Paths.anims = b5.Paths.assets + 'anims/',
	b5.Paths.fonts = b5.Paths.assets + 'fonts/',
	b5.Paths.pkgs = b5.Paths.assets + 'objects/',
	b5.Paths.texts = b5.Paths.assets + 'texts/';
	b5.Paths.player = b5.Paths.assets + 'player/';
	b5.Paths.shaders = b5.Paths.assets + 'shader/';
	//Mods
	b5.Paths.modAssets = appResDir + "mods/";
	b5.Paths.modSceneRes = appResDir + 'mods/scenes/';
	
	//Filter collection (PIXIJS new!)
	b5.Filters = {};
	
	//Color split
	b5.Filters.color = new b5.Shader('ColorSplitFilter', b5.Paths.shaders + 'ColorSplit.ish', false);
	
	//Kawase Blur
	b5.Filters.kBlur = new b5.Shader('KawaseBlurFilter', b5.Paths.shaders + 'KawaseBlur.ish', false);
	
	//Outline (for stroke label)
	b5.Filters.outline = new b5.Shader('OutlineFilter', internalDir + 'engine/res/Outline.ish', false);
  
	b5.Game = {
		readConfig: function() {
			b5.Game.cfg = b5.INI.parse(b5.File.readSync(b5.Paths.config));
			//if (b5.Game.cfg.__fmt__[0][1].indexOf('# Base')>-1) b5.Game.cfg.__fmt__[0][1] = "# Main configuration file";
		},
		saveConfig: function(onSave, onFail) {
			var e = b5.File.write(b5.Paths.config, b5.INI.stringify(b5.Game.cfg));
			e.onwrite = onSave;
			e.onerror = onFail;
		},
		applyConfig: function(section) {
			//Update version to 1.3: Set current version and video noise to off.
			/*
			if(!b5.Game.cfg.Settings || (b5.Game.cfg.Settings && b5.Game.cfg.Settings.version < 1.3 && b5.Game.cfg.Settings.codename !== RELEASE_CODENAME)) {
				b5.Game.cfg.Video.screenfx_enabled = false;
				b5.Game.cfg.Video.resolution = "1152x648";
				b5.Game.cfg.Video.vsync = true;
			}*/
	  	
			b5.Game.cfg.Settings = { version: RELEASE_VER, codename: RELEASE_CODENAME };
			
			//Create new section
			if(!b5.Game.cfg.Game) b5.Game.cfg.Game = { dlc_title: true }
			if(b5.Game.cfg.Game.dlc_title === void 0) b5.Game.cfg.Game.dlc_title = true;
			
			if (section == "video" || !section) {
				//Video config
				var vcfg = b5.Game.cfg.Video;
				
				if(vcfg.colorFX === void 0 && vcfg.postprocessing !== void 0) {
					vcfg.colorFX = true;
					delete vcfg.postprocessing;
				}
				//Overscan
				app.global_scale = 1 - (vcfg.overscan*0.15);
				//app.clear_canvas = app.global_scale < 0.9;
				app.onResizeBase();
				//Vsync
				app.vsync = true; //vcfg.vsync;
				app.fps_limit = 250;
				//Noise
				b5.Game.screenfx && (vcfg.screenfx_enabled ? b5.Game.screenfx.activate() : b5.Game.screenfx.deactivate());
				//Resolution
				var res = vcfg.resolution,
				aspect_ratio = (vcfg.aspectRatio || "16:9").split(':');
				aspect_ratio = +aspect_ratio[0] / +aspect_ratio[1];
				app.setResolution(Math.ceil(res * aspect_ratio), res);
				//Aspect ratio
				app.setDesignSize(Math.ceil(720 * aspect_ratio), 720);
				//Adapt things to aspect ratio
				window.scene_GUI && (scene_GUI.w = app.design_width);
				window.sceneMain && (sceneMain.w = app.design_width);
				app.display.mask.width = app.design_width;
				
				//Display
				!dev.fastcoding && b5.Utils.SetOrientation('landscape');
				
				//Texture resolution
				if(vcfg.textureQuality == void 0) vcfg.textureQuality = 0.6;
				app.texture_resolution = vcfg.textureQuality;
				
				app.display.setAntialiasingEnabled(vcfg.antialiasing);
				//Effects
			  app[vcfg.colorFX ? 'addFilter' : 'removeFilter'](b5.Filters.color.filter);
			  
			  //Removals
			  if(vcfg.asyncTextureDecoding !== void	0) delete vcfg.asyncTextureDecoding;
			  
			  //Additions
			  if(vcfg.fastTextureDecoding === void 0) vcfg.fastTextureDecoding = false;
			  if(vcfg.cupheadFilters === void	0) vcfg.cupheadFilters = true;
			  if(vcfg.brightness === void 0) vcfg.brightness = 0.2;
			  
			  //Filters
			  var bright = b5.Maths.pos(-0.05, 0.3, vcfg.brightness);
			  if(vcfg.cupheadFilters) app.setFilters({
			  	contrast: 1.3 - bright,
			  	brightness: 0.85 + bright
			  });
			  
			  app.fast_texture_decoding = vcfg.fastTextureDecoding;
			  
			}
			//Audio config
			if (section == "audio" || !section) {
				var acfg = b5.Game.cfg.Audio;
				b5.Game.Music && (
					b5.Game.Music.volume = acfg.master * acfg.music * 0.8,
					b5.Game.Music.setVolumeMultiplierAll(b5.Game.Music.volume)
				);
				b5.Game.Sfx && (
					b5.Game.Sfx.volume = acfg.master * acfg.sfx,
					b5.Game.Sfx.setVolumeMultiplierAll(1*b5.Game.Sfx.volume)
				);
				
				if(acfg.reverb === void 0) acfg.reverb = false;
				
				b5.Sound.reverbEnabled = acfg.reverb;
			}

			if (section == "language" || !section) {
				//Read texts
				//	b5.Game.setLanguage && b5.Game.setLanguage(b5.Game.cfg.Language.lang);
				b5.Game.updateTextObjects && b5.Game.updateTextObjects();
			}
		}
	};
	b5.Game.speed = 1;
	//Create game folders and files if they doesn't exist (app does it automatically)
	//Copy base game config to storage

	//Because the internal filesystem is not supported for file, "copying" menas just reading the file then writting it's content to sdcard (persistent filesystem)
	var createSaveFiles = function() {
		console.log('Creating Save Files')
		b5.File.createDir(appResDir + 'saves').oncreate = function() {
		  
		  var sav = b5.Paths.saves + 'cuphead_player_data_v1_slot_#.sav',
		  sav0 = sav.replace('#','0'),
		  sav1 = sav.replace('#','1'),
		  sav2 = sav.replace('#','2');
		  
		  if(!b5.File.exists(sav0)) {
		  	console.log("Saving data... 0");
		  	setTimeout(f => b5.File.extractAsset(internalDir + 'saves/cuphead_player_data_v1_slot_0.sav', sav0), 200);
		  }
		  if(!b5.File.exists(sav0)) {
		  	console.log("Saving data... 1");
		  	setTimeout(f => b5.File.extractAsset(internalDir + 'saves/cuphead_player_data_v1_slot_1.sav', sav1), 200);
		  }
		  if(!b5.File.exists(sav2)) {
		  	console.log("Saving data... 2");
		  	setTimeout(f => b5.File.extractAsset(internalDir + 'saves/cuphead_player_data_v1_slot_2.sav', sav2), 200);
		  }
		/*	console.log('SavingData...0')
			b5.File.extractAsset(internalDir + 'saves/cuphead_player_data_v1_slot_0.sav', b5.Paths.saves + 'cuphead_player_data_v1_slot_0.sav', function() {
				console.log('SavingData...1')
				b5.File.extractAsset(internalDir + 'saves/cuphead_player_data_v1_slot_1.sav', b5.Paths.saves + 'cuphead_player_data_v1_slot_1.sav', function() {
					console.log('SavingData...2')
					b5.File.extractAsset(internalDir + 'saves/cuphead_player_data_v1_slot_2.sav', b5.Paths.saves + 'cuphead_player_data_v1_slot_2.sav', function() {
						console.log('done');
					});
				})
			})*/
		}
	}
	if (!b5.File.exists(b5.Paths.config)) {
		b5.File.extractAsset(internalDir + 'config.ini', b5.Paths.config, function(e) {
			b5.Game.readConfig();
			b5.Game.applyConfig();
		})
	} else {
		b5.Game.readConfig();
		b5.Game.applyConfig();
	}


	//Copy base save files
	if (!b5.File.exists(b5.Paths.saves)) createSaveFiles();
	
	setTimeout(()=>{b5.PreStartup()},1200);
	
	b5.PreStartup = function() {
		
		//Scene for gui and screen effects
		scene_GUI = new b5.Scene();
		scene_GUI.clip_children = false;
		scene_GUI.w = app.design_width;
		app.addScene(scene_GUI);
		scene_GUI._layer = 2;
		app.focus_scene = scene_GUI;
	
b5.Game.importObject = function(name) { //console.warn('Import: '+name)
let scr = "",
res = null;

scene_GUI.addResource(
	res = new b5.Raw(name+'PKG', b5.Paths.pkgs + name + '.cup', true, data => {
		scr = data;
	},true),
	'raw'
);
try { Function(scr)() } catch(e){console.warn('Import error: '+e)}

scene_GUI.removeResource(res,'raw');

var object = b5.export && b5.export(sceneMain.view, sceneMain, sceneMain.data, b5.Game);
return b5.export = null,
object;
};

  b5.Game.d_getDifficulty = function(d) {
  	var a = (this.Multiplayer.isGuest || this.Multiplayer.isHosting) && this.Multiplayer.player2joined ? ' | Online' : '';
  	switch(d) {
  		case 0: return 'Simple' + a;
  		case 2: return 'Extreme' + a;
  		default: return 'Regular' + a;
  	}
  }
	b5.Game.d_printPlayersAndHP = function() {
		if(sceneMain.data.players) {
			for(var i = 0, n = "", a = sceneMain.data.players.activePlayers; i < a.length; i++) {
				var p = sceneMain.findActor(a[i],true);
				
				n += a[i].capitalize() + /*+ (p.flags.heartPoints > 0 ? p.flags.heartPoints + "HP" : "DEAD") +*/ (i+1 < a.length ? " | ":"");
			}
			return n;
		}
		return "";
	}
	b5.Game.d_printPlayersMap = function() {
		if(sceneMain.data.players) {
			for(var i = 0, n = "", a = sceneMain.data.players.activePlayers; i < a.length; i++) {
				var p = sceneMain.findActor(a[i],true);
				
				n += a[i].capitalize() + (i+1 < a.length ? " | ":"");
			}
			return n;
		}
		return "";
	}
	
b5.Game.parseResources = function(json, scene) {
	if(json === void 0)	return;
	var resources = typeof json === "string" ? JSON.parse(json) : json,
	loadId = 0;
	for(var i in resources) 
		for(var a = 0; a <resources[i].length; a++) {
			var res = resources[i][a];
		  if(!scene.findResource(res.name, i)) switch(i) {
		  	case "bitmap":
		  		if(typeof res.automatize !== "object") {
		  			var bitmap = new b5.Bitmap(res.name, b5.Paths.assets + res.src, res.preload);
		  			if(res.resolution !== void 0) bitmap.resource.resolution = res.resolution;
		  			scene.addResource(bitmap, i, res.persist);
		  		}
		  		else {
		  			var b = res.automatize,
		  			seq = new Array(b.pad).fill('#').join('');
		  			for(var c = b.start; c <= b.end; c++) {
		  				var bitmap = new b5.Bitmap(b.name.replace(/%i/g,c), b5.Paths.assets + b.src.replace(seq,c.toString().padStart(b.pad,"0")), b.preload);
		  				scene.addResource(bitmap,i, b.persist);
		  			}
		  		}
		  	break;
		  	case "brush":
		  		if(!Array.isArray(res.bitmaps)) {
		  			for(var e = res.bitmaps.start, d = []; e <= res.bitmaps.end; e++)
		  				d.push(res.bitmaps['name-prefix'].replace(/%i/g,e));
		  			res.bitmaps = d;
		  		}
		  		for(var b = 0, c = []; b < scene.bitmaps.length; b++)
		  		  res.bitmaps.indexOf(scene.bitmaps[b].name) > -1 && c.push(scene.bitmaps[b]);
		  		 
		  		let atlas = new b5.ImageAtlas(res.name, c),
		  		generate = res.frames && res.frames.endsWith('.json');
		  		
		  		atlas.framesId = atlas.animsId = loadId;
		  		
		  		res.frames && scene.addResource(
		  			new b5.Raw(res.name+'-frames',b5.Paths.assets+res.frames, true, f => {
		  				if(atlas.framesId != void 0) {
		  				  delete atlas.framesId;
		  			    atlas.parseFrames(f, generate);
		  				}
		  		}), 'raw');
		  		
		  		res.anims && scene.addResource(
		  			new b5.Raw(res.name+'-anims',b5.Paths.assets+res.anims, true, x => {
		  	  		if(atlas.animsId != void 0) {
		  				  delete atlas.animsId;
		  			    atlas.parseAnims(x);
		  				}
		  		}), 'raw');
		  		
		  		scene.addResource(atlas,i, res.persist);
		  	break;
		  	case "sound":
		  		if(typeof res.automatize !== "object") {
		  			var sound = new b5.Sound(res.name, b5.Paths.assets + res.src, res.preload, res.reuse, res.destroy, res.options);
		  			sound.loop = res.loop;
		  			sound.global_stream = !!res.global_stream;
		  		  res.category == "sfx" ? (sound.output_gain = this.Sfx.volume, this.Sfx.add(sound), sound.onDestroy = this.Sfx.remove) :
		  		  	(sound.output_gain = this.Music.volume, this.Music.add(sound), sound.onDestroy = this.Music.remove);
		  		  res.destroyOnEnd && (sound.destr = res.destroyOnEnd);
		  	  	scene.addResource(sound,i, res.persist);
		  		}
		  		else {
		  			var b = res.automatize,
		  			seq = new Array(b.pad).fill('#').join('');
		  			for(var c = b.start; c <= b.end; c++) {
		  				var sound = new b5.Sound(b.name.replace(/%i/g,c), b5.Paths.assets + b.src.replace(seq,c.toString().padStart(b.pad,"0")), b.preload,b.reuse,b.destroy,b.options);
		  				sound.loop = b.loop;
		  				sound.global_stream = !!b.global_stream;
		  				if(b.category == "sfx") {
		  					sound.output_gain = this.Sfx.volume;
		  					this.Sfx.add(sound);
		  					sound.onDestroy = this.Sfx.remove;
		  					b.destroyOnEnd && (sound.destr = b.destroyOnEnd);
		  				}
		  				else {
		  					sound.setReverbGain(0);
		  					sound.output_gain = this.Music.volume;
		  					this.Music.add(sound);
		  					sound.onDestroy = this.Music.remove;
		  					b.destroyOnEnd && (sound.destr = b.destroyOnEnd);
		  				}
		  				scene.addResource(sound,i, b.persist);
		  			}
		  		}
		  	break;
		  	case 'shader':
		  		scene.addResource(new b5.Shader(res.name, b5.Paths.assets + res.src, res.async), 'shader', res.persist);
		  	break;
		  	case 'raw':
		  		scene.addResource(new b5.Raw(res.name, b5.Paths.assets + res.src, true), 'raw');
		  	break;
		  }
		  loadId++;
		}
};

b5.Game.UI = {
	createButton: function(text, theme) {
		if(theme == 'light') {
			var bg = new b5[text.length>1?'RectActor':'ArcActor'];
	//		bg.atlas = sceneMain.findResource('SpeechDialogsAtlas','brush');
			bg.current_frame = 41;
			bg.center_atlas = true;
			bg.ignore_atlas_size = true;
			bg.corner_radius = 8;
			bg.radius = 14;
			bg.stroke_filled = true;
			bg.stroke_thickness = 2;
			bg.stroke_style = "black";
			bg.setSize(32,32);
			bg.tag = "button";
		}
		else {
			if(text.length < 2) {
	  		var bg = new b5.ArcActor;
	  		bg.radius = 18;
	  		bg.fill_style = "black";
	  		bg.round_pixels = false;
	  		bg.tag = 'button';
			}
			else {
				var bg = new b5.RectActor;
				bg.w = 32;
				bg.h = 32;
				bg.fill_style = "black";
				bg.round_pixels = false;
				bg.tag = "button";
				bg.corner_radius = 8;
			}
		}
			
		var label = new b5.LabelActor;
		label.font = scene_GUI.findResource('CupheadVogueExtraBoldFont','brush');
		label.fill_style = theme == 'light' ? 'black' : "white";
		label.round_pixels = false;
		label.text_baseline = "middle";
		label.text = text;
		bg.addActor(label);
		label._x = -1;
		label._y = -1;
		label._scale = theme === "dark" ? .61 : .6;
			
		//Set bg size if text have more than one character
		label.onTick = function() {
			text.length > 1 && bg.setSize(this.w/2.5, bg.atlas ? bg.atlas.frames[bg.current_frame].h : bg.h);
			!this.offscreen && this.dirty();
		}
			return bg;
	},
	getButtonForPlayer: function(btn,pl) {
		var b = "";
		switch(b5.Game.Input.input_player[pl]) {
    			case "GUI": b = b5.Game.GUI.buttonDefs[btn]; break;
    			case "Keyboard": b = b5.Game.cfg.Keyboard[pl+"_key_"+btn].toUpperCase(); break;
    			case "Gamepad": b = b5.Game.cfg.Gamepad[pl+"_btn_"+btn]; break;
    		}
    return	b;
	}
}
//Create main scene
sceneMain = new b5.Scene();
sceneMain.clip_children = false;
sceneMain.w = app.design_width;
app.addScene(sceneMain);
sceneMain._layer = 1;
sceneMain.BLUR_MULTIPLIER = 0;
sceneMain.BLUR_ADDED = false;

sceneMain.onPreDraw = function() {
	//Update filter
	if(b5.Filters.kBlur.loaded && b5.Game.cfg.Video.blur) {
		if(this.BLUR_MULTIPLIER > 0 && !this.BLUR_ADDED) {
			this.BLUR_ADDED = true;
			this.addFilter(b5.Filters.kBlur.filter);
		}
		else if(this.BLUR_MULTIPLIER <= 0 && this.BLUR_ADDED) {
			this.BLUR_ADDED = false;
			this.removeFilter(b5.Filters.kBlur.filter);
		}
		b5.Filters.kBlur.uOffset[0] = (1/app.design_width) * this.BLUR_MULTIPLIER;
		b5.Filters.kBlur.uOffset[1] = (1/app.design_height) * this.BLUR_MULTIPLIER;
	}
}

//Load scripts
b5.Game.contents = JSON.parse(b5.File.readSync(b5.Paths.scripts + 'content.json'));

for (var i = 0; i < b5.Game.contents.cup.length; i++) {
var js = element('script', {
src: b5.Paths.scripts + b5.Game.contents.cup[i]}, null, null, 'head');
ResourceQueue.add(js);
}
ResourceQueue.onload = function() {
setTimeout(b5.Startup, 200)
}
ResourceQueue.load();

b5.Startup = function() {

//Read texts
b5.Game.setLanguage && b5.Game.setLanguage(b5.Game.cfg.Language.lang);
b5.Game.applyConfig('audio');

var _timer = setInterval(function() {
if (scene_GUI.areResourcesLoaded()) {

app.start();
app.splash.destroy();
b5.Game.LoadScene(dev.loadscene, false, false, {
hide_anim: 'fade', hide_speed: 0.2,hourglass:false
},dev.data);

setTimeout(setInterval(b => b5.Game.Input.updateInput(), 1),1000);

clearInterval(_timer);
}

app.splash.loadingBar.setPercent(
	scene_GUI.countLoadedResources() / scene_GUI.countLoadableResources()
);

},50);

b5.Game.GUI.disableButtons();

scene_GUI.loadResources(); //b5.ResourceQueue.load();

//Background actor
sceneMain.background = new b5.Actor();
sceneMain.addActor(sceneMain.background);
sceneMain.background.name = "scene_background";
sceneMain.background.round_pixels = false;

sceneMain.view = new b5.Actor();
sceneMain.addActor(sceneMain.view);
sceneMain.view.name = "scene_camera";
sceneMain.round_pixels = false;
sceneMain.view.round_pixels = false;
sceneMain.view.camera_x = 0;
sceneMain.view.camera_y = 0;
sceneMain.view.target_x = 0;
sceneMain.view.target_y = 0;
sceneMain.view.camera_offset_x = 0;
sceneMain.view.camera_offset_y = 0;
sceneMain.view.camera_speed_x = 0.07;
sceneMain.view.camera_speed_y = 0.07;
sceneMain.view.camera_vx = 0;
sceneMain.view.camera_vy = 0;
sceneMain.view.camera_max_speed_x = 100;
sceneMain.view.camera_max_speed_y = 100;
sceneMain.view.camera_range = 1;
sceneMain.view.camera_extents = [0, 0, 0, 0];
sceneMain.view.camera_update = true;

sceneMain.view.setPosition = function(x, y) {
this._ox = -x;
this._oy = -y;
};
sceneMain.view.setOrigin = function(x, y) {
this._x = x;
this._y = y;
};
sceneMain.view.updateCamera = function() {
var s = this.scale,
t = b5.Game.Flags.inLevel ? s : 1/s,
x = b5.Maths.cap(this.target_x/s,
this.camera_extents[0]/t,
this.camera_extents[2]/t) + this.camera_offset_x,
y = b5.Maths.cap(this.target_y/s,
this.camera_extents[1]/t,
this.camera_extents[3]/t) + this.camera_offset_y;

this.camera_vx = Math.round1000(b5.Maths.cap(((x - this.camera_x) * this.camera_speed_x) * b5.Game.speed, -this.camera_max_speed_x, this.camera_max_speed_y));
this.camera_vy = Math.round1000(b5.Maths.cap(((y - this.camera_y) * this.camera_speed_y) * b5.Game.speed, -this.camera_max_speed_y, this.camera_max_speed_y));

this.camera_x += this.camera_vx;
this.camera_y += this.camera_vy;

this.setPosition(this.camera_x + this.camera_shake_x,
this.camera_y + this.camera_shake_y);
}
sceneMain.view.reset = function() {
this.camera_x = 0;
this.camera_y = 0;
this.target_x = 0;
this.target_y = 0;
this.camera_offset_x = 0;
this.camera_offset_y = 0;
this.camera_shake_y = 0;
this.camera_shake_x = 0;
this.camera_speed_x = 0.07;
this.camera_speed_y = 0.07;
this.camera_vx = 0;
this.camera_vy = 0;
this.camera_max_speed_x = 100;
this.camera_max_speed_y = 100;
this.camera_range = 1;
this.camera_extents = [0, 0, 0, 0];
this._scale = 1;
this.setRotation(0);
this.setPosition(0,0);
this._x2 = this._y2 = 0;
this.ox = this.oy = 0;
this.camera_update = true;
this.ox_scale = this.oy_scale = 1;
};

sceneMain.removePersistentResources = function(filter) {
var t = [this.bitmaps, this.brushes, this.fonts, this.raw, this.sounds, this.shaders];
for (var o = 0; o < t.length; o++)
if (t[o] === this[filter] || !filter) for (var r = 0; t[o].length > r;)
t[o][0].persist ? t[o][0].destroy(): r++;
}

b5.generateRandomMovement = function(length, tangent) {
var maths = ["cos",
"sin"],
ops = ["-",
"+",
'*'],
f = "";
tangent && maths.push('tan');
for (var i = 0; i < length; i++) {
var nextop = i == length-1 ? ' ': ops[b5.Maths.randomRange(0, 2)],
nextop2 = ops[b5.Maths.randomRange(0, 1)],
randomultin = 0.001 + Math.random(),
randomultout = 0.0001 + Math.random()*0.1,
randomultin2 = 0.001 + Math.random(),
randomultout2 = 0.0001 + Math.random()*0.1,
randomath = "Math." + maths[b5.Maths.randomRange(0, maths.length-1)] + "(",
randomath2 = "Math." + maths[b5.Maths.randomRange(0, maths.length-1)] + "(";
f += randomath + "i * " + randomultin + nextop2+randomath2 +" i*" + randomultin2 + ")+"+randomultout2 + ")*"+randomultout + nextop;
}
return Function("return function(i){ return "+f+";}")();
}

app.onPause = function() {
b5.Game.Flags.pausingEnabled && !b5.Game.PauseMenu.visible && !b5.Game.Multiplayer.isGuest && b5.Game.PauseMenu.show(b5.Game.Flags.inWorldmap ? "worldmap": b5.Game.Flags.inLevel ? "level": null);

}

//Load default slot data
if(dev.loadscene != 1 || dev.loadscene != 4) {
  b5.Game.SaveSlots.slot0 = JSON.parse(b5.File.readSync(b5.Paths.saves + b5.Game.contents.sav[0]));
  b5.Game.setCurrentSaveSlot(0);
}

fpt = 0;
fptc = 0;
l = app.now || 0;

app.adaptive_physics = true;

app.memoryUsage = ""

app.getMemoryUsage = function() {
	if(cordova.platformId == "browser" || cordova.platformId == "electron") return;
	chrome.system.memory.getInfo(function(e){
  	app.memoryUsage = Math.round10(Math.round1000((e.capacity-e.availableCapacity)/e.capacity)*100)+'%'
  })
}

scene_GUI.addActor(b5.dbgtxt);
b5.dbgtxt._layer = 20;
b5.dbgtxt.font = scene_GUI.findResource('CupheadVogueExtraBoldFont','brush');

app.updateInfoText = function() {
	b5.dbgtxt.clearFormat();
	b5.dbgtxt.setTextFmt( (window.debugText||"")+//'--p1--\n'+ Obj2(b5.Game.Input.player1)+"\n--p2--\n"+Obj2(b5.Game.Input.player2)+'\n'
(!sceneMain.areResourcesLoaded()? _loadingtext()+' |':_statusText())+ " "+RELEASE_CODENAME + " "+ RELEASE_VER + " | "+
  fpt +'fps' + ' mem: '+ 
  (app.memoryUsage.indexOf('.') != -1 ? app.memoryUsage : app.memoryUsage.replace('%','.0%')) +
  ' dC: '+app.display.drawCount)
}

app.onTick = function() {
app.target_frame_rate = window.ALT_FPS || 1/app.adt;
b5.Game.speed = 60/app.target_frame_rate;
b5.Game.SceneLoader.update();

b5.Game.SceneLoader.update_scene && b5.UpdateScene(sceneMain.view, sceneMain, sceneMain.data, b5.Game);

sceneMain.active && sceneMain.view.active && sceneMain.view.camera_update && sceneMain.view.updateCamera();

sceneMain.time_step = app.dt;


//Update pause
var btnPause = (b5.Game.Input.player1.Start || b5.Game.Input.player2.Start) && !b5.Game.Flags.inSomeMenu;
if (btnPause && b5.Game.Flags.pausingEnabled && !b5.Game.PauseMenu.visible && !b5.Game.Multiplayer.isGuest)
b5.Game.PauseMenu.show(b5.Game.Flags.inWorldmap ? "worldmap": b5.Game.Flags.inLevel ? "level": null);
  
app.now > l+1000 ? (fpt = fptc+1,
  fptc = 0, 
  l = app.now,
  cordova.platformId != 'electron' && app.getMemoryUsage(), 
  app.updateInfoText()
): fptc++;
//app.updateInfoText()


}

function _loadingtext() {
	var r = 'LOADING', t = "";
	for(var i = 0, a = sceneMain.countLoadedResources() / sceneMain.countLoadableResources(); i < r.length; i++) {
		var s = Math.floor(.2+r.length*a);
		if(s > -1 && i < s) {
			t += `&f[#008000]${r[i]}&f`
		}
		else t += r[i]
	}
	return t;
}
function _statusText() {
	switch(app.texture_state) {
		case "uploading": return '&f[#ffff00]UPLOADING&f |';
		case "reading": return '&f[#0000ff]READING&f |';
		default: return "";
	}
}

}

}
};
/*
obj = function(o) {
	var t = [];
	for (var i in o)t.push(i + " = "+ o[i]);
	return t.join('\n');
}*/
function Obj2(o) {
var t = ""; for (var i in o)t += i + ": "+ (typeof o[i] == "function" ? "Function(){...}":o[i])+"\n"; return t;
}