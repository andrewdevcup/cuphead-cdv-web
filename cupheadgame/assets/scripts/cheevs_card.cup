(function() {
	
	//Resources
	var cheev_b = scene_GUI.addResource(
		new b5.Bitmap('CheevBG', b5.Paths.assets + 'cheev_toast_card_combined.png'),
		'bitmap'
	),
	cheev_sfx = scene_GUI.addResource(
		new b5.Sound('CheevSwitchSfx', b5.Paths.assets + 'Achievement_Switch.ogg', true),
		'sound'
	),
	cheev_font = scene_GUI.findResource('CupheadVogueExtraBoldFont', 'brush'),
	sub_font = scene_GUI.findResource('CupheadMemphisFont',"brush");
	
	cheev_sfx.global_stream = true;
	b5.Game.Sfx.add(cheev_sfx);
	
	
	b5.Game.CheevQueue = [];
	b5.Game.CheevUpdateQueue = function() {
		var q = this.CheevQueue[0];
		q && this.addCheevQueue(q[0],q[1],q[2]);
	}
	b5.Game.addCheevQueue = function(title, text, icon) {
		var c = new b5.Actor();
		c.bitmap = cheev_b;
		c.setSize(552,109);
		c.y = (scene_GUI.h/2)+60;
		c.tye = c.y;
		c.ty = c.y - 120;
		
		scene_GUI.addActor(c);
		c._layer = 7;
		
		c.data.title = title, 
		c.data.text = text, 
		c.data.icon = icon;
		
		var t = new b5.LabelActor();
		t.font = cheev_font;
		t.text = title || "";
		t.x = -150;
		t.y = -6;
		t.text_align = "left";
		t._scale = 0.55;
		t.fill_style = "black";
		c.addActor(t);
		
		var tx = new b5.LabelActor();
		tx.font = sub_font;
		tx.text = text || "";
		tx.fill_style = "black";
		tx.text_align = "left";
		tx.x = t.x;
		tx.y = 20;
		tx._scale = 0.53;
		c.addActor(tx);
		
		c.TweenTo('_y', c.ty, 0.35, b5.Ease.backout);
		c.setTimeout(d => c.TweenToWithEnd('_y',c.tye, 0.3, b5.Ease.backin, true, 0, u => {
			b5.Game.CheevQueue.shift();
			b5.Game.CheevUpdateQueue();
			u.destroy();
		}),2.7);
	};
	
	b5.Game.addCheev = function(title, text, icon) {
		this.CheevQueue.push([title,text,icon]);
		this.CheevQueue.length == 1 && (cheev_sfx.play(), this.CheevUpdateQueue());
	}
	
})();