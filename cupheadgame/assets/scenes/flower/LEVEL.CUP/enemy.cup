return {
	acorn: function(world, scene, data, game) {
		var j = new b5.Actor;
		j.atlas = scene.findResource('AcornAtlas','brush');
		j.tag = "enemy";
		j.tags = ["enemy"];
		world.PlayerLayer.addActor(j);
		j.playAnim("acorn_spin", true);
		
		j.initBody('collider',true);
		var ft = j.getFixtureSelf();
		ft.width = 18;
		ft.type = b5.Shape.TypeCircle;
		j.addFixture(ft);
		
		j._layer = 2;
		j.setPosition(data.pos.x,data.pos.y);
		j.data = data.data;
		
		j.id = j.data.id;
		j.releaseTime = j.data.releaseTime;
		j.target = world.findActor(j.data.target, true);
		j.shooting = false;
		j.speed = j.data.speed;
		j.acceleration = j.data.acceleration;
		
		j._scale = 0.97;
		
		j.visible = false;
		j.setTimeout(f => f.data.visible = true, j.releaseTime*.1)
		
		j.setTimeout(f => {
			j._scale_x *= -1;
			j.playAnim("acorn_shoot",true);
			
			if(j.target && !j.shooting) {
				j.shooting = true;
				j.setRotation( b5.Maths.posAngle(j.x,j.y,j.target.x,j.target.y) );
				
			}
			else if(!j.shooting) {
				//No target
				j.shooting = true;
				j._rotation = -180 * b5.Maths.DtoRad;
			}
			
			j.axis = {
				x: Math.cos( j.rotation ),
				y: Math.sin( j.rotation )
			}
			j.body.m_linearVelocity.x = j.speed * j.axis.x;
			j.body.m_linearVelocity.y = j.speed * j.axis.y;

		}, j.releaseTime);
		
		j.onOffscreen = function(explode) {
			if(!explode) this.release(true);
			else {
				this.body.m_linearVelocity.x = this.body.m_linearVelocity.y = 0;
				this.setRotation(0);
				scene.findResource('SeedPoofSfx','sound').play();
				this.playAnimWithEnd('acorn_explode',g => g.release(true));
			}
		}
		j.onfloor = false;
		
		j.onTick = function() {
			if(!this.onfloor) for(var i = 0, o = this.A_overlaps, l; i < o.length; i++) {
				if(l = o[i], l && l.isFloor) {
					this.onOffscreen(true);
					this.onfloor = true;
				}
			}
		}
		
		j.onPlayerHit = j.onDeath = function() {
			this.body.SetActive(false);
			this.tags = [];
			this.onOffscreen();
			
			//Sync Multiplayer
			scene.events.dispatch('enemydeath',[this.id, 'send']);
			
		}
		
		//Destroy
		j.setTimeout(t => {
			t.data.onOffscreen();
		},5);
	
		return j;
	},
	boomerang: function(world, scene, data, game) {
		var j = new b5.Actor;
		j.atlas = scene.findResource('BoomerangAtlas','brush');
		j.tag = "enemy";
		j.tags = ["enemy"];
		world.PlayerLayer.addActor(j);
		j.playAnim("boomerang", true);
		
		j.initBody('collider',true);
		var ft = j.getFixtureSelf();
		ft.width = 55;
		j._scale = 0.95;
		ft.type = b5.Shape.TypeCircle;
		j.addFixture(ft);
		
		j._layer = 2;
		j.setPosition(data.pos.x,data.pos.y);
		j.data = data.data;
		j.speed = j.data.speed;
		j.releaseTime = j.data.releaseTime;
		j.turnaround_time = j.data.turnaround_time;
		
		j.visible = false;
		j.setTimeout(f => f.data.visible = true, 0.06);
		
		j.setTimeout(f => {
			f.data.body.m_linearVelocity.x = -j.speed;
		}, j.releaseTime);
		
		j.turnaround = false;
		
		j.turn = function() {
			this.turnaround = true;
			this.setPosition(-800, 150);
			this.body.m_linearVelocity.x = 0;
			this.setTimeout(f => this.body.m_linearVelocity.x = this.speed, this.turnaround_time);
		}
		
		j.sfx = scene.findResource('BoomerangLoopSfx','sound');
		j.sfx.play();
		
		j.onTick = function() {
			if(this.x < -800 && !this.turnaround) this.turn();
			
			j.sfx.setStereoPan( this.x / (scene.w *.5) );
		}
		
		//Destroy
		j.setTimeout(t => {
			t.data.release(true);
			t.data.sfx.stop();
		},5.5);

	}
};