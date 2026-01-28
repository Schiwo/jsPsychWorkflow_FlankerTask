/**
 * Creates and returns an array of jsPsych instruction trials.
 *
 * This function reads the instruction configuration from the experiment settings
 * (expInfo.instructions), dynamically loads the corresponding instruction images,
 * and builds jsPsychInstructions objects that allow participants to navigate
 * through the pages using the configured forward and backward keys.
 *
 * @param {Object} expInfo - The experiment configuration object containing
 *                          instruction settings and navigation keys.
 * @returns {Array} An array of jsPsychInstructions trial objects.
 */
const createInstructions = (expInfo) => {

  /**
   * Builds a single jsPsychInstructions trial by loading a set of images
   * from a specified folder and converting them into HTML pages.
   *
   * @param {String} foldername - Name of the folder containing instruction images
   * @param {String} filename - Base filename for instruction images (without index or extension)
   * @param {String} fileformat - File extension for the images (e.g., ".JPG", ".PNG")
   * @param {Number} length - Number of instruction pages to load
   * @returns {Object} A configured jsPsychInstructions trial template
   */
  const instrLoader = (foldername, filename, fileformat, length) => ({
    type: jsPsychInstructions,

    // Dynamically generates the instruction pages when the trial is run.
    pages: () => {
      const instructionArray = [];

      // Load each instruction image and wrap it in an <img> tag
      for (let i = 0; i < length; i++) {
        const instrImage = new Image();
        instrImage.src = `instructions/${foldername}/${filename}${i + 1}${fileformat}`;

        // Store the image as an HTML string for jsPsych to display
        instructionArray.push(`<img src="${instrImage.src}" />`);
      }

      return instructionArray;
    },

    // Navigation keys for moving forward and backward through the instructions
    key_forward: expInfo.instrKeyForward,
    key_backward: expInfo.instrKeyBackward
  });

  /**
   * Generate instruction trials from the configuration object.
   * Each entry corresponds to one instruction set defined in expInfo.instructions.
   */
  return Object.values(expInfo.instructions).map(instruction =>
    instrLoader(
      instruction.folder,
      instruction.file,
      instruction.format,
      instruction.length
    )
  );
};