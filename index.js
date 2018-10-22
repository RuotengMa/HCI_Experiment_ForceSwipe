var Pressure = require('pressure');

var $ = require("jquery");


require("bootstrap");

function debugMsg(msg){
    $("#debug_text").html(msg);
}

function forceUpdate(force){
        debugMsg(force);
        forceBarVal = 100 * force;
        forceBarValStr = forceBarVal + "%";

        $("#forceBar").width(forceBarValStr);
}



Pressure.set('a', {
  start: function(force, event){
        //console.log(force);
        forceUpdate(force);
    },
  end: function(force, event){
        //console.log(force);
        forceUpdate(force);
    },
  startDeepPress: function(force, event){
        //console.log(force);
        forceUpdate(force);
    },
  endDeepPress: function(force, event){
        //console.log(force);
        forceUpdate(force);
    },
  change: function(force, event){
        forceUpdate(force);
    }
  });


Pressure.set('#leftPanel', {
  start: function(force, event){
        //console.log(force);
        forceUpdate(force);
    },
  end: function(force, event){
        //console.log(force);
        forceUpdate(force);
    },
  startDeepPress: function(force, event){
        //console.log(force);
        forceUpdate(force);
    },
  endDeepPress: function(force, event){
        //console.log(force);
        forceUpdate(force);
    },
  change: function(force, event){
        //console.log(force);
        forceUpdate(force);
    }
  }
  );