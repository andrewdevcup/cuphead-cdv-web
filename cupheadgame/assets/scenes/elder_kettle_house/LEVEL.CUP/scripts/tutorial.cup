return function(thisNpc, world, scene, game, data) {
	//NPC INTERACT 
	
	//Disable other npcs
	world.findActor('NPC_ElderKettle', true).npc_active = false;
	world.findActor('NPC_Exit', true).npc_active = false;
	
	//Freeze players
	var players = world.findActorsByTagName('player', true);
	for (var i = 0; i < players.length; i++) {
		players[i]._av = false;
		players[i].onRemove(); //Stop any behaviors
		//Add particle
		var particle = data.spawnPlayerParticle('playerReviveEffect', players[i]);
	}

	thisNpc.active = false;

	//Load tutorial level
	particle.onAnimEnd = function() {
		game.LoadScene('tutorial', false, true, {
			show_anim: 'close',
			hide_anim: 'open',
			music_fade_speed: 0.35,
			hourglass: true
		});
	}
};