/**
 * ======================================================================
 * Helper functions for handling feedback and accuracy logic
 * across different trial templates.
 * ======================================================================
 */

/**
 * Checks whether the participant’s response is correct.
 *
 * This function compares the recorded response to the expected
 * correct response and returns a numeric accuracy code that can
 * be stored in the trial data.
 *
 * @param {Object} data - The jsPsych trial data object
 * @param {String} data.response - The participant's response
 * @param {String} data.correctResp - The correct response for the trial
 * @returns {Number} 1 if the response is correct, 0 otherwise
 */
function checkAccuracy(data) {
  // Log trial data for debugging purposes
  console.log(data);

  // If no response was given, mark as incorrect
  if (!data.response) {
    return 0;
  }

  // Compare response and correct answer (case/accent insensitive)
  if (
    data.response.localeCompare(
      data.correctResp,
      undefined,
      { sensitivity: 'accent' }
    ) === 0
  ) {
    return 1;
  }

  // All other cases are treated as incorrect
  return 0;
}

/**
 * Provides background color feedback for incorrect or missing responses.
 *
 * This function looks at the most recent trial’s accuracy value
 * and changes the page background color if the response was
 * incorrect or missing. No semantic (text) feedback is shown.
 *
 * @returns {String} An empty string, as this function is intended
 *                   to be used as a jsPsych stimulus callback
 */
function fdbStimulus() {
  // Retrieve the most recent trial's data
  const data = jsPsych.data.get().last(1).values()[0];

  // If the response was correct, do not change the background
  if (data.accuracy) {
    return "";
  }

  // Change background color for incorrect or missing responses
  document.body.style.background = expInfo.fdbColorIncorrect;
  return "";
}

/**
 * Provides both background color and semantic (text) feedback.
 *
 * This function evaluates the most recent trial and:
 * - Sets the background color based on accuracy
 * - Returns a feedback message ("Correct!", "Too slow!", or "Wrong")
 *
 * @returns {String} Feedback text to be displayed by jsPsych
 */
function posFdbStimulus() {
  // Retrieve the most recent trial's data
  const data = jsPsych.data.get().last(1).values()[0];

  // Correct response: show positive feedback
  if (data.accuracy) {
    document.body.style.background = expInfo.fdbColorCorrect;
    return "Correct!";
  }

  // No response given: show timeout feedback
  if (data.response == null) {
    document.body.style.background = expInfo.fdbColorIncorrect;
    return "Too slow!";
  }

  // Incorrect response: show negative feedback
  document.body.style.background = expInfo.fdbColorIncorrect;
  return "Wrong";
}

/**
 * Resets the background color to the experiment’s default.
 *
 * This function should be called at the start of a new trial
 * to ensure that feedback colors from the previous trial
 * do not carry over.
 */
function normalBackground() {
  document.body.style.background = expInfo.backgroundColor;
}
