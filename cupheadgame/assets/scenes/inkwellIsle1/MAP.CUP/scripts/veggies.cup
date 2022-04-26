return function(thisNpc, world, scene, game, data, glyph) {
  //On Interact
  var extremeUnlocked = game.SaveSlots.currentSaveSlot._isHardModeAvailable;
  card = data.showTitleCard('boss', data.Texts.the_root_pack,data.Texts.botanic_panic, {
  	simpleMode:true,
  	normalMode:true,
  	extremeMode: extremeUnlocked
  });

	card.onEnter = function(diff) {
		scene.findResource('StartLevelSfx','sound').play();
		
		!game.Multiplayer.isGuest && game.LoadScene('veggies', true, false, {
			hide_anim: 'open',
			show_anim: 'close',
			hourglass: true
		}, {
			difficulty: diff
		});
	 
	  //Save position in map
    var mapData = game.SlotUtils.getSessionInMap(3);
  
    mapData.playerOnePosition.x = mapData.playerTwoPosition.x = -157.24 / data.worldScale[0];
    mapData.playerOnePosition.y = mapData.playerTwoPosition.y = -464.98 / data.worldScale[1];
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