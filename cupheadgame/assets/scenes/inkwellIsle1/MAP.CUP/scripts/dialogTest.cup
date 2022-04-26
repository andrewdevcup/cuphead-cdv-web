return function(thisNpc, world, scene, game, data) {
  //On Interact
  
  var canSkipDialog = false,  //Whether or not the player can skip to the next speech bubble
  dialoguerState = game.SaveSlots.DialoguerGlobalVariables.floats[0].float,  //The states of dialogs of all npcs (from the original Cuphead game)
  dialog = null,  //The dialog object
  dialogIndex = 0,  //The index of the speech bubble of the dialog
  dialogData = thisNpc.data.dialogs[dialoguerState[1]],  //The dialogs of the npc
  getTexts = function(txtIds) {
  	for(var i = 0, a = []; i < txtIds.length; i++)
  	  a.push( data.Texts[txtIds[i]].replace('@playersLength@',data.players.activePlayers.length) );
  	return a;
  };  //The text ids of the dialog corresponding to the actual texts in the current language
      //This is a function for every npc, so you can replace your strings with anything (variable text)
  
  //On dialog
  //When the dialog bubble is shown
  thisNpc.onDialog = function(index) {
  	dialogIndex = index;
  	canSkipDialog = false;
  	this.setTimeout(()=> {
  		//Set to skip dialog after time in data
  		canSkipDialog = true;
  		dialog.setArrowVisible(true);
  	}, dialogData.times[index]);

  	//Do things
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
  	for(var a = 0, b = world.findActorsByTagName('player',true); a < b.length; a++)
  	  data[b[a].name].flags.controllable = true;

  };
  
  //Create dialog
  dialog = data.createDialog(thisNpc,
    getTexts(dialogData.texts),
    thisNpc.data.cameraOffset
  );
  
  
};