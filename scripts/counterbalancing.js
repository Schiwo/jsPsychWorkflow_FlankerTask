// ============================================================================
// COUNTERBALANCING 
// ============================================================================
// This is the main counterbalancing module for creating balanced trial sequences.
//
// Node.js Setup:
// If running in Node.js (testing/development), use tests/counterbalancing.setup.js first:
//   const counterbalancing = require('./tests/counterbalancing.setup.js');

// ============================================================================
// CONSTANTS - Settings that control how the algorithm works
// ============================================================================
// These limits prevent the algorithm from getting stuck trying impossible combinations
const MAX_PICKER_ATTEMPTS = 200;  // How many times to try picking a valid trial
const MAX_RETRY_ATTEMPTS = 25;    // How many times to retry before starting over
const MAX_RESTART_ATTEMPTS = 15;  // How many times to completely restart with a new seed


// ============================================================================
// UTILITY FUNCTIONS - Simple helpers with no dependencies
// ============================================================================

/**
 * Get the math library - Find it whether we're in a browser or Node.js
 * @returns {Object} The math.js library that we can use for calculations
 * @throws {Error} If the math.js library cannot be found
 */
function getMath() {
  // First check if we're in Node.js and math is available there
  if (typeof global !== 'undefined' && global.math) {
    return global.math;
  } 
  // Otherwise check if we're in a browser and math is available
  else if (typeof window !== 'undefined' && window.math) {
    return window.math;
  }
  // If we get here, math.js wasn't found - this is an error
  throw new Error('math.js library not found');
}

/**
 * Extract array elements by indices
 * This function picks specific items from an array using their positions
 * @param {Array} array - Source array (the list we're picking from)
 * @param {Array} indices - Indices to extract (which positions to pick)
 * @returns {Array} Elements at specified indices (the picked items)
 */
function getArrayElementsById(array, indices) {
  // For each index in our list, get the element at that position from array
  return indices.map(id => array[id]);
}

/**
 * Convert null values in proportions array to default arrays
 * This function replaces any "null" proportions with equal distribution
 * @param {Array} prprtn - Proportions array that may contain null values
 * @param {Array} fctr - conditions array containing number of levels for each condition
 * @returns {Array} Modified proportions array with null values replaced
 */
function nullToProportion(prprtn, fctr) {
  // Look at each condition
  for (var i = 0; i < prprtn.length; i++) {
    // If this condition has no proportions specified (null)
    if (prprtn[i] == null) {
      // Create a default that uses each level equally often
      // For example, if condition has 3 levels: [1, 1, 1] means each appears equally
      prprtn[i] = Array(fctr[i]).fill(1);
    }
  }
  return prprtn;
}


// ============================================================================
// VALIDATION FUNCTIONS - Ensure inputs are valid
// ============================================================================

/**
 * Check if the transition rules are correctly specified
 * This function validates that the rules make sense before we use them
 * @param {Array} rules - Array of transition rules (one per condition)
 * @param {Array} conditions - Array containing number of levels for each condition
 * @throws {Error} If rules are invalid or incorrect
 */
function ruleCheck(rules, conditions) {
  // We can only have one "next" rule, so we use this to track that
  let nextCheck = false;
  
  // First, make sure rules is actually an array
  if (!Array.isArray(rules)) {
    throw "Rule error; rules must be an array with n elements (n = number of conditions).";
  } 
  // And make sure we have the same number of rules as conditions
  else if (rules.length != conditions.length) {
    throw "Rule error; rules must be an array with n elements (n = number of conditions).";
  }

  // Now check each individual rule
  for (var i = 0; i < rules.length; i++) {
    // If this condition has no rule, that's fine - skip it
    if (rules[i] == null) {
      continue;
    } else {
      // Check "identical" rules - they need a number bigger than 0
      if (rules[i][0] == "identical") {
        if (rules[i][1] < 1) {
          throw "Rule error; x must be larger than 0!";
        }
      } 
      // Check "next" rules - we can only have one of these
      else if (rules[i][0] == "next") {
        if (nextCheck == true) {
          throw "Rule error; you can use only 1 NEXT rule!";
        } else {
          nextCheck = true;
        }
      }
    }
  }
}

/**
 * Check if proportions are correctly specified
 * This makes sure that all proportion values are valid
 * @param {Array} proportions - Array of proportions (one per condition)
 * @throws {Error} If any proportion value is less than 1
 */
function proportionCheck(proportions) {
  // Check each condition's proportions
  for (var i = 0; i < proportions.length; i++) {
    // If this condition has no proportions specified, that's okay - skip it
    if (proportions[i] == null) {
      continue;
    } else {
      // Check if any proportion value is less than 1 (which would be invalid)
      if (proportions[i].some(function(e) {
        return e < 1;
      })) {
        throw "rule error; you cannot use proportion values <1";
      }
    }
  }
}


// ============================================================================
// DEBUG/LOGGING FUNCTIONS - Helpful utilities for troubleshooting
// ============================================================================

/**
 * Log debug message if DEBUG_MODE is enabled
 * This prints helpful information to the console for troubleshooting
 * @param {string} message - Message to log
 */
function debugLog(message) {
  // Only print if debugging is turned on
  if (DEBUG_MODE) {
    console.log("[DEBUG] " + message);
  }
}

/**
 * Log pool state summary if DEBUG_MODE is enabled
 * The pool is a collection of trials still available to pick from
 * @param {Object} pool - Pool matrix to check
 * @param {string} label - Label for this state (for readability)
 */
function debugPoolState(pool, label) {
  // Only print if debugging is turned on
  if (DEBUG_MODE) {
    // Count how many trials are left in the pool
    var sum = getMath().sum(pool);
    console.log("[POOL] " + label + " - Remaining trials: " + sum);
  }
}

/**
 * Format pool state as readable string showing all indices and values
 * This makes the pool data easy to read for debugging
 * @param {Object} pool - Pool matrix to format
 * @returns {string} Formatted pool state (one line per combination)
 */
function formatPoolState(pool) {
  var formatted = "";
  var size = pool.size();
  
  // Helper function to navigate through nested arrays
  function iterateArray(arr, indices) {
    // If this is still an array, keep drilling down
    if (Array.isArray(arr)) {
      for (var i = 0; i < arr.length; i++) {
        var newIndices = indices.concat([i]);
        iterateArray(arr[i], newIndices);
      }
    } 
    // If we reached the actual number, print it
    else {
      formatted += "[" + indices.join(",") + "]: " + arr + "\n";
    }
  }
  
  // Start the traversal from the beginning
  iterateArray(pool.valueOf(), []);
  return formatted;
}

/**
 * Log picked conditions for current trial if DEBUG_MODE is enabled
 * @param {number} trialNum - Trial number (which trial is this)
 * @param {Array} conditions - Picked conditions for this trial
 */
function debugPickedConditions(trialNum, conditions) {
  // Only print if debugging is turned on
  if (DEBUG_MODE) {
    console.log("[TRIAL " + trialNum + "] Picked conditions: [" + conditions.join(", ") + "]");
  }
}


// ============================================================================
// CORE ALGORITHM FUNCTIONS - Building blocks of the algorithm
// ============================================================================

/**
 * Pick random seed values based on proportions
 * The seed is the first trial - choosing it randomly helps ensure variety
 * @param {Array} prop - Proportions array for each condition
 * @returns {Array} Random seed combination (the first trial)
 */
function pickSeed(prop) {
  var seeds = [];
  // For each condition, pick a random starting value
  for (var i = 0; i < prop.length; i++) {
    // Use the proportions to influence which values are picked
    seeds.push(proportionalRandint(prop[i]));
  }
  return seeds;
}

/**
 * Create initial pool with condition proportions applied
 * This creates a collection of all the trial combinations we'll pick from
 * @param {Array} conditions - Array containing number of levels for each condition
 * @param {Array} conditionProportions - Array of proportions for each condition
 * @returns {Object} Base pool matrix with proportions applied
 */
function start(conditions, conditionProportions) {
  // Get access to the math library for calculations
  const math = getMath();
  
  // Create a base matrix where all positions start with value 1
  var basePool = math.ones.apply(null, conditions);
  
  // Apply the proportions to determine how many times each combination appears
  for (var i = 0; i < conditionProportions.length; i++) {
    basePool.forEach(function (value, index, matrix) {
      // Multiply each position by the appropriate proportion value
      basePool = math.subset(basePool, math.index.apply(null, index),
        math.multiply(math.subset(basePool, math.index.apply(null, index)), conditionProportions[i][index[i]]));
    });
  }
  
  // Multiply by the number of sets to create multiple complete counterbalanced sets
  basePool = math.multiply(basePool, sets);
  return basePool;
}

/**
 * Subtract one from a specific condition combination in the pool
 * This removes one trial from the pool after we've picked it
 * @param {Object} matrix - Pool matrix (all available trials)
 * @param {Array} vector - Indices of combination to subtract (which trial we picked)
 * @returns {Object} Updated pool matrix (with that trial removed)
 */
function poolSubtraction(matrix, vector) {
  const math = getMath();
  
  // Find the position in the matrix and subtract 1 from it
  return math.subset(matrix, math.index.apply(null, vector),
    math.subtract(math.subset(matrix, math.index.apply(null, vector)), 1));
}

/**
 * Translate transition rules to valid condition combinations for the next trial
 * This figures out which trial combinations are allowed based on the rules
 * @param {Array} conditions - Array containing number of levels for each condition
 * @param {Array} rules - Array of transition rules
 * @param {Array} list - List of previously picked trial combinations
 * @param {number} index - Current trial index
 * @returns {Array} Valid combinations for each condition at current trial
 */
function ruleTranslator(conditions, rules, list, index) {
  // This will hold all valid options for each condition
  validCombos = [];
  
  // Check each condition
  for (var i = 0; i < conditions.length; i++) {
    // If no rule for this condition, all options are valid
    if (rules[i] == null) {
      validCombos.push(Array.from(Array(conditions[i]).keys()));
    } 
    // If the rule is a custom function, call it and get the valid options
    else if (typeof rules[i] === 'function') {
      // Custom rule function - should return valid levels array or single value
      var customResult = rules[i](conditions[i], index, list);
      // Make sure result is always an array of valid options
      if (Array.isArray(customResult)) {
        validCombos.push(customResult);
      } else {
        validCombos.push(customResult);
      }
    } 
    // If the rule is a specific rule type
    else if (Array.isArray(rules[i])) {
      // "identical" rule: next trial must match a previous trial
      if (rules[i][0] == "identical") {
        validCombos.push(list[index - rules[i][1]][rules[i][2]]);
      } 
      // "different" rule: next trial must NOT match a previous trial
      else if (rules[i][0] == "different") {
        // Start with all options
        var availableValue = Array.from(Array(conditions[i]).keys());
        // Remove the one that we must be different from
        availableValue.splice(list[index - rules[i][1]][rules[i][2]], 1);
        validCombos.push(availableValue);
      } 
      // "next" rule: increment the previous trial's value by a fixed amount
      else if (rules[i][0] == "next") {
        validCombos.push((list[index - 1][i] + rules[i][1]) % conditions[i]);
      }
    }
  }
  return validCombos;
}

/**
 * Check if a solveable solution exists for the current trial given constraints
 * This checks if we can pick a valid trial at this point
 * @param {Object} pool - Remaining pool matrix (trials still available)
 * @param {Array} prev - Previously selected trial combinations (past trials)
 * @param {number} index - Current trial index (which trial number is this)
 * @returns {boolean} True if a valid combination exists, false otherwise
 */
function solveable(pool, prev, index) {
  // If pool is undefined, we can always pick (no constraints)
  if (pool == undefined) {
    return true;
  }
  
  const math = getMath();
  
  // Get the valid combinations based on rules
  var valid = ruleTranslator(conditions, transitionRules, prev, index);
  
  // Check if there are any valid combinations left in the pool
  return math.sum(math.subset(pool, math.index.apply(null, valid))) > 0;
}

/**
 * Pick a random valid combination from the pool following transition rules
 * This picks the next trial combination randomly but respects all constraints
 * @param {Object} pool - Remaining pool matrix (trials still available)
 * @param {Array} prev - Previously selected trial combinations (past trials)
 * @param {number} index - Current trial index (which trial number is this)
 * @param {Array} proportions - Proportions array for weighted selection (how often each option should appear)
 * @returns {Array} Randomly selected valid condition combination (the next trial)
 * @throws {Error} If no solution can be found after max attempts
 */
function picker(pool, prev, index, proportions) {
  const math = getMath();
  
  // Get which condition levels are valid for each condition at this position
  var valid = ruleTranslator(conditions, transitionRules, prev, index);
  var attemptCount = 0;
  
  // Keep trying to pick a valid combination until we succeed or hit the limit
  while (true) {
    attemptCount++;
    
    // If we've tried too many times, something is wrong - give up
    if (attemptCount > MAX_PICKER_ATTEMPTS) {
      throw "Couldn't find a solution. Consider using less restrictions.";
    }
    
    // Try picking one valid level for each condition
    var pickedConditions = [];
    for (var i = 0; i < valid.length; i++) {
      // If this condition has multiple valid options
      if (Array.isArray(valid[i])) {
        // Randomly pick one of them (respecting proportions)
        pickedConditions.push(valid[i][proportionalRandint(getArrayElementsById(proportions[i], valid[i]))]);
      } 
      // If this condition has only one valid option
      else {
        // Use that option
        pickedConditions.push(valid[i]);
      }
    }

    // Check if this combination is still available in the pool
    if (math.subset(pool, math.index.apply(null, pickedConditions)) > 0) {
      // Yes, it's available - return this combination
      return pickedConditions;
    }
    // If not available, loop back and try again
  }
}

/**
 * Helper function to pick a random combination based on rules
 * This is used internally by prepend and append functions
 * @param {Array} validconditions - Valid condition combinations for current position
 * @returns {Array} Randomly selected combination
 * @private
 */
function pickRandomCombo(validconditions) {
  var pickedCombo = [];
  
  // For each condition, pick a valid level
  for (var i = 0; i < validconditions.length; i++) {
    // If this condition has multiple options
    if (Array.isArray(validconditions[i])) {
      // Pick one randomly
      pickedCombo.push(validconditions[i][randint(validconditions[i].length)]);
    } 
    // If this condition has only one option
    else {
      // Use that option
      pickedCombo.push(validconditions[i]);
    }
  }
  
  return pickedCombo;
}


// ============================================================================
// MAIN API FUNCTIONS - High-level, user-facing functions
// ============================================================================

/**
 * Generate a counterbalanced trial sequence based on specified parameters
 * This is the main function that creates a fair, balanced sequence of trials
 * @param {Object} counterBalancingParameter - Configuration object containing:
 *   - conditions: Array of condition levels (how many options each condition has)
 *   - conditionProportions: Array of proportions (or null) for each condition (how often each option appears)
 *   - transitionRules: Array of transition rules between trials (constraints on trial order)
 *   - sets: Number of counterbalanced sets (how many times to repeat the full sequence)
 *   - DEBUG_MODE: Optional boolean to enable debug logging (for troubleshooting)
 * @returns {Array} Counterbalanced list of trial combinations (the trial sequence)
 * @throws {Error} If no valid solution exists for given constraints
 */
function counterbalance(counterBalancingParameter) {
  const math = getMath();
  
  // ============================================================================
  // SETUP: Save the parameters to global variables for use throughout function
  // ============================================================================
  conditions = counterBalancingParameter.conditions;
  conditionProportions = nullToProportion(counterBalancingParameter.conditionProportions, conditions);
  transitionRules = counterBalancingParameter.transitionRules;
  sets = counterBalancingParameter.sets;
  DEBUG_MODE = counterBalancingParameter.DEBUG_MODE || false;

  // Local variables for this function
  var randomSeed, basePool, remainingPool, trialList, tryNr, restartNr, j, trialcount;

  // ============================================================================
  // VALIDATION: Check that the rules and proportions are valid
  // ============================================================================
  ruleCheck(transitionRules, conditions);
  proportionCheck(conditionProportions);

  // ============================================================================
  // INITIALIZATION: Set up the pool and starting conditions
  // ============================================================================
  // Pick the first trial randomly
  randomSeed = pickSeed(conditionProportions, conditions);
  
  // Create the pool of available trials based on proportions
  basePool = start(conditions, conditionProportions);

  // Make a copy of the pool that we'll modify as we pick trials
  remainingPool = math.clone(basePool);

  // Start the trial list with the first trial
  trialList = [randomSeed];
  
  // Remove the first trial from the pool
  remainingPool = poolSubtraction(remainingPool, randomSeed);
  
  // Initialize counters
  tryNr = 0;          // How many times we've tried at current position
  restartNr = 0;      // How many times we've completely restarted
  j = 1;              // Current position in the trial sequence (0 is the seed)
  trialcount = math.sum(basePool);  // Total number of trials we need to pick

  // Print debug information if requested
  debugLog("Starting counterbalance with " + trialcount + " total trials");
  debugPickedConditions(0, randomSeed);
  debugPoolState(remainingPool, "Initial");

  // ============================================================================
  // MAIN LOOP: Pick each trial one by one
  // ============================================================================
  while (j < trialcount) {
    // Debug output showing current progress
    debugLog("Loop check: j=" + j + ", trialcount=" + trialcount + ", pool_sum=" + math.sum(remainingPool));
    
    // Check if we can find a valid trial at this position
    if (solveable(remainingPool, trialList, j)) {
      // Yes, we can - pick a valid trial
      trialList[j] = picker(remainingPool, trialList, j, conditionProportions);
      debugPickedConditions(j, trialList[j]);
      
      // Remove this trial from the pool
      remainingPool = poolSubtraction(remainingPool, trialList[j]);
      debugPoolState(remainingPool, "After trial " + j);
      
      // Move to the next position
      j++;
    } 
    // No valid trial found at this position
    else {
      debugLog("No solveable combination found for trial " + j + " (Try #" + (tryNr + 1) + ")");
      
      // If we've tried too many times, start completely over with a new seed
      if (tryNr > MAX_RETRY_ATTEMPTS) {
        debugLog("Picking new seed (Restart #" + (restartNr + 1) + ")");
        randomSeed = pickSeed(conditionProportions, conditions);
        tryNr = 0;
        restartNr++;
        
        // If we've restarted too many times, something is impossible - give up
        if (restartNr > MAX_RESTART_ATTEMPTS) {
          var remainingCount = math.sum(remainingPool);
          var valid = ruleTranslator(conditions, transitionRules, trialList, j);
          var availableCount = math.sum(math.subset(remainingPool, math.index.apply(null, valid)));
          throw "Can't find a solution for the specified conditions.\nFailed at trial " + j + ".\nRemaining conditions in pool: " + remainingCount + ".\nAvailable conditions matching rules: " + availableCount + ".\nPool state:\n" + formatPoolState(remainingPool);
        }
      }
      
      // Reset everything and try again
      remainingPool = basePool;
      trialList = [randomSeed];
      remainingPool = poolSubtraction(remainingPool, randomSeed);
      j = 1;
      tryNr++;
    }
  }

  // Success! All trials have been picked
  debugLog("Counterbalance completed successfully!");
  return trialList;
}

/**
 * Prepend trials to the beginning of a trial sequence based on rules
 * This adds extra trials at the start, useful for practice or warm-up trials
 * @param {Array} rawList - Original trial list (the main sequence)
 * @param {Object} counterBalancingParameter - Configuration object containing:
 *   - preprendTrials: Number of trials to prepend (how many to add at the beginning)
 *   - prependRules: Transition rules for prepended trials (constraints on these new trials)
 *   - conditions: Array of condition levels
 * @returns {Array} Trial list with prepended trials (original sequence with additions at start)
 */
function prepend(rawList, counterBalancingParameter) {
  var n = counterBalancingParameter.preprendTrials;  // How many trials to add
  var rules = counterBalancingParameter.prependRules;  // Rules for the new trials
  var conditions = counterBalancingParameter.conditions;
  
  // If no trials to prepend, just return the original list
  if (n == 0) {
    return rawList;
  }
  
  // Validate the rules
  ruleCheck(rules, conditions);
  
  // We build backwards from the start of the original sequence
  var revList = deepCopy(rawList).reverse();
  
  // Add the prepended trials
  for (let index = 0; index < n; index++) {
    // Get valid combinations for this position
    var valid = ruleTranslator(conditions, rules, revList, revList.length);
    // Pick one randomly
    var pickedCombo = pickRandomCombo(valid);
    revList.push(pickedCombo);
  }

  // Reverse back to get the correct order
  return revList.reverse();
}

/**
 * Append trials to the end of a trial sequence based on rules
 * This adds extra trials at the end, useful for additional testing or practice
 * @param {Array} rawList - Original trial list (the main sequence)
 * @param {Object} counterBalancingParameter - Configuration object containing:
 *   - appendTrials: Number of trials to append (how many to add at the end)
 *   - appendRules: Transition rules for appended trials (constraints on these new trials)
 *   - conditions: Array of condition levels
 * @returns {Array} Trial list with appended trials (original sequence with additions at end)
 */
function append(rawList, counterBalancingParameter) {
  var n = counterBalancingParameter.appendTrials;  // How many trials to add
  var rules = counterBalancingParameter.appendRules;  // Rules for the new trials
  var conditions = counterBalancingParameter.conditions;
  
  // If no trials to append, just return the original list
  if (n == 0) {
    return rawList;
  }
  
  // Validate the rules
  ruleCheck(rules, conditions);
  
  // Make a copy of the original list so we don't modify it
  var list = deepCopy(rawList);
  
  // Add the appended trials
  for (let index = 0; index < n; index++) {
    // Get valid combinations for this position
    var valid = ruleTranslator(conditions, rules, list, list.length);
    // Pick one randomly
    var pickedCombo = pickRandomCombo(valid);
    // Add it to the end of the list
    list.push(pickedCombo);
  }

  return list;
}

/**
 * Create a complete trial sequence with prepended, main, and appended trials
 * This is the main entry point that creates the full experiment sequence
 * @param {Object} counterBalancingParameter - Configuration object for counterbalancing
 * @returns {Array} Complete trial sequence with all phases (warm-up + main + extra trials)
 */
function createTrialSequences(counterBalancingParameter) {
  // Step 1: Create the main counterbalanced trial sequence
  var trialList = counterbalance(counterBalancingParameter);
  
  // Step 2: Add any warm-up or practice trials at the beginning
  trialList = prepend(trialList, counterBalancingParameter);
  
  // Step 3: Add any extra trials at the end
  trialList = append(trialList, counterBalancingParameter);
  
  return trialList;
}


// ============================================================================
// EXPORT - Make functions available for other files to use (only in Node.js)
// ============================================================================
// This code runs in Node.js environments (not in web browsers)
// It makes all the functions in this file available to other files
// I use this part only for testing and development in Node.js. 
// You can savely remove this part and you will still be able to run the counterbalancing module in the browser.

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    // Main API - Functions you'll typically use
    createTrialSequences,  // Main function to create the complete trial sequence
    counterbalance,        // Function to create just the main counterbalanced trials
    prepend,               // Function to add trials at the beginning
    append,                // Function to add trials at the end
    
    // Validation functions - Check if inputs are valid
    ruleCheck,             // Check if rules are specified correctly
    proportionCheck,       // Check if proportions are specified correctly
    
    // Core helper functions - Internal functions used by the main functions
    nullToProportion,      // Replace null proportions with defaults
    pickSeed,              // Pick the first trial
    start,                 // Create the initial pool of trials
    solveable,             // Check if a valid trial exists at a position
    picker,                // Pick a random valid trial
    poolSubtraction,       // Remove a trial from the pool
    ruleTranslator,        // Translate rules to valid options
    getArrayElementsById,  // Get items from array by their positions
    
    // Debug functions - For troubleshooting
    debugLog,              // Print debug messages
    debugPoolState,        // Print the pool state
    formatPoolState,       // Format pool data nicely
    debugPickedConditions  // Print the picked conditions
  };
}
