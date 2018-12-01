var Pressure = require('pressure');

var $ = require("jquery");
var Chart = require("chart.js");
var loremIpsum = require("lorem-ipsum");
var seedrandom = require('seedrandom');


require("bootstrap");

function debugMsg(msg){
      $("#debug_text").html(msg);
}

seedrandom('hello.', { global: true });
console.log('rnd:'+Math.random());

var timeUpdate = [];
var forceTimeline = [];
var chartTimeUpdate = [];
var chartForceTimeline = [];
var forceLineChart = null;



function forceUpdate(force){
        //debugMsg(force);

        if(inSession){
          sessionInfo.forceLog.push(force);
          sessionInfo.forceLogTime.push(Date.now());
        }
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

function recordTrace(e){
    xUp = e.pageX;
    yUp = e.pageY;
    tUp = Date.now();

    xTraverse = xUp - xDown;
    yTraverse = yUp - yDown;
    timeElapsed = tUp - tDown;

    if ((Math.abs(xTraverse) > 30 || Math.abs(yTraverse) > 30 ) && (timeElapsed < 1000))  {
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

}

curExpriment = null;
$("#touchDetectArea").on("mousedown", function(e){
  if(curExperiment == null){

  }
  else if(expParams[curExperiment].technique == TECH.FP){
    startFPScroll(e);
  }
  else if(expParams[curExperiment].technique == TECH.SFP){
    startSFPScroll(e);
  }
  else{

  }

  debugMsg("mouse down detected");
  xDown = e.pageX;
  yDown = e.pageY;
  tDown = Date.now();
})
.on("mouseup", function(e){
  console.log("INTERACTION - mouseup");

  if(curExperiment == null){

  }
  else if( expParams[curExperiment].technique == TECH.FS ){
    recordTrace(e);
  }
  else if(expParams[curExperiment].technique == TECH.FP){
    endFPScroll();
  }
  else if(expParams[curExperiment].technique == TECH.SFP){
    endSFPScrolll();
  }
  else if(expParams[curExperiment].technique == TECH.TEST){
    endFPScroll();
    recordTrace(e);
  }

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



function animateScroll(targetPos){
      // v = distance/time = distance(px) / (distance/5) = 5 px/ms = 5000 px/s
      duration = Math.abs(targetPos - $(window).scrollTop())/scrollSpeed;
      console.log("duration : "  + duration);
      $("html, body").stop().animate({scrollTop:targetPos}, duration, 'swing', function() { });
}

var INTERACTION = Object.freeze({"normalScroll":0,"fsPrev":2,"fsNext":3, "fpPrevStart":4, "fpNextStart":5, "mouseDown":6, "fpStop":7});


function ScrollToPrevChapter(){
  sessionInfo.interactionLog.push(INTERACTION.fsPrev);
  sessionInfo.interactionLogTime.push(Date.now())
  console.log("INTERACTION - fsPrev");
  isNormalScroll = false;

  var curChapterNum = getCurrentChapter();
  var curChapterID = "#ch"+ curChapterNum;
  var prevChapterID = "#ch"+ (curChapterNum-1);
  targetPos = 0;

  if( $(curChapterID).position().top < $(window).scrollTop() ){
    targetPos = $(curChapterID).position().top;
  }
  else{
    if(curChapterNum == 1)
      targetPos = $(curChapterID).position().top;
    else
      targetPos = $(prevChapterID).position().top;
  }

  animateScroll(targetPos);
}

function ScrollToNextChapter(){
  sessionInfo.interactionLog.push(INTERACTION.fsNext);
  sessionInfo.interactionLogTime.push(Date.now())
  console.log("INTERACTION - fsNext");
  isNormalScroll = false;

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


    if (Math.max.apply(Math, forceTimeline) > forceStart){ 
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
        if(curExperiment == null){

        }
        else if(expParams[curExperiment].technique == TECH.FP || expParams[curExperiment].technique == TECH.TEST ){
            //startFPScroll();
        }
        else if(expParams[curExperiment].technique == TECH.SFP){

        }
        else{

        }
    },
  end: function(force, event){
        //console.log(force);
        //forceUpdate(force);

        if(curExperiment == null){

        }
        else if(expParams[curExperiment].technique == TECH.FP || expParams[curExperiment].technique == TECH.TEST ){
            endFPScroll();
        }
        else if(expParams[curExperiment].technique == TECH.SFP){
            endSFPScroll();
        }
        else{

        }
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
        if(curExperiment == null){

        }
        else if(expParams[curExperiment].technique == TECH.FP || expParams[curExperiment].technique == TECH.TEST ){
          setFPScrollSpeed(force);
        }
        else if(expParams[curExperiment].technique == TECH.SFP){
          setFPScrollSpeed(force);
        }
    }
  }
  );

function sigmoid(t, c, a, k) {
    return c/(1 + a * Math.pow(Math.E, -t));
}

function setFPScrollSpeed(force){

  FPScrollSpeed = sigmoid(force * 12 - 6, 100, 1, 0.5);
}

function FPScroll(){
  console.log("FPScrolling");
  //console.log(FPScrollSpeed);
  if(dirFPScroll == DIRECTION.DOWN){
    $(document).scrollTop($(window).scrollTop() + FPScrollSpeed);
  }
  else{
    $(document).scrollTop($(window).scrollTop() - FPScrollSpeed);
  }
}

var intFPScroll = null;
var dirFPScroll = null;

function startFPScroll(e){
  console.log("start FPScroll");

  console.log("clientY: " + e.clientY);

  if(e.clientY > $(window).height()/2 ){
    sessionInfo.interactionLog.push(INTERACTION.fpNextStart );
    sessionInfo.interactionLogTime.push(Date.now())
    isNormalScroll = false;

    dirFPScroll = DIRECTION.DOWN;
  }
  else{
    sessionInfo.interactionLog.push(INTERACTION.fpPrevStart );
    sessionInfo.interactionLogTime.push(Date.now())
    isNormalScroll = false;

    dirFPScroll = DIRECTION.UP;
  }
  clearInterval(intFPScroll);
  intFPScroll = setInterval(FPScroll, 5);
  console.log(intFPScroll);
}
var inSFPS = false;
function startSFPScroll(e){
  console.log("start scroll then FP");
  inSFPS = true;
  dirFPScroll = lastScrollDir
  sessionInfo.interactionLog.push(INTERACTION.sfpStart );
  isNormalScroll = false;
  sessionInfo.interactionLogTime.push(Date.now());
  clearInterval(intFPScroll); 
  intFPScroll = setInterval(FPScroll, 5);
}

function endSFPScrolll(){
  console.log("end scroll then FP");
  inSFPS = false;
  sessionInfo.interactionLog.push(INTERACTION.sfpStop );
  isNormalScroll = false;
  sessionInfo.interactionLogTime.push(Date.now());
  clearInterval(intFPScroll);  
}



function endFPScroll(){
  console.log("end FPScroll");
  sessionInfo.interactionLog.push(INTERACTION.fpStop );
  isNormalScroll = false;
  sessionInfo.interactionLogTime.push(Date.now())
  clearInterval(intFPScroll);
}



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

function genVisual(){

  indicatorHeight = 10;

  targetIndicatorPos = ($("#targetImg").position().top + $("#targetImg").height()/2) / $(document).height() * $(window).height() - indicatorHeight/2;
  targetDiv = "<div class='position-fixed' style='color:red;right:10px;top:"+targetIndicatorPos+"px;height:"+indicatorHeight+"px;border: 2px solid #73AD21;width:50px;'></div>";

  //targetDiv = "<div class='position-fixed' style='color:red;right:10px;top:"+targetIndicatorPos+"px;height:"+indicatorHeight+"px;border: 3px solid #73AD21;'> →→→→→→ </div>";


  ChapterIndicatorDiv = "";
  for(i = 0 ; i < randChapterNum ; i++){

    var curChapterID = "#ch"+ (i+1);
    var curChapterIndicatorPos = $(curChapterID).position().top / $(document).height() * $(window).height();
    ChapterIndicatorDiv += "<div class='position-fixed' style='z-index: 1;color:blue;right:10px;height:"+indicatorHeight+"px;top:"+curChapterIndicatorPos+"px;border: 2px solid blue;width:50px;'></div>";
  }

  console.log(ChapterIndicatorDiv);


  Result = targetDiv + ChapterIndicatorDiv;
  return Result;
}


function genContent(folder){

  if(isTestSession)
    Math.seedrandom();
  else
    seedrandom('hello.world', { global: true });

  while(true){

    randChapterNum = Math.floor(Math.random() * (maxChapters-minChapters) + minChapters);
    targetChapter = Math.floor(Math.random() * randChapterNum);
    console.log("target chapter is " + targetChapter);

    fullContent = "";
    for(i = 0 ; i < randChapterNum ; i++){
      fullContent += genChapter(i+1, maxChapters,folder, (i == targetChapter));
    }


    $("#randomTextArea").html(fullContent);

    if(!expParams[curExperiment].isTestSession)
      overrideTargetLocationFromStart( expParams[curExperiment].targetLoc[curSession] * expParams[curExperiment].targetDir[curSession]  );

    $("#visualGenArea").html(genVisual());

    if(!withinView($("#targetImg").position().top, $("#targetImg").height(), sessionStartPos()))
      break;
  }

}

function genRandomImage( folder, maxID, isTarget = false){
  randImgNum =  Math.floor(Math.random() * maxID) + 1;

  console.log("genRandomImage: " + randImgNum);

  if(isTarget)
    return "<img src='img/"+folder+"/target.jpg' id='targetImg' style='position:absolute;' width='600' height='400'>";
  else
    return ""; // No image other than the target
    //return "<img src='img/"+folder+"/"+randImgNum+".jpg' width='600' height='400'>";
}

function experimentSetup(){


  /* expParams = [
    {
      "expName": "TestSession",
      "technique": TECH.TEST,
      "minChapters": 3,
      "maxChapters": 4,
      "scrollSpeed": 5,  


            "sessionMax":4,
      "targetLoc": [TDIST.SHORT, TDIST.MEDIUM, TDIST.LONG, TDIST.SHORT],
      "targetLocDir": [TDIR.UP, TDIR.DOWN, TDIR.UP, TDIR.DOWN],
      "TestSession":true,    
    },*/


  minChapters = expParams[curExperiment].minChapters;
  maxChapters = expParams[curExperiment].maxChapters;
  scrollSpeed = expParams[curExperiment].scrollSpeed;
  forceStart = expParams[curExperiment].forceStart;
  sessionMax = expParams[curExperiment].sessionMax;
  isTestSession = expParams[curExperiment].isTestSession;

  //targetLoc = expParams[curExperiment].targetLoc;
  //targetDir = expParams[curExperiment].targetDir;

  expRecord.push(Array());
  sessionCount = 0;
  modalMsgSetup("Experiment " + curExperiment+ " Start", expParams[curExperiment].expDesc , sessionSetup, "Start the experiment");


  $("#forceBar").toggle(expParams[curExperiment].showForceBar);

}

function experimentTerminate(){
  /*
      Show "Thank you" screen, 
  */
  curExperiment += 1;



  recordText = "";
  expRecord[expRecord.length - 1].forEach(function(item, index, array){
      recordText += ("Session " + index + ": " + (item.endTime - item.startTime) + "ms <br>");
  });

  downloadFilename = 'FS_P' + curParticipant + '_' + expParams[curExperiment-1].expName + '.json';

  hrefData = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(expRecord));
  modalMsgSetup("Experiment End", "experiment "+ (curExperiment) + "/" + expParams.length + "done, <br><a href='"+hrefData+"' download='"+downloadFilename+" id='expDataDownload'>experiment data</a><br>" + recordText, masterExperimentRun, "Next Experiment", null, "", 3);
}


function targetResponseSetup(){

  $("#targetImg").on("click", function(){
      sessionTerminate();

//      if(expParams[curExperiment].technique == TECH.TEST){
      if(isTestSession == true){
        modalMsgSetup("Session End", "You found the target. Do you want to practice more?", sessionSetup, "Try Again", experimentTerminate ,"Start");
      }
      else{
        if(sessionCount < sessionMax){
          modalMsgSetup("Session End", "You found the target, ready for the next one?", sessionSetup, "Next Session");
          //sessionSetup();
        }
        else{
          experimentTerminate();
        }
      }
  });

}

function modalEnable(){
  $("#modalClose").prop('disabled', false);
    console.log("modal Close enabled!!");
}

function modalMsgSetup(title, msg, callback, buttonMsg, callback2 = null ,buttonMsg2 = "", waitTime = 0){

  if(waitTime > 0){
    console.log("modal Close disable!!");
    $("#modalClose").prop('disabled', true);
    setTimeout(modalEnable,waitTime * 1000);
  }

  $("#ModalTitle").html(title );
  $("#ModalContent").html(msg );
  $("#modalClose").html(buttonMsg);
  $("#experimentMessageModal").modal('show');

  //$("#modalClose").click(callback);
  $("#experimentMessageModal").off('hidden.bs.modal');
  $("#experimentMessageModal").on('hidden.bs.modal', callback);
  //$("#modalClose").click(function(){sessionStart();});

  $("#modalTry").html(buttonMsg2);
  if(buttonMsg2 == "")
    $("#modalTry").hide();
  else{
    $("#modalTry").show();
  
    $("#modalTry").on("click", function(){
      console.log("modalTry clicked");
      $("#experimentMessageModal").off('hidden.bs.modal');
      $("#experimentMessageModal").on('hidden.bs.modal', callback2); 
      $("#experimentMessageModal").modal('hide');
    });

  }
}

function debugKeySetup(){
  $(document).keypress(function(event){
    if(event.key == 't'){
      $(document).scrollTop($("#targetImg").position().top);


      //animateScroll($("#targetImg").position().top);
    }
  });
}

function targetDescription(){
  targetLocStr = "";
  $(window).scrollTop(sessionStartPos());
  if($("#targetImg").position().top > sessionStartPos()){
    targetLocStr = "Scroll <strong style='color:red'>DOWN</strong> for the target";
  }
  else{
    targetLocStr = "Scroll <strong style='color:red'>UP</strong> for the target"; 
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
  sessionCount += 1;
  curSession = sessionCount -1;

  output = genContent(folder);


  targetResponseSetup();
  modalMsgSetup("Session " + sessionCount  ,  targetDescription() , sessionStart, "Start Session");
  debugKeySetup();
}

function chapterLocationInfo(){
  
  var chpLocInfo = Array();
  for(var i = 1 ; i <= randChapterNum ; i++){
      iterChapter = "#ch"+i;
      iterChapterTop = $(iterChapter).position().top;      
      chpLocInfo.push(iterChapterTop);
  }
  return chpLocInfo;
}
var lastScrollTop = null;
var lastScrollDir = null;
function sessionStart(){
  console.log("session start");
  inSession = true;
  traceTimeUpdate = Array();
  traceTimeBase = Date.now();
  $(window).off("scroll");
  lastScrollTop = $(window).scrollTop();

  $(window).on("scroll", function(){
    if(isNormalScroll){
       var st = $(this).scrollTop();
       if (st > lastScrollTop){
           // downscroll code
           console.log("normal scroll down.");
           lastScrollDir = DIRECTION.DOWN;
       } else {
          // upscroll code
          console.log("normal scroll up.");
          lastScrollDir = DIRECTION.UP;
       }
       lastScrollTop = st;
     }
  })

  $(window).scroll(function(){
    sessionInfo.moveTrace.push($(window).scrollTop());
    sessionInfo.moveTraceTime.push(Date.now());
    traceTimeUpdate.push(Date.now()-traceTimeBase);
  });

  sessionInfo = {
      startTime: Date.now(),
      endTime: null,
      moveTrace: Array(), 
      moveTraceTime: Array(),
      interactionLog:Array(),
      interactionLogTime:Array(),
      forceLog:Array(),
      forceLogTime: Array(),
      startPosition:$(window).scrollTop(), 
      targetPosition:$("#targetImg").position().top,
      scrollSpeed: scrollSpeed,
      chapterLocation:chapterLocationInfo(),
      documentHeight:$(document).height(),
      windowHeight:$(window).height(),
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
  inSession = false;

  $(window).off("scroll");
  sessionInfo.endTime = Date.now();
  expRecord[expRecord.length - 1].push(sessionInfo);

  drawMoveTrace();

  console.log("session time : " + (sessionInfo.endTime - sessionInfo.startTime)/1000 + "s");
  debugMsg("session time : " + (sessionInfo.endTime - sessionInfo.startTime)/1000 + "s");
}

var TECH = Object.freeze({"TEST":0,"TD":1, "FS": 2, "FP":3, "SFP":4});


function overrideTargetLocation(newLoc){
  console.log("Target Loc Override Absolute :" + newLoc + ", " + curSession);
  $("#targetImg").offset({top: newLoc, left: $(window).width()/2 - $("#targetImg").width()/2});
}

function overrideTargetLocationFromStart(relativeLoc){
  console.log("Target Loc Override Relative :" + relativeLoc);
  overrideTargetLocation($(document).height()/2 + relativeLoc);
}


var TLOC = Object.freeze({"SHORT":4000, "MEDIUM":10000, "LONG":15000});
var TDIR = Object.freeze({"UP":-1, "DOWN":1});

function setConfig(){
  sessionMax = 4;
  sessionCount = 0;
  minChapters = 3;
  maxChapters = 4; 
  scrollSpeed = 5; // px/ms
  randChapterNum = null; 

  curExperiment = 0;
  forceStart = 0.5;
  // EXPPARAMS START HERE -----------
  expParams = [
// P4 241
    // block 0 (test)
    {
      "expName": "TestSession",
      "expDesc": "This is a practice session to get you familiar with the environment. The task of all experiments are to locate the target image. There's only one image in the whole document.",
      "technique": TECH.TD,
      "minChapters": 5,
      "maxChapters": 6,
      "scrollSpeed": 3,
      "showForceBar": false,
      "forceStart": 0.5,

      "sessionMax":5,
      "isTestSession":true,
    },
    {
      "expName": "TestSession",
      "expDesc": "This is a practice session to get you familiar with the environment. The task of all experiments are to locate the target image. There's only one image in the whole document.",
      "technique": TECH.FS,
      "minChapters": 5,
      "maxChapters": 6,
      "scrollSpeed": 3,
      "showForceBar": false,
      "forceStart": 0.5,

      "sessionMax":5,
      "isTestSession":true,
    },
    {
    "expName": "TestSession",
      "expDesc": "This is a practice session to get you familiar with the environment. The task of all experiments are to locate the target image. There's only one image in the whole document.",
      "technique": TECH.FP,
      "minChapters": 5,
      "maxChapters": 6,
      "scrollSpeed": 3,
      "showForceBar": false,
      "forceStart": 0.5,

      "sessionMax":5,
      "isTestSession":true,
    },
    // block 1, 2
    { 
      "expName": "Traditional",
      "expDesc": "In this session, only traditional scrolling can be used to locate the target image.",
      "technique": TECH.TD,
      "minChapters": 3,
      "maxChapters": 5,
      "scrollSpeed": 5,
      "showForceBar": false,
      "forceStart": 0.5,

      "sessionMax":5,
"targetLoc": [TLOC.SHORT, TLOC.MEDIUM, TLOC.SHORT, TLOC.MEDIUM, TLOC.LONG],
      "targetDir": [TDIR.DOWN, TDIR.UP, TDIR.UP, TDIR.DOWN, TDIR.DOWN],
      "isTestSession":false,
    },
    { 
      "expName": "ForceScroll",
      "expDesc": "In this session, both the ForceScroll and traditional scrolling technique can be used to locate the target image.",
      "technique": TECH.FS,
      "minChapters": 3,
      "maxChapters": 5,
      "scrollSpeed": 5,
      "showForceBar": false,
      "forceStart": 0.5,

      "sessionMax":5,
"targetLoc": [TLOC.SHORT, TLOC.MEDIUM, TLOC.SHORT, TLOC.MEDIUM, TLOC.LONG],
      "targetDir": [TDIR.DOWN, TDIR.UP, TDIR.UP, TDIR.DOWN, TDIR.DOWN],    
      "isTestSession":false,
    },
    { 
      "expName": "ForcePress",
      "expDesc": "In this session, only the ForcePress technique can be used to locate the target image.",
      "technique": TECH.FP,
      "minChapters": 3,
      "maxChapters": 5,
      "scrollSpeed": 5,
      "showForceBar": true,
      "forceStart": 0.5,

      "sessionMax":5,
"targetLoc": [TLOC.SHORT, TLOC.MEDIUM, TLOC.SHORT, TLOC.MEDIUM, TLOC.LONG],
      "targetDir": [TDIR.DOWN, TDIR.UP, TDIR.UP, TDIR.DOWN, TDIR.DOWN],
      "isTestSession":false,
    },
    // block 2, 4
    { 
      "expName": "Traditional",
      "expDesc": "In this session, only the Traditional technique can be used to locate the target image.",
      "technique": TECH.TD,
      "minChapters": 3,
      "maxChapters": 5,
      "scrollSpeed": 5,
      "showForceBar": false,
      "forceStart": 0.5,

      "sessionMax":5,
"targetLoc": [TLOC.MEDIUM, TLOC.LONG, TLOC.MEDIUM, TLOC.LONG, TLOC.SHORT],
      "targetDir": [TDIR.DOWN, TDIR.UP, TDIR.UP, TDIR.UP, TDIR.DOWN],
      "isTestSession":false,
    },   
    { 
      "expName": "ForceScroll",
      "expDesc": "In this session, both the ForceScroll and traditional scrolling technique can be used to locate the target image.",
      "technique": TECH.FS,
      "minChapters": 3,
      "maxChapters": 5,
      "scrollSpeed": 5,
      "showForceBar": false,
      "forceStart": 0.5,

      "sessionMax":5,
 "targetLoc": [TLOC.MEDIUM, TLOC.LONG, TLOC.MEDIUM, TLOC.LONG, TLOC.SHORT],
      "targetDir": [TDIR.DOWN, TDIR.UP, TDIR.UP, TDIR.UP, TDIR.DOWN],     "isTestSession":false,
    },
    { 
      "expName": "ForcePress",
      "expDesc": "In this session, only the ForcePress technique can be used to locate the target image.",
      "technique": TECH.FP,
      "minChapters": 3,
      "maxChapters": 5,
      "scrollSpeed": 5,
      "showForceBar": true,
      "forceStart": 0.5,

      "sessionMax":5,
"targetLoc": [TLOC.MEDIUM, TLOC.LONG, TLOC.MEDIUM, TLOC.LONG, TLOC.SHORT],
      "targetDir": [TDIR.DOWN, TDIR.UP, TDIR.UP, TDIR.UP, TDIR.DOWN],
      "isTestSession":false,
    },
    // block 3, 1
    { 
      "expName": "Traditional",
      "expDesc": "In this session, only the Traditional technique can be used to locate the target image.",
      "technique": TECH.TD,
      "minChapters": 3,
      "maxChapters": 5,
      "scrollSpeed": 5,
      "showForceBar": false,
      "forceStart": 0.5,

      "sessionMax":5,
"targetLoc": [TLOC.SHORT, TLOC.SHORT, TLOC.LONG, TLOC.MEDIUM, TLOC.LONG],
      "targetDir": [TDIR.UP, TDIR.DOWN, TDIR.DOWN, TDIR.UP, TDIR.UP],
      "isTestSession":false,
    },
    { 
      "expName": "ForceScroll",
      "expDesc": "In this session, both the ForceScroll and traditional scrolling technique can be used to locate the target image.",
      "technique": TECH.FS,
      "minChapters": 3,
      "maxChapters": 5,
      "scrollSpeed": 5,
      "showForceBar": false,
      "forceStart": 0.5,

      "sessionMax":5,
"targetLoc": [TLOC.SHORT, TLOC.SHORT, TLOC.LONG, TLOC.MEDIUM, TLOC.LONG],
      "targetDir": [TDIR.UP, TDIR.DOWN, TDIR.DOWN, TDIR.UP, TDIR.UP],
      "isTestSession":false,
    },
    { 
      "expName": "ForcePress",
      "expDesc": "In this session, only the ForcePress technique can be used to locate the target image.",
      "technique": TECH.FP,
      "minChapters": 3,
      "maxChapters": 5,
      "scrollSpeed": 5,
      "showForceBar": true,
      "forceStart": 0.5,

      "sessionMax":5,
"targetLoc": [TLOC.SHORT, TLOC.SHORT, TLOC.LONG, TLOC.MEDIUM, TLOC.LONG],
      "targetDir": [TDIR.UP, TDIR.DOWN, TDIR.DOWN, TDIR.UP, TDIR.UP],
      "isTestSession":false,
    },

  ];
  // EXPPARAMS END HERE

}

function initRecord(){
  expRecord = Array();
  traceLineChart = null;
  inSession = false;
}

function masterExperimentSetup(){
  setConfig();
  initRecord();
}

function masterExperimentRun(){
  /* potentially this could determine if we should continue run a new experiment or not */
  initRecord(); 
  if(curExperiment < expParams.length )
    experimentSetup();
  else
    thankParticipant();
}

function thankParticipant(){
  modalMsgSetup("Experiment End", "Thank you for participating in the experiment.", newParticipant, "Next Participant");
}


function newParticipant(){
  curParticipant += 1;
  curExperiment = 0;

  masterExperimentSetup();
  masterExperimentRun();  
}

// Using code snippet from Tom Bates @ stackOverflow: 
// https://stackoverflow.com/questions/8858994/let-user-scrolling-stop-jquery-animation-of-scrolltop
// Stop the animation if the user scrolls. Defaults on .stop() should be fine
// bind is replaced with on since from jQuery 3.0 bind is deprecated

function stopAnimation(){

}

var isNormalScroll = false;

$('body').on("DOMMouseScroll mousewheel", function(e){
  if( inSession ){
    sessionInfo.interactionLog.push(INTERACTION.normalScroll );
    sessionInfo.interactionLogTime.push(Date.now())
    console.log("INTERACTION - normalScroll");
    isNormalScroll = true;
  }
  if ( e.which > 0 || e.type === "mousedown" || e.type === "mousewheel"){
      $('html, body').stop(); // This identifies the scroll as a user action, stops the animation, then unbinds the event straight after (optional)
    console.log("stop movement");
  }  
});

$('body').on("mousedown", function(e){
  if( inSession ){
    sessionInfo.interactionLog.push(INTERACTION.mouseDown );
    sessionInfo.interactionLogTime.push(Date.now())
    console.log("INTERACTION - mouseDown");
  }
  if(!inSFPS)
    if ( e.which > 0 || e.type === "mousedown" || e.type === "mousewheel"){
         $('html, body').stop(); // This identifies the scroll as a user action, stops the animation, then unbinds the event straight after (optional)
      console.log("stop movement");
    }
});     

$(document).ready(function(){
  curParticipant = 0;
  newParticipant();
}); 



