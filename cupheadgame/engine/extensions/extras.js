//Useful mrthods
//Clear empty spaces in arrays
Array.prototype.clean = function() {
	for (var i = 0, e = []; i < this.length; i++)
		this[i] && e.push(this[i]);
	return e;
};

//From String.prototype
Array.prototype.search = function(regExpArr) {
	for (var i = 0; i < regExpArr.length; i++) {
		var a = this.indexOf(regExpArr[i]);
		if (a != -1) return a;
	}
	return -1;
};

String.prototype.indexesOf = function(n) {
	n = String(n);
	for (var i = 0, s = this, a = 0, p = 0, c = []; a !== -1;) {
		a = s.indexOf(n);
		s = s.substr(a+n.length);
		c.push(a + p);
		p += a+n.length;
	}
	return c.pop(),
	c;
};

String.prototype.capitalize = function(t){if("number"==typeof t&&t>=0){var e=[this.slice(0,t),this.slice(t,t+1),this.slice(t+1)];return e[0]+(e[1]?e[1].toUpperCase():"")+e[2]}var n=this.split(" ");return(n=n.map((function(t){return t.length>0?t[0].toUpperCase()+t.slice(1):""}))).join(" ")}

//Similar to linux: Fill integer value with zeros for a specified unit
Number.prototype.zfill = function(s) {
	return String(this).padStart(s, "0");
};

//Recommended to have anywhere
parseValue = function(e) {
	return !isNaN(+e) ? +e :
	e == "true" ? true :
	e == "false" ? false :
	e == void 0 ? void 0 :
	(e.startsWith('{') && e.endsWith('}')) ? JSON.parse(e) :
	e.indexOf('function ') == 0 ? Function('return '+e)() :
	e;
}

Object.clone = function(e) {
	var n = {};
	for(var i in e) n[i] = e[i];
	return n;
}

Math.round10 = function(n) {
	return Math.round(n*10)/10;
};
Math.round1000 = function(n) {
	return Math.round(n*1000)/1000;
};

//Fract like in glsl
Math.fract = function(n) {
	return n - Math.trunc(n);
};

//Percentage of a number between min and max
Math.perc = function(n, min, max) {
	return (n-min) / (max-min);
}

JSON.parse2 = JSON.parse;
JSON.secParse = function(o) {
	try {
		return JSON.parse2(o)
	}
	catch(e) {
		var f = function JSONError() {
			this.message = e.message;
			this.stack = e.stack;
		}
		console.log(new	f);
		return {}
	}
}
JSON.parse = JSON.secParse;

//This should be built-in
ArrayBuffer.detach = function(a) {
	try{postMessage("","",[a])}catch(e){}
}

//Fix fetch if File plugin is installed

self._fetch = self.fetch;

self.fetch = function(url, options) {
	return new Promise((re, rj) => {
		const r = new XMLHttpRequest();
		re({
			url: url,
			status: 200,
			statusText: 'OK',
			ok: true,
			arrayBuffer: f => {
				return new Promise((a, m) => {
					r.open('GET', url, !0),
					r.responseType = 'arraybuffer';
					r.onload = e => a(r.response), r.onerror = e => m(e);
					r.send();
				});
			},
			text: f => {
				return new Promise((a, m) => {
					r.open('GET', url, !0),
					r.responseType = 'text';
				  r.onload = e => a(r.response), r.onerror = e => m(e);
					r.send();
				});
			},
			blob: f => {
				return new Promise((a, m) => {
					r.open('GET', url, !0),
					r.responseType = 'arraybuffer',
					r.onload = e => {
						a(new Blob([r.response]));
						ArrayBuffer.detach(r.response);
					}, r.onerror = e => m(e);
					r.send();
				});
			},
			blob2: f => {
				return new Promise((a, m) => {
					r.open('GET', url, !0),
					r.responseType = 'blob';
					r.onload = e => a(r.response), r.onerror = e => m(e);
					r.send();
				});
			},
			json: f => {
				return new Promise((a, m) => {
					r.open('GET', url, !0), 
					r.responseType = 'json';
					r.onload = e => a(r.response), r.onerror = m;
					r.send();
				});
			}
		});
	});
}

//Better prompt
promptAsync = function(subtitle, text, options) {
	if(document.getElementById('PromptBG')) document.getElementById('PromptBG').remove();
	
	  !options && (options = {});
	   var nw = innerWidth > innerHeight ? innerHeight * 1.2 : innerWidth,
	   nh = innerHeight > innerWidth ? innerWidth : innerHeight;
	
     var bg = document.createElement('div'),
     bgs = bg.style;
    
     bg.id = 'PromptBG';
    
     bgs.width = self.innerWidth + 'px';
     bgs.height = self.innerHeight + 'px';
     bgs.position = 'absolute';
     bgs.display = 'flex';
     bgs.justifyContent = 'center';
     bgs.alignItems = 'center';
     bgs.zIndex = 99
     
     var mbg = document.createElement('div'),
     mbgs = mbg.style;
     
     mbgs.backgroundColor = 'rgb(49 49 49)';
     mbgs.width = (nw * 0.9) + 'px';
     mbgs.height = (nh * .54) + 'px';
     mbgs.borderRadius = '5%';
     mbgs.display = 'flex';
     mbgs.justifyContent = 'start';
     mbgs.alignItems = "center";
     mbgs.flexDirection = 'column';
     bg.appendChild(mbg);
     
     var stxt = document.createElement('text'),
     stxts = stxt.style;
     stxt.textContent = subtitle;
     stxts.color = "#bbbbbb";
     stxts.zoom = 1.3;
     stxts.font = '';
     stxts.paddingTop = "3%";
     stxts.paddingLeft = "2%";
     stxts.paddingRight = "2%";
     mbg.appendChild(stxt);
     
     var ta = document.createElement('textarea'),
     tas = ta.style;
     
     ta.value = text !== void 0 ? String(text) : "";
     
     tas.backgroundColor = "transparent";
     tas.marginTop = "3%";
     tas.width = '95%';
     tas.height = '35%';
     tas.color = "white";
     mbg.appendChild(ta);
     
     var btnCancel = document.createElement('text'),
     btncs = btnCancel.style;
     
     btncs.font = '';
     btncs.zoom = 2.2;
     btncs.marginLeft = "-25%";
     btncs.marginTop = "1%";
     btncs.color = "#589693";
     btnCancel.textContent = (options.cancel || "Cancel") + ". . . . .";
     mbg.appendChild(btnCancel);
     
     btnCancel.onpointerdown = a => btnCancel.animate([{transform:'scale(1)'},{transform:'scale(0.9)'}],{
     	duration:110,
     	fill: "forwards"
     });
     btnCancel.onpointerup = a => btnCancel.animate([{transform:'scale(0.9)'},{transform:'scale(1)'}],{
     	duration:100,
     	fill:"forwards"
     });
     
     var btnAccept = document.createElement('text'),
     btnas = btnAccept.style;
     
     btnas.font = '';
     btnas.zoom = 2.2;
     btnas.color = "#589693";
     btnas.marginLeft = "25%";
     btnAccept.textContent = " . . . . " + (options.accept || "Accept");
     mbg.appendChild(btnAccept);
     
     btnAccept.onpointerdown = a => btnAccept.animate([{transform:'scale(1)'},{transform:'scale(0.9)'}],{
     	duration:110,
     	fill: "forwards"
     });
     btnAccept.onpointerup = a => btnAccept.animate([{transform:'scale(0.9)'},{transform:'scale(1)'}],{
     	duration:100,
     	fill:"forwards"
     });
      
     mbg.animate([{transform:'scale(0)',easing:'cubic-bezier(.36,1.39,.86,.95)'},{transform:'scale(1)'}],300);
    
     bg.hide = function() {
     	this.animate([{opacity:1},{opacity:0}],{
     		duration:100,
     		fill:"forwards"
     	});
     	setTimeout(b=>this.remove(),100);
     }
     document.body.appendChild(bg);
     
  return new Promise((res,rej) => {
  	btnCancel.onclick = k => {
  		bg.hide(),rej(null);
  		btnCancel.onclick = null;
  	};
  	btnAccept.onclick = k => {
  		bg.hide(),res(ta.value);
  		btnAccept.onclick = null;
  	};
  });
 }