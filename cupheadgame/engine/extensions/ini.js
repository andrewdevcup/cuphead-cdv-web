//INI.JS | Made by AndrewDev for Booty5.2
try{b5}catch(e){b5={}}
b5.INI = {
  parse: function(str) {
    var lst = str.split("\n"), a = {}, ah = !1, co = "";
    a.__fmt__ = [];
    for(var i=0;i<lst.length;i++) {
      //If string has no comments (startsWith #) look for object name
      var o =	lst[i].trim(), t = [];
      !o.startsWith("#") && !o.startsWith(";") && o != "" ? (
        //Once found the object, determine if it's the header (strings with brackets [ ]) or
        //property (strings with property and value)
        //Ignore every property that isn't in a header from the start, create objects with header names and
        //add properties under the object, setting it to next when hit next header.
        o.startsWith("[") && o.endsWith("]") && (
          co = o.replace(/[\[\]]/g,"").trim(), //.replace(/ /g,"_"),
          a[co] = {}, 
          ah = !0
        ),
        o.indexOf("=") > -1 && ah && (
          t = o.split("="),
          t[0] = t[0].trim(), t[1] = t[1].trim(),
          //Set string as boolean or number, else just string.
          a[co][t[0]] = t[1].search(/true|True/i) > -1 ? !0 : t[1].search(/false|False/i) > -1 ? !1 : !isNaN(t[1]) && t[1] != "" ? +t[1] : t[1]
        )
      ) : a.__fmt__.push([i,o]);
    }
    return a;
  },
  stringify: function(obj) {
    var nstrl = [], nstr = [];
    //Create a list of lines of the ini file, then adding the format (if available) for such as
    //comments or empty lines
    for(var i in obj) {
      //Object
      if( i != "__fmt__") { nstr.push( "[" + i + "]" );
        //Properties
        for(var a in obj[i]) nstr.push( a + " = " + (obj[i][a]===true ? "True" : obj[i][a]===false ? "False" : obj[i][a]) ); //Auto format
      }
    }
    //Insert format and comments
    for(var i=0, a=obj.__fmt__, len=a ? a.length : 0, c=nstr.length + len; i < c;i++) {
      //Look for comments or empty spaces in this line
      if(a) for(var b=0;b<len;b++) if( i == a[b][0] ) { nstrl.push( a[b][1] ); break}
      nstr[i] && nstrl.push( nstr[i] );
    }
    return nstrl.join("\n").trim();
  }
};