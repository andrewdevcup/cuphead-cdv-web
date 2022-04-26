b5.export = function(world, scene, data, game) {
	var myexports = {};

	//Load only the equiped weapons instead of all
	//To save in resources

	//Load definitions
	var defs = game.GameDefIDs,
	loadouts = game.SaveSlots.currentSaveSlot.loadouts;

	//Get equiped weapons from savefile
	var charmP1 = defs.charms[loadouts.playerOne.charm],
	charmP2 = defs.charms[loadouts.playerTwo.charm];
	
	data.playerCharms = {
		player1: charmP1,
		player2: charmP2
	};

	//Load common resources
	//game.importObject('CreateCommonCharmResources');

	//List equiped charms
	var charms = [];
	for (var i in data.playerCharms) {
	  var c = data.playerCharms[i];
		charms.indexOf(c) == -1 && c != "empty" && charms.push(c);
	}

	//Load charm resources
	data.charms = {};
	for (var i = 0; i < charms.length; i++) {
		var resData = b5.File.readSync(b5.Paths.player + 'charms/'+charms[i]+'/resources-level.json'),
		res = data.charms[charms[i]] = resData != "" ? JSON.parse(resData) : {};
    
    game.parseResources(res, scene);

		//Parse events
		var charm = data.charms[charms[i]];
		charm.setupActions = Function(b5.File.readSync(b5.Paths.player + 'charms/' + charms[i] + '/CHARM.cup'))();
	}
	
	data.Charm = function(name, player) {
		if (name != "empty") {
			this.chm = data.charms[name];
			this.data = this.chm.setupActions(player, data[player.name].flags, world, scene, game, this.chm);
			this.updateBehavior = function() {
				this.data.onTick()};
		} else return null;
	}

	return myexports;
};