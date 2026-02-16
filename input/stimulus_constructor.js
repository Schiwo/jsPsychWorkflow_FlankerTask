/**
 * Constructs a jsPsych trial object based on the specified trial part type and stimulus information.
 *
 * This function creates trial objects for different parts of a flanker task trial (e.g., fixation cross,
 * blank screen, stimulus-onset asynchrony period, target display, and feedback). It extracts stimulus
 * parameters from the trial list, constructs the visual HTML elements for the stimuli, and assembles
 * a jsPsych-compatible trial object with all necessary parameters and data logging.
 *
 * @param {Object} expInfo - The experiment information object containing stimulus sets, timings, and configuration.
 * @param {string} trialPart - The type of trial part to construct (e.g., "fixationcross", "target", "feedback").
 * @param {Array} list - The trial list containing factor levels for the current trial (or null for non-stimulus trials).
 * @param {number} trialNr - The trial number within the current block.
 * @param {number} blockNr - The block number.
 * @param {boolean} training - Whether this is part of a training block. Defaults to false.
 * @returns {Object} A jsPsych trial object configured for the specified trial part.
 */
function stimulusConstructor(expInfo, trialPart, list, trialNr, blockNr, training=false) {
  // --- Extract stimulus parameters from the trial list ---
  // If a trial list is provided, extract the congruency, stimulus set, and option to determine the target and flanker stimuli.
  if (list) {  
    // Current trial congruency (0 = congruent, 1 = incongruent)
    currentCongruency = list[trialNr][0];
    // Previous trial congruency (for potential sequential effects analysis)
    prevCongruency = list[trialNr][1];
    // Which set of stimuli to use (e.g., arrows vs. letters)
    stimulusSet = list[trialNr][2];
    // Which stimulus variant within the set (e.g., left vs. right arrow)
    stimulusOption = list[trialNr][3];
    // Determine the target stimulus based on stimulus set and option
    target = expInfo.stimuli[stimulusSet][stimulusOption];
    // Determine the flanker stimulus based on congruency (0 = same as target, 1 = opposite)
    flanker = expInfo.stimuli[stimulusSet][(stimulusOption + currentCongruency) % 2];
   
    // --- Create HTML elements for visual display ---
    // Format flanker elements with appropriate styling
    flankerElement = "<div style=\"font-size:" + expInfo.stimulusSize + "px; width:50px\">" + flanker +  "</div>";
    // Format target element with appropriate styling
    targetElement = "<p style=\""+"font-size:" + expInfo.stimulusSize + "px; width:50px\">" + target  + "</div>";
  }

  // --- Construct the appropriate trial object based on trial part type ---
  // Different trial parts (fixation, target, feedback, etc.) have different configurations.

  if (trialPart == "fixationcross") {
    // Display a fixation cross (+) for a fixed duration with no response collection.
    trialObject = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: "<div style=\"font-size:" + expInfo.stimulusSize + "px;\">" + "+" +  "</div>",
      choices: "NO_KEYS",
      trial_duration: expInfo.fixationcrossDuration
    };

  } else if (trialPart == "blank") {
    // Display a blank screen with no response collection.
    trialObject = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: "",
      choices: "NO_KEYS",
      trial_duration: expInfo.blankDuration
    };

  } else if (trialPart == "soa") {
    // Stimulus-onset asynchrony: Display flankers only (no target) for a brief period with no response collection.
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
    // Display target surrounded by flankers and collect keyboard response.
    // Measure accuracy and record response time.
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
      // Calculate accuracy after the response is recorded
      on_finish: (data) => {
        data.accuracy = checkAccuracy(data)
      }

    };

  } else if (trialPart == "feedback") {
    // Display feedback (error highlight) after incorrect responses only.
    trialObject = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: () => { return fdbStimulus()},
      choices: "NO_KEYS",
      // Only show feedback if the previous response was incorrect (accuracy == false)
      trial_duration: () => { return (jsPsych.data.get().last(1).values()[0].accuracy == true)? 0:expInfo.feedbackDuration},
      // Return background to normal after feedback
      on_finish: () => { normalBackground()}
    };

  } else if (trialPart == "posFeedback") {
    // Display positive feedback (reward highlight) after correct responses only.
    trialObject = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: () => { return posFdbStimulus()},
      choices: "NO_KEYS",
      // Only show feedback if the previous response was correct (accuracy == true)
      trial_duration: () => { return (jsPsych.data.get().last(1).values()[0].accuracy == true)? 0:expInfo.feedbackDuration},
      // Return background to normal after feedback
      on_finish: () => { normalBackground()}
    };
  }

  // --- Attach trial data for logging and analysis ---
  // Initialize the data object for this trial.
  trialObject.data = {};
  // Record the trial number within the block.
  trialObject.data.trial = trialNr;
  // Record the block number.
  trialObject.data.block = blockNr;
  // Record the trial part type for later analysis.
  trialObject.data.trialPart = trialPart
  // If stimulus information is available, log congruency, target, flanker, and correct response.
  if(list) {
    trialObject.data.congruency = (currentCongruency == 0)? "congruent":"incongruent";
    trialObject.data.target = target;
    trialObject.data.flanker = flanker;
    trialObject.data.correctResp =  expInfo.keys[stimulusSet][stimulusOption];
  }

  // --- Apply skim mode adjustments ---
  // If in skim mode (testing), set all trial durations to 0 for rapid execution.
  if (skimMode) {
    trialObject.trial_duration = 0;
  }

  return trialObject;
}
