  btn = function(x,y,w,h,txt) {
  	var a = new b5.RectActor();
  	a.setSize(w,h);
  	a.setPosition(x,y);
  	a.touchable=true;
  	scene.addActor(a);
  	return a;
  }
  
  
  sa = btn(-590,-300,100,50);
  sa.onBeginTouch=()=>{
  	ACTOR = scene.findActor(prompt('ACTOR='),true);
  }
  
  zi = btn(-590,-240,100,50);
  zi.onBeginTouch=()=>{
  	world._scale+=.05*world.scale;
  }
  
  zo = btn(-590,-190,100,50);
  zo.onBeginTouch=()=>{
  	world._scale-=.05*world.scale;
  }
  
  cfp = btn(-590,-130,100,50);
  cfp.onBeginTouch=()=>{
  	window.ACTOR && ACTOR.current_frame++;
  }
  cfm = btn(-590,-70,100,50);
  cfm.onBeginTouch=()=>{
  	window.ACTOR && ACTOR.current_frame--;
  }