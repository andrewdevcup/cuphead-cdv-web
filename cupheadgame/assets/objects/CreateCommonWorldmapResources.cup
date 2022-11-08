b5.export = function(world, scene, data, game) {
	var myexports = {};

	//Import resources for level
	var resources = JSON.parse(b5.File.readSync(b5.Paths.sceneRes + 'common_worldmap/resources.json'));

	game.parseResources(resources, scene);

	data.showTitleCard = function(type, text, titleText, options) {
		var g = type == "general",
		bg = new b5[g?"RectActor": "Actor"](),
		action = {
			main: null,
			onEnter: null,
			onExit: null
		};

		bg.setSize(1280, 720);
		bg.fit = b5.Actor.FitX;
		bg.fill_style = "#00000070";
		bg.tag = "TitleCard";
		if (!g) bg.bitmap = scene.findResource('TitleCardFader', 'bitmap');

		var card = new b5.Actor();
		action.main = bg;
		
		card.closeGuestEvt = scene.events.once("closetitlecard", evtdata => {
			if(game.Multiplayer.isGuest && !evtdata[1]) {
				action.onExit && action.onExit();
				action.onExit = null;
				card.close(evtdata[0]);
			}
		});

		card.close = function(off) {
			this.use_parent_opacity = true;
			bg.TweenToWithEnd('opacity', 0, 0.18, b5.Ease.linear, true, 0, e => {
				bg.destroy();
				game.Flags.pausingEnabled = !game.Multiplayer.isGuest;
				game.Flags.inSomeMenu = false;
				action.main = null;
			});
			
			b5.Game.UiButtons.hide(true);
			
			if(game.Multiplayer.isHost) {
				game.Multiplayer.sendToGuest("DISPATCH_EVENT",["closetitlecard",[1]]);
			}
			scene.events.dispatch('closetitlecard',[1, true]);
			
			off && scene.events.off(this.closeGuestEvt);
		}

		game.Flags.pausingEnabled = false;
		game.Flags.inSomeMenu = true;
		
		var r = function() {
			return b5.Maths.randomRange(0.95, 1, 05);
		}
		switch (type) {
			case "boss":
				card.bitmap = scene.findResource("TitleCardBossLevel", "bitmap");
				card.setSize(776, 568);

				//Boss name label
				var labelBName = new b5.LabelActor();
				labelBName.setTextFmt(text);
				labelBName.y = -193;
				labelBName.line_height = 55;
				labelBName._scale = 0.9;
				labelBName.font = scene.findResource('CupheadHenrietteFont', 'brush');
				card.addActor(labelBName);

				//-in- label
				var inLabel = new b5.Actor();
				inLabel.atlas = scene.findResource('TitleCardInAtlas', 'brush');
				inLabel.current_frame = data.Texts.title_card_in_frame;
				inLabel.y = -165;
				card.addActor(inLabel);

				//Level name label
				var labelMain = new b5.LabelActor();
				labelMain.setTextFmt(titleText);
				labelMain.y = -63;
				labelMain.line_height = 47;
				labelMain._scale = 2.1;
				labelMain.font = scene.findResource('CupheadPosterFont', 'brush');
				card.addActor(labelMain);

				//Difficulty selection label
				var diffSelL = new b5.LabelActor();
				diffSelL.font = scene_GUI.findResource('CupheadMemphisFont','brush');
				diffSelL.setTextFmt(data.Texts.difficulty_select);
				diffSelL.y = 84;
				diffSelL._scale = 0.6;
				card.addActor(diffSelL);

				//Buttons
				
				var simpleLabel,
				normalLabel,
				extremeLabel,
				diffLength = 0,
				tilde1_x = 0,
				tilde2_x = 0;
				
				options.simpleMode && diffLength++;
				options.normalMode && diffLength++;
				options.extremeMode && diffLength++;
				
				//Background
				//Button BG
				var btnBg = new b5.PolygonActor();
				btnBg.point_base = [
					[-r(),-r(),r(),-r(),r(),r(),-r(),r()],
					[-r(),-r(),r(),-r(),r(),r(),-r(),r()],
					[-r(),-r(),r(),-r(),r(),r(),-r(),r()]
				];
				btnBg.points = [-1,-1,1,-1,1,1,-1,1];
				btnBg.point_index = 0;
				btnBg.fill_style = "#c14710"
				btnBg.y = 0;
				btnBg.target = {x:0,y:0,w:10,h:10,scale_x:1,scale_y:1};
				card.addActor(btnBg);
				
				btnBg.updateSize = function() {
					var w = (this.target.w*this.target.scale_x*app.global_font_scale*1.15)/2,
					h = (this.target.h*this.target.scale_y);

					this._y = (this.target.y+2) - this.target.h/2;
					this._x = this.target.x;

					this.point_index >= this.point_base.length && (this.point_index = 0);

					for (var i = 0, m = [w, h, w, h, w, h, w, h]; i < this.points.length; i++) {
						this.points[i] = this.point_base[this.point_index][i] * m[i];
					}
				}

				btnBg.setInterval(k => {
					var _this = k.data;
					
					_this.updateSize();
					_this.point_index++;
				},1/12);
				
				//Texts (Difficulty)
				if(options.simpleMode) {
					simpleLabel = new b5.LabelActor();
					simpleLabel.font = diffSelL.font;
					simpleLabel.setTextFmt(data.Texts.d_simple);
					simpleLabel._scale = 0.75;
					simpleLabel.y = 130;
					simpleLabel.id = 0;
					simpleLabel.tag = "SelectBtn";
					simpleLabel.fill_style = "#575755";
					card.addActor(simpleLabel);
					
					simpleLabel.select = function(deselect) {
						if(deselect) {
							this.fill_style = "#575755";
							return;
						}
						btnBg.target = this;
						this.fill_style = "white";
						btnBg.updateSize();
					}
					
					simpleLabel.onTick = function() {
						//if(!options.extremeMode && options.normalMode)
					  	tilde1_x = this.x + ((this.w/2)*app.global_font_scale)+1;
					}
				}
				
				if(options.normalMode) {
					normalLabel = new b5.LabelActor();
					normalLabel.font = diffSelL.font;
					normalLabel.setTextFmt(data.Texts.d_regular);
					normalLabel._scale = 0.75;
					normalLabel.y = 130;
					normalLabel.id = 1;
					normalLabel.tag = "SelectBtn";
					normalLabel.fill_style = "#575755";
					card.addActor(normalLabel);
					
					//Update layout
					normalLabel.onTick = function() {
				  	if(options.simpleMode && !options.extremeMode) {
				  		this._x = (this.w/2) * app.global_font_scale * .78;
			  			simpleLabel._x = (-(this.w/2) - simpleLabel.w/2)*app.global_font_scale*0.58;
		  			}
		  			else if(options.extremeMode && !options.simpleMode) {
		  				this._x = (-(this.w/2) - this.w/2)*app.global_font_scale*0.54;
		  			}
		  			if(options.extremeMode && options.simpleMode)
		  			  tilde2_x = this.x + ((this.w/2)*app.global_font_scale)+1;
					}
					
					normalLabel.select = function(deselect) {
						if(deselect) {
							this.fill_style = "#575755";
							return;
						}
						btnBg.target = this;
						this.fill_style = "white";
						btnBg.updateSize();
					}
				}
				
				if(options.extremeMode) {
					extremeLabel = new b5.LabelActor();
					extremeLabel.font = diffSelL.font;
					extremeLabel.setTextFmt(data.Texts.d_extreme);
					extremeLabel._scale = 0.75;
					extremeLabel.y = 130;
					extremeLabel.id = 2;
					extremeLabel.tag = "SelectBtn";
					extremeLabel.fill_style = "#575755";
					card.addActor(extremeLabel);
					
					//Update layout
					extremeLabel.onTick = function() {
				  	if(options.simpleMode) {
				  		if(options.normalMode) {
				    		this._x = ((this.w/2) +(normalLabel.w/2)) * app.global_font_scale*1.02;
			  		  	simpleLabel._x = (-(normalLabel.w/2) - simpleLabel.w/2)*app.global_font_scale;
		  		  	}
		  		  	else {
		  	  			this._x = (this.w/2) * app.global_font_scale * .78;
			    			simpleLabel._x = (-(this.w/2) - simpleLabel.w/2)*app.global_font_scale*.58;
		    			}
				  	}
		  			else if(options.normalMode) {
		  				this._x = ((this.w/2) * app.global_font_scale);
		  			}
		  			
					}
					
					extremeLabel.select = function(deselect) {
						if(deselect) {
							this.fill_style = "#575755";
							return;
						}
						btnBg.target = this;
						this.fill_style = "white";
						btnBg.updateSize();
					}
				}
				
				//Tildes
				tilde1 = new b5.Actor();
				tilde1.atlas = inLabel.atlas;
				tilde1.current_frame = 8;
				card.addActor(tilde1);
				
				tilde2 = new b5.Actor();
				tilde2.atlas = inLabel.atlas;
				tilde2.current_frame = 8;
				card.addActor(tilde2);
				
				tilde1.y = tilde2.y = 118;
				
				tilde1.visible = diffLength > 1;
				tilde2.visible = diffLength > 2;
				
				tilde1.onTick = function() {
					this._x = tilde1_x;
					tilde2._x = tilde2_x;
				}
				
				//Select button on selected difficulty
				var selectedDiff = data.levelData.selectedDifficulty;
				selectedDiff == void 0 && (selectedDiff = data.levelData.selectedDifficulty = 1);
				
				var selectedBtn = card.findActorById(selectedDiff);
				
				//If no difficulty button is available, select the one with higher difficulty
				if(!selectedBtn) switch(true) {
					case extremeLabel != void	0: selectedBtn = extremeLabel; break;
					case normalLabel != void 0: selectedBtn = normalLabel; break;
					case simpleLabel != void 0: selectedBtn = simpleLabel;
				}
				
				selectedBtn.select();
				
				var selects = card.findActorsByTagName('SelectBtn'),
				current_sel = selects.indexOf(selectedBtn),
				prev_sel = current_sel,
				p_axis = 0;
				
				//Input
				card.setInterval(k => {
					var axis_x = Math.round(game.Input.player1.axis_x || game.Input.player2.axis_x);
					
					if(p_axis != axis_x && (p_axis = axis_x, axis_x != 0)) {
						
						current_sel += axis_x;
						current_sel = b5.Maths.cap(current_sel,0,selects.length-1);
						
						for(var i = 0; i < selects.length; i++)
						  selects[i].select(selects[current_sel] != selects[i]);
						  
						prev_sel != current_sel && scene.findResource('DifficultySettingsHoverSfx','sound').play();
						
						prev_sel = current_sel;
						
						//Set global difficulty selection
						data.levelData.selectedDifficulty = selects[current_sel].id;
					}
				},0);
				
				
				//Legal line
				
				var legal = new b5.Actor();
				legal.bitmap = scene.findResource('TitleCardLegalLineBitmap','bitmap');
				legal.setSize(404,80);
				legal.y = 195;
				card.addActor(legal);

				break;
			default:
				card.bitmap = scene.findResource('TitleCardGeneralArea', 'bitmap');
				card.setSize(540, 300);

				//Label
				var labelMain = new b5.LabelActor();
				labelMain.setTextFmt(text);
				labelMain.y = text.split('\n').length == 1 ? -30 : -60;
				labelMain.line_height = 55;
				labelMain._scale = 1.15;
			  labelMain.name = "TitleCardGeneralLabelMain";
				labelMain.font = scene.findResource('CupheadHenrietteFont', 'brush');
				card.addActor(labelMain);

				//Button
				let labelBtn = new b5.LabelActor();
				labelBtn.setTextFmt(data.Texts.enter);
				labelBtn.layer = 2;
				labelBtn.letter_spacing = 7;
				labelBtn.y = 72;
				labelBtn._scale = 0.76;
				labelBtn.font = scene_GUI.findResource('CupheadMemphisFont', 'brush');
				card.addActor(labelBtn);

				//Button BG
				var btnBg = new b5.PolygonActor();
				btnBg.point_base = [
					[-r(),-r(),r(),-r(),r(),r(),-r(),r()],
					[-r(),-r(),r(),-r(),r(),r(),-r(),r()],
					[-r(),-r(),r(),-r(),r(),r(),-r(),r()]
				];
				btnBg.points = [-1,-1,1,-1,1,1,-1,1];
				btnBg.point_index = 0;
				btnBg.fill_style = "#c14710"
				btnBg.y = labelBtn.y;
				card.addActor(btnBg);

				btnBg.setInterval(k => {
					var _this = k.data,
					w = (labelBtn.w*labelBtn.scale_x*app.global_font_scale*1.22)/2,
					h = (labelBtn.h*labelBtn.scale_y);

					_this._y = (labelBtn.y+2) - labelBtn.h/2;

					_this.point_index >= _this.point_base.length && (_this.point_index = 0);

					for (var i = 0, m = [w, h, w, h, w, h, w, h]; i < _this.points.length; i++) {
						_this.points[i] = _this.point_base[_this.point_index][i] * m[i];
					}
					_this.point_index++;
				},1/12);

			}

			//Update
			card.onTick = function() {
				var input = game.Input,
				btnA = input.player1.A || input.player2.A,
				btnB = input.player1.B || input.player2.B;

				if (!btnA && !btnB && !card.enabled) card.enabled = true;

				if (card.enabled && btnA && !card.btnA) {
						card.btnA = true;
				  	card.btnB = true;
						!game.Multiplayer.isGuest && action.onEnter && action.onEnter(data.levelData.selectedDifficulty);
				}

				if (card.enabled && btnB && !card.btnB) {
			  		card.btnB = true;
				  	card.btnA = true;
						action.onExit && action.onExit();
						card.close();
				}
			}

			scene.findResource('DifficultySettingsAppearSfx', 'sound').play();
			scene.findResource('LevelMenuUpSfx', 'sound').play();

			card._scale = 0;

			bg.addActor(card);
			bg.opacity = 0;

			bg.TweenTo('opacity', 1, 0.25);
			
			b5.Game.UiButtons.setButtons([
				{
					"text": "texts.ui_confirm",
					"actionButton": "jump"
				},
				{
					"text": "texts.general_back",
					"actionButton": "shoot"
				}
			]);
			b5.Game.UiButtons.show(true);

			bg.onDraw = function() {
				scene.BLUR_MULTIPLIER = this.opacity;
			}

			app.events.once('loadingscreenin', e => {
				bg._av = false;
				scene.BLUR_MULTIPLIER = 0;
				bg.destroy();
			});

			card.TweenTo('_scale', 1, 0.45, b5.Ease.backout);
			card.use_parent_opacity = false;

			bg.layer = 5;
			scene_GUI.addActor(bg);

			return action;
		}

		return myexports;
	};