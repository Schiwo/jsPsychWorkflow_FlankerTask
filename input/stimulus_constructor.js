function stimulusConstructor(trialPart, list, trialNr, blockNr, training) {
  if (list) {  
    currentCongruency = list[trialNr][0];
    prevCongruency = list[trialNr][1];
    stimulusSet = list[trialNr][2];
    stimulusOption = list[trialNr][3];
    target = expInfo.stimuli[stimulusSet][stimulusOption];
    flanker = expInfo.stimuli[stimulusSet][(stimulusOption + currentCongruency) % 2];
   
    flankerElement = "<div style=\"font-size:" + expInfo.stimulusSize + "px; width:50px\">" + flanker +  "</div>";
    targetElement = "<p style=\""+"font-size:" + expInfo.stimulusSize + "px; width:50px\">" + target  + "</div>";
  }


  if (trialPart == "fixationcross") {

    trialObject = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: "<div style=\"font-size:" + expInfo.stimulusSize + "px;\">" + "+" +  "</div>",
      choices: "NO_KEYS",
      trial_duration: expInfo.fixationcrossDuration
    };

  } else if (trialPart == "blank") {

    trialObject = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: "",
      choices: "NO_KEYS",
      trial_duration: expInfo.blankDuration
    };

  } else if (trialPart == "soa") {

    trialObject = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: "<table style=\"table-layout: fixed; width:100px\">" +
          "<tr>" +
            "<td>" + flankerElement + "</td>" +
            "<td>" + "</td>" +
            "<td>" + flankerElement + "</td>" +
          "</tr>" + 
        "</table>",
      choices: "NO_KEYS",
      trial_duration: expInfo.soaDuration
    };

  } else if (trialPart == "target") {

    trialObject = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: "<table style=\"table-layout: fixed; width:100px\">" +
          "<tr>" +
            "<td>" + flankerElement + "</td>" +
            "<td>" + targetElement + "</td>" +
            "<td>" + flankerElement + "</td>" +
          "</tr>" + 
        "</table>",
      choices: expInfo.keys.flat(),
      stimulus_duration: expInfo.targetDuration,
      trial_duration: expInfo.targetDuration + expInfo.responseWindowDuration,
      on_finish: (data) => {
        data.accuracy = checkAccuracy(data)
      }

    };

  } else if (trialPart == "feedback") {

    trialObject = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: () => { return fdbStimulus()},
      choices: "NO_KEYS",
      trial_duration: () => { return (jsPsych.data.get().last(1).values()[0].accuracy == true)? 0:expInfo.feedbackDuration},
      on_finish: () => { normalBackground()}
    };

  } else if (trialPart == "posFeedback") {

    trialObject = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: () => { return posFdbStimulus()},
      choices: "NO_KEYS",
      trial_duration: () => { return (jsPsych.data.get().last(1).values()[0].accuracy == true)? 0:expInfo.feedbackDuration},
      on_finish: () => { normalBackground()}
    };
  }


  trialObject.data = {};
  trialObject.data.trial = trialNr;
  trialObject.data.block = blockNr;
  trialObject.data.trialPart = trialPart
  if(list) {
    trialObject.data.congruency = (currentCongruency == 0)? "congruent":"incongruent";
    trialObject.data.target = target;
    trialObject.data.flanker = flanker;
    trialObject.data.correctResp =  expInfo.keys[stimulusSet][stimulusOption];
  }

  if (skimMode) {
    trialObject.trial_duration = 0;
  }

  return trialObject;
}
