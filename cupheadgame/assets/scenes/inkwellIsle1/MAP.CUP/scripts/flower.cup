return function(thisNpc, world, scene, game, data, glyph) {
  //On Interact
  var extremeUnlocked = game.SaveSlots.currentSaveSlot._isHardModeAvailable;
  card = data.showTitleCard('boss', data.Texts.cagney_carnation,data.Texts.floral_fury, {
  	simpleMode:!true,
  	normalMode:true,
  	extremeMode: false //extremeUnlocked
  });

	card.onEnter = function(diff) {
		scene.findResource('StartLevelSfx','sound').play();
		
		!game.Multiplayer.isGuest && game.LoadScene('flower', true, false, {
			hide_anim: 'open',
			show_anim: 'close',
			hourglass: true
		}, {
			difficulty: diff
		});
	 
	  //Save position in map
    var mapData = game.SlotUtils.getSessionInMap(3);
  
    mapData.playerOnePosition.x = mapData.playerTwoPosition.x = 1383.85 / data.worldScale[0];
    mapData.playerOnePosition.y = mapData.playerTwoPosition.y = 156.37 / data.worldScale[1];
	};
	
	card.onExit = function() {
		thisNpc.interacting = false; //Reset
	  
	  //Show glyph back
	  var player = world.findActor(thisNpc.player,true);
	  player && thisNpc.player_focus && player.onNpcFocus(thisNpc);
	  
		for(var i = 0, p = world.findActorsByTagName('player',true);i<p.length;i++) {
			p[i].flags.controllable = true;
		}
	};
};