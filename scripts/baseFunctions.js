/**
 * Creates a deep copy of an object or array.
 *
 * @param {*} oldObj - The object or array to be deep-copied
 * @returns {*} A fully independent deep copy of the input
 */
function deepCopy(oldObj) {
  // Default to the original value (will be replaced if it's an object/array)
  let newObj = oldObj;

  // Only process non-null objects (includes arrays)
  if (oldObj && typeof oldObj === 'object') {
    // Determine whether we are copying an array or a plain object
    newObj = Object.prototype.toString.call(oldObj) === "[object Array]" ? [] : {};

    // Recursively copy each property or element
    for (let i in oldObj) {
      newObj[i] = deepCopy(oldObj[i]);
    }
  }

  return newObj;
};


/**
 * Returns a random integer between 0 (inclusive) and max (exclusive).
 *
 * @param {Number} max - Upper bound (non-inclusive) for the random value
 * @returns {Number} A random integer in the range [0, max)
 */
function randint(max) {
  const min = 0;
  max = Math.floor(max) - 1;

  // Generate a random integer in the specified range
  return Math.floor(Math.random() * (max - min + 1)) + min;
};


/**
 * Selects a random index based on weighted proportions.
 *
 * @param {Number[]} proportions - Array of non-negative weights
 * @returns {Number} The selected index
 */
function proportionalRandint(proportions) {
  // Calculate the total weight
  const sum = proportions.reduce((a, b) => a + b, 0);

  // Pick a random number in the range [0, sum)
  const pick = randint(sum);

  let steps = 0;

  // Walk through the proportions until the picked value falls within a range
  for (let i = 0; i < proportions.length; i++) {
    steps += proportions[i];
    if (pick < steps) {
      return i;
    }
  }
};


/**
 * Preloads instruction images from a given folder.
 *
 * @param {String} folder - Name of the instruction folder
 * @param {Number} instrLength - Number of instruction images to load
 * @returns {Image[]} An array of preloaded Image objects
 */
function instrLoader(folder, instrLength) {
  const imgArray = [];

  // Load each instruction image
  for (let i = 0; i < instrLength; i++) {
    imgArray[i] = new Image();
    imgArray[i].src = `instructions/${folder}/Folie${i + 1}.JPG`;
  }

  return imgArray;
};

/**
 * Randomly shuffles an array in place using the Fisher–Yates algorithm.
 *
 * @param {Array} a - The array to shuffle
 * @returns {Array} The same array, shuffled
 */
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    // Pick a random index from 0 to i
    const j = Math.floor(Math.random() * (i + 1));

    // Swap the elements at indices i and j
    [a[i], a[j]] = [a[j], a[i]];
  }

  return a;
};



/**
 * Loads multiple JavaScript files asynchronously and optionally runs a callback
 * after all scripts have been successfully loaded.
 *
 * @param {String} directory - Directory path for the scripts
 * @param {String[]} files - Array of script filenames (without extension)
 * @param {String} [extension=".js"] - File extension to use for each script
 * @param {Function} [callback] - Optional function to run after all scripts load
 */
async function loadScripts(directory, files, extension = ".js", callback) {
  const scripts = [];

  // Create a list of promises for each script to be loaded
  for (const file of files) {
    const path = directory + file + extension;
    console.log(path);
    scripts.push(loadScriptAsync(path));
  }

  try {
    // Wait for all scripts to finish loading
    await Promise.all(scripts);
    console.log("All scripts loaded successfully");

    // Call the callback function if provided
    if (callback && typeof callback === 'function') {
      callback();
    }
  } catch (error) {
    // Log any errors that occur during loading
    console.error("Error loading scripts:", error);
  }
};



// Export functions for use in Node.js/CommonJS environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    deepCopy,
    randint,
    proportionalRandint,
    instrLoader,
    shuffle,
    loadScripts
  };
}