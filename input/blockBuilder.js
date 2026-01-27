function buildExperimentalBlock(timeline, tstructure, tlist, block, expInfo, functionalTrials, training = false, trainingLength) {
  // console.log(timeline);
  blockLength = training? (tlist.length * trainingLength) : tlist.length;

  if (!training) {
    let blockPauseCopy = deepCopy(functionalTrials.blockPause);
    blockPauseCopy.data.blockNr = block + 1;
    timeline.push(blockPauseCopy);
  }
  
  blockStart = stimulusConstructor(expInfo, "fixationcross", null, null, training? - (block + 1) : (block + 1));
  blockStart.trial_duration = expInfo.blockStartDuration;
  timeline.push(blockStart);

  for (var i = 0; i < blockLength; i++) {
    let trialCopy = deepCopy(tstructure);
    for (var j = 0; j < trialCopy.length; j++) {
      timeline.push(stimulusConstructor(expInfo, trialCopy[j], tlist, i, block));
    }
  }
  return timeline;
}

/* START EXPERIMENT */
function buildExperimentStart(timeline, functionalTrials) {
  /*EXPERIMENT START*/
  if (!skimMode) { //skip if skimMode
    timeline.push(functionalTrials.browserCheck); //check participants browser
    timeline.push(functionalTrials.welcome); //welcome to the experiment
    timeline.push(functionalTrials.ageGender); //ask for age and gender
  }
  return timeline;
}

/* END EXPERIMENT */
function buildExperimentEnd(timeline, functionalTrials){
  timeline.push(functionalTrials.saveData)
  timeline.push(functionalTrials.exit);
  return timeline;
}
