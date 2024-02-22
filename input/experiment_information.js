 function createExpInfo(){
    let expInfo = {
        minWidth: 1200,
        minHeight: 700,
        backgroundColor : "#70757a", //background colour
        fontColor : "#FFFFFF", //font colour
        promptColor : "#C0C0C0",//prompt color
        fdbColorCorrect : "#008000", //displayed colour in "incorrect"-feedbacks
        fdbColorIncorrect : "#b30000", //displayed colour in "incorrect"-feedbacks
        token : "17C41AFF", //returned URL token

        trialStructures: {
            training: ["fixationcross", "blank", "soa", "target", "feedbackPos"],
            main: ["fixationcross", "blank", "soa", "target", "feedback"]
         },

        stimuli : [["3","4"], ["5","6"]],
        keys : [["3","4"], ["5","6"]], //response keys

        blocks : 1, //amount of blocks
        trainingblocks : 2, //amount of training blocks

        blockStartDuration : 1000,
        fixationcrossDuration : 250,
        soaDuration : 150,
        blankDuration : 35,
        targetDuration : 500,
        responseWindowDuration : 500,
        feedbackDuration : 201,
        trainingFeedbackDuration : 501,

        stimulusSize : 45, //size of target stimuli
        fixationCrossSize : 45, //size of fixation cross

        instrKeyForward : "C", //key to move forward in instructions
        instrKeyBackward : "X", //key to move backwards in instructions

        instructions : {
            instructions1 : {
                folder: "instructions1",
                file: "Folie",
                format: ".JPG",
                length: 3
            },
            instructions2 : {
                folder: "instructions2",
                file: "Folie",
                format: ".JPG",
                length: 1
            },
            instructions3 : {
                folder: "instructions3",
                file: "Folie",
                format: ".JPG",
                length: 1
            },
            expInformation: {
                folder: "expInformation",
                file: "Folie",
                format: ".JPG",
                length: 1
            }
        }
    }

    // // CSS root changes
    var root = document.documentElement; //variable setup for css 
    root.style.setProperty('--backgroundColor', expInfo.backgroundColor);
    root.style.setProperty('--fontColor', expInfo.fontColor);

    return expInfo
}