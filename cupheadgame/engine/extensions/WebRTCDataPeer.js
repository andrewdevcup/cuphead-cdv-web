/*
* Written by AndrewDev
* HUGE Thanks to Bastian Heist!!
*/
(function() {
	window.Peer = function(id, iceServers, dataChannelId) {
		var s; //["stun:stun.l.google.com:19302", "stun:stun2.l.google.com:19302"]
		if(iceServers || this.iceServers) {
			iceServers && (this.iceServers = iceServers);
			s = { iceServers: [{ urls: this.iceServers}], iceCandidatePoolSize: 10 };
		}
		this.peerConnection = new RTCPeerConnection(s);
		this.dataChannel = this.peerConnection.createDataChannel('DataChannel',
		{negotiated:true, id: dataChannelId || new Date().getMonth()});
		this.ice = [];
		this._prevIceConnState = "new";
		this._prevConnState = "new";
		this.session = null;
		this.connected = !1;
		this.id = id || "";
		this.dataChannelId = dataChannelId || new Date().getMonth();
		this.configuration = s;
		this.CONNECTING_WAIT_ICE = !0;
		this.OFFERED = !1;
		
		var e = this,
		t = e.peerConnection, o = e.dataChannel;
		t.onconnectionstatechange = function(evt) {
			"connected" === t.connectionState && (e.connected=!0, e.onConnected && e.onConnected());
			("closed" === t.connectionState || "disconnected" === t.connectionState || "failed" === t.connectionState) && (e.connected=!1,e.onDisconnected && e.onDisconnected(t.connectionState, evt));
			
			e.onConnectionState && e._prevConnState != t.connectionState && (
				e._prevConnState = t.connectionState,
				e.onConnectionState(t.connectionState)
			);
			
			"failed" === t.connectionState && e.onError && e.onError(evt);
		}
		t.oniceconnectionstatechange = function(evt) {
			e.onIceConnectionState && e._prevIceConnState != t.iceConnectionState && (
				e._prevIceConnState = t.iceConnectionState,
				e.onIceConnectionState(t.iceConnectionState)
			);
		}
		o.onclose = function(evt) {
		  e.onClose && e.onClose('closed', evt);
		}
		//ICE
		//t.onicecandidateerror = l => e.onError && e.onError(l);
		t.onicecandidate = function(evt) {
			evt.candidate ? e.ice.push(evt.candidate.toJSON()) : (
				e.CONNECTING_WAIT_ICE && (
					e.CONNECTING_WAIT_ICE=!1, 
					e.onIceReady && e.onIceReady(),
					e._onIceReady && (e._onIceReady(), e._onIceReady=null))
			);
		};
		e.onOpen = null,
		e.onConnected = null,
		e.onDisconnected = null,
		e.onError = null,
		e.onMessage = null,
		e.onClose = null,
		e.onIceReady = null,
		e.onConnectionState = null,
		e.onIceConnectionState = null;
		e.dataChannel.onmessage = function(m) {
			e.onMessage && e.onMessage(m);
		}
		e.dataChannel.onopen = function() {
			e.onOpen && e.onOpen();
		}
	};
	Peer.sdp = `v=0\r
o=- % IN IP4 127.0.0.1\r
s=- \r
t=0 0\r
a=group:BUNDLE 0\r
a=extmap-allow-mixed\r
a=msid-semantic: WMS\r
m=application 9 UDP/DTLS/SCTP webrtc-datachannel\r
c=IN IP4 0.0.0.0\r
a=ice-ufrag:%\r
a=ice-pwd:%\r
a=ice-options:trickle\r
a=fingerprint:%\r
a=setup:%\r
a=mid:0\r
a=sctp-port:5000\r
a=max-message-size:262144\r
`;
Peer.gen = " generation 0 ufrag % network-cost 999";
	Peer.prototype.offer = function(onOffer) {
		var e = this,
		t = e.peerConnection;
  	t.createOffer().then(offer => {
  	 	t.setLocalDescription(new RTCSessionDescription(offer)).then(function() { 
  			e.session = t.localDescription;
  			e.OFFERED = !0;
  			onOffer && onOffer(e);
  		});
  	}).catch(a => e.onError && e.onError(a));
	};
  Peer.prototype.acceptRAW = function(peerSession, peerIce, onAllow, onError) {
  	var e = this, t = e.peerConnection;
   try{
  	t.setRemoteDescription(new RTCSessionDescription(peerSession))
  	 .then(function() {
  	 	peerIce.forEach( (c) => t.addIceCandidate(c) );
  	 	onAllow&&onAllow();
  	 });
  	}catch(a){ onError && onError(a)}
  };
	Peer.prototype.connectRAW = function(peerSession, peerIce, onDescSet) {
		var e = this,
		t = e.peerConnection;
		e.acceptRAW(peerSession, peerIce, function() {
			t.createAnswer().then(answer => {
				t.setLocalDescription(new RTCSessionDescription(answer)).then(function() {
					e.session = t.localDescription;
					e.CONNECTING_WAIT_ICE = !0;
			  	e._onIceReady = function() {onDescSet && onDescSet()};
				});
			});
		}, function(a) { e.onError && e.onError(a)} );
	};
	Peer.prototype.connect = function(code, onConnect) {
		try {
		var c = atob(code.trim()),
		t = c.substr(1,c.indexOf('\n')-1),
		s = c.substr(t.length+2),
		i = null,
		d = Peer.sdp,
		ufrag = "";
		
		//Offer/answer
		s = s.substr(0,s.indexOf('%i')).split('\n');
		for(var i = 0, l = [1,9,10,12,13];i<l.length; i++) {
			d = d.replace("%",s[i]);
			l[i] == 9 && (ufrag = s[i]);
		}
		//Ice
		i = c.substr(c.indexOf('%i')+3).split('\n');

		for(var a = 0, ice = []; a < i.length; a++) {
			var enc = i[a].split(' ')[4],
			nenc = enc ? _decode(enc) : (enc = ""),
			gen = Peer.gen.replace('%',ufrag);
			ice.push({
				candidate: ((enc.startsWith("À".charCodeAt(null)) || !enc) ? 'candidate:'+i[a]:'candidate:'+i[a].replace(enc,nenc)) + gen, 
				sdpMid: "0", 
				sdpMLineIndex: 0
			});
		}
		//Accept offer / answer
		c.startsWith('%o') ? this.connectRAW({type: 'offer', sdp: d}, ice, x => {
			onConnect && onConnect(this.getCode());
		}) : this.acceptRAW({type: 'answer', sdp: d}, ice);
		}catch(e){this.onError && this.onError(e)}
	};
	Peer.prototype.getCode = function() {
		var e = this.session,
		lines = [1,9,10,12,13],
		codes = [],
		values = e.sdp.replace(/\r/g,'').split('\n');
		
		//Extract
		for(var i = 0; i < lines.length; i++) {
			var l = values[lines[i]];
			switch(lines[i]) {
				case 1:
					codes.push(l.substr(l.indexOf('- ')+2,l.indexOf(' IN')-4));
					break;
				case 9:
				case 10:
				case 12:
				case 13:
					codes.push(l.substr(l.indexOf(':')+1));
			}
		}
		for(var i = 0,ice="";i<this.ice.length;i++){
			var enc = this.ice[i].candidate.split(' ')[4],
			cand = "",
			nenc = _encode(enc);
			cand = !enc.startsWith("À".charCodeAt(null)) ?this.ice[i].candidate.replace(enc,nenc):this.ice[i].candidate;
			cand = cand.substr(0,cand.indexOf('generation')-1);
			ice += '\n'+ cand;
		}
		return e && this.ice ? btoa('%'+e.type[0] + "\n" + codes.join('\n') +'\n' + (e.sdp.endsWith("\n")?"":"\n") + "%i"+ ice.replace(/candidate:/g,''))
	: (this.onError && this.onError('Connect to a WiFi network'), null);
	};
	Peer.prototype.send = function(msg) {
		this.dataChannel.readyState === "open" && this.dataChannel.send(msg);
	};
	Peer.prototype.reset = function(clearMethods) {
		var e = this.id, t = this.dataChannelId, k = this.iceServers, p = {}, c = this.configuration;
		if(!clearMethods) for(var i in this) 'function' === typeof this[i] ? p[i] = this[i] : delete this[i];
		this.iceServers = k;
		Peer.call(this);
		this.id = e;
		this.dataChannelId = t;
		this.configuration = c;
		for(var i in p)this[i] = p[i]; //Restore functions
	};
	Peer.prototype.close = function() {
		this.dataChannel.close();
		this.peerConnection.close();
		this.connected=!1;
		this.onDisconnected && this.onDisconnected();
		this.onClose && this.onClose('closed');
		this.reset(!0);
	};
	var _encode=e=>{
		for(var i=0,n="";i<e.length;i++)n+= e[i]!=="."?String.fromCharCode(+e[i].charCodeAt(0)+6):String.fromCharCode(2);
		return n;
	},
	_decode=e=>{
		e=e.replaceAll(String.fromCharCode(2),'.');for(var i=0,n="";i<e.length;i++)n+=e[i]!="."?String.fromCharCode(e[i].charCodeAt(0)-6):".";
		return n;
	};
})();