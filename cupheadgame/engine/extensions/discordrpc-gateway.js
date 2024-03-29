/*
*
* EXPERIMENTAL DISCORD RICH PRESENCE LIBRARY
* ON THE WEB, USING DISCORD GATEWAY
* CODE ADAPTED FROM MRPC BY KHANHDUYTRAN0, HUGE THANKS TO HIM!!!
* WRITTEN BY ANDREWDEV
*
*/

(function() {
	DiscordGatewayRPC = function(token, autoReconnect) {
		this.token = token;
		this.activity = null,
		this.session_status = null,
		this.closing = false,
		this.auto_reconnect = !!autoReconnect,
		this.debug = false,
		this._onloggedin = null,
		this.onReady = null,
		this.onClose = null,
		this.onOpen = null,
		this.onMessage = null,
		this.heart_start = -1,
		this.heartbeat_interval = Number.MAX_VALUE;
		const _this = this;
		this.getIdentify = function() {
			return {
				op: 2,
				d: {
					token: _this.token,
					properties: {
						os: b5.Utils.GetPlatform().toLowerCase(),
						browser: "cordova",
						device: b5.Utils.IsMobile() ? "mobile" : "desktop"
					},
					compress: false,
					intents: 0
				}
			}
		}
		this.createClient = function() {
			this.socket = new WebSocket('wss://gateway.discord.gg/?encoding=json&v=9')
			this.socket.rpc = this;
			this.socket.onmessage = function(m) {

				const data = JSON.parse(m.data),
				t = data.t,
				s = data.s,
				d = data.d;
				
				this.rpc.onMessage && this.rpc.onMessage(data);

				switch (data.op) {
					case 0: //Dispatch event
						if (data.t == "READY") {
							//Save status and sync
							this.rpc.session_status = d.sessions[0].status;
							
							this.rpc.onReady && this.rpc.onReady(d);
							this.rpc._onloggedin && this.rpc._onloggedin(d);
							console.log('[Gateway] Logged in as '+d.user.username+'#'+d.user.discriminator);
							
							//Keep alive
							
							this.rpc.heart_start = setTimeout(f => {
								this.rpc.debug && console.log('Gateway Heartbeat (Start)');
								this.send(JSON.stringify({
									op: 1,
									d: s
								}));
							},d.heartbeat_interval);
						}
						else if(data.t == "SESSIONS_REPLACE") {
							//Save status and sync
							this.rpc.session_status = d[0].status;
						}
						break;
					case 10: //Hello

						const id = this.rpc.getIdentify(); //Get identification
						
						this.rpc.heartbeat_interval = d.heartbeat_interval;
						
						//And send
						this.send(JSON.stringify(id));
						break;
					case 1: //Heartbeat request
						this.send(JSON.stringify({
							op: 1,
							d: s
						}));
						break;
					case 11: //Heartbeat ACK
						if (this.rpc.heartbeat_interval < 10000) return;
						
						this.rpc.debug && console.log('Gateway Heartbeat (ACK)');

						this.rpc.heart_start = setTimeout(m => {
							this.send(JSON.stringify({
								op: 1,
								d: s
							}));
						}, this.rpc.heartbeat_interval);
						break;
				}

			}

			this.socket.onopen = function(r) {
				this.onOpen && this.onOpen(r);
				console.log('Discord Gateway Opened');
			}

			this.socket.onclose = function(r) {
				self.clearInterval(this.rpc.heart_start);
				this.onClose && this.onClose(r);
				if(!this.rpc.closing && this.rpc.auto_reconnect) this.rpc.resetConnection();
			}
		}

		this.resetConnection = function() {
			let a = this.activity, t = this.token, e = this.auto_reconnect,
			funcs = {};
			for (var i in this)typeof this[i] == "function" && (funcs[i] = this[i]);
			DiscordGatewayRPC.call(this, t, e);

			console.log('Gateway reset');
			this.createClient();

			for (var i in funcs) this[i] = funcs[i];
			funcs = null;

			if (a) {
				this._onloggedin = f => this.setActivity(a);
			}
		}

		this.setActivity = function(data,type) {
			this.activity = data;
			this.socket.readyState === 1 && this.socket.send(JSON.stringify({
				op: 3,
				d: {
					activities: [{
						name: data.name,
						state: data.state,
						type: type || DiscordGatewayRPC.Activity.PLAYING,
						details: data.details,
						application_id: data.application_id,
						assets: {
							large_image: data.largeImageKey,
							large_text: data.largeImageText
						},
						timestamps: {
							start: data.startTimestamp,
							end: data.endTimestamp
						}
					}],
					afk: true,
					since: data.startTimestamp,
					status: this.session_status
				}
		}));
	}
	
	this.close = function() {
		this.closing = true;
		this.socket.close();
		self.clearInterval(this.heartbeat_interval);
	}
};
DiscordGatewayRPC.Activity = {
	PLAYING: 0,
	STREAMING: 1,
	LISTENING: 2,
	WATCHING: 3,
	CUSTOM: 4
}
})();