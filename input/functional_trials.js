/**
 * Creates and returns a collection of reusable functional trials for the experiment.
 * These trials handle common tasks such as saving data, checking browser compatibility,
 * showing welcome/exit screens, collecting demographics, and managing block breaks.
 *
 * @param {Object} expInfo - expInfo object; see experiment_information.js.
 * @returns {Object} An object containing jsPsych elements.
 */
function createFunctionalTrials(expInfo) {
    return {

        /**
         * Trial for saving participant data to the JATOS server.
         * Uses a retry mechanism to handle temporary connection issues.
         * If saving fails, the participant is prompted to check their internet connection.
         */
        saveData: {
            type: jsPsychCallFunction,
            async: true,
            func: function (done) {
                // Convert all collected jsPsych data into CSV format
                var resultCSV = jsPsych.data.get().csv();

                /**
                 * Attempts to submit data to the JATOS server.
                 * If submission fails, it retries up to 5 times.
                 *
                 * @param {String} data - The CSV-formatted experiment data
                 * @param {Number} retry - Current retry attempt counter
                 */
                function saveData(data, retry = 0) {
                    console.log("Trying to save data.");
                    console.log("Try Nr: " + retry);

                    // Warn the participant if this is not the first try
                    if (retry > 5) {
                        alert("Data storage failed!");
                        return;
                    } else if (retry > 0) {
                        alert("No internet connection!\nCheck connection and press OK!");
                    }

                    // Attempt to submit the data to JATOS
                    jatos.submitResultData(data)
                        .then(() => {
                            console.log("Data saved successfully.");
                        })
                        .catch(() => {
                            // Retry saving the data if submission fails
                            saveData(data, retry + 1);
                        });
                }

                // Start the data-saving process
                saveData(resultCSV);

                // Notify jsPsych that this asynchronous trial is complete
                done();
            }
        },

        /**
         * Presents the informed consent form to the participant.
         * Participants must click a button to consent and continue, or decline.
         * If consent is declined, the experiment is immediately aborted.
         */
        informedConsent: {
            type: jsPsychHtmlButtonResponse,
            // Display consent form text with instructions
            stimulus:
                "<p>Please read the informed consent information below.</p>" +

                "<p>ADD YOUR CONSENT FORM HERE</p>" +

                "<p>Click a button below to consent or decline.</p>",
            // Restrict valid responses to button clicks (0 = Yes, 1 = No)
            choices: ["Yes, I consent", "No, I decline"],
            // Process the participant's response after the trial completes
            on_finish: (data) => {
                // If the user clicks button 1 (No), stop the study
                if (data.response === 1) {
                    jsPsych.abortExperiment("Participant did not consent.");
                }
            },
        },

        /**
         * Checks whether the participant is using a desktop/laptop
         * and meets the minimum window size requirements.
         * Mobile devices are excluded from the experiment.
         */
        browserCheck: {
            type: jsPsychBrowserCheck,
            minimum_width: expInfo.minWidth,
            minimum_height: expInfo.minHeight,
            inclusion_function: (data) => {
                // Only allow non-mobile devices
                return data.mobile === false;
            },
            exclusion_message: (data) => {
                // Flag the experiment as aborted if the user is excluded
                experiment_aborted = true;

                if (data.mobile) {
                    return '<p>You must use a desktop/laptop computer to participate in this experiment.</p>';
                }
            }
        },

        /**
         * Displays a welcome screen at the beginning of the experiment.
         * Waits for any key press before continuing.
         */
        welcome: {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: "Welcome to the experiment. Press any key to begin!"
        },

        /**
         * Final screen shown after the experiment is completed.
         * Allows participants to either read background information
         * or continue to the forwarding/exit page.
         */
        exit: {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: `The experiment is finished now. Thank you for your participation!
                       Press "${expInfo.instrKeyForward}" to be forwarded!`,
            choices: [expInfo.instrKeyForward]
        },

        /**
         * Collects basic demographic information from the participant:
         * age and gender.
         * The values are also stored in global variables for later use.
         */
        ageGender: {
            type: jsPsychSurveyText,
            questions: [
                { prompt: "Please, tell us your age" },
                { prompt: "Please, tell us your gender (m = male, f = female, d = diverse)", placeholder: "m/f/d" }
            ],
            data: { trialPart: 'ageGender' },
            on_finish: (data) => {
                // Store responses in the trial data
                data.age = data.response.Q0;
                data.gender = data.response.Q1;

                // Optionally store in global variables for later access
                subject_age = data.age;
                subject_gender = data.gender;
            }
        },

        /**
         * Displays a pause screen between blocks.
         * Informs participants of the current block number
         * and allows them to take a short break if desired.
         */
        blockPause: {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: () => {
                const currentBlock = jsPsych.getCurrentTrial().data.blockNr;

                if (currentBlock === 1) {
                    return `This is block nr. ${currentBlock} of ${expInfo.blocks}.<br/>
                            Continue by pressing "${expInfo.instrKeyForward}"!`;
                } else {
                    return `This is block nr. ${currentBlock} of ${expInfo.blocks}.
                            You can take a short break, if you want to!<br/>
                            Continue by pressing "${expInfo.instrKeyForward}"!`;
                }
            },
            choices: [expInfo.instrKeyForward],
            data: { trialPart: 'blockPause' }
        },
    };
}
