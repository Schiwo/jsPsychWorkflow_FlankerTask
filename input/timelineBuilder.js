/**
 * Builds and returns the full jsPsych timeline for the experiment.
 *
 * The timeline defines the complete sequence of events a participant will experience (eg welcome screens, instructions,  experimental trials,
 * break screens etc) as well as functional elements (eg data-saving).
 *
 * This function gathers all required configuration and helper objects (e.g., experiment
 * settings, counterbalancing rules, functional trials, and instructions), generates
 * condition sequences for training and main blocks, and then assembles everything
 * into a single ordered array that jsPsych can run.
 *
 * @returns {Array} An ordered list (the "timeline") of jsPsych elements that make up the experiment flow.
 */
function timelineBuilder() {

  // Get information about the experiment (like number of blocks, used keys, etc.). See further in expInfo.js
  const expInfo = createExpInfo();
  // Set up counterbalancing (to make sure conditions are shown in a balanced way). See further in counterbalancing_parameter.js
  const counterBalancingParameter = createCounterBalancingParameter();
  // Create the different types of trials with standard functions (eg welcoming to the experiment, asking for age and gender, etc). See further in functionalTrials.js
  const functionalTrials = createFunctionalTrials(expInfo);
  // Get the instructions that will be shown to the participant. See further in instructionsReader.js
  const instructionsArray = createInstructions(expInfo);

  // --- Create trial lists ---
  // These arrays will hold the condition levels (based on the counterbalancing parameter) for training and main trials for each block.
  // this will be an array of arrays: each entry represents a block, which contains an array of trials, which contains an array of condition levels.
  // e.g., trainingList = [[[block1_trial1_condition1_LevelX, block1_trial1_condition2_LevelX], [block1_trial2_condition1_LevelX, block1_trial2_condition2_LevelX], ...], ... ]
  var trainingList = [];
  var trialList = [];

  // Fill the trainingList with condition levels for each trial in each training block
  for (var i = 0; i < expInfo.trainingblocks; i++) {
    trainingList[i] = createTrialSequences(counterBalancingParameter);
  }

  // Fill the trialList with condition levels for each trial in each main block
  for (var i = 0; i < expInfo.blocks; i++) {
    trialList[i] = createTrialSequences(counterBalancingParameter);
  }

  // --- Create the timeline ---
  // This array will store the full order of each jsPsych elements that are used to run the experiment (instructions, trials, etc.).
  timeline = [];
  
  // --- Add trials and instructions to the timeline ---
  // Here you might want to change things for your own experiment, like adding different types of training blocks, changing the order of instructions, etc.

  // For testing purposes, you can skip directly to the main experiment by setting skipToMain to true (see init.html)
  if (!skipToMain) {
    // Add the start of the experiment (like welcome screen, consent, etc.). See further in blockBuilder.js
    timeline = buildExperimentStart(timeline, functionalTrials);
    // Add the first set of instructions. See further in instructions.js
    timeline.push(instructionsArray[0]);
    // Add the first training block. See further in blockBuilder.js
    timeline = buildExperimentalBlock(timeline, expInfo.trialStructures.main, trainingList[1], 1, expInfo, functionalTrials, true, 0.1);
    // Add the second set of instructions.
    timeline.push(instructionsArray[1]);
    // Add the second training block. See further in blockBuilder.js
    timeline = buildExperimentalBlock(timeline, expInfo.trialStructures.main, trainingList[1], 1, expInfo, functionalTrials, true, 0.5);
    // Add the third set of instructions
    timeline.push(instructionsArray[2]);
  }
  // Add the main experimental blocks. See further in blockBuilder.js
  for (var b = 0; b < expInfo.blocks; b++) {
    timeline = buildExperimentalBlock(timeline, expInfo.trialStructures.main, trialList[b], b, expInfo, functionalTrials);
  }
  // Add the end of the experiment (like thank you screen, data saving, etc.). See further in blockBuilder.js
  timeline = buildExperimentEnd(timeline, functionalTrials);
  // Print a message to the console to show the timeline was built
  console.log("Timeline built!");
  // Return the finished timeline
  return timeline;
}
