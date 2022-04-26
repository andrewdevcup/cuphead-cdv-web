return function(thisNpc, world, scene, game, data) {
	//NPC INTERACT 
	
	game.Flags.pausingEnabled = false;
	
	//Disable wall collision
	world.findActor('LevelWall1',true).setPosition(-999,-999);
	
	//Disable other npcs
	world.findActor('NPC_InkwellTutorial', true).npc_active = false;
	world.findActor('NPC_ElderKettle', true).npc_active = false;
	
	thisNpc.onPlayersReachedPosition = function() {
		game.LoadScene(
				game.contents.maps[3], false, true, {
				music_fade_speed: 0.35,
				show_anim:'close',
				hide_anim:'open',
				hourglass:true
			}, {
				fromLevel: 'elder_kettle_house'
			});
	};
	 
};