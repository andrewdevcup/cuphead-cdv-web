b5.export = function(world, scene, data, game) {
	var myexports = {
	};
	
	//Import resources 
	var resources = JSON.parse(b5.File.readSync(b5.Paths.sceneRes + 'common/resources.json'));
	
	game.parseResources(resources,scene);
		
		//Create NPC dialog and glyphs

    data.showNpcGlyph = function(npc, text) {
    	//Glyph actor
      var base = new b5.Actor;
      
      if(game.Flags.inLevel) {
    		npc.parent.addActor(base);
    		base.setPosition(npc.x, npc.y-((npc.h||npc.radius)/2));
      }
      else {
      	npc.addActor(base);
      	base.setPosition(0, -(npc.h||npc.radius)/2);
      	scene.findResource('SelBubbleAppearSfx','sound').play();
      }
      
    	base._layer = npc.layer;
    	base.oy = -40;
    	base._scale = 0;
    	
    	base.TweenTo('_scale',1,0.3,b5.Ease.quadout,true)
  	
    	var glyphBG = new b5.Actor;
    	glyphBG.atlas = scene.findResource('SpeechDialogsAtlas','brush');
    	glyphBG.current_frame = 42; 
    	glyphBG.round_pixels = false;
    	glyphBG.center_atlas = true;
    	base.addActor(glyphBG);
    	glyphBG.setSize(42,42);
    	glyphBG.ignore_atlas_size = true;
    	
    	var glyphArrow = new b5.Actor;
    	glyphArrow.atlas = glyphBG.atlas;
    	glyphArrow.current_frame = 43;
    	glyphArrow.round_pixels = false;
    	glyphArrow.center_atlas = true;
    	base.addActor(glyphArrow);
    	glyphArrow._y = 20;
    	
    	var label = new b5.LabelActor;
    	label.font = scene_GUI.findResource('CupheadVogueExtraBoldFont','brush');
    	label.tag= "GlyphLabel";
    	label.space_width = 28;
    	label.letter_spacing = 13;
    	label.text_baseline = "middle"
    	
    	var lBtn = "",
    	btn = null;
    	label.onTick = function() {
    		var intBtn = game.UI.getButtonForPlayer('jump','p1');
    		
    		var title = game.Flags.inLevel ? data.Texts[data.npc[npc.name].glyphTitle.replace('texts.','')] : null;
    		
    		this.text = title ? "     "+ title + intBtn.replace(/./g,intBtn.length==1?'       ':'   ') : "";
    	//	this.text = title ? " "+ title : "";
    		//Change button only on input change
    		if(lBtn != intBtn) {
    			lBtn = intBtn;
    			//Compose
    			base.removeActorsWithTag("button");
    			btn = game.UI.createButton(lBtn, 'light');
    			base.addActor(btn);
     			btn._scale = 0.95;
    		}
    		btn._x = title ? (this.w/8.7) - btn.w: 0;
    
    		glyphBG.setSize(((this.w*this.scale_x*1.4)/4) + (title?0:btn.w*1.3),glyphBG.h);
    		
    	}
    	
    	label.round_pixels=false;
    	label._y = 0;
    	label._scale = 0.6;
    	base.addActor(label);
    
    base.hide = function(sound) {
    	var t = this;
    	this.TweenToWithEnd('_scale',0,0.3,b5.Ease.backin,true,0, function() {
    		t.destroy();
    	});
    	
    	if(game.Flags.inWorldmap && sound) scene.findResource('SelBubbleDisappearSfx','sound').play();
    }
    
    return base;
    };
	
	data.createDialog = function(target, texts, camPos) {
		if(!texts || !texts[0]) texts = ["no text array\nsupplied!"];
		var dlgbg = new b5.Actor,
		lns = texts[0].split('\n').length; //Lines
		
		dlgbg.bitmap = scene.findResource('SpeechBubbleBoxBitmap','bitmap');
		dlgbg.setSize(
		  24.5*b5.Utils.measureTextLengthWidth(texts[0]),
			45*lns
		);
		target.parent.addActor(dlgbg);
		dlgbg.setPosition(target.x-(dlgbg.w/2.3), target.y-(target.h/2)-(dlgbg.h/2)-18);
		dlgbg.round_pixels = false;
		dlgbg.center_atlas = true;
		dlgbg.layer = 5;
		dlgbg.opacity = 0;
		
		dlgbg.TweenTo('opacity',1,0.06,b5.Ease.linear,true,0.06);
		
		//Text
		var txt = new b5.LabelActor;
		txt.fill_style = 'black';
		txt.font = scene.findResource('CupheadFelixRegularFont', 'brush');
		txt.text = texts[0];
		camPos && (
			world.camera_update = false,
			world.TweenTo('_ox', -target.x - camPos[0], 1, b5.Ease.quadinout),
			world.TweenTo('_oy', -target.y - camPos[1], 1, b5.Ease.quadinout)
		);
		txt.text_align = 'left';
		txt.text_baseline = "alphabetic";
    txt.x = (-dlgbg.w/2)+25;
		txt.y = 14-(dlgbg.h/4);
		dlgbg.addActor(txt);
		txt.round_pixels = false;
		txt.line_height = 41;
		txt.space_width = 21;
		txt._scale = 0.72;
		
		txt.onDraw = function() {
			this._y = lns == 1 ? 10 : -(this.h * this.scale_y)/20;
		}
		
		//Bubble tail
		var bt = new b5.Actor;
		bt.round_pixels = false;
		bt.center_atlas = true;
		bt.atlas = scene.findResource('SpeechDialogsAtlas','brush');
		bt.current_frame = b5.Maths.randomRange(11,33);
		bt.x = (dlgbg.w/2)-60;
		bt.y = dlgbg.h/2;
		bt.oy = 24;
		bt._scale = 0.9;
		dlgbg.addActor(bt);
		bt.onTick = bt.dirty;
		
		//Arrow
		var dlgarr = new b5.Actor;
		dlgarr.round_pixels = false;
		dlgarr.center_atlas = true;
		dlgarr.atlas = bt.atlas;
		dlgarr.current_frame = b5.Maths.randomRange(34,39);
		dlgarr.x = (dlgbg.w/2)-35;
		dlgarr.y = (dlgbg.h/2)-25;
		dlgbg.addActor(dlgarr);
		dlgarr._scale = 0.8;
		dlgarr.time = 0;
		dlgarr.visible = false;
		
		dlgarr.onTick = function() {
			this.time += game.speed*0.33;
			this._ox = -(1-Math.cos(this.time))*4;
		}
		
		//Dialog methods
		dlgbg.texts = texts;
		dlgbg.text_index = 0;
		
		dlgbg.nextBubble = function() {
			if(this.text_index < this.texts.length-1) this.text_index++;
			else {
				target.onDialogEnd && target.onDialogEnd();
				
				//Set camera back to following players
				if(game.Flags.inWorldmap) {
					
				  world.TweenTo('_ox', -world.camera_x, 0.4, b5.Ease.cubicout),
		 		  world.TweenToWithEnd('_oy', -world.camera_y, 0.4, b5.Ease.cubicout,	0,	false, g => {
		 		  	world.camera_update = true;
		 		  });
				}
				this.TweenToWithEnd('opacity',0,0.06,b5.Ease.linear,true,0,function() {
					dlgbg.destroy();
				});
				return;
			}
			this.TweenToWithEnd('opacity',0,0.06,b5.Ease.linear,true,0,function() {
				if(dlgbg.text_index < dlgbg.texts.length) {
				  lns = texts[dlgbg.text_index].split('\n').length; //Lines
					dlgbg.setSize(
					  24.5*b5.Utils.measureTextLengthWidth(texts[dlgbg.text_index]),
						45 * lns
					);
		      txt._x = (-dlgbg.w/2)+25;
					txt._y = 14-(dlgbg.h/4);//+(lns == 4 ? 50 : lns == 3 ? 45 : lns == 2 ? 40 : dlgbg.h/2);
			
					bt.current_frame = b5.Maths.randomRange(11,33);
					bt.x = (dlgbg.w/2)-(bt.w/2)-20;
					bt.y = dlgbg.h/2;
					
					dlgarr.current_frame = b5.Maths.randomRange(34,39);
					dlgarr.x = (dlgbg.w/2)-35;
					dlgarr.y = (dlgbg.h/2)-25;
					
					txt.text = dlgbg.texts[dlgbg.text_index];
					
					dlgbg.setPosition(target.x-(dlgbg.w/2.3), target.y-(target.h/2)-(dlgbg.h/2)-15);
					dlgbg.TweenTo('opacity',1,0.06,b5.Ease.linear,true,0.06);
				}
				else {
					//Exit dialog
					game.Flags.inNpcDialog = false;
				}
				target.onDialog && target.onDialog(dlgbg.text_index);
			});
		}
		
		dlgbg.setArrowVisible = function(visible) {
			this.actors[2].visible = !!visible;
		}
	  
	  dlgbg.linput = 0;
	  //Update bubble
	  dlgbg.onTick = function() {
	  	var input = game.Input.player1.A || game.Input.player2.A;
	  	
	  	if(input != this.linput) {
	  		this.linput = input;
	  		
	  		if(input) {
	  			target.onDialogInput && target.onDialogInput();
	  		}
	  	}
	  }
	  game.Flags.inNpcDialog = true;
	  target.onDialog && target.onDialog(0);
		
		return dlgbg;
	}
		
	return myexports;
};