/** Simple console **/
_initConsole = function() {
	if(cordova.platformId == 'browser') return console.show = console.hide = e => {};
	element('style', {}, ".console::marker { content: ''; } \n .console-input::marker { content: '>> '; }",{},'head',true);
	element('div', {
		id: 'consoleview'
	},'', {
		backgroundColor: 'rgba(64,64,64,0.5)',
		width: '100%',
		height: '100vh',
		position: 'absolute',
		overflow: 'hidden',
		top: '0%'
	},'body',true);
	
	 conshead = element('h2',{
	  onclick: function() {console.hide()}
	}, 'Console [\u2716]', {
		width: '100%',
		height: '5vh',
		marginTop: '0px',
		marginBottom: '0px',
		textAlign: 'center',
		boxShadow: '0px 1px 10px black',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		color: '#fff',
		cursor: 'pointer'
	}),
	consbody = element('div', {}, '', {
		width: '100%',
		height: '97vh',
		maxWidth: '100%',
		overflowY: 'scroll',
		overflowX: 'hidden'
	}),
	conslist = element('ul', {
		id: 'conslist'
	}, '', {
		paddingLeft: '2vh',
		color: 'white',
		width: '92%',
		overflowY: 'hidden',
		overflowX: 'hidden'
	}),
	consview = document.getElementById('consoleview'),
	constxt = element('textarea', {
    id: 'constxt'
  }, '', {
    width: '95%',
    height: '40vh',
    marginTop: '1vh',
    paddingLeft: '2vh',
    backgroundColor: 'transparent',
    color: 'white'
  }),
  consinf = element('span', {
  	id: 'consinf',
    innerHTML: 'Simple console v1.0. Type $c for console methods.'
  }, '', {
  	width:'99%',
  	color: 'rgba(255,255,255,0.672)',
  	paddingLeft: '2vh'
  }),
  obj = function(e) {
         var t = "<span style='color:rgb(219,129,240)'>";
         try {
             for (var i in e) t += i + ': ' + '<span style="color:' + _consoleLs.getColorFor(!e[i] && e[i] != !1 ? 'undefined' : typeof e[i]) + '">' +
                 (e[i] === null ? 'null' : e[i] == undefined ? 'undefined' :
                     typeof e[i] == 'function' ? e[i].toString().substr(0, e[i].toString().indexOf('{')) + ' {...}' : typeof e[i] == 'string' ? '" ' + e[i].toString() + ' "' : e[i].toString()) + '</span> \n';
         } catch (o) { console.error(o)}
  	t += '</span>'
  	return t;
  };
	
	_consoleLs = {
		arrow_right: '\u25b6',
		arrow_down: '🔽',
		arrow_cmd: '>>  ',
		func_f: 'ƒ ',
		global_ls_id: 0,
		textarea: constxt,
		getColorFor: function(e) {
			var t = "";
			switch(e) {
				case 'string': t = 'rgb(45,175,44)'; break;
				case 'number': t = 'rgb(41,106,210)'; break;
				case 'boolean': t = '#9d57c6'; break;
				case 'function': t = '#9a4295'; break;
				case 'undefined': t = 'rgb(117,212,111)'; break;
				default: t = '#fff';
			}
			return t;
		},
    addLine: function(text,type,isResult, logtype) {
    	var _ = this;
    	_.global_ls_id++;
    	var n = ( type == "object" && !Array.isArray(text) ) || type == "function",
    	m = (type == "object" && Array.isArray(text)),
    	r = logtype == 'noclr'? '#fff' : 'rgb(45,175,44)',
    	e = element('li', {
    		className: 'console',
    		clicked: !1,
    		onclick: isResult && type == "object" && function(){
    			if(!this.clicked) {
    			  this.clicked = !0
    		  	console.log(obj(text), 'noclr');
    		  	document.getElementById('console-ln-span-'+ (_.global_ls_id-1)).textContent = _.arrow_down
    			}
    		}
    	}, '', {
    		zoom: 1.1,
    		padding: '2px 0px 2px 0px',
    		boxShadow: isResult ? '0px 1px 0px white' : '',
    		backgroundColor: logtype ? logtype == 'warn' ? 'rgba(255,207,3,0.55)' : logtype == 'error' ? 'rgba(238,14,14,0.55)' : 'transparent' : 'transparent',
    	}),
    	//Marker
    	t = element('span', {
    		textContent: n || m ? this.arrow_right : type == 'cmdout' ? this.arrow_cmd : '',
    		id: 'console-ln-span-'+ _.global_ls_id
    	}, '', {
    		zoom: 0.9,
    		cursor: m || n ? "pointer" : "default",
    		userSelect: "none",
     	}),
     	f = element('i',{}, n && type == 'function' ? this.func_f : '', {color:'#6c53dc'}),
    	//Text
    	o = element('span', {
    		innerHTML: !n && !m ? text.toString().replace(/\n/g,"<br>") : type == "function" ? text.toString().substr(8,text.toString().indexOf('{')-7).replace(/\n/g,'') +'...}' : !m ? "Object{...}":"Array[...]"
    		
    	}, null, {color: !logtype ? type == "object" || type == 'cmdout' ? 'white' : this.getColorFor(type) : 'white'
    	}),
    	a = document.getElementById('conslist');
    	
    	//Append (element to list, marker to element, text to marker)
    	a.appendChild(e);
    	e.appendChild(t);
    	e.appendChild(f);
    	e.appendChild(o);
    },
	};

	consview.appendChild(conshead),
	consview.appendChild(consbody),
	consbody.appendChild(conslist),
	consbody.appendChild(constxt),
	consbody.appendChild(consinf);

    delete conshead;
    delete consbody;
    delete conslist;
    delete conxtxt;
    delete consinf;
	
	//Append to console
	window['$c'] = {};
	$c.log = function(e, r) {
		var t = typeof e,
		n;
		
		e === null ? (e = 'null', t = 'undefined') :
		e === undefined && (e = 'undefined', t = e);
		
		n = t == 'string' && !r ? '" '+e+' "' : e;
		
		_consoleLs.addLine(n, t, true, r);
	//	r && _consoleLs.addLine()

	};
	$c.error = function(e) { console.log('\u274c '+e,'error') };
	$c.warn = function(e) { console.log('\u26a0 '+ e,'warn') };
	window.addEventListener('error', function(e) {
		var t = e.filename.split('/');
		t = '/'+t[t.length-1];
		console.error(e.message + '.\n'+(e.filename==location.href ? 'console' : t+ ':'+e.lineno + ':'+e.colno));
	},!1);
  $c.show = function() {
  	document.getElementById('consoleview').hidden=false;
  }
  $c.hide = function() {
  	document.getElementById('consoleview').hidden=true;
  },
  $c.clear = function() {
	var e = document.getElementById('conslist');
  	do {
  		e.removeChild(conslist.firstChild);
  	} while(e.childNodes.length > 0);
  	console.warn('Console was cleared.');
  };
  $c.info = $c.warn;
  console = $c;
  constxt.onkeydown = function(e) {
  	if(e.key == 'Enter') {
  		_consoleLs.addLine(constxt.value, 'cmdout');
  		this.value.endsWith('\n') && (this.value = this.value.substr(0,this.value.length-1));
            try {
                console.log(eval(this.value));
            }
            catch (o) { console.error(o) };
  	}
  }
  //Show on Home key on keyboard
  window.addEventListener('keydown',(e)=> { e.key == 'Home' && console.show() },!1);
  //Show on double back tap on phones
  var poptime = 0;
  window.addEventListener('popstate', function(e) {
    var t = Date.now();
    t - poptime < 200 && console.show();
    poptime = t;
  },!1);
  //console.hide()
};