(function() {
	var worker = new Worker('data:application/javascript;base64,b25tZXNzYWdlPWZ1bmN0aW9uKGV2dCkgewoJbGV0IGRhdGEgPSBldnQuZGF0YSwKCWJsb2IgPSBuZXcgQmxvYihbZGF0YS5hcnJheUJ1ZmZlcl0pOwogIG5ldyBNZXNzYWdlQ2hhbm5lbCgpLnBvcnQxLnBvc3RNZXNzYWdlKCIiLFtkYXRhLmFycmF5QnVmZmVyXSk7CgljcmVhdGVJbWFnZUJpdG1hcChibG9iLCBkYXRhLngsIGRhdGEueSwgZGF0YS53aWR0aCwgZGF0YS5oZWlnaHQsIHsKCQlwcmVtdWx0aXBseUFscGhhOiBkYXRhLnByZW11bHRpcGx5QWxwaGEsCgkJcmVzaXplV2lkdGg6IGRhdGEucmVzaXplV2lkdGgsCgkJcmVzaXplSGVpZ2h0OiBkYXRhLnJlc2l6ZUhlaWdodCwKCQlyZXNpemVRdWFsaXR5OiBkYXRhLnJlc2l6ZVF1YWxpdHkKCQl9KS50aGVuKGIgPT4gewoJCQlibG9iID0gbnVsbDsKCQkJcG9zdE1lc3NhZ2UoewoJCQkJYml0bWFwOiBiLAoJCQkJaWQ6IGRhdGEuaWQKCQkJfSxbYl0pOwoJCX0pLmNhdGNoKGUgPT4gcG9zdE1lc3NhZ2Uoe3N0YWNrOmUuc3RhY2ssbWVzc2FnZTplLm1lc3NhZ2V9KSk7Cn0=');
	worker.tasks = [];
	worker.waiting = [];
	worker.id = 0;
	worker.postInterval = setInterval(x => {
		var task = worker.tasks[0];
		if (task) {
			worker.waiting.push(task);
			worker.postMessage({
				arrayBuffer: task.arrayBuffer,
				resizeWidth: task.resizeWidth,
				resizeHeight: task.resizeHeight,
				resizeQuality: task.resizeQuality,
				premultiplyAlpha: task.premultiplyAlpha,
				id: task.id,
				x: task.x,
				y: task.y,
				width: task.width,
				height: task.height
			}, [task.arrayBuffer]);

			worker.tasks.shift();
		}
	},
		10);
	worker.onmessage = function(message) {
		var data = message.data;

		for (var i = 0; i < worker.waiting.length; i++) if (data.id == worker.waiting[i].id) {
			return worker.waiting[i].func(data.bitmap),
			worker.waiting.splice(i, 1);
		}
	};

	globalThis._createImageBitmap = globalThis.createImageBitmap;
	
	var singleThread = {
		tasks: [],
		busy: false,
		next: function() {
			this.busy = this.tasks.length > 0;
			
			let task = this.tasks[0];
			if(task !== void 0) {
				_createImageBitmap(task.src, task.x, task.y, task.width, task.height, {
					resizeWidth: task.options.resizeWidth,
					resizeHeight: task.options.resizeHeight,
					resizeQuality: task.options.resizeQuality,
					premultiplyAlpha: task.options.premultiplyAlpha
				}).then(task.func).catch(task.func);
			
				this.tasks.shift();
			}
			else this.busy = false;
		}
	};
	globalThis._createImageBitmapSingleThread = function(source, x, y, w, h, options) {
		return new Promise((s, r) => {
			singleThread.tasks.push({
				src: source,
				x: x,
				y: y,
				width: w,
				height: h,
				options: options,
				func: function(t) {
					t instanceof ImageBitmap ? s(t) : r(t);
					singleThread.next();
				}
			});
			!singleThread.busy && singleThread.next();
		});
	};

	globalThis.createImageBitmap = function(source, x, y, w, h, options) {
		//Normal function if source is not arraybuffer
		arguments.length < 3 && (options = x);
		!options && (options = {});
		if (!(source instanceof ArrayBuffer)) {
			if (!options.singleThread) return delete options.singleThread,
			globalThis._createImageBitmap(source, x, y, w, h, options);
			else return delete options.singleThread,
			globalThis._createImageBitmapSingleThread(source, x, y, w, h, options);
		}
		return new Promise((s, f) => {
			worker.id++;

			worker.tasks.push({
				id: worker.id,
				arrayBuffer: source,
				resizeWidth: options.resizeWidth,
				resizeHeight: options.resizeWidth,
				resizeQuality: options.resizeQuality,
				premultiplyAlpha: options.premultiplyAlpha,
				x: arguments.length < 3 ? void 0: x,
				y: y,
				width: w,
				height: h,
				func: function(result) {
					result instanceof ImageBitmap ? s(result): f(result);
				}
			});

		});
	}
})();