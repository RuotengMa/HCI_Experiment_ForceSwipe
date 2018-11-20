var Pressure = require('pressure');

var $ = require("jquery");
var Chart = require("chart.js");
var loremIpsum = require("lorem-ipsum");


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


$("#touchDetectArea").on("mousedown", function(e){
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

    swipeHandler(xTraverse, yTraverse);
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

var DIRECTION = Object.freeze({"LEFT":1, "RIGHT": 2, "UP":3, "DOWN":4});

function getDirection(xMove, yMove){
  if(Math.abs(xMove) >= Math.abs(yMove)){
    if(xMove > 0)
      return DIRECTION.RIGHT;
    else
      return DIRECTION.LEFT;
  }
  else{
    if(yMove < 0)
      return DIRECTION.UP;
    else
      return DIRECTION.DOWN;
  }
}

function getCurrentChapter(){
  // Use center to detect center

   var viewportCenter = $(window).scrollTop() + $(window).height()/2;

  for(var i = 1 ; i <= randChapterNum ; i++){
      iterChapter = "#ch"+i;
      iterChapterTop = $(iterChapter).position().top;
      iterChapterBottom = $(iterChapter).position().top + $(iterChapter).height();

      if(viewportCenter > iterChapterTop && viewportCenter < iterChapterBottom){
          return i;
      }
  }
}

scrollSpeed = 5; // px/ms

function animateScroll(targetPos){
      // v = distance/time = distance(px) / (distance/5) = 5 px/ms = 5000 px/s
      duration = Math.abs(targetPos - $(window).scrollTop())/scrollSpeed;
      console.log("duration : "  + duration);
      $("html, body").stop().animate({scrollTop:targetPos}, duration, 'swing', function() { });
}


function ScrollToPrevChapter(){
  var curChapterNum = getCurrentChapter();
  var curChapterID = "#ch"+ curChapterNum;
  var prevChapterID = "#ch"+ (curChapterNum-1);
  targetPos = 0;

  if(curChapterNum == 1)
    targetPos = $(curChapterID).position().top;
  else
    targetPos = $(prevChapterID).position().top;


  animateScroll(targetPos);
}

function ScrollToNextChapter(){
  var curChapterNum = getCurrentChapter();
  var curChapterID = "#ch"+ curChapterNum;
  var nextChapterID = "#ch"+ (curChapterNum+1);
  targetPos = 0;

  if(curChapterNum == randChapterNum)
    targetPos = $(document).height() - $(window).height();
  else
    targetPos = $(nextChapterID).position().top;


  animateScroll(targetPos);
}


function forceSwipeHandler(swpDir){

  console.log("Current Chapter: " + getCurrentChapter());

  switch(swpDir){
    case DIRECTION.LEFT:
    case DIRECTION.UP:
      console.log("Navigate to previous chapter");
      ScrollToPrevChapter();
      break;
    case DIRECTION.RIGHT:
    case DIRECTION.DOWN:
      console.log("Navigate to next chapter");
      ScrollToNextChapter();
      break;
    default:
      console.log("...");
  }
}

function normalSwipeHandler(swpDir){

}


function swipeHandler( xMove, yMove ){
    console.log("Now into swipe Handler");


    dbgInfo =   "swipe detected<br>" + 
                "Duration: " + timeElapsed + "<br>" + 
                "Max of Force: " + Math.max.apply(Math, forceTimeline) + "<br>"
                ;

    swipeDirection = getDirection(xMove, yMove);

    if (Math.max.apply(Math, forceTimeline) > 0.5){ 
        forceSwipeHandler(swipeDirection);
    }
    else{
        normalSwipeHandler(swipeDirection);
    }

    debugMsg(dbgInfo);

    //console.log(JSON.stringify(chartTimeUpdate));
    //console.log(JSON.stringify(chartForceTimeline));
}



Pressure.set('#touchDetectArea', {
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


function genChapter(chapterNum, maxChapters, folder="01_animal" ,isTarget=false){

  minParagraphs = 50;
  rangeParagraphs = 30;

  randParagraphs = Math.floor(Math.random() * rangeParagraphs + minParagraphs); 

  console.log(randParagraphs);

  liRandomText = loremIpsum({
      count: randParagraphs,
      units: 'paragraphs',
      sentenceLowerBound: 5,
      sentenceUpperBound: 20,
      paragraphLowerBound: 2,
      paragraphUpperBound: 5,
      format: 'plain'
  }) + genRandomImage(folder, maxChapters, isTarget) + loremIpsum({
      count: randParagraphs,
      units: 'paragraphs',
      sentenceLowerBound: 5,
      sentenceUpperBound: 20,
      paragraphLowerBound: 2,
      paragraphUpperBound: 5,
      format: 'plain'
  });

  

  liRandomText = "<br><br><br><br><br><div class='chContainer' id='ch"+chapterNum+"'> \
  <hr><h2 class='chTitle'>Chapter " + chapterNum + "</h2><hr><br><br><br><br><br>" + liRandomText + "</div>"


  output = liRandomText;

  return output;
}

function withinView(targetTop, targetHeight, viewTop){

  targetBottom = targetTop + targetHeight;
  if( targetTop > viewTop && targetTop < viewTop + $(window).height())
    return true;

  if( targetBottom > viewTop && targetBottom < viewTop + $(window).height())
    return true;

  return false;
}


function sessionStartPos(){
  return $(document).height()/2;
}


function genContent(folder){

  while(true){

    randChapterNum = Math.floor(Math.random() * (maxChapters-minChapters) + minChapters);
    targetChapter = Math.floor(Math.random() * randChapterNum);
    console.log("target chapter is " + targetChapter);

    fullContent = "";
    for(i = 0 ; i < randChapterNum ; i++){
      fullContent += genChapter(i+1, maxChapters,folder, (i == targetChapter));
    }

    $("#randomTextArea").html(fullContent);

    if(!withinView($("#targetImg").position().top, $("#targetImg").height(), sessionStartPos()))
      break;
  }

}

function genRandomImage( folder, maxID, isTarget = false){
  randImgNum =  Math.floor(Math.random() * maxID) + 1;

  console.log("genRandomImage: " + randImgNum);

  if(isTarget)
    return "<img src='img/"+folder+"/target.jpg' id='targetImg' width='600' height='400'>";
  else
    return ""; // No image other than the target
    //return "<img src='img/"+folder+"/"+randImgNum+".jpg' width='600' height='400'>";
}

function experimentSetup(){
  /*
    Setting up for new ID.
  */
  expRecord.push(Array());
  sessionCount = 0;
  modalMsgSetup("Experiment Start", " description for the experiment goes here", sessionSetup, "Start the experiment");
}

function experimentTerminate(){
  /*
      Show "Thank you" screen, 
  */

  recordText = "";
  expRecord[expRecord.length - 1].forEach(function(item, index, array){
      recordText += ("Session " + index + ": " + (item.endTime - item.startTime) + "ms <br>");
  });

  modalMsgSetup("Experiment End", "Thank you for participating the experiment<br>" + recordText, masterExperimentRun, "Next Participant");
}


function targetResponseSetup(){

  $("#targetImg").on("click", function(){
      sessionTerminate();
      if(sessionCount < sessionMax){
        modalMsgSetup("Session End", "You found the target, ready for the next one?", sessionSetup, "Next Session");
        //sessionSetup();
      }
      else{
        experimentTerminate();
      }
  });

}

function modalMsgSetup(title, msg, callback, buttonMsg){

  $("#ModalTitle").html(title );
  $("#ModalContent").html(msg );
  $("#modalClose").html(buttonMsg);
  $("#experimentMessageModal").modal('show');

  //$("#modalClose").click(callback);
  $("#experimentMessageModal").off('hidden.bs.modal');
  $("#experimentMessageModal").on('hidden.bs.modal', callback);
  //$("#modalClose").click(function(){sessionStart();});
}

function debugKeySetup(){
  $(document).keypress(function(event){
    if(event.key == 't'){
      //$(document).scrollTop($("#targetImg").position().top);
      duration = Math.abs($("#targetImg").position().top - $(window).scrollTop())/5;
      console.log("duration : "  + duration);
      $("html, body").stop().animate({scrollTop:$("#targetImg").position().top}, duration, 'swing', function() { });
    }
  });
}

function targetDescription(){
  targetLocStr = "";
  $(window).scrollTop(sessionStartPos());
  if($("#targetImg").position().top > sessionStartPos()){
    targetLocStr = "Scroll DOWN for the target";
  }
  else{
    targetLocStr = "Scroll UP for the target"; 
  }

  console.log("start location : " + sessionStartPos());
  console.log("target location: " + $("#targetImg").position().top);

  return "Please find the target image: <br> <img src='./img/"+folder+"/target.jpg' width='300' height='200'><br>"+targetLocStr;
}

function sessionSetup(){
  /*
      Setup content
  */

  folder = "01_animal";
  output = genContent(folder);

  sessionCount += 1;

  targetResponseSetup();
  modalMsgSetup("Session " + sessionCount  ,  targetDescription() , sessionStart, "Start Session");
  debugKeySetup();
}



function sessionStart(){
  console.log("session start");

  traceTimeUpdate = Array();
  traceTimeBase = Date.now();
  $(window).off("scroll");
  $(window).scroll(function(){
    sessionInfo.moveTrace.push($(window).scrollTop());
    traceTimeUpdate.push(Date.now()-traceTimeBase);
  });

  sessionInfo = {
      startTime: Date.now(),
      endTime: null,
      moveTrace: Array(), 
      startPosition:$(window).scrollTop(), 
      targetPosition:$("#targetImg").position().top,
      scrollSpeed: scrollSpeed,
  };

}

function drawMoveTrace(){

    if(traceLineChart != null)
      traceLineChart.destroy();

    var ctx = document.getElementById("traceLineChart");

    traceLineChart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: traceTimeUpdate,
              datasets: [{
                label:"Movement Trace",
                data:sessionInfo.moveTrace,
                borderColor: "#3e95cd",
                fill:false
              }]
            },
            options: {  responsive:false, 
                        animation:{duration:0},
                        scales:{
                          yAxes:[{
                            ticks:{
                              max:$(document).height(),
                              min:0,
                            }
                          }]
                        }
                      }
    });

    traceLineChart.update(0);
}

function sessionTerminate(){
  /*
      Record the data. 
  */

  sessionInfo.endTime = Date.now();
  expRecord[expRecord.length - 1].push(sessionInfo);

  drawMoveTrace();

  console.log("session time : " + (sessionInfo.endTime - sessionInfo.startTime)/1000 + "s");
  debugMsg("session time : " + (sessionInfo.endTime - sessionInfo.startTime)/1000 + "s");
}


function setConfig(){
  sessionMax = 2;
  sessionCount = 0;
  minChapters = 3;
  maxChapters = 4; 
  randChapterNum = null; 
}

function initRecord(){
  expRecord = Array();
  traceLineChart = null;
}

function masterExperimentSetup(){
  setConfig();
  initRecord();
}

function masterExperimentRun(){
  /* potentially this could determine if we should continue run a new experiment or not */
  experimentSetup();
}



$(document).ready(function(){
  masterExperimentSetup();
  masterExperimentRun();
}); 



