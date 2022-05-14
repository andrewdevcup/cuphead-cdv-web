return {
	questionMark: function(world, scene, data, game) {
		var q = new b5.Actor();
		q.atlas = scene.findResource('questionMarksAtlas','brush');

		q.tag = "Parryable";
		q.tags = ["Parryable"];
		world.findActor('Layer'+scene.data.view.playerLayer).addActor(q);
		
		q.initBody('collider',true);
		var ft = q.getFixtureSelf();
		ft.width = 20;
		ft.type = b5.Shape.TypeCircle;
		q.addFixture(ft);
		
		q._layer = data.layer;
		q.setPosition(data.pos.x,data.pos.y);
		q.data = data.data;
		q._scale = 0.95;
		
		q.id = q.data.id;
		
		q.playAnimWithEnd('qm_'+q.data.type+'_intro', qk => {
			qk.playAnim('qm_'+qk.data.type,true);
		});
		
		q.onOffscreen = function() {
			this.release(true);
		}
		
		q.parryScore = 100;
		
		q.onParry = q.onOffscreen;
		
		q.anim_x = 0;
		q.anim_y = 0;
		
		//Float to
		q.tws = {
			x: new b5.Tweener(q,'anim_x',null,q.x,q.x+q.data.float.x,q.data.float.s,b5.Ease.quadout),
			y: new b5.Tweener(q,'anim_y',null,q.y,q.y+q.data.float.y,q.data.float.s,b5.Ease.quadout)
		}
		
		q.setTimeout(k => {
			let _q = k.data;
			
			_q.tws.x.start();
			_q.tws.y.start();
			
			//Physics anim
			_q.setInterval(h => {
				_q.setPosition(_q.anim_x,_q.anim_y);
			},0);
		},1.75);
		
		q.setTimeout(t => {
			t.data.playAnimWithEnd('qm_'+t.data.data.type+'_death', e => e.onOffscreen());
		},3.5);
	
		return q;
	}
}