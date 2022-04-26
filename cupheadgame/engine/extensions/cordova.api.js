/*
*
*
* Script to patch Cordova APIs to Booty5
* 
* Note: It was an actual nightmare to get the File API working, thanks to the undocumented actual way to locate file URLs
* 
*/
try{b5}catch(e){b5={}}

b5.Cordova = {
	file: !!(window.cordova && window.cordova.file),
	orientation: !!(screen.lockOrientation && screen.unlockOrientation),
	statusbar: !!window.StatusBar,
	fullscreen: !!window.AndroidFullScreen
};
/*
*
* FileSystem
*
*/
b5.File = {
	resolve: b5.Cordova.file && function(path,file,o) {
		var e = path.replace('file://','').replace('/storage/emulated/0/','/sdcard/'),
		t = "", n = {isFile:false, isDir:false};
	  resolveLocalFileSystemURL('cdvfile://localhost' + (!e.startsWith('/') ? '/'+e : e) + (!e.endsWith('/')? "/" : ''), dirFS => {
	  	o.type == "file" && dirFS.getFile(file, { create: o.create||false, exclusive: false }, fileEntry => {
	  		n.isFile = fileEntry.isFile;
        if(o.remove) { fileEntry.remove(o.onload, o.onerror); return}
        else if(o.write) {
        	fileEntry.createWriter(fileWriter => {
        	  o.pointerpos != null && fileWriter.seek(o.pointerpos);
        	  fileWriter.onwrite = ()=>{o.onload()};
        	  fileWriter.onerror = ()=>{o.onerror()};
        	  fileWriter.write(o.data);
          },o.onerror);
          return;
        }
        else if(o.copy || o.move) {
        	var r = o.to.path.lastIndexOf('/'),
        	i = o.to.path.substr(0,r),
        	s = i.substr(0,i.lastIndexOf('/')+1);
        	
        	i = i.substr(i.lastIndexOf('/')+1);
        	var c = new DirectoryEntry(i, s.replace(/sdcard\/|storage\/emulated\/0\/|file:\/\/\//g,'/').replace(/\/\//g,'/') + i, fileEntry.filesystem);
         	fileEntry[o.copy ? 'copyTo' : o.move && 'moveTo'](c, o.to.name, o.onload, o.onerror);
          return;
        }
        else if(o.read) {
        	fileEntry.file(function(r) {
        		var i = new FileReader();
        		i.readAsText(r);
        		i.onload = function() {
        			o.onload(i._result);
        		}
        	},o.onerror);
        	return;
        }
      },o.onerror);
      
      o.type == "dir" && dirFS.getDirectory(file, { create: o.create||false, exclusive: false }, dirEntry => {
      	n.isDir = dirEntry.isDirectory;
      	if(o.create) { o.onload(); return}
    	  if(o.remove) { dirEntry.remove(o.onload, o.onerror); return}
    	  else if(o.copy || o.move) {
        	var r = o.to.path.lastIndexOf('/'),
        	i = o.to.path.substr(0,r),
        	s = i.substr(0,i.lastIndexOf('/')+1);
        	
        	i = i.substr(i.lastIndexOf('/')+1);
        	var c = new DirectoryEntry(i, s.replace('file:///storage/emulated/0','') + i, dirEntry.filesystem);
        	c.nativeURL = c.toURL().replace('cdvfile://localhost/sdcard/','');
         	dirEntry[o.copy ? 'copyTo' : o.move && 'moveTo'](c, o.to.name, o.onload, o.onerror);
          return;
        }
      },o.onerror);
      
    },o.onerror);
	}
};
b5.File.readSync = function(file) {
    //Browser compatibility
  if(!file.startsWith('filesystem:')) {
    var r = new XMLHttpRequest(), e = !0, t = !0;
    r.open('GET',file, !1);
    try{r.send()}catch(o){e=!1}
   // b5.Cordova.file && !b5.File.isDir(file) && (t = !1);
    return (e || r.status === 200) && t && r.response.indexOf("onHasParentDirectory();")==-1 ? r.response : "";
  }
  else return localStorage.getItem(file);
},
b5.File.read = function(file) {
  var n = { onload: null, onerror: null };
	if( b5.Cordova.file && !file.startsWith('filesystem:')) {
		var e = file.lastIndexOf('/')+1,
		t = file.substr(0,e),
		o = file.substr(e);
		b5.File.resolve(t, o, {type: "file", read: true, onload: (r)=>{n.onload && n.onload(r)}, onerror: (r)=>{n.onerror && n.onerror(r)}});
	}
	else {
		localStorage.getItem(file);
	}
	return n;
},
b5.File.write = function(file, text, add, pos) {
	var n = { onwrite: null, onerror: null };
	if( b5.Cordova.file && !file.startsWith('filesystem:')) {
		var e = file.lastIndexOf('/')+1,
		t = file.substr(0,e),
		o = file.substr(e),
		a = function() {
			b5.File.resolve(t, o, {create: true, write: true, data:text, pointerpos:pos, type:"file", onload: (r)=>{n.onwrite && n.onwrite(r)}, onerror: (r)=>{n.onerror && n.onerror(r)}});
		};
		b5.File.resolve && (
			add ? a()
			: (
				b5.File.resolve(t, o, {remove: true}),
				a()
			)
		);
	}
	else {
		//Write to persistent storage instead
		localStorage.setItem(file, text);
		setTimeout(a => n.onwrite && n.onwrite(),10);
	}
	return n;
},
b5.File.extractAsset = function(internalFile,externalFile, onwrite) {
	var f = b5.File.readSync(internalFile);
	b5.File.write(externalFile, f).onwrite = function() {
		onwrite && onwrite();
	};
},
//Only for external file system, contents inside apk/ipa/exe can't be copied/moved
b5.File.copy = function(src,dest) {
	var n = { oncopy: null, onerror: null };
	if( b5.Cordova.file ) {
		var e = src.lastIndexOf('/')+1,
		t = src.substr(0,e),
		o = src.substr(e),
		a = dest.lastIndexOf('/')+1,
		i = dest.substr(0,a),
		r = dest.substr(a);
		b5.File.resolve(t, o, {type:'file', copy: true, to:{path:i, name:r}, onload: (r)=>{n.oncopy && n.oncopy(r)}, onerror: (r)=>{n.onerror && n.onerror(r)}});
		return n;
	}
},
b5.File.copyDir = function(src,dest) {
	var n = { oncopy: null, onerror: null };
	if( b5.Cordova.file ) {
		dest.endsWith('/') && (dest = dest.substr(0,dest.length-1))
		var e = src.lastIndexOf('/')+1,
		t = src.substr(0,e),
		o = src.substr(e),
		a = dest.lastIndexOf('/')+1,
		i = dest.substr(0,a),
		r = dest.substr(a);
		b5.File.resolve(t, o, {type:'dir', copy: true, to:{path:i, name:r}, onload: (r)=>{n.oncopy && n.oncopy(r)}, onerror: (r)=>{n.onerror && n.onerror(r)}});
		return n;
	}
},
b5.File.createDir = function(dir) {
	var n = { oncreate: null, onerror: null };
	if( b5.Cordova.file && !dir.startsWith('filesystem:') ) {
		var e = dir.lastIndexOf('/')+1,
		t = dir.substr(0,e),
		o = dir.substr(e);
		b5.File.resolve(t, o, {create: true, type: "dir", onload: (r)=>{n.oncreate && n.oncreate(r)}, onerror: (r)=>{n.onerror && n.onerror(r)}});
	}
	return setTimeout(a => n.oncreate && n.oncreate(),10), n;
},
b5.File.delete = function(type, entry) {
	var n = { ondelete: null, onerror: null };
	if( b5.Cordova.file && !file.startsWith('filesystem:') ) {
		var e = entry.lastIndexOf('/')+1,
		t = entry.substr(0,e),
		o = entry.substr(e);
		b5.File.resolve(t, o, {remove: true, type: type, onload: (r)=>{n.ondelete && n.ondelete(r)}, onerror: (r)=>{n.onerror && n.onerror(r)}});
	}
	else {
		localStorage.removeItem(null, entry);
	}
	return n;
},
b5.File.exists = function(entry) {
	//Browser compatibility
	if(!entry.startsWith('filesystem:')) {
		var r = new XMLHttpRequest(),
		e = !0;
		r.open('GET',entry,!1);
		try{r.send()}catch(o){ e = !1}
		return (e || r.status === 200) && r.response != "";
	}
	else return localStorage.getItem(entry) !== null;
},
b5.File.isFile = function(entry) {
  var r = new XMLHttpRequest(), e = !0;
  r.open('GET',entry, !1);
  try{r.send()}catch(o){e=!1}
	return e ? r.indexOf("onHasParentDirectory();") == -1 : e;
},
b5.File.isDir = function(entry) {
	var r = new XMLHttpRequest(), e = !0;
  r.open('GET',entry, !1);
  try{r.send()}catch(o){e=!1}
	return e ? r.indexOf("onHasParentDirectory();") != -1 : e;
},
b5.File.listDir = function(dir, filter) {
	//This will only work in Cordova
	//In browsers, it just gives the type: 'Is a directory'
	var r = new XMLHttpRequest();
	r.open('HEAD',dir,!1);
	try{r.send()}catch(o){}
	//Split
	var e = r.response.replace(/<script>/g,"").split('</script>');
	for(var i=0, t=[];i<e.length;i++) 
		if(e[i].indexOf('addRow')>-1) {
			var o = e[i].substr(9, e[i].indexOf('","')-9);
			(o.indexOf(filter) > -1 || filter === undefined) && t.push(o);
		}
	return t;
};

/*
*
* ScreenOrientation
*
*/
b5.Cordova.orientation ? b5.Utils.SetOrientation = function(e) {
	e ? screen.lockOrientation(e) : screen.unlockOrientation();
} : b5.Utils.SetOrientation = function(e) {
	try{e ? screen.orientation.lock('landscape') : screen.orientation.unlock()}
	catch(e) { console.warn(e) }
}

/*
*
* StatusBar
*
*/
b5.Cordova.statusbar && (b5.Utils.SetFullscreen = function(e,t) {
	if(e) {
		if(cordova.platformId == "android") b5.Cordova.fullscreen && AndroidFullScreen.immersiveMode();
		else if(cordova.platformId != "browser") StatusBar.hide();
		else try{document.documentElement.requestFullscreen()}catch(e){console.warn(e)}
	}
	else {
		if(cordova.platformId == "android") b5.Cordova.fullscreen && AndroidFullScreen.resetScreen();
		else if(cordova.platformId != "browser") StatusBar.show();
		else try{document.exitFullscreen()}catch(e){console.log(e)}
	}
});


/*
*
* ENGINE PATCH FOR CORDOVA-BROWSER / ELECTRON
*
*/

b5.Utils.loadRAW = function(e, t, o, a) {
  if(e.startsWith('filesystem:')) return o(localStorage.getItem(e)), !0;
  var n = new XMLHttpRequest;
  n.open('GET', e, t),
  e.endsWith('.json') && n.overrideMimeType('application/json'),
  a && (n.responseType = 'arraybuffer'),
  n.onload = r => o(n.response);
  n.onerror = r => o(null);
  try {
    n.send()}catch(t) {
    return!1
  }
  return !0
}