return function(thisNpc, world, scene, game, data) {
	//On Interact

	var card = data.showTitleCard('general', data.Texts.elder_kettle_house);

	card.onEnter = function() {
		scene.findResource('StartLevelSfx','sound').play();
		
		!game.Multiplayer.isGuest && game.LoadScene('elder_kettle_house', true, false, {
			hide_anim: 'open',
			show_anim: 'close',
			hourglass: true
		});

		//Save position in map
		var mapData = game.SlotUtils.getSessionInMap(3);

		mapData.playerOnePosition.x = mapData.playerTwoPosition.x = -13.3999996;
		mapData.playerOnePosition.y = mapData.playerTwoPosition.y = 1.92;
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