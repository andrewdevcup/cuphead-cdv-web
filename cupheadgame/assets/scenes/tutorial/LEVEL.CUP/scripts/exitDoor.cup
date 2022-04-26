return function(thisNpc, world, scene, game, data) {
	//NPC INTERACT

	//Freeze players
	var players = world.findActorsByTagName('player', true);
	for (var i = 0; i < players.length; i++) {
		players[i]._av = false;
		players[i].onRemove(); //Stop any behaviors
		//Add particle
		var particle = data.spawnPlayerParticle('playerReviveEffect', players[i]);
	}
  
  //Set level to completed
  game.SlotUtils.getLevelData(data.levelID).completed = true;
  
	//Load elder kettle house level
	particle.onAnimEnd = function() {
		game.LoadScene(game.contents.levels[0], false, true, {
			show_anim: 'close',
			hide_anim: 'open',
			music_fade_speed: 0.35,
			hourglass: true
		});
		
		//Save coins
		data.transferCoinsToSaveSlot();
	};
};