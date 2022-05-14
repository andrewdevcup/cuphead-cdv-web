return function(thisPlayer, flags, world, scene, game, charmData) {
	//Setup actions
	return {
		onTick: function() {
			//Upddate
			
			if(flags.heartPoints > 0 && thisPlayer.data.supermeter < thisPlayer.data.max_supermeter_score) {
				thisPlayer.data.supermeter += 0.07*game.speed;
			}
		}
	};
};