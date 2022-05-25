b5.export = function(world, scene, data, game) {
	var myexports = {};

	//Load only the equiped weapons instead of all
	//To save in resources

	//Load definitions
	var defs = game.GameDefIDs,
	loadouts = game.SaveSlots.currentSaveSlot.loadouts;

	//Get equiped weapons from savefile
	var superP1 = defs.supers[loadouts.playerOne.super],
	superP2 = defs.supers[loadouts.playerTwo.super];
	
	data.playerSupers = {
		player1: superP1,
		player2: superP2
	};

	//Load common resources
	//game.importObject('CreateCommonSuperResources');

	//List equiped supers
	var supers = [];
	for (var i in data.playerSupers) {
	  var c = data.playerSupers[i];
		supers.indexOf(c) == -1 && c != "empty" && supers.push(c);
	}
	
	//Load if none is empty
	if(supers.length > 0) new b5.Raw('SuperCommonResources', b5.Paths.player + 'supers/resources.json', true, fdata => {
		game.parseResources(fdata,scene);
	},true);

	//Load super resources
	data.supers = {};
	for (var i = 0; i < supers.length; i++) {
		var resData = b5.File.readSync(b5.Paths.player + 'supers/'+supers[i]+'/resources-level.json'),
		res = data.supers[supers[i]] = resData != "" ? JSON.parse(resData) : {};
    
    game.parseResources(res, scene);

		//Parse events
		var super_ = data.supers[supers[i]];
		super_.setupActions = Function(b5.File.readSync(b5.Paths.player + 'supers/' + supers[i] + '/SUPER.cup'))();
	}
	
	data.Super = function(name, player) {
		if (name != "empty") {
			this.spr = data.supers[name];
			this.data = this.spr.setupActions(player, data[player.name].flags, world, scene, game, this.spr);
			this.updateBehavior = function() {
				this.data.onTick()};
		} else return null;
	}

	return myexports;
};