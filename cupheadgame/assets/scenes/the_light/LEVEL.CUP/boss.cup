return {
	TheLight: function(thisActor, world, scene) {
		//Create hitboxes and joints

		var difficulty = scene.data.addScore('skill', scene.data.loadData.difficulty != undefined ? scene.data.loadData.difficulty : 1),
	  bossData = scene.data.bossData;

	//	bossData.health = 500;

		bossData.Pattern = (function() {
			for (var i = 0, ac = false, pat = []; i < 32; i++) {
				ac = !ac;
				pat[i] = ac ? Math.round10(b5.Maths.randomRange(2.5, 4, true)): [
					{attack: 1, time: Math.round10(b5.Maths.randomRange(1, 2.5, true))},
					{attack: 2, time: Math.round10(b5.Maths.randomRange(1, 2.5, true))}
				][b5.Maths.randomRange(0, 1)];
			}
			return pat;
		})();
		bossData.PatternIndex = 0;
		bossData.executingPattern = false;

		//Body hitboxes
		var hb1 = new b5.ArcActor;
		hb1.radius = 50;
		thisActor.parent.addActor(hb1);
		hb1.setPosition(thisActor.x,
			thisActor.y);
		hb1.tags = ['enemy', 'hittableEnemy'];
		hb1.name = thisActor.name+'-Hitbox1';
		hb1.visible = false;
		
		hb1.initBody('collider',true);
		hb1.addFixtureSelf();
		
		var hitShader = scene.findResource("EnemyHitShader","shader");

		hb1.onBulletHit = function(bullet) {
	//		thisActor.addFilter(hitShader.filter);
	    thisActor.tint_colour = "#ff4444";
			thisActor.setTimeout(function() {
				//thisActor.removeFilter(hitShader.filter);
				thisActor.tint_colour = "0xffffff";
			},app.dt*4);
			bossData.health -= bullet.damage;
		}

		//Light
		var addLightBar = function(angle, root) {
			var b = new b5.RectActor;
			b.setSize(900,
				27);
			//b.ox = -b.w/2;
			b.fill_style = 'blue';
			b.round_pixels = false;
			b.rotation = b5.Maths.degToRad(angle);
			b.start_angle = angle;
			thisActor.parent.addActor(b);
			b._layer = 0;
			b.cull=false
			
			b.initBody('collider');
			b.addFixtureSelf();
			b.setPosition(
				(b.w/2)*Math.cos(b.rotation),
				(b.w/2)*Math.sin(b.rotation))
				
		  root.weldBodyTo(b, false);

			b.setActive = function(a) {
				this.tags = a ? ['enemy','wall'] : [];
				this.fill_style = a ? 'red':'blue';
			}

			return b;
		}
		
		//Light bars 1
		var lbg1 = new b5.Actor;
		thisActor.parent.addActor(lbg1);
		lbg1.initBody('kinematic');
		lbg1.addFixtureSelf(1,1,0,true);
		
		var lbg2 = new b5.Actor;
		thisActor.parent.addActor(lbg2);
		lbg2.initBody('kinematic');
		lbg2.addFixtureSelf(1,1,0,true);
		
		// Y
		var lb1 = addLightBar(30, lbg1),
		lb2 = addLightBar(150, lbg1),
		lb3 = addLightBar(270, lbg1);
		//λ
		var lb4 = addLightBar(-30, lbg2),
		lb5 = addLightBar(-150, lbg2),
		lb6 = addLightBar(-270, lbg2);

		//Rotation angles
		bossData.rAngle = b5.Maths.degToRad(0);
		bossData.rAngAccel = 0;

		thisActor.maxhealth = bossData.health;
		
		thisActor.executeAction = function(act) {

			//Advert
			if (act.attack == 1 && !this.attacking) {
				lb1.fill_style = lb2.fill_style = lb3.fill_style = "yellow";
				this.attacking = true;
				thisActor.setTimeout(function() {
					//Attack
					lb1.setActive(true),
					lb2.setActive(true),
					lb3.setActive(true);
					thisActor.setTimeout(function() {
						//End
						thisActor.attacking = false;
						lb1.setActive(false),
						lb2.setActive(false),
						lb3.setActive(false);
					}, act.time);
				}, 1.2);
			}
			if (act.attack == 2 && !this.attacking) {
				lb4.fill_style = lb5.fill_style = lb6.fill_style = "yellow";
				this.attacking = true;
				thisActor.setTimeout(function() {
					//Attack
					lb4.setActive(true),
					lb5.setActive(true),
					lb6.setActive(true);
					thisActor.setTimeout(function() {
						//End
						thisActor.attacking = false;
						lb4.setActive(false),
						lb5.setActive(false),
						lb6.setActive(false);
					}, act.time);
				}, 1.2);
			}

		};
		

		var dead = false;
		
		//Load tutorial if battle was win (yes,)
		
		scene.events.once('onfightwin:nextscene', ()=>{
			b5.Game.LoadScene('tutorial', 0, 0, {
				show_anim: 'fade',
				show_speed: 2,
				hide_anim: 'open',
				hourglass: true
			});
		});

		thisActor.onTick = function() {
			bossData = scene.data.bossData; //Fix object error in guest
			bossData.rAngle += (bossData.rAngAccel + (thisActor.maxhealth - bossData.health)*4.3e-5) * b5.Game.speed;
			
			lbg1.setRotation(-bossData.rAngle);
			lbg2.setRotation(bossData.rAngle);

			if (scene.data.levelData.fightStarted) {
				bossData.rAngAccel < 0.008 && (bossData.rAngAccel += 8e-5*b5.Game.speed);

				//Patterns
				if (!bossData.executingPattern) {
					bossData.executingPattern = true;
					if(bossData.Pattern[bossData.PatternIndex+1]) thisActor.executeAction(bossData.Pattern[bossData.PatternIndex+1]);

					thisActor.setTimeout(function() {
						bossData.executingPattern = false;
					}, bossData.Pattern[bossData.PatternIndex]);

					bossData.PatternIndex < bossData.Pattern.length -1 ?
					bossData.PatternIndex += 2: (
						bossData.PatternIndex = 0,
						bossData.executingPattern = false
					);
				}

				if (bossData.health <= 0 && !dead) {
					dead = true;
					scene.data.onBossDeath && scene.data.onBossDeath();
					thisActor.onDeath && thisActor.onDeath();
				}

			}
		};
	}
};