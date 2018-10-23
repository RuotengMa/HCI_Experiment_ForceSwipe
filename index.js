var Pressure = require('pressure');

var $ = require("jquery");


require("bootstrap");

function debugMsg(msg){
    if(msg.constructor == Array){
      infoStr = "array length: " + msg.length + "<br>" +
                "array content: " + msg.join(",");

      $("#debug_text").html(infoStr);
    }
    else
      $("#debug_text").html(msg);
}

var timeUpdate = [];


function forceUpdate(force){
        //debugMsg(force);
        forceBarVal = 100 * force;
        forceBarValStr = forceBarVal + "%";

        timeUpdate.push(Date.now());

        $("#forceBar").width(forceBarValStr);
}



$("#textContent").on("mousedown", function(e){
  xDown = e.pageX;
  yDown = e.pageY;
  tDown = Date.now();
})
.on("mouseup", function(e){
  xUp = e.pageX;
  yUp = e.pageY;
  tUp = Date.now();

  xTraverse = xUp - xDown;
  yTraverse = yUp - yDown;
  timeElapsed = tUp - tDown;

  if ((Math.abs(xTraverse) > 30 || Math.abs(yTraverse) > 30 ) && (timeElapsed < 1000))  {
    console.log("swipe detected!");

    swipeHandler(xTraverse, yTraverse, tDown, tUp);
  }
})
;

function swipeHandler( xMove, yMove, tDown, tUp ){
    console.log("Now into swipe Handler");


    debugMsg(timeUpdate);
    timeUpdate = [];

}



Pressure.set('#textContent', {
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


