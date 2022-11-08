(function() {
	var confirmDlg = new b5.Actor(),
	confBG = new b5.RectActor(),
	confirmCard = new b5.Actor(),
	cardWText = new b5.LabelActor(),
	cardEText = new b5.LabelActor(),
	cardSText = new b5.LabelActor();
	
	scene_GUI.addActor(confirmDlg);
	confirmDlg._layer = 4;
	
	confirmDlg.addActor(confBG);
	confirmDlg.addActor(confirmCard);
	
	confirmCard.addActor(cardWText);
	confirmCard.addActor(cardEText);
	confirmCard.addActor(cardSText);
	
	cardWText.font = scene_GUI.findResource('CupheadVogueBoldFont','brush');
	cardEText.font = scene_GUI.findResource('CupheadVogueExtraBoldFont','brush');
	cardSText.font = cardEText.font;
	
	cardWText.fill_style = b5.Game.Styles.text_pausemenu;
	cardWText.line_height = 46;
	cardWText._y = -70;
	cardWText._scale = 0.8;
	
	cardEText.fill_style = "black";
	cardEText._y = 8;
	cardEText._scale = 0.8;
	
	cardSText.fill_style = b5.Game.Styles.text_warning_unselected;
	cardSText._scale = 0.8;
	cardSText._y = 55;
	cardSText.line_height = 45;
	
	confBG.fill_style = "black";
	confBG.opacity = 0.5;
	confBG.setSize(scene_GUI.w,scene_GUI.h);
	confBG.fit = b5.Actor.FitSize;
	
	b5.Game.parseResources({
		bitmap:[{
			name: "SlotWarningCardBitmap",
			src: "slot_warning_bg_cropped.png"
		}]
	}, scene_GUI);
	
	confirmCard.bitmap = scene_GUI.findResource('SlotWarningCardBitmap','bitmap');
	confirmCard.setSize(440,265);
	
	cardSText.sel = 1;
	cardSText.input = 'player1';
	cardSText.resetH = function() {
		this.btnA = this.btnB = this.axis_y = true;
	}
	cardSText.resetH();
	cardSText.onTick = function() {
		var input = b5.Game.Input,
		btnA = input[this.input].A,
		btnB = input[this.input].B,
		axis_y = Math.round(input[this.input].axis_y);
		
		//Move selection
		if(axis_y != 0 && !this.axis_y) {
			this.axis_y = true;
			
			this.sel += axis_y;
			if(this.sel < 0) this.sel = 1;
			else if(this.sel > 1) this.sel = 0;
			b5.Game.PauseMenu.playSfx();
		}
		else if(!axis_y) this.axis_y = false;
		
		//Select
		if(btnA && !this.btnA) {
			this.btnA = true;
			
			confirmDlg.onselect(this.sel);
			b5.Game.PauseMenu.playSfx();
		}
		else if(!btnA) this.btnA = false;
		
		//Back
		if(btnB && !this.btnB) {
			this.btnB = true;
			
			confirmDlg.onselect(1);
			b5.Game.PauseMenu.playSfx();
		}
		else if(!btnB) this.btnB = false;
		
		this.setFormatLine(this.sel, 0, 0, [b5.Game.Styles.text_pausemenu_selected], true);
	}
	
	confirmDlg.show = function(text, empText, yesText, noText) {
		this._av = true;
		cardWText.clearFormat();
		cardWText.setTextFmt(text);
		cardEText.text = empText;
		cardSText.text = yesText + '\n' + noText;
		cardSText.sel = 1;
		cardSText.resetH();
	}
	confirmDlg.close = function() {
		this._av = false;
	}
	confirmDlg.close();
	
	b5.Game.Confirm = function(text, empText, yesText, noText, inputPlyr) {
		confirmDlg.show(text, empText, yesText, noText);
		cardSText.input = inputPlyr || 'player1'; //Which input can select
		return new Promise( (yes, no) => {
			confirmDlg.onselect = s => {
				if(s == 0) yes && yes();
				else no && no();
				
				confirmDlg.close();
			}
		});
	}
	
})();