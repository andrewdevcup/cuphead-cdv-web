

//Music

b5.Game.Music = {};
b5.Game.Music.sounds = [];
b5.Game.Music.volume = 1;

(function() {
	var slider = new b5.Actor();
	slider.visible = false;
	slider.name = "mus_vol_slider";
	scene_GUI.addActor(slider);
	slider.x = 1;
	b5.Game.Music.volume_slider = slider;
	slider.onTick = function() {
		b5.Game.Music.setVolumeAll(this.x);
	}
	slider.onTweenEnd =	function() {
		b5.Game.Music.stopAll(this.destroyFadeOut);
		this._x = 1;
		this.destroyFadeOut = false;
		this.active = false;
		b5.Game.Music.setVolumeAll(1);
	};
})();

//Global volume control
b5.Game.Music.stopAll = function(destroy) {
	if(destroy) for(var snds=this.sounds;snds.length > 0;) {if(snds[0].loaded) {
		snds[0].stop();
		snds[0].destroy();
	}}
	else for(var i = 0,	snds = this.sounds;i < snds.length; i++)if(snds[i].loaded)	{
		snds[i].stop();
	}
};

b5.Game.Music.setVolumeAll = function(vol) {
  for(var i=0, snds=this.sounds; i < snds.length; i++) snds[i].setGain(vol);
};
b5.Game.Music.setVolumeMultiplierAll = function(vol) {
	for(var i=0, snds=this.sounds; i < snds.length; i++) snds[i].setOutputGain(vol);
	this.setVolumeAll(1);
};

b5.Game.Music.fade_out = function(spd, destroy) {
	this.volume_slider._x = 1;
	this.volume_slider.active = true;
	this.volume_slider.destroyFadeOut = !!destroy;
	this.volume_slider.TweenToWithEnd('_x', 0, spd || 0.35, 0, true, 0, ()=>{b5.Game.Music.volume_slider.onTweenEnd()});
};
b5.Game.Music.fade_in = function(spd) {
	this.volume_slider._x = 0;
	this.volume_slider.active = true;
	this.volume_slider.TweenToWithEnd('_x', 1, spd || 0.35, 0, true, 0, ()=>{b5.Game.Music.volume_slider.onTweenEnd()});
};
b5.Game.Music.add = function(snd) {
	this.sounds.push(snd);
};
b5.Game.Music.remove = function(snd) {
	for(var i = 0, snds = b5.Game.Music.sounds, na=[]; i < snds.length; i++)
	  if( snd === snds[i]) snds.splice(i,1); 
};
b5.Game.Music.resetFilters = function() {
	for(var i = 0, snds = b5.Game.Music.sounds; i < snds.length; i++) {
		snds[i].equalizer && snds[i].setEqualizer('allpass',0.1,0,0,0);
		snds[i].setPlaybackSpeed(1);
		snds[i].setGain(1);
		snds[i].limiter && snds[i].setCompressor(-60,0,-1,0.03,0.05);
	}
};
//Sound Effects

b5.Game.Sfx = {};
b5.Game.Sfx.sounds = [];
b5.Game.Sfx.volume = 1;

(function() {
	var slider = new b5.Actor();
	slider.visible = false;
	slider.name = "sfx_vol_slider";
	scene_GUI.addActor(slider);
	slider.x = 1;
	b5.Game.Sfx.volume_slider = slider;
	slider.onTick = function() {
		this.nogui ? b5.Game.Sfx.setVolumeAllNoGUI(this.x) : b5.Game.Sfx.setVolumeAll(this.x);
	};
	slider.onTweenEnd = function() {
		b5.Game.Sfx.stopAll(this.destroyFadeOut);
    b5.Game.Sfx.setVolumeAll(1);
		this._x = 1;
		this.destroyFadeOut = false;
		this.nogui = false;
		this.active = false;
  };
})();

//Global volume control
b5.Game.Sfx.stopAll = function(destroy, absolutelyAll) {
	for(var i=0, snds=this.sounds; i < snds.length; i++) if(!snds[i].global_stream || absolutelyAll){
		snds[i].stop();
		destroy && snds[i].destroy();
	}
};
b5.Game.Sfx.pauseAll = function() {
	for(var i=0, snds=this.sounds; i < snds.length; i++) snds[i].isPlaying() && !snds[i].global_stream && snds[i].pause();
};
b5.Game.Sfx.resumeAll = function() {
	for(var i=0, snds=this.sounds; i < snds.length; i++) snds[i].wasPlaying() && !snds[i].global_stream && snds[i].resume();
};
b5.Game.Sfx.setVolumeAll = function(vol) {
  for(var i=0, snds=this.sounds; i < snds.length; i++) snds[i].setGain(vol);
};
b5.Game.Sfx.setVolumeAllNoGUI = function(vol) {
  for(var i=0, snds=this.sounds; i < snds.length; i++) !snds[i].global_stream && snds[i].setGain(vol);
};
b5.Game.Sfx.setVolumeMultiplierAll = function(vol) {
	for(var i=0, snds=this.sounds; i < snds.length; i++) snds[i].setOutputGain(vol);
	this.setVolumeAll(1);
};
b5.Game.Sfx.resetVolume = function() {
	var acfg = b5.Game.cfg.Audio;
	this.volume_slider.timelines.remove();
	this.volume_slider._x = 1;
	this.volume_slider.active = false;
	this.setVolumeAll(1);
};
b5.Game.Sfx.fade_out = function(spd, destroy, noGUI) {
	this.volume_slider._x = 1;
	this.volume_slider.active = true;
	this.volume_slider.destroyFadeOut = !!destroy;
	this.volume_slider.nogui = true;
	this.volume_slider.TweenToWithEnd('_x', 0, spd || 0.35, 0, true, 0, ()=>{b5.Game.Sfx.volume_slider.onTweenEnd()});
};
b5.Game.Sfx.fade_in = function(spd, noGUI) {
	this.volume_slider._x = 0;
	this.volume_slider.active = true;
	this.volume_slider.nogui = !!noGUI;
	this.volume_slider.TweenToWithEnd('_x', 1, spd || 0.35, 0, true, 0, ()=>{b5.Game.Sfx.volume_slider.onTweenEnd()});
};
b5.Game.Sfx.add = function(snd) {
	this.sounds.push(snd);
};
b5.Game.Sfx.remove = function(snd) {
	for(var i = 0, snds = b5.Game.Sfx.sounds; i < snds.length; i++)
	  if( snd === snds[i]) { snds.splice(i,1); return}
};