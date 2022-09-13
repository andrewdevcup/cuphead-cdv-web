return function(thisPlayer, flags, input, world, scene, game, data) {
	//Setup local variables here
	//This function will be called when player is first created
	//For executing actions when loading screen is being hidden,
	//add the method thisPlayer.onLoadingScreenOut = function(){...}
	//var myvar = flags.jumping
	
	var ols = null,
	glyph = null;
	
	//On npc focus, instead of showing the glyph on the npc, show
	//over the player's head and play a sound
	
	thisPlayer.onNpcFocus = function() {
		glyph = data.showNpcGlyph(this,'');
	};
	thisPlayer.onNpcBlur = function(npc) {
		glyph && glyph.hide(!npc.interacting);
	}
	
	return function(thisPlayer, flags, input, world, scene, game, data) {
		//This is a loop function
		//It will be called consecutively when loadingScreenOut
    
    //Map hitbox it's a single hitbox, the player itself, so use that instead.
    
    ols = thisPlayer.A_overlaps; //thisPlayer.findOverlaps(thisPlayer.parent);
    flags.inWood = false;
    for(var i = 0; i < ols.length; i++) {
    	if(ols[i].tags.indexOf("NPC") !== -1) {
    		ols[i].player_focus = true;
    		ols[i].player = thisPlayer.name;
    	}
    	
    	if(ols[i].tags.indexOf('TopDeco') !== -1 ||
    	   ols[i].tags.indexOf('player') !== -1) {
    		if(thisPlayer.layer != ols[i].layer && thisPlayer.y >= ols[i].y) {
    			thisPlayer.layer = ols[i].layer;
    			thisPlayer.bringToFront();
    		}
    		else if(thisPlayer.y < ols[i].y && thisPlayer.layer != data[thisPlayer.name].sub_layer) {
    			thisPlayer.layer = data[thisPlayer.name].sub_layer;
    			thisPlayer.parent.order_changed = true;
    		}
    	}
    	
    	if(!flags.inWood && ols[i].tags.indexOf('Wood') !== -1) {
    		flags.inWood = true;
    	}
    }
    
	};
};