function timelineBuilder(){

  globalThis.counterBalancingParameter = createCounterBalancingParameter();
  globalThis.expInfo = createExpInfo();
  globalThis.functionalTrials = createFunctionalTrials();
  globalThis.instructionsArray = createInstructions();



  

  /* create trial lists */
  var trainingList = []
  var trialList = []

  for (var i = 0; i < expInfo.trainingblocks; i++) {
    trainingList[i] = createTrialSequences(counterBalancingParameter);
  }

  for (var i = 0; i < expInfo.blocks; i++) {
    trialList[i] = createTrialSequences(counterBalancingParameter);
  }


  /* create timeline */
  timeline = [];
  
  /* push trials to timeline */
  if (!skipToMain) {
    timeline = buildExperimentStart(timeline);
    timeline.push(instructionsArray[0]);
    timeline = buildExperimentalBlock(timeline, expInfo.trialStructures.main, trainingList[1], 1, true, 0.1);
    timeline.push(instructionsArray[1]);
    timeline = buildExperimentalBlock(timeline, expInfo.trialStructures.main, trainingList[1], 1, true, 0.5);
    timeline.push(instructionsArray[2]);
  }
  for (var b = 0; b < expInfo.blocks; b++) {
    timeline = buildExperimentalBlock(timeline, expInfo.trialStructures.main, trialList[b], b);
  }
  timeline = buildExperimentEnd(timeline);
  console.log("Timeline built!");
  return timeline;
}
