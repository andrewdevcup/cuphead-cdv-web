(function() {
	b5.Game.SaveSlots = {};
	//Create slots
	for(var i = 0; i < b5.Game.contents.sav.length; i++)
	  b5.Game.SaveSlots['slot'+i] = {};
	
  b5.Game.setCurrentSaveSlot = function(slot) {
  	this.SaveSlots.currentSaveSlot = this.SaveSlots['slot'+slot];
  	this.SaveSlots.slot_index = slot;
  	
  	b5.Game.SlotUtils.parseDialoguerVariables();
  };
  
  b5.Game.save = function() {
  	if(!this.Multiplayer.isGuest) {
  		delete this.SaveSlots.currentSaveSlot.sessionStarted; //Leftover from previous alpha releases
  		this.SaveSlots.currentSaveSlot.dialoguerState = b5.XML.stringify({DialoguerGlobalVariables: this.SaveSlots.DialoguerGlobalVariables});
  		b5.File.write(b5.Paths.saves + this.contents.sav[this.SaveSlots.slot_index], JSON.stringify(this.SaveSlots.currentSaveSlot));
  	}
  };
  
  //Utils
  
  b5.Game.SlotUtils = {
  	parseDialoguerVariables: function() {
  		//Parse temporary dialoguer states
    	b5.Game.SaveSlots.DialoguerGlobalVariables = b5.Game.SaveSlots.currentSaveSlot.dialoguerState ? b5.XML.parse(b5.Game.SaveSlots.currentSaveSlot.dialoguerState).DialoguerGlobalVariables
    	  : {
  	    	'$': {
    	  		"xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
    	  		"xmlns:xsd": "http://www.w3.org/2001/XMLSchema"
  	    	},
  	    	booleans: [],
    	  	strings: [],
  	    	floats: [{
    	  		float: new Array(22).fill(0)
    	  	}]
  	    }
  	
    	for(var i = 0, fs = b5.Game.SaveSlots.DialoguerGlobalVariables.floats[0].float; i < fs.length; i++)
    	  fs[i] = +fs[i];
  	},
  	getLevelData: function(id) {
  		for(var i = 0, a = b5.Game.SaveSlots.currentSaveSlot.levelDataManager.levelObjects; i < a.length; i++) 
  		  if(a[i].levelID === id) return a[i];
  		return null;
  	},
  	createSessionInMap: function(mapId, x, y) {
  		var mdm = b5.Game.SaveSlots.currentSaveSlot.mapDataManager,
  		md = mdm.mapData,
  		session = {
  			mapId: mapId,
  			sessionStarted: true,
  			playerOnePosition: {x: x, y: y, z: 0},
  			playerTwoPosition: {x: x+0.4, y: y, z: 0},
  			hasVisitedDieHouse: (!!this.getSessionInMap(mapId)||{}).hasVisitedDieHouse,
  			hasKingDiceDisappeared: (!!this.getSessionInMap(mapId)||{}).hasKingDiceDisappeared
  		};
  		
  		//Remove duplicates (Alpha 1.3 bug)
  		for(var i = 0, a = []; i < md.length-1; i++)
  		  md[i].mapId != md[i+1].mapId && a.push(md[i]);
  		
  		md = a;
  		mdm.mapData = a;

  		//Reset session
  		for(var i = 0; i < md.length; i++) md[i].sessionStarted = false;
  		
  		for(var i = 0; i < md.length; i++) 
  		  if(md[i].mapId === mapId) {
  		  	md[i] = session;
  		  	return;
  		  }
  		//Pointer lost
  		mdm.mapData.push(session);
  	},
  	isSessionStarted: function(slot) {
  		for (var i = 0, s = b5.Game.SaveSlots['slot'+slot]; s && i < s.mapDataManager.mapData.length; i++) {
  			if (s.mapDataManager.currentMap == s.mapDataManager.mapData[i].mapId &&
				s.mapDataManager.mapData[i].sessionStarted) return !0;
  		}
  		return !1;
  	},
  	getSessionInMap: function(mapId) {
  		var md = b5.Game.SaveSlots.currentSaveSlot.mapDataManager.mapData;
  		for(var i = 0; i < md.length; i++) if(md[i].mapId === mapId) return md[i];
  		return null;
  	},
  	getDialoguerStates: function() {
  		return b5.Game.SaveSlots.DialoguerGlobalVariables.floats[0].float;
  	},
  	getPlayerInventory: function(player) {
  		return b5.Game.SaveSlots.currentSaveSlot.inventories[player];
  	},
  	getPlayerLoadouts: function(player) {
  		return b5.Game.SaveSlots.currentSaveSlot.loadouts[player];
  	},
  	getPlayerStatictics: function(player) {
  		return b5.Game.SaveSlots.currentSaveSlot.statictics[player];
  	},
  	getSlotCompletion: function(slot) {
  		var s = b5.Game.SaveSlots['slot'+slot],
  		e = 0,
  		lvls = 1 + 5 + 2 + 5 + 2 + 6 + 2 + 2, //tutorial,isle1,isle1run,isle2,isle2run,isle3,isle3run,isle4casino,isle4devil: 25
  		lvlsCompleted = 0,
  		totalItems = 0;
  		
  		//Get levels and completed ones
  		for(var i = 0, a = s.levelDataManager.levelObjects; i < a.length; i++) {
  			a[i].completed && lvlsCompleted++;
  			a[i].difficultyBeaten == 2 && lvlsCompleted++;
  		}
  		
  		totalItems = 6 + 3 + 6 + 42 + 2 + 1 + (lvls*2);
  		//Wpns, supers, charms, pacifist extra, piano extra, levels (extreme)
  		
  		//Count
  		e += s.inventories.playerOne._weapons.indexOf(
  			b5.Game.GameDefIDs.weapons["unused?"]) != -1 ? 
  			s.inventories.playerOne._weapons.length - 1 :
  			s.inventories.playerOne._weapons.length;
  		e += s.inventories.playerOne._supers.length;
  		e += s.inventories.playerOne._charms.length;
  		e += s.coinManager.coins.length;
  	  s.unlockedBlackAndWhite && s.unlocked2Strip && e++;
  		e += lvlsCompleted;
  		
  		//Percent
  		return e / totalItems;
  	}
  };
  
})();