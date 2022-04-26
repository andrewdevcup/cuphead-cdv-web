b5.PixiDisplay = function(canvas) {
	PIXI.settings.PRECISION_VERTEX = "mediump";
  PIXI.settings.CREATE_IMAGE_BITMAP = true;
	PIXI.settings.SORTABLE_CHILDREN = true;
	
	this.canvas = canvas;
	this.pixi = new PIXI.Application({
		view: canvas,
		width: canvas.width,
		height: canvas.height,
		backgroundColor: 0x0,
		useContextAlpha: false,
		autoStart: false,
		preserveDrawingBuffer: false,
	  powerPreference: "high-performance"
	});
	//this.pixi.stage.sortableChildren = true;
	this.pixi.stage.interactiveChildren = false;
	this.stage = this.pixi.stage,
	this.renderer = this.pixi.renderer;
	
	// rewrite drawElements to count draws
	var r = this.renderer.gl, t = this;
	r._drawElements = r.drawElements;
	this.drawCount = 0;
	r.drawElements = function(a,b,c,d,e,f) {
		t.drawCount++;
		r._drawElements(a,b,c,d,e,f);
	}
	
	//Culling mask
	this.mask = new PIXI.Graphics().beginFill(0xffffff).drawRect(0,0,1,1).endFill();
	this.mask.pivot.set(0.5);
	this.mask.scale.set(b5.app.design_width,b5.app.design_height);
	this.mask.zIndex = 999;
	this.pixi.stage.addChild(this.mask);
	this.pixi.stage.mask = this.mask;

/*
*   	PIXI3D Plugin!!
*/

	//Setup	lighting environment
	var light = Object.assign(new PIXI3D.Light(), { intensity: 15, type:"directional"});
	light.rotationQuaternion.setEulerAngles(0,180,0);

	PIXI3D.LightingEnvironment.main.lights.push(light);

};
b5.PixiDisplay.prototype.transformScene = function(obj, x, y, w, h, rot, scx, scy, ox, oy, skx, sky, texture, v, opacity, layer) {
	obj.x = x,
	obj.y = y,
	obj.scale.x = scx,
	obj.scale.y = scy,
	obj.visible = !!v,
	obj.alpha = opacity,
	obj.zIndex = layer;
},
b5.PixiDisplay.prototype.transform = function(obj, x, y, w, h, rot, scx, scy, ox, oy, skx, sky, texture, layer) {
	obj.x = x,
	obj.y = y,
	obj.rotation = rot,
	obj.scale.x = scx,
	obj.scale.y = scy,
	obj.pivot.x = ox,
	obj.pivot.y = oy,
	obj.skew.x = skx,
	obj.skew.y = sky,
	obj.zIndex = layer;
},
b5.PixiDisplay.prototype.drawRect = function(e, _) {
	var o = _.ss_x,
  		i = _.ss_y,
  		n = _.corner_radius,
  		c = PIXI.utils.string2hexAlpha(_.fill_style),
  		d = PIXI.utils.string2hexAlpha(_.stroke_style);
  		
  	  e._geometry.clear();
  	  _.filled && (
  	  	e.beginFill(c.hex, c.alpha),
  	    !_.corner_radius ? e.drawRect(0,0,o,i) : e.drawRoundedRect(0,0,o,i,n),
  	    e.endFill()
  	  );
  	  _.stroke_filled && (
  	  	e.lineStyle(_.stroke_thickness, d.hex, d.alpha),
  	    !_.corner_radius ? e.lineTo(o,0).moveTo(o,0)
  	    .lineTo(o,i)
  	    .moveTo(o,i)
  	    .lineTo(0,i).moveTo(0,i)
  	    .lineTo(0,0) : //Rounded
  	      e.moveTo(n, 0)
  				 .lineTo(o-n, 0)
				   .quadraticCurveTo(o, 0, o, n)
  				 .lineTo(o, i-n)
				   .quadraticCurveTo(o, i, o-n, i)
			 	   .lineTo(n, i)
					 .quadraticCurveTo(0, i, 0, i-n)
					 .lineTo(0, n)
					 .quadraticCurveTo(0, 0, n, 0)
  	  );
},
b5.PixiDisplay.prototype.drawArc = function(e, _) {
	var t = _.radius,
  		c = PIXI.utils.string2hexAlpha(_.fill_style),
  		d = PIXI.utils.string2hexAlpha(_.stroke_style);
  		
  		e._geometry.clear();
  		_.filled && e.beginFill(c.hex, c.alpha)
  	  						 	  .moveTo(t,t)
  	    							.arc(t, t, t, _.start_angle, _.end_angle, _.anticlockwise)
  	    					    .endFill();
  	  _.stroke_filled && e.lineStyle(_.stroke_thickness, d.hex, d.alpha)
  	    									 	 .arc(t, t, t, _.start_angle, _.end_angle, _.anticlockwise);
},
b5.PixiDisplay.prototype.drawPolygon = function(e, _) {
	var c = PIXI.utils.string2hexAlpha(_.fill_style),
  		d = PIXI.utils.string2hexAlpha(_.stroke_style);
  		
  		e._geometry.clear();
  		_.filled && e.beginFill(c.hex,c.alpha)
  		                .drawShape(new PIXI.Polygon(_.points))
  		                .endFill();
  	  if(_.stroke_filled) {
  	  	e.lineStyle(_.stroke_thickness, d.hex, d.alpha);
  	  	for(var i = 0, n = _.points; i < n.length; i+=2)
  	  	  e.moveTo(n[i],n[i+1]).lineTo(n[i+2]!==void 0?n[i+2]:n[0],n[i+3]!==void 0?n[i+3]:n[1]);
  	  }
},
b5.PixiDisplay.prototype.measureTextLineIndexes = function(t) {
	for(var i = 0, e = t.split('\n'), a = [], b = 0; i < e.length; i++) {
		a[i] = [b, b+e[i].length-1];
		b += e[i].length+1;
	}
	return a;
},
b5.PixiDisplay.prototype.setAntialiasingEnabled = function(e) {
	this.canvas.style.imageRendering = e ? "" : "pixelated";
},
b5.PixiDisplay.getBlendMode = function(e) {
	switch(e) {
		case 'lighter':
			return PIXI.BLEND_MODES.ADD;
		case 'multiply':
			return PIXI.BLEND_MODES.MULTIPLY;
		case 'screen':
			return PIXI.BLEND_MODES.SCREEN;
		default:
		  return PIXI.BLEND_MODES.NORMAL;
	}
};

/*
* =====   PATCHES   =====
*/

//Change base texture of PIXI.Texture, avoids creating lots of textures
//to store sprites of different spritesheets, create a new texture and set texture.frame instead
PIXI.Texture.prototype.setBaseTexture = function(bt) {
	var e = this,
	u = function(b) {
		e.orig.width = b.width,
		e.orig.height = b.height;
		e._loading_baseTex=!1;
	};
	this.baseTexture = bt;
  !bt.valid && !this._loading_baseTex && (
  	bt.once('loaded',u),
  	this._loading_baseTex=!0
  );
  u(bt);
};

//Set texture frame (faster than updateUvs())
PIXI.Texture.prototype.setFrame = function(x,y,w,h) {
	var e = this.frame;
	e.x = x, e.y = y,
	e.width = w, e.height = h;
	return this._uvs.set(e, this.baseTexture), this;
};

//Output hex string and float alpha
PIXI.utils.string2hexAlpha = function(s) {
	var e = this.string2hex(s.substr(0,7)),
	o = s[0] === '#' && s.length === 9 ? +("0x"+s.substr(7))/255 : s === 'transparent' ? 0:1;
	return {hex: e, alpha: o};
};

//String to rgb, wonder why this isn't here
PIXI.utils.string2rgb = function(s) {
	if(s.startsWith('rgb') && (s=s.trim())) {
		var d = s.split(',');
		d[0] = +d[0].substr(d[0].indexOf("(")+1);
		d[1] = +d[1];
		d[2] = +d[2].substr(0,d[2].length-1);
		d[3] !== void 0 && d.pop();
		return d;
	}
	else return PIXI.utils.hex2rgb(PIXI.utils.string2hex(s));
}

//Nice addition, convert actually converts the string to color name
PIXI.utils.rgb2string = function(rgb,	convert) {
	var e = "#", t = null;
	if(rgb) {
		t = Math.round(rgb[0]*255).toString(16);
		t.length === 1 && (t = t.padStart(2,'0'));
		e += t;
		t = Math.round(rgb[1]*255).toString(16);
		t.length === 1 && (t = t.padStart(2,'0'));
		e += t;
		t = Math.round(rgb[2]*255).toString(16);
		t.length === 1 && (t = t.padStart(2,'0'));
		e += t;
	}
  else e += "000000";
  //Colors thing will only work with this modified version of pixi.min.js
  var c = PIXI.COLORS;
  if(c && convert) for(var i in c) if(e === c[i]) return i;
	return e;
};

//Fun thing. fullCcolor is for mixing two colors together at maximum, so you can get full yellow, aqua, etc
PIXI.utils.rotateRGB = function(angle, fullColor) {
	var r120 = 2.0943951023931953,
	r240 = 4.1887902047863905;
	if(!fullColor) return [
		.5+Math.cos(angle+r120)*.5,
		.5+Math.cos(angle+r240)*.5,
		.5+Math.cos(angle)*.5];
	else {
		//Repeat wrapping (Math.perc -- extras.js)
	  var perc = Math.perc || function(n, min, max) {
			return (n-min) / (max-min);
		};
		var PI2 = 6.283185307179586,
	  PI1_3 = 1.0471975511965976,
	  PIR = [PI1_3,PI1_3*2, PI1_3*3,PI1_3*4,PI1_3*5,PI1_3*6],
	  n = Math.abs(angle)/PI2,
	  w = PI2 * (n - Math.trunc(n)),
	  rgb = [1,0,0];
	  
	  //From 0 to PI1_3: increment G
	  if(w > 0 && w <= PIR[0]) rgb[1] = perc(w, 0, PIR[0]);
	  //From PI1_3 to PI1_3 * 2: decrement R
	  else if(w > PIR[0] && w <= PIR[1]) { 
	  	rgb[1] = 1; 
	  	rgb[0] = 1-perc(w, PIR[0], PIR[1]);
	  }
	  //From PI1_3 * 2 to 3: increment B
	  else if(w > PIR[1] && w <= PIR[2]) { 
	  	rgb[0] = 0;
	  	rgb[1] = 1;
	  	rgb[2] = perc(w, PIR[1], PIR[2]);
	  }
	  //From PI1_3 * 3 to 4: decrement G
	  else if(w > PIR[2] && w <= PIR[3]) {
	  	rgb[0] = 0;
	  	rgb[1] = 1-perc(w,PIR[2], PIR[3]);
	  	rgb[2] = 1;
	  }
	  //From PI1_3 * 4 to 5: increment R
	  else if(w > PIR[3] && w <= PIR[4]) {
	  	rgb[0] = perc(w, PIR[3], PIR[4]);
	  	rgb[2] = 1;
	  }
	  //From PI1_3 * 5 to 6: decrement B
	  else if(w > PIR[4] && w <= PIR[5]) {
	  	rgb[2] = 1-perc(w, PIR[4], PIR[5]);
	  }
	  return rgb
	}
};

//Convert number to vector component (like in glsl)
PIXI.utils.vec = function(len, n) {
	return new Array(len).fill(n);
};

PIXI.filters.default = new PIXI.Filter();

//PIXI3D

b5.Model = function(e,t) {
	//Custom gltf loader to prevent loading a shared texture twice
	this.gltf = {
		descriptor: null,
		buffers: [],
		images: []
	};
	this._resource_count = 0;
	this._load_count = 0,
	this.preload = !0,
	this.loading = !0;
	this.name = e;
	this.type = 'raw';
	
	var o = this.gltf,
	p = this,
	onloadOne = function() {
		p._load_count++;
		p._load_count >= p._resource_count && (
			b5.app.onResourceLoaded(p,!1),
			p.onload && p.onload(p.gltf)
		);
	},
	addBuffer = function(buffer, d) {
		if(buffer !== null) {
			o.buffers[d] = buffer;
			onloadOne();
		}
		else {
			onloadOne = ()=>{};
			b5.app.onResourceLoaded(p,!0);
			p.onload && p.onload(null);
		}
	},
	onDescriptorLoad = function() {
		o.descriptor = JSON.parse(this.response);
		
	  p._resource_count = o.descriptor.images.length + o.descriptor.buffers.length;
		
		//Load texture (if one already exists then use it)
		for(var i = 0, m = o.descriptor.images; i < m.length; i++) {
			var uri = (m[i].uri.startsWith('data:') ? '' : n) + m[i].uri,
			texc = PIXI.utils.BaseTextureCache[uri], nt = null;
		  o.images[i] = !texc ? (
		  	nt = PIXI.Texture.from( uri),
		  	nt.baseTexture.resource.source.addEventListener('load',onloadOne,!1),
		  	nt.baseTexture.resource.source.addEventListener('error',e=>addBuffer(null),!1),
		  	nt
		  ) : (onloadOne(), new PIXI.Texture(texc));
		}
		
		//Load buffers
	  for(let i = 0, m = o.descriptor.buffers; i < m.length; i++) {
	  	var uri = (m[i].uri.startsWith('data:') ? '' : n) + m[i].uri;
	  	b5.Utils.loadRAW(uri, true, buffer =>{ addBuffer(buffer, i); }, true);
	  }
	 
	},
	a = new XMLHttpRequest,
	n = t.substr(0,t.lastIndexOf('/')+1);
	
	a.open('GET',t);
	
	a.onload = onDescriptorLoad;
	a.onerror = ()=>{ addBuffer(null) };
	a.send();
};
b5.Model.prototype.destroy = function() {
	null !== this.parent && this.parent.removeResource(this, this.type);
	this.gltf.descriptor = null;
	this.gltf.buffers = null;
};

// Actor3D for displaying models on a render texture (fixes filter errors)

b5.Actor3D = function(model,w,h) {
	b5.Actor.call(this);
	this.model = model;
	this.sprite = new PIXI3D.PostProcessingSprite(b5.app.display.renderer, {
		objectToRender: model,
		width:w,
		height:h
	});
	this.sprite.renderTexture.updateUvs = ()=>{};
	this.sprite.zIndex = -1;
	this.container.addChild(this.sprite);
	this.sprite.on('removed',console.log)
};
b5.Actor3D.prototype = new b5.Actor, 
b5.Actor3D.prototype.constructor = b5.Actor3D, 
b5.Actor3D.prototype.parent = b5.Actor.prototype;
b5.Actor3D.prototype.draw = function() {
	this.onDraw && this.onDraw();
  
 	if(this.container.visible = this.visible && this.opacity && this._draw) {
 		var e = this.sprite;
 		e.width = this.w,
 		e.height = this.h;
 		
 		this.accum_opacity = (this.parent || this.scene).opacity * this.opacity;
    e.alpha = this.use_parent_opacity ? this.accum_opacity : this.opacity;

 	}
 	
 	if(this.transform_dirty && this.active) {
  	if (0 !== this.depth && 1 !== this.depth) {
      var y = 1/this.depth;
  	}else var y = 1;
  	
   	b5.app.display.transform(this.container,
  	  this.x+this.x2+(this.parent?!this.parent.ox?this.container.parent.pivot.x:this.parent.w/2:0),
  	  this.y+this.y2+(this.parent?!this.parent.oy?this.container.parent.pivot.y:this.parent.h/2:0),
  	  this.w,
  	  this.h,
  	  this.rotation,
  	  this.scale_x*y,
  	  this.scale_y*y,
   	  (this.w/2)-this.ox,
  	  (this.h/2)-this.oy,
  	  this.skew_x,
  	  this.skew_y,
  	  void 0,
  	  this.layer
  	);
  	this.transform_dirty = !1;
  	}
  	this.container.visible && this.drawChildren(!1);
},
b5.Actor3D.prototype.destroy = function() {
  null === this.parent?null !== this.scene && this.scene.removeActor(this): this.parent.removeActor(this),
  this.sprite.destroy(),
  this.container.destroy()
};