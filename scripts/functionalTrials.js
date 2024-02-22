    // templates for special functionality and short instructions
function createFunctionalTrials(){
    return {   
        saveData: {
            type: jsPsychCallFunction,
            async: true,
            func: function(done){
            var resultCSV = jsPsych.data.get().csv();
                function saveData(data, retry=0) {
                console.log("Trying to save data.");
                console.log("Try Nr: " + retry);
                if (retry > 0) {
                    alert("No internet connection! \n Check connection and press OK!")
                } else if (retry > 5) {
                    alert("Data storage failed! \n")
                }
                jatos.submitResultData(data)
                    .then(() => {console.log("success");})
                    .catch(() => {saveData(data, retry+1)})
                }
                saveData(resultCSV)
                done();
        
            }
        },

        browserCheck: {
            type: jsPsychBrowserCheck,
            minimum_width: 1280,
            minimum_height: 700,
            inclusion_function: (data) => {
                return data.mobile === false;
            },
            exclusion_message: (data) => {
                experiment_aborted = true;
                if(data.mobile){
                return '<p>You must use a desktop/laptop computer to participate in this experiment.</p>';
                };
            }
        },

        welcome: {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: "Welcome to the experiment. Press any key to begin!" 
        },

        exit: {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: `The experiment is finished now. Thank you for your participation! Press "${expInfo.instrKeyForward}" to read something about the background of the experiment or press "${expInfo.instrKeyBackward}" to be forwarded!`, //
            choices: [expInfo.instrKeyForward, expInfo.instrKeyBackward]
        },

        ageGender:  {
            type: jsPsychSurveyText,
            questions: [
            {prompt: "Please, tell us your age"},
            {prompt: "Please, tell us your gender (m = male, f = female, d = diverse)" , placeholder: "m/f/d"}
            ],
            data: { trialPart: 'ageGender' },
            on_finish: (data) => {
            data.age = data.response.Q0;
            subject_age = data.age;
            data.gender = data.response.Q1;
            subject_gender = data.gender;
            }
        },
       

        blockPause: {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: (data) => {
                if (jsPsych.getCurrentTrial().data.blockNr == 1) {
                return `This is block nr. ${jsPsych.getCurrentTrial().data.blockNr} of ${expInfo.blocks}.<br/>Continue by pressing "${expInfo.instrKeyForward}"!`; //
                } else {
                return `This is block nr. ${jsPsych.getCurrentTrial().data.blockNr} of ${expInfo.blocks}. You can take a short break, if you want to!<br/>Continue by pressing "${expInfo.instrKeyForward}"!`; } //
            },
            choices: [expInfo.instrKeyForward],
            data: { trialPart: 'blockPause' }
        },
        


        browserCheck: {
            type: jsPsychBrowserCheck,
            minimum_width: expInfo.minWidth,
            minimum_height: expInfo.minHeight,
            inclusion_function: (data) => {
                return data.mobile === false;
            },
            exclusion_message: (data) => {
                experiment_aborted = true;
                if(data.mobile){
                    return '<p>A desktop/laptop computer is required to participate in this experiment.</p>';
            };
        }
    }   
    }
}