/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

 window.onerror = function(e,t,o,a,n) {
 alert(e+','+t+','+o+','+a+','+n)
 }
 
 promptAsync = function(subtitle, text) {
	 if(document.getElementById('PromptBG')) return;
	 
	 var bg = document.createElement('div'),
	 bgs = bg.style;
	
	 bg.id = 'PromptBG';
	
	 bgs.width = self.innerWidth + 'px';
	 bgs.height = self.innerHeight + 'px';
	 bgs.position = 'absolute';
	 bgs.display = 'flex';
	 bgs.justifyContent = 'center';
	 bgs.alignItems = 'center';
	 bgs.zIndex = 90;
	 
	 var mbg = document.createElement('div'),
	 mbgs = mbg.style;
	 
	 mbgs.backgroundColor = 'rgb(49 49 49)';
	 mbgs.width = '75%';
	 mbgs.height = '65%';
	 mbgs.borderRadius = '5%';
	 bg.appendChild(mbg);
	 
	 mbg.animate([{transform:'scale(0)',easing:'cubic-bezier(.36,1.59,.86,.95)'},{transform:'scale(1)'}],300);
	
	 document.body.appendChild(bg);
	
 }
 
 /* Queue system */
 ResourceQueue = function() {},
 ResourceQueue.in_queue = [],
 ResourceQueue.results = [],
 ResourceQueue._processing = !1,
 ResourceQueue.ended = !0,
 ResourceQueue.add = function(e) {
 	ResourceQueue.in_queue.push(e);
 },
 ResourceQueue.load = function() {
 	ResourceQueue.ended && (ResourceQueue.results = []);
 	if (!ResourceQueue._processing) {
 		var e = ResourceQueue.in_queue,
 		t = e[0];
 		ResourceQueue._processing = !0;
 		ResourceQueue.ended = !1;
 		t.onload = function(o, a) {
 			var n = ResourceQueue;
 			n._processing = !1;
 			n.in_queue.shift();
 			n.results.push(a != undefined ? a: true);
 			this.onerror && (this.onerror = null),
 			n.in_queue.length > 0 ? (n._processing = !1, n.load(), n.onupdate && n.onupdate(o, a)): (n.onload && n.onload(n.results), n.ended = !0);
 		},
 		t.onerror = function() {
 			this.onload(this, !1)
 		};
 		t.load ? t.load(): t.onerror();
 	}
 },
 ResourceQueue.onload = null,
 ResourceQueue.onupdate = null;

document.addEventListener('deviceready', onDeviceReady, !1);

  window.element = function(type, prop, text, style, dest, append) {
	var e = type.search(/body|head/i) == -1 && document.createElement(type);
	!prop && (prop = {}),
	!style && (style = {});
	text && (e.innerText = text);
	for (var i in prop) e[i] = prop[i];
	for (var i in style) e.style[i] = style[i];
	dest && ( append && (document[dest].appendChild(e), e.outerHTML += '\n'), e.element_dest = dest);
	e.load = !e.load && function() {
		var t = this.element_dest;
		t && document[t].appendChild(this);
     	this.load = null;
	};
	return e;
  };

function onDeviceReady() {

	DebugBuild = true;

	//Add your HTML Elements
	internalDir =  "";
	
	if(window.cordova) {
		appResDir = cordova.file.externalDataDirectory || cordova.file.dataDirectory;
		switch(cordova.platformId) {
			case 'android': 
				internalDir = window.DebugBuild ? '/sdcard/CupheadGame/' : cordova.file.applicationDirectory+'cupheadgame/'
			break;
			default:
				internalDir = cordova.file.applicationDirectory+'cupheadgame/';
		}
	}
	else {
		appResDir = '/';
		internalDir = '/';
	}

	element('canvas', {
		id: 'gamecanvas', width: 1280, height: 720
	}, null, {
		position: 'absolute'
	}, 'body', !0);
	
	//Setup scripts

	var LoadScripts = function() {
	  loadList = JSON.parse((function() {
	    var x = new XMLHttpRequest;
	    x.open('GET', internalDir + 'main.json',!1);
	    x.send();
	    return x.response;
	  })());

	  for(var i = 0; i < loadList.load.length; i++) {
	    var el = element('script', {
	      src: loadList.load[i].replace('%internalDir%',internalDir).replace('%sdcard%','/sdcard/')
	    }, null, null, 'head');
	    ResourceQueue.add(el);
	  }
	  ResourceQueue.onload = function(){b5.onload()};
      ResourceQueue.load();

	}

	_initConsole();

    var permissions = cordova.plugins.permissions;
    if(permissions) permissions.checkPermission(permissions.WRITE_EXTERNAL_STORAGE, function(status) {
      if(status.hasPermission) LoadScripts();
        else permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, LoadScripts, function(err) {
          throw err
        });
    }, function(err) {
      throw err
    });
}



/*************************************************************************************************************/