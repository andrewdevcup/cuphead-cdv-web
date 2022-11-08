b5.export = function(world, scene, data, game) {
	var myexports = {};

	//Load only the equiped weapons instead of all
	//To save in resources

	//Load definitions
	var defs = game.GameDefIDs,
	loadouts = game.SaveSlots.currentSaveSlot.loadouts;

	//Get equiped weapons from savefile
	var weaponPrimaryP1 = defs.weapons[loadouts.playerOne.primaryWeapon],
	weaponSecondaryP1 = defs.weapons[loadouts.playerOne.secondaryWeapon],
	weaponPrimaryP2 = defs.weapons[loadouts.playerTwo.primaryWeapon],
	weaponSecondaryP2 = defs.weapons[loadouts.playerTwo.secondaryWeapon];

	data.playerWeapons = {
		player1: [weaponPrimaryP1,
			weaponSecondaryP1],
		player2: [weaponPrimaryP2,
			weaponSecondaryP2]
	};

	//Load common resources
	game.importObject('CreateCommonWeaponResources');

	//List equiped weapons
	var weapons = [];
	for (var i in data.playerWeapons)
		for (var a = 0; a < data.playerWeapons[i].length; a++) {
		var w = data.playerWeapons[i][a];
		weapons.indexOf(w) == -1 && w != "empty" && weapons.push(w);
	}
  
  data.loadWeapon = function(name) {
  	var wpath = b5.Paths.player + 'weapons/' + name + '/';
  	
  	//Load weapon data
  	new b5.Raw(name+":WeaponData", wpath + 'weapon.json', true, wdat => {
  		data.weapons[name] = JSON.parse(wdat);
  	}, true);
  	
		//Load weapon resources
		var res = data.weapons[name].resources;
    
    game.parseResources(res, scene);

		//Parse events
		var weapon = data.weapons[name];
		new b5.Raw(name + ":WeaponScript", wpath + 'WEAPON.cup', true, wsc => {
			weapon.setupActions = Function(wsc)();
		}, true);

  }
  
	//Load weapon data
	data.weapons = {};
	for (var i = 0; i < weapons.length; i++) {
		data.loadWeapon(weapons[i]);
	}
	
	data.playerBullets = [];
	data.playerEXbullets = [];

	data.Weapon = function(name, player) {
		if (name != "empty") {
			if(!data.weapons[name]) data.loadWeapon(name);
			this.wpn = data.weapons[name];
			this.data = this.wpn.setupActions(player, player.flags, world, scene, game, this.wpn);
			this.updateBehavior = function() {
				this.data.onTick(this.data.bullets, this.data.exBullets)};
		} else return null;
	}

	return myexports;
};