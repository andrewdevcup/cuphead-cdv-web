/*
*
* This will create player objects with physics body, properties, weapons and UI
* It loads the corresponding atlas for players and selected weapons
* rather than loading them all like on the original version.
* This is to save in resources.
* It also appends player flags and states to sceneData,
* aswell as an input listener.
* For the moment, only two players are allowed,
* but in the futute this may change.
* (You can add more players, but you should add more inputs too)
* Player properties and resources are located at (assetsFolder)/player/
*/

b5.export = function(world, scene, data, game) {
	var myexports = {};

	game.importObject('CreateCommonPlayerResources');
	game.importObject('CreateWeapons');
	game.importObject('CreateCharms');
	game.importObject('CreateSuper');
	game.importObject('CreateLevelHUD');

	game.Flags.inMainGame = true;
	game.Flags.playerCanExecuteSuper = true;
	//Load player data
	data.players = JSON.parse(b5.File.readSync(b5.Paths.player + 'players.json'));

	var isP1Mugman = game.SaveSlots.currentSaveSlot.isPlayer1Mugman;

  data.playerLastSpawnPosX = 0;
  
	myexports.createPlayer = function(player, playerInput, asPlayer2, levelStarted, chaliceFlag) {
		
		var rPlayer = player;
		if(chaliceFlag == 1 || chaliceFlag == 4) player = "chalice";
		
		var playerPath = b5.Paths.player + player + '/',
		playerid = !asPlayer2 ? "playerOne": "playerTwo";
		
		if(!asPlayer2) data.players.player1 = player;
		else data.players.player2 = player;

		data[player] = JSON.parse(
			b5.File.readSync(playerPath + 'player.json')
		);
		
		data[player].flags.introFlag = chaliceFlag;

		//Load resources
		var res = data[player].resources,
		extRes = data[player].extra_resources;

		//Bitmaps
		for (var a = 0, bitmaps = []; a < res.bitmaps.length; a++) {
			var btm = scene.findResource(res.bitmaps[a].name, 'bitmap');
			if (btm === null) {
				var bitmap = new b5.Bitmap(res.bitmaps[a].name, b5.Paths.assets + res.bitmaps[a].src, res.bitmaps[a].preload);
				scene.addResource(bitmap, 'bitmap');
			} else var bitmap = btm;
			bitmaps.push(bitmap);
		}
		//Atlas
		if (scene.findResource(res.atlas.name, 'brush') === null) {
			var atlas = new b5.ImageAtlas(res.atlas.name, bitmaps);
			atlas.parseFrames(b5.File.readSync(b5.Paths.assets + res.atlas.frames));
			atlas.parseAnims(b5.File.readSync(b5.Paths.assets + res.atlas.anims));
			scene.addResource(atlas, 'brush');
		} else var atlas = scene.findResource(res.atlas.name, 'brush');

		//Sounds
		for (var a = 0; a < res.sounds.length; a++) {
			var snd = scene.findResource(res.sounds[a].name, 'sound');
			if (snd === null) {
				var sound = new b5.Sound(res.sounds[a].name, b5.Paths.assets + res.sounds[a].src, res.sounds[a].preload, res.sounds[a].reuse, false);
				sound.loop = res.sounds[a].loop;
				sound.onDestroy = game.Sfx.remove;
				sound.output_gain = game.Sfx.volume;
				game.Sfx.add(sound);
				scene.addResource(sound, 'sound');
			}
		}
		
		//Load extra resources
		game.parseResources(extRes, scene);
		
	  scene.tryLoadNextResource();

		var phyb = data[player].body.physicsBody;

		//Spawn next to existing player if added as player2
		var prevpl = world.findActorsByTagName("player", true);
		if (prevpl.length > 0 && asPlayer2) {
			prevpl = prevpl[prevpl.length-1];

			data.player.spawn = {
				pos: [prevpl.x,
					prevpl.y-20],
				facing: Math.sign(prevpl.scale_x)
			}
		}

		//Create player and attach physics body
		var ply = new b5.PolygonActor;
		
		ply.setBodySize = function(w, h) {
			w = w/2,
			h = h/2;
			var w2 = w/2,
			h2 = h/2;
			//Octagon
			this.points = [
  			-w, h-0.1,
				-w, -h2,
				-w2, -h,
				w2, -h,
				w, -h2,
				w, h-0.1,
				w2, h,
				-w2, h
			];
			this.updatePointsPhysics();
	//		this.setSize(w,h)
		};
		
		ply.points=[];
		ply.hitboxes = [];
		ply.w = 0;
		ply.h = 0;
		ply.cull = false;
		ply.setBodySize(phyb.size[0],phyb.size[1]);
		ply.fill_style = game.Flags.debugShowHitboxes ? "#00800080": "transparent";
		ply.name = player;
		ply.rname = rPlayer;
		ply.tag = "player";
		ply.id = playerid;
		world.findActor("Layer"+data.view.playerLayer, true).addActor(ply);
		ply._layer = data.view.playerSubLayer || data[player].sub_layer || 1;
		ply.initBody("dynamic", true, false);

		ply.addFixture({
			type: b5.Shape.TypePolygon,
			vertices: ply.points,
		//	width:ply.w,
		//	height:ply.h,
			restitution: 0,
			density: phyb.density,
			friction: phyb.friction,
			collision_category: game.PLAYER, 
			collision_mask: game.FLOOR + game.WALL + game.PLATFORM //Can collide with categories:
		});


		//Spawn where
		ply.setPosition(data.player.spawn.pos[0] - (levelStarted ? 0 : data.playerLastSpawnPosX), data.player.spawn.pos[1]);
    
    data.playerLastSpawnPosX += phyb.size[0]*1.8;
    
		ply.data = data[player].variables;
		ply.flags = data[player].flags;
		//Attach hurtbox (will be used to check for overlapping with enemies and npcs without having a physics body attached)
		//It doesn't support rotation tho
		var hitboxes = data[player].body.hitboxes;

		for (var i in hitboxes) {
			var h = hitboxes[i];
			if (h != {}) {
				var hbx = new b5[h.type + 'Actor'];
				hbx.type === b5.Actor.Type_Arc ? (
					hbx.radius = h.radius,
					hbx.fill_style = 'blue'
				): (
					hbx.setSize(h.size[0], h.size[1]),
					hbx.fill_style = "red"
				);
				h.name == "ParryHitbox" && (hbx.fill_style = "pink");
				hbx.setPosition(ply.x+h.offset[0], ply.y+h.offset[1]);
				hbx.offset = h.offset;
				
				ply.hitboxes.push(hbx);
				
				hbx.player = ply;
				
				//Collider
				
				ply.parent.addActor(hbx);
				
				hbx.initBody("collider",true);
				hbx.addFixtureSelf();
				
				hbx.opacity = 1;
				hbx.name = h.name;
				hbx.alwaysActive = h.alwaysActive;
				hbx.activeTime = h.times;
				hbx.visible = !!game.Flags.debugShowHitboxes;
				hbx.tag = player +"hitbox" + (h.name == "ParryHitbox" ? '-intangible':'');
				hbx.tags = ["player","hitbox", "playerhitbox"];
			}
		}
		
		ply.onPositionSet= function(x,y) {
			for(var i=0,e=this.hitboxes;i<e.length;i++) 
		  	e[i].setPosition(x+e[i].offset[0],y+e[i].offset[1]);
		}
		//Attach atlas
		var playerAtlas = new b5.Actor;
		playerAtlas.atlas = atlas;
		playerAtlas.current_frame = res.alignment_frame;
		playerAtlas.round_pixels = false;
		playerAtlas.ox = res.atlas.offset[0];
		playerAtlas.oy = res.atlas.offset[1];
		ply.addActor(playerAtlas);
		playerAtlas.name = "AtlasImage";
		playerAtlas._scale = res.atlas.scale || 1;
		playerAtlas.center_atlas = !!res.atlas.centered;
		
		ply.Sprite = playerAtlas;

		playerAtlas.playAnim("idle_stand", true);

		//Input
		ply._playerInput = playerInput ? 'player2': 'player1';

		//Add weapons based on their id from savefile
		var loadout = game.SaveSlots.currentSaveSlot.loadouts[playerid],
		defs = game.GameDefIDs;

		ply.equipedWeapons = [
			defs.weapons[loadout.primaryWeapon],
			defs.weapons[loadout.secondaryWeapon]
		];
		
		ply.equipedCharm = defs.charms[loadout.charm];
		
		ply.equipedSuper = defs.supers[loadout.super];
		
		//Add HUD
		data.createHUD(ply, 
		  (scene.w/2) * (asPlayer2 || prevpl.length > 0 ? 1: -1), 
		  scene.h / 2 * (!b5.Game.Flags.originalCupheadHud ? -1 : 1)
		);

		//Add components
		ply.components = {};
		ply.activeComponents = data[player].variables.activeComponents;
		var cmps = data[player].components;
		
		//If player added after levelStarted, start with one hp
	//	if(levelStarted) data[player].flags.heartPoints = 1;
		
		for (var i = 0; i < cmps.length; i++) {
			var cmp = cmps[i].replace(".cup", '');

			//Initialize components
			//Get loop function as output to update them
			var func = Function(b5.File.readSync(playerPath + 'components/' + cmps[i]))();
			ply.components[cmp] = func && func(ply, data[player].flags, ply._playerInput, world, scene, game, data);
		}

		data.players.activePlayers.push(player);
		
		scene.events.dispatch('playeradded',player);
	};
	
	data.getActivePlayers = function() {
		for(var i = 0, m = [], p = world.findActorsByTagName('player',true); i < p.length; i++) {
			if(p[i].flags.heartPoints > 0) m.push(p[i]);
		}
		return m;
	}

	myexports.removePlayer = function(p) {
		var pl = world.findActor(p, true);
		pl.onRemove && pl.onRemove();
		pl.release(true);
		data.players.activePlayers.splice(
			data.players.activePlayers.indexOf(p), 1);
		delete data[p];
		game.Multiplayer.player2Joined = false;

		sceneMain.findActor(p+'HUD').destroy();
		
		scene.events.dispatch('playerremoved',p);
	};
	
	/*
	*
	* ChaliceFlag:
	* 0 - no Chalice
	* 1 - load as Chalice
	* 2 - No cookie
	* 3 - Intro Scared (no chalice)
	* 4 - Intro scared (chalice)
	*/
	var p1chaliceFlag = game.SlotUtils.getPlayerLoadouts('playerOne').charm == b5.Game.GameDefIDs.charms.cookie ? 1 : 0,
	p2chaliceFlag = game.SlotUtils.getPlayerLoadouts('playerTwo').charm == b5.Game.GameDefIDs.charms.cookie ? 1 : 0;
	
	//If both players have the cookie	equiped
	if( p1chaliceFlag && p2chaliceFlag && b5.Game.Multiplayer.player2Joined) {
		data.loadData.RNDINT >= 128 ?
		  p1chaliceFlag = 2
		  :
		  p2chaliceFlag = 2;
	}
	
	//If it's final boss
	if(data.levelIsFinalBoss) {
		p1chaliceFlag = (p1chaliceFlag == 1 ? 4 : 3);
		p2chaliceFlag = (p2chaliceFlag == 1 ? 4 : 3);
	}
	
	//Level locked for chalice
	if(data.noChalice && !game.Flags.forceChalice) {
		p1chaliceFlag = p2chaliceFlag = 0;
	}

	myexports.createPlayer(
		data.players.characters[isP1Mugman ? 1 : 0 ], false, false, false, 
		p1chaliceFlag	//|| data.loadData.playerOneAsChalice
	);
	//Add player 2 if joined
	game.Multiplayer.player2Joined && myexports.createPlayer(
		data.players.characters[isP1Mugman ? 0 : 1 ], true, true, false,
		p2chaliceFlag // || data.loadData.playerTwoAsChalice
	);

	data.initializePlayers = function() {
		var players = world.findActorsByTagName('player', true);
		for (var i = 0; i < players.length; i++) {
			players[i].releaseJoints();
			//Called when loading screen is being hidden
			players[i].onLoadingScreenOut && players[i].onLoadingScreenOut();
			//Start updating components
			players[i].onTick = function() {
				for (var a = 0; a < data[this.name].components.length; a++) {
					var c = this.components[data[this.name].components[a].replace('.cup', '')];
					c && c(this, data[this.name].flags, game.Input[this._playerInput], world, scene, game, data);
				}
			};
			
		}

		var platforms = world.findActorsByTagName('platform', true);

	//	for (var a = 0; a < platforms.length; a++) platforms[a].releaseJoints();

		for (var i = 0; i < players.length; i++) {
		/*	for (var a = 0; a < players.length; a++)
			//OLD: Create joints with no collision so the players don't collide with each other
			//Update: use physics layers instead
			players[a] != players[i] && players[i].disableCollision(players[a]);
			*/
			
			//Do the same with platforms so players cannot collide when they're jumping below them
			for (var a = 0; a < platforms.length; a++)
		  	players[i].y > platforms[a].y && platforms[a].playersOver[players[i].name] !== false && (
		  		platforms[a].platform.disableCollision(players[i]),
		  		platforms[a].playersOver[players[i].name] = false
  			);
		}
	};

	data.allPlayersDead = function(name) {
		data.levelData.fightStarted = false;
		data.players_dead = true;
		game.Flags.pausingEnabled = false;
	  
	  if(!game.Multiplayer.isGuest) {
	  	scene.events.dispatch('allplayersdead');
   
    	data.playFightText('YouDied', data.showDeathCard);
	  }
	};
	
	scene.events.on('allplayersdead', evtdata => {
		if(!evtdata) evtdata = [];
		if(game.Multiplayer.isGuest && evtdata[0] == 1) {
			data.playFightText('YouDied', data.showDeathCard);
		}
		else if(game.Multiplayer.isHost) game.Multiplayer.sendToGuest("DISPATCH_EVENT",['allplayersdead',[1]]);
	});
	
	//Show death screen if player one dies and player two exits
	scene.events.on('playerremoved', e => {
		game.DiscordSession.updateActivity({
    	state: game.d_printPlayersAndHP()
  	});
  		
		for(var i = 0, a = data.getActivePlayers(); i < a.length; i++) 
		  if(a[i].flags.heartPoints <= 0) return void data.allPlayersDead();
	});
	
	scene.events.on('playeradded', e => {
  	//Update presence in discord
  	scene.setTimeout(f => {
  		game.DiscordSession.updateActivity({
    		state: game.d_printPlayersAndHP()
  		});
  	},0.25);
  });
/*	
  scene.events.on('playerhit', e => {
  	//Update presence in discord
  	scene.setTimeout(f => {
  		game.DiscordSession.updateActivity({
    		state: game.d_printPlayersAndHP()
  		});
  	},0.25);
  });
  */

	data.playersIntroAnimation = function() {
		for (var i = 0, a = world.findActorsByTagName('player', true); i < a.length; i++) {
			a[i].playIntroAnimation(a[i].flags.introFlag);
		}
		/*
		app.setTimeout(function() {
			for (var i = 0, a = world.findActorsByTagName('player', true); i < a.length; i++) {
				var anim = b5.Maths.randomRange(0, 1) ? 'a': 'b',
				atl = a[i].findActor('AtlasImage');
				if (atl) atl.playAnimWithEnd('intro_'+anim, function(x) {
					x.parent.updateAnimations = true;
				});
			}
		},0.5);*/
	};

	data.createPlayer = myexports.createPlayer;
	data.removePlayer = myexports.removePlayer;

	return myexports;
};