return function(thisNpc, world, scene, game, data) {
  //On Interact

  var canSkipDialog = false,  //Whether or not the player can skip to the next speech bubble
  dialoguerState = game.SaveSlots.DialoguerGlobalVariables.floats[0].float,  //The states of dialogs of all npcs (from the original Cuphead game)
  dialog = null,  //The dialog object
  dialogIndex = 0,  //The index of the speech bubble of the dialog
  dialogData = thisNpc.data.dialogs[dialoguerState[4]],  //The dialogs of the npc
  getTexts = function(txtIds) {
  	for(var i = 0, a = []; i < txtIds.length; i++)
  	  a.push( data.Texts[txtIds[i]] );
  	return a;
  };  //The text ids of the dialog corresponding to the actual texts in the current language
      //This is a function for every npc, so you can replace your strings with anything (variable text)
  var currentSfx;
  
  //On dialog
  //When the dialog bubble is shown
  thisNpc.onDialog = function(index) {
  	dialogIndex = index;
  	canSkipDialog = false;
  	dialog && dialog.setArrowVisible(false);
  	this.setTimeout(()=> {
  		//Set to skip dialog after time in data
  		canSkipDialog = true;
  		dialog.setArrowVisible(true);
  	}, dialogData.times[index]);

  	//Do things
  	currentSfx && currentSfx.stop();
  	currentSfx = scene.findResource('queenGhostSpeechSfx'+b5.Maths.randomRange(1,10),'sound');
  	currentSfx.play();
  	
  	if(index == 4) {
  		scene.findResource('PlayerChalicePowerUpSfx','sound').play();
  		thisNpc.playAnimWithEnd('chalice_magic', f => {
  			f.playAnim('chalice_idle', true);
  			let repeats = 1;
  			this.onAnimRepeat = function() {
		    	//Wait for looping point to play next anim
		    	if(this.current_anim == 'chalice_idle' && repeats <= 0) {
		    		this.playAnimWithEnd('chalice_talk', f => f.playAnim('chalice_idle_talk',true));
		    		delete this.onAnimRepeat;
		  	 }
		  	 repeats--;
		    }
  		});
  		
  		//Player animations
  		thisNpc.setTimeout(r => {
  			for(var a = 0, p = data.getActivePlayers(); a < p.length; a++) {
	  			var magic = new b5.Actor();
	  			magic.atlas = scene.findResource('LegendaryGhostBeamAtlas','brush');
	  			magic.frame_speed = 24;
	  			magic.frames_repeat = false;
	  			magic.onAnimEnd = magic.destroy;
	  			world.PlayerLayer.addActor(magic);
	  			magic._layer = p[a].layer;
	  			magic.setPosition(p[a].x,p[a].y);
	  			magic._y2 = -350;
	  			magic._x2 = -20;
	  			p[a].Sprite.playAnimWithEnd('power_up_super', g => g.playAnim('idle_stand',true));
	  		}
  		}, 0.85);
  	}
  };
  
  //On dialogInput
  //When user is pressing the action button
  thisNpc.onDialogInput = function() {
  	canSkipDialog && dialog.nextBubble();
  	
  	//Do more things
  };
  
  //On dialogEnd
  //When index reached dialog length
  thisNpc.onDialogEnd = function() {
  	//Set to not interacting after some time
  	this.player_focus = false;
  	this.setTimeout(function(task) {
  		task.data.interacting = false;
  	}, 0.5);
  	
  	//Allow players to move
  	this.setTimeout(f => {
  		for(var a = 0, b = world.findActorsByTagName('player',true); a < b.length; a++)
  		  data[b[a].name].flags.controllable = true;
  	},0.25);
  	
  	b5.Game.LoadScene('inkwellIsle1', false, false, {
  		show_anim: 'close',
			hide_anim: 'open',
			hourglass: true
  	}, {
  		fromLevel: b5.Game.SceneLoader.sceneId,
			fromLevelID: data.levelID,
			level_completed: true,
  	})

  };
  
  //Create dialog
  thisNpc.onPlayersReachedPosition = function() {
  	//Called when players reched position
  	dialog = data.createDialog(thisNpc,
      getTexts(dialogData.texts),
      thisNpc.data.cameraOffset
    );
    
    this.onAnimRepeat = function() {
    	//Wait for looping point to play next anim
    	if(this.current_anim == 'chalice_idle') {
    		this.playAnimWithEnd('chalice_talk', f => f.playAnim('chalice_idle_talk',true));
    		delete this.onAnimRepeat;
  	 }
    }
    
  }
  
};