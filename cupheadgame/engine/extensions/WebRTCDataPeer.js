/*
* Written by AndrewDev
* HUGE Thanks to Bastian Heist!!
*/
(function() {
	window.Peer = function(id, iceServers, turnServers, dataChannelId) {
		var s; //["stun:stun.l.google.com:19302", "stun:stun2.l.google.com:19302"]
		if(iceServers || this.iceServers) {
			iceServers && (this.iceServers = iceServers);
			turnServers && (this.turnServers = turnServers);
			dataChannelId !== void 0 && (this.dataChannelId = dataChannelId);
			s = { iceServers: [{ urls: this.iceServers}, ...this.turnServers], iceCandidatePoolSize: 10 };
		}
		this.peerConnection = new RTCPeerConnection(s);
		this.dataChannel = this.peerConnection.createDataChannel('DataChannel',
		{negotiated:true, id: this.dataChannelId /*|| new Date().getMonth()*/});
		this.ice = [];
		this._prevIceConnState = "new";
		this._prevConnState = "new";
		this.session = null;
		this.connected = !1;
		this.id = id || "";
		this.dataChannelId = dataChannelId /*|| new Date().getMonth();*/
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
		i = null;
		
		//Offer/answer
		s = s.substr(0,s.indexOf('%i'));
		//Ice
		i = c.substr(c.indexOf('%i')+3).split('\n');

		for(var a = 0, ice = []; a < i.length; a++) {
			var enc = i[a].split(' ')[4],
			nenc = enc ? _decode(enc) : (enc = "");
			ice.push({
				candidate: _decode(i[a]), //((enc.startsWith("À".charCodeAt(null)) || !enc) ? i[a]:i[a].replace(enc,nenc)), 
				sdpMid: "0", 
				sdpMLineIndex: 0
			});
		}
		//Accept offer / answer
		c.startsWith('%o') ? this.connectRAW({type: 'offer', sdp: s}, ice, x => {
			onConnect && onConnect(this.getCode());
		}) : this.acceptRAW({type: 'answer', sdp: s}, ice);
		}catch(e){this.onError && this.onError(e)}
	};
	Peer.prototype.getCode = function() {
		var e = this.session,
		values = e.sdp.replace(/\r/g,'').split('\n');
		
		for(var i = 0,ice="";i<this.ice.length;i++){
//			var enc = this.ice[i].candidate.split(' ')[4],
	//		cand = "",
	//		nenc = _encode(enc);
//			cand = !enc.startsWith("À".charCodeAt(null)) ?this.ice[i].candidate.replace(enc,nenc):this.ice[i].candidate;
			ice += '\n'+ _encode(this.ice[i].candidate);
		}
		return e && this.ice ? btoa('%'+e.type[0] + "\n" + values.join('\n') + (e.sdp.endsWith("\n")?"":"\n") + "%i"+ ice)
	: null;
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
		for(var i=0,n="";i<e.length;i++)n+=String.fromCharCode(+e[i].charCodeAt(0)+5);
		return n;
	},
	_decode=e=>{
		for(var i=0,n="";i<e.length;i++)n+=String.fromCharCode(e[i].charCodeAt(0)-5);
		return n;
	};
})();