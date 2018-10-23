var Pressure = require('pressure');

var $ = require("jquery");
var Chart = require("chart.js");



require("bootstrap");

function debugMsg(msg){
      $("#debug_text").html(msg);
}


var timeUpdate = [];
var forceTimeline = [];
var chartTimeUpdate = [];
var chartForceTimeline = [];
var forceLineChart = null;



function forceUpdate(force){
        //debugMsg(force);
        forceBarVal = 100 * force;
        forceBarValStr = forceBarVal + "%";

        timeUpdate.push(Date.now() - tDown);
        forceTimeline.push(force);

        $("#forceBar").width(forceBarValStr);
}


$("#debug_toggle").on("click", function(e){
    $("#debug_panel").toggle();
});

$("#forceBar_toggle").on("click", function(e){
    $("#forceBar").toggle();
});


$("#textContent").on("mousedown", function(e){
  debugMsg("mouse down detected");
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

  if ((Math.abs(xTraverse) > 30 || Math.abs(yTraverse) > 30 ) && (timeElapsed < 2000))  {
    console.log("swipe detected!");

    swipeHandler(xTraverse, yTraverse, tDown, tUp);

  }


    //debugMsg(forceTimeline);
    chartTimeUpdate = [];
    chartForceTimeline = [];
    chartTimeUpdate = timeUpdate;
    chartForceTimeline = forceTimeline;



    if(forceLineChart != null)
      forceLineChart.destroy();

    var ctx = document.getElementById("forceLineChart");

    forceLineChart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: chartTimeUpdate,
              datasets: [{
                label:"Force applied",
                data:chartForceTimeline,
                borderColor: "#3e95cd",
                fill:false
              }]
            },
            options: {  responsive:false, 
                        animation:{duration:0},
                        scales:{
                          yAxes:[{
                            ticks:{
                              max:1,
                              min:0,
                              stepsize:0.05
                            }
                          }]
                        }
                      }
    });

    forceLineChart.update(0);


  timeUpdate = [];
  forceTimeline = [];

})



function swipeHandler( xMove, yMove, tDown, tUp ){
    console.log("Now into swipe Handler");


    dbgInfo =   "swipe detected<br>" + 
                "Duration: " + timeElapsed + "<br>" + 
                "Max of Force: " + Math.max.apply(Math, forceTimeline) + "<br>"
                ;

    debugMsg(dbgInfo);

    //console.log(JSON.stringify(chartTimeUpdate));
    //console.log(JSON.stringify(chartForceTimeline));
}



Pressure.set('#textContent', {
  start: function(force, event){
        //console.log(force);
        //forceUpdate(force);
    },
  end: function(force, event){
        //console.log(force);
        //forceUpdate(force);
    },
  startDeepPress: function(force, event){
        //console.log(force);
        //forceUpdate(force);
    },
  endDeepPress: function(force, event){
        //console.log(force);
        //forceUpdate(force);
    },
  change: function(force, event){
        //console.log(force);
        forceUpdate(force);
    }
  }
  );


