// helper functions for different trial templates

//target accuarcy check: check for correct response and add it to trial element data.
function checkAccuracy(data) {
    console.log(data);
    if (!data.response) {
      return 0;
    } else if (data.response.localeCompare(data.correctResp, undefined, { sensitivity: 'accent' }) == 0) {
      return 1;
    } else {
      return 0;
    }
  }

// background color feedback (only for non-correct trials): check for accuracy in previous trial element and change the background color, if incorrect or no response was given.
function fdbStimulus() {
    data = jsPsych.data.get().last(1).values()[0];
    if(data.accuracy){
      return "";
    } else if (data.response == null) {
      document.body.style.background = expInfo.fdbColorIncorrect;
      return "";
    } else {
      document.body.style.background = expInfo.fdbColorIncorrect;
      return "";
    }
  }

// background color and semantic feedback (for correct and non-correct trials): check for accuracy in previous trial element and change the background color + semantic feedback. 
function posFdbStimulus() {
    var data = jsPsych.data.get().last(1).values()[0];
    if(data.accuracy){
      document.body.style.background = expInfo.fdbColorCorrect;
      return "Correct!"; 
    } else if (data.response == null) {
      document.body.style.background = expInfo.fdbColorIncorrect;
      return "Too slow!";
    } else {
      document.body.style.background = expInfo.fdbColorIncorrect;
      return "Wrong"; 
    }
  }

//change the background color to normal.
function normalBackground(){
  document.body.style.background = expInfo.backgroundColor;
}