function createInstructions() {
  //load a certain amount of pictures from given path. Used to gather instruction pages.
  function instrLoader(foldername, filename, fileformat, length){
    var instructionsTemplate = {
      type: jsPsychInstructions,
      pages:() =>{
        instructionArray = [];
        for (var i = 0; i < length; i++) {
          instrImage = new Image();
          instrImage.src = `instructions/${foldername}/${filename}${i + 1}${fileformat}`;
          instructionArray[i] = "<img src=\"" + instrImage.src + "\"></img>";
        }
        return instructionArray;
      },
      key_forward: expInfo.instrKeyForward,
      key_backward: expInfo.instrKeyBackward
    };
    return instructionsTemplate;
  }

  instructionsArray = []
  Object.values(expInfo.instructions).forEach(instruction => instructionsArray.push(instrLoader(instruction.folder, instruction.file, instruction.format, instruction.length)));

return instructionsArray;
}
