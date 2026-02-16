/**
 * Builds and adds an experimental block to the timeline.
 *
 * This function constructs a complete block of trials by setting up the block start screen
 * (fixation cross), iterating through the specified number of trials, and constructing each
 * trial based on the provided trial structure and factor levels. For main blocks (not training),
 * it also adds a block pause screen before the block begins.
 *
 * @param {Array} timeline - The timeline array to add the block elements to.
 * @param {Array} tstructure - The trial structure array defining the sequence of stimulus types within each trial.
 * @param {Array} tlist - The list of factor levels for each trial, which determines trial parameters.
 * @param {number} block - The block number (0-indexed).
 * @param {Object} expInfo - The experiment information object containing settings like blockStartDuration.
 * @param {Object} functionalTrials - The functional trials object containing predefined trials like blockPause.
 * @param {boolean} training - Whether this is a training block. Defaults to false.
 * @param {number} trainingLength - The proportion of trials to use for training blocks (e.g., 0.1 for 10%).
 * @returns {Array} The updated timeline with the block and all its trials added.
 */
function buildExperimentalBlock(timeline, tstructure, tlist, block, expInfo, functionalTrials, training = false, trainingLength) {
  // --- Determine the total number of trials for this block ---
  // For training blocks, trials are reduced by the trainingLength factor; otherwise, use all trials.
  blockLength = training? (tlist.length * trainingLength) : tlist.length;

  // --- Add block pause screen (main blocks only) ---
  // Before starting a main experimental block, show a pause screen and record which block is beginning.
  if (!training) {
    let blockPauseCopy = deepCopy(functionalTrials.blockPause);
    blockPauseCopy.data.blockNr = block + 1;
    timeline.push(blockPauseCopy);
  }
  
  // --- Add block start fixation cross ---
  // Display the fixation cross at the beginning of the block. Use negative block numbers for training blocks.
  blockStart = stimulusConstructor(expInfo, "fixationcross", null, null, training? - (block + 1) : (block + 1));
  blockStart.trial_duration = expInfo.blockStartDuration;
  timeline.push(blockStart);

  // --- Add all trials in the block ---
  // For each trial, create a copy of the trial structure and construct each stimulus based on the factor levels.
  for (var i = 0; i < blockLength; i++) {
    let trialCopy = deepCopy(tstructure);
    for (var j = 0; j < trialCopy.length; j++) {
      timeline.push(stimulusConstructor(expInfo, trialCopy[j], tlist, i, block));
    }
  }
  return timeline;
}

/**
 * Builds and adds the experiment start sequence to the timeline.
 *
 * This function adds the initial trials that welcome participants and gather basic information.
 * It includes a browser check to ensure browser compatibility, a welcome screen, and demographic
 * questions (age and gender). These trials are skipped if skimMode is enabled (for testing purposes).
 *
 * @param {Array} timeline - The timeline array to add the start sequence to.
 * @param {Object} functionalTrials - The functional trials object containing predefined sequence trials.
 * @returns {Array} The updated timeline with the experiment start sequence added.
 */
function buildExperimentStart(timeline, functionalTrials) {
  // --- Add experiment initialization trials (skip if in skim mode) ---
  if (!skimMode) {
    // Check the participant's browser for compatibility.
    timeline.push(functionalTrials.browserCheck);
    // Display welcome message to the participant.
    timeline.push(functionalTrials.welcome);
    // Ask the participant for their age and gender information.
    timeline.push(functionalTrials.ageGender);
  }
  return timeline;
}

/**
 * Builds and adds the experiment end sequence to the timeline.
 *
 * This function adds the final trials that conclude the experiment. It saves all collected data
 * and displays an exit message to the participant.
 *
 * @param {Array} timeline - The timeline array to add the end sequence to.
 * @param {Object} functionalTrials - The functional trials object containing predefined end sequence trials.
 * @returns {Array} The updated timeline with the experiment end sequence added.
 */
function buildExperimentEnd(timeline, functionalTrials){
  // Save all collected experiment data.
  timeline.push(functionalTrials.saveData);
  // Display exit message to the participant.
  timeline.push(functionalTrials.exit);
  return timeline;
}
