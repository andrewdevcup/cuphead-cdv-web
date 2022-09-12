(function() {
	var voguefont = new b5.ImageAtlas('CupheadVogueExtraBoldFont', [
		new b5.Bitmap('CupheadVogue-ExtraBold-Bitmap0', b5.Paths.fonts + 'CupheadVogue-ExtraBold-merged-0.png'),
		new b5.Bitmap("CupheadVogue-ExtraBold-Bitmap1", b5.Paths.fonts + 'CupheadVogue-ExtraBold-merged-1.png')
	]);
	voguefont.parseFrames(b5.File.readSync(b5.Paths.fonts + 'CupheadVogue-ExtraBold-merged.bft'));

	var memphisfont = new	b5.ImageAtlas('CupheadMemphisFont', [
		new b5.Bitmap("CupheadMemphisFontBitmap0", b5.Paths.fonts + 'CupheadMemphis-Medium-merged-0.png'),
		new b5.Bitmap("CupheadMemphisFontBitmap1", b5.Paths.fonts + 'CupheadMemphis-Medium-merged-1.png')
	]);
	memphisfont.parseFrames(b5.File.readSync(b5.Paths.fonts + 'CupheadMemphis-Medium-merged.bft'));

	//Load Bold font
	var voguefont_bold = new b5.ImageAtlas('CupheadVogueBoldFont', [
		scene_GUI.addResource(new b5.Bitmap('CupheadVogueBold', b5.Paths.fonts + 'CupheadVogue-Bold-merged-0.png'), 'bitmap')
	]);
	voguefont_bold.parseFrames(b5.File.readSync(b5.Paths.fonts + 'CupheadVogue-Bold-merged.bft'));

	scene_GUI.addResource(voguefont_bold, 'brush');
	scene_GUI.addResource(voguefont, 'brush');
	scene_GUI.addResource(memphisfont, 'brush');
})();