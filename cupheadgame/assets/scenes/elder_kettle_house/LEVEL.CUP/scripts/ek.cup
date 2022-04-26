return function(thisNpc, world, scene, game, data) {
	//NPC INTERACT
	var canSkipDialog = false,  //Whether or not the player can skip to the next speech bubble
  dialoguerState = game.SaveSlots.DialoguerGlobalVariables.floats[0].float;  //The states of dialogs of all npcs (from the original Cuphead game)
  
  //If tutorial level played (completed)
  if(game.SlotUtils.getLevelData(0).played) dialoguerState[0] = 2;
  
  var dialog = null,  //The dialog object
  dialogIndex = 0,  //The index of the speech bubble of the dialog
  dialogData = thisNpc.data.dialogs[dialoguerState[0]],  //The dialogs of the npc
  getTexts = function(txtIds) {
  	for(var i = 0, a = []; i < txtIds.length; i++) a.push( data.Texts[txtIds[i]] );
  	return a;
  };  //The text ids of the dialog corresponding to the actual texts in the current language
      //This is a function for every npc, so you can replace your strings with anything (variable text)
  

	//Disable other npcs
	world.findActor('NPC_InkwellTutorial', true).npc_active = false;
	world.findActor('NPC_Exit', true).npc_active = false;
   
	var talking = false,
	talk = '',
	time = 0,
	nextTransTime = b5.Maths.randomRange(4, 6, true),
	transTime = 0,
	talkTransition = function() {
		thisNpc.playAnimWithEnd('talk_trans_'+(talk == 'a'?'ab': 'ba'), function() {
			talking ? thisNpc.playAnim('talk_'+(talk == 'a'?'b': 'a'), true):
			thisNpc.playAnim('ek_idle', true);
			talk = talk == 'a' ? 'b': 'a';
		});
	},
	potion = null,
	ekSfx = {
		McKellen: (function() {
			for(var i = 0, a = []; i < scene.sounds.length; i++)
			  scene.sounds[i].name.indexOf('McKellen')!=-1 && a.push(scene.sounds[i]);
			return a;
		})(),
		ExcitedBurst: (function() {
			for(var i = 0, a = []; i < scene.sounds.length; i++)
			  scene.sounds[i].name.indexOf('ExcitedBurst')!=-1 && a.push(scene.sounds[i]);
			return a;
		})(),
		Laugh: (function() {
			for(var i = 0, a = []; i < scene.sounds.length; i++)
			  scene.sounds[i].name.indexOf('Laugh')!=-1 && a.push(scene.sounds[i]);
			return a;
		})(),
		WarStory: (function() {
			for(var i = 0, a = []; i < scene.sounds.length; i++)
			  scene.sounds[i].name.indexOf('WarStory')!=-1 && a.push(scene.sounds[i]);
			return a;
		})()
	},
	currSfx = null;
  
	thisNpc.onPlayersReachedPosition = function() {
		//Talk
		thisNpc.playAnim('talk_a', true);
		talking = true;
		talk = 'a';
		
		dialog = data.createDialog(thisNpc, getTexts(dialogData.texts));
	};
	
	thisNpc.onDialogEnd = function() {
		talking = false;
		this.interacting = false;
		game.Flags.pausingEnabled = true;
		talk === 'b' ? talkTransition() : this.playAnim('ek_idle', true);
		
		this.setTimeout(function() {
			//Prevent players from jumping on A press to close dialog
			for(var i = 0, p = world.findActorsByTagName('player',true); i < p.length; i++) {
			  data[p[i].name].flags.controllable = true;
			  data[p[i].name].flags.jumpState = 2;
			  p[i].setTimeout(task=>{
			  	var player = task.data;
			  	data[player.name].flags.jumpState = 0;
			  },.2);
			}
		},app.dt);
		  
		//Enable npcs
		world.findActor('NPC_InkwellTutorial', true).npc_active = true;
  	world.findActor('NPC_Exit', true).npc_active = true;
  	
  	//Advance
		dialoguerState[0] === 0 && (dialoguerState[0] = 1);
	};

	thisNpc.onDialogInput = function() {
		if(canSkipDialog) {
			dialog.nextBubble();
			canSkipDialog = false;
			dialog.setArrowVisible(false);
		}
	};
	thisNpc.onDialog = function(index) {
		this.setTimeout(function() {
			canSkipDialog = true;
			dialog.setArrowVisible(true);
		},dialogData.times[index]);
		
		//Sfx
		var sfx = ekSfx[dialogData.data[index]];
		
		currSfx && currSfx.stop();
		
		//Prevent	playing the same sfx
		for(;;) {
			var aSfx = sfx[b5.Maths.randomRange(0,sfx.length-1)];
			if(currSfx != aSfx) {
				currSfx = aSfx.play();
				break;
			}
		}
		
		//Actions
		if(dialoguerState[0] === 0) {
			if(index === 7) {
				thisNpc.playAnimWithEnd('bottle_pops_out',()=>{
					  thisNpc.playAnim('bottle_pops_out_boil',true);
			  });
		  	talking = false;
		  	
		  	//Spawn potion
		  	potion = new b5.Actor;
		  	potion.atlas = thisNpc.atlas;
		  	potion.center_atlas = true;
		  	potion.round_pixels = false;
		  	potion.x = 277;
		  	potion.y = 56;
		  	potion._scale = 0.9;
		  	thisNpc.parent.addActor(potion);
		  	potion.playAnimWithEnd('ek_bottle_toss_up',()=>{
		  		potion.playAnim('ek_bottle_boil',true);
		  	});
		  	
		  	//Spawn puff smoke
		  	data.spawnParticle('ek_puff',thisNpc);
		  	
		  	//Sfx
		  	scene.findResource('EkBottlePopsOutSfx', 'sound').play();
			}
			else if(index === 8) {
				thisNpc.playAnimWithEnd('bottle_pops_out_trans',()=>{
					 thisNpc.playAnim('talk_a',true);
			 	   talking = true;
			 	   talk = 'a';
				   transTime = 0;
				});
				
				//Potion particle
				data.spawnParticle('ek_bottle_dissapear_fx', potion);
				potion.destroy();
				
				//Sfx 
				scene.findResource('EkBottleDissapearSfx', 'sound').play();
				
				//Players power up
				for(var i = 0, p = world.findActorsByTagName('player',true); i < p.length; i++) {
				  data[p[i].name].flags.controllable = false;
				  p[i].findActor('AtlasImage').playAnimWithEnd('power_up',(atlas)=>{
				  	atlas.playAnim('idle_stand',true);
				  });
				}
				//Sfx
				scene.findResource('PlayerPowerUpSfx', 'sound').play(0.15);
			}

		}
		
		
	};


	//Manage talk animations
	thisNpc.onDraw = function() {
		time += game.speed*0.07;
		if (talking && thisNpc.current_anim.indexOf('trans') == -1) {
			thisNpc.frame_speed = 24+Math.abs(Math.cos(time)*30*Math.tan(time));

			transTime < nextTransTime ? transTime += app.dt: (
				transTime = 0,
				nextTransTime = b5.Maths.randomRange(4, 6, true),
				talkTransition()
			);
		}
	};

};