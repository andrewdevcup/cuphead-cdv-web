(function() {
	b5.Game.Texts = {
		texts: {},
		textObjects: []
	};
	b5.Game.addTextObject = function(labelActor) {
		this.Texts.textObjects.push(labelActor);
		labelActor.updateText = null;
	};
	b5.Game.updateTextObjects = function() {
		for(var i = 0, o = this.Texts.textObjects; i < o.length; i++)
		  o[i].updateText();
	};
	b5.Game.removeTextObject = function(actor) {
		for(var i = 0, a = this.Texts.textObjects, b = []; i < a.length; i++)
		  actor !== a[i] && b.push(a[i]);
		this.Texts.textObjects = b;
	};
	b5.Game.setLanguage = function(lang,auto) {
		var txts;
		
		lang == "*" && (lang = b5.Utils.GetLanguage().language);
		txtRaw = new b5.Raw('texts',b5.Paths.texts+lang+'.json',true, raw => {
			txts = raw;
			b5.Game.cfg.Language.lang = lang;
		},true);
			
		//Load default EN language if local language isn't present
		if(!txts) new b5.Raw('texts',b5.Paths.texts+'en.json',true, raw => {
			txts = raw;
			b5.Game.cfg.Language.lang = 'en';
			console.log('Could not find localization for '+lang+'. Using default (en-US)');
		},true);
			
		this.Texts.texts = JSON.secParse(txts);
		
	};
})();