// Load dependencies only in Node.js environment
if (typeof require !== 'undefined' && typeof global !== 'undefined') {
  try {
    global.math = require('mathjs');
  } catch (e) {
    // math.js not available in this context
  }
  try {
    const baseFuncs = require('./baseFunctions.js');
    // In Node.js, assign to global scope to match browser behavior
    if (!global.deepCopy) global.deepCopy = baseFuncs.deepCopy;
    if (!global.randint) global.randint = baseFuncs.randint;
    if (!global.proportionalRandint) global.proportionalRandint = baseFuncs.proportionalRandint;
  } catch (e) {
    // baseFunctions not available in this context
  }
}

// Global variables used during counterbalancing
// These are set by the counterbalance() function
var factors;
var factorProportions;
var transitionRules;
var sets;
var DEBUG_MODE;

/**
 * Get math library instance - works in both browser and Node.js environments
 * @returns {Object} math.js library instance
 * @throws {Error} If math.js library is not found
 */
function getMath() {
  if (typeof global !== 'undefined' && global.math) {
    return global.math;
  } else if (typeof window !== 'undefined' && window.math) {
    return window.math;
  }
  throw new Error('math.js library not found');
}

// Constants for counterbalancing algorithm
const MAX_PICKER_ATTEMPTS = 200;  // Maximum attempts to pick a valid combination
const MAX_RETRY_ATTEMPTS = 25;    // Maximum retry attempts before picking new seed
const MAX_RESTART_ATTEMPTS = 15;  // Maximum restart attempts with new seed

/**
 * Convert null values in proportions array to default arrays
 * @param {Array} prprtn - Proportions array that may contain null values
 * @param {Array} fctr - Factors array containing number of levels for each factor
 * @returns {Array} Modified proportions array with null values replaced
 */
function nullToProportion(prprtn, fctr) {
  for (var i = 0; i < prprtn.length; i++) {
    if (prprtn[i] == null) {
      prprtn[i] = Array(fctr[i]).fill(1);
    }
  }
  return prprtn;
} 

//function to check if the transition rules are correctly specified
/**
 * Validate transition rules specification
 * @param {Array} rules - Array of transition rules (one per factor)
 * @param {Array} factors - Array containing number of levels for each factor
 * @throws {Error} If rules are invalid or incorrect
 */
function ruleCheck(rules, factors) {
  let nextCheck = false;
  if (!Array.isArray(rules)) {
    throw "Rules must be an array with n elements (n = number of factors).";
  } else if (rules.length != factors.length) {
    throw "Rules must be an array with n elements (n = number of factors).";
  }

  for (var i = 0; i < rules.length; i++) {
    if (rules[i] == null) {
      continue;
    } else {
      if (rules[i][0] == "identical") {
        if (rules[i][1] < 1) {
          throw "rule error; x must be larger than 0!";
        }
      } else if (rules[i][0] == "next") {
        if (nextCheck == true) {
          throw "rule error; you can use only 1 NEXT rule!";
        } else {
          nextCheck = true;
        }
      }
    }
  }
}

//function to check if proportions are correctly specified 
/**
 * Validate proportions specification
 * @param {Array} proportions - Array of proportions (one per factor)
 * @throws {Error} If any proportion value is less than 1
 */
function proportionCheck(proportions) {
  for (var i = 0; i < proportions.length; i++) {
    if (proportions[i] == null) {
      continue;
    } else {
      if (proportions[i].some(function(e) {
        return e < 1;
      })) {
        throw "rule error; you cannot use proportion values <1";
      }
    }
  }
} 


//function to pick valid factor combinations for the next trial depending on the specified transition rules 
/**
 * Translate transition rules to valid factor combinations for the next trial
 * @param {Array} factors - Array containing number of levels for each factor
 * @param {Array} rules - Array of transition rules
 * @param {Array} list - List of previously picked trial combinations
 * @param {number} index - Current trial index
 * @returns {Array} Valid combinations for each factor at current trial
 */
function ruleTranslator(factors, rules, list, index) {
  validCombos = [];
  for (var i = 0; i < factors.length; i++) {
    if (rules[i] == null) {
      validCombos.push(Array.from(Array(factors[i]).keys()));
    } else if (rules[i][0] == "identical") {
      validCombos.push(list[index - rules[i][1]][rules[i][2]]);
    } else if (rules[i][0] == "different") {
      var availableValue = Array.from(Array(factors[i]).keys());
      availableValue.splice(list[index - rules[i][1]][rules[i][2]], 1);
      validCombos.push(availableValue);
    } else if (rules[i][0] == "next") {
      validCombos.push((list[index - 1][i] + rules[i][1]) % factors[i]);
    }
  }
  return validCombos;
}

/**
 * Extract array elements by indices
 * @param {Array} array - Source array
 * @param {Array} indices - Indices to extract
 * @returns {Array} Elements at specified indices
 */
function getArrayElementsById(array, indices) {
  return indices.map(id => array[id]);
}


/**
 * Log debug message if DEBUG_MODE is enabled
 * @param {string} message - Message to log
 */
function debugLog(message) {
  if (DEBUG_MODE) {
    console.log("[DEBUG] " + message);
  }
}

/**
 * Log pool state summary if DEBUG_MODE is enabled
 * @param {Object} pool - Pool matrix to check
 * @param {string} label - Label for this state
 */
function debugPoolState(pool, label) {
  if (DEBUG_MODE) {
    var sum = getMath().sum(pool);
    console.log("[POOL] " + label + " - Remaining trials: " + sum);
  }
}

/**
 * Format pool state as readable string showing all indices and values
 * @param {Object} pool - Pool matrix to format
 * @returns {string} Formatted pool state
 */
function formatPoolState(pool) {
  var formatted = "";
  var size = pool.size();
  
  function iterateArray(arr, indices) {
    if (Array.isArray(arr)) {
      for (var i = 0; i < arr.length; i++) {
        var newIndices = indices.concat([i]);
        iterateArray(arr[i], newIndices);
      }
    } else {
      formatted += "[" + indices.join(",") + "]: " + arr + "\n";
    }
  }
  
  iterateArray(pool.valueOf(), []);
  return formatted;
}

/**
 * Log picked conditions for current trial if DEBUG_MODE is enabled
 * @param {number} trialNum - Trial number
 * @param {Array} conditions - Picked conditions for this trial
 */
function debugPickedConditions(trialNum, conditions) {
  if (DEBUG_MODE) {
    console.log("[TRIAL " + trialNum + "] Picked conditions: [" + conditions.join(", ") + "]");
  }
}

/**
 * Pick random seed values based on proportions
 * @param {Array} prop - Proportions array for each factor
 * @returns {Array} Random seed combination
 */
function pickSeed(prop) {
  var seeds = [];
  for (var i = 0; i < prop.length; i++) {
    seeds.push(proportionalRandint(prop[i]));
  }
  return seeds;
}

//function to create base pool for counterbalancing
/**
 * Create initial pool with factor proportions applied
 * @param {Array} factors - Array containing number of levels for each factor
 * @param {Array} factorProportions - Array of proportions for each factor
 * @returns {Object} Base pool matrix with proportions applied
 */
function start(factors, factorProportions) {
  //coding variables
  const math = getMath();
  var basePool = math.ones.apply(null, factors); //create base matrix
  for (var i = 0; i < factorProportions.length; i++) {
    basePool.forEach(function (value, index, matrix) {
      basePool = math.subset(basePool, math.index.apply(null, index),
        math.multiply(math.subset(basePool, math.index.apply(null, index)), factorProportions[i][index[i]]));
    });
  }
  basePool = math.multiply(basePool, sets);
  return basePool;
}


/**
 * Check if a solveable solution exists for the current trial given constraints
 * @param {Object} pool - Remaining pool matrix
 * @param {Array} prev - Previously selected trial combinations
 * @param {number} index - Current trial index
 * @returns {boolean} True if a valid combination exists, false otherwise
 */
function solveable(pool, prev, index) {
  if (pool == undefined) {
    return true;
  }
  const math = getMath();
  var valid = ruleTranslator(factors, transitionRules, prev, index);
  return math.sum(math.subset(pool, math.index.apply(null, valid))) > 0;
}

/**
 * Subtract one from a specific condition combination in the pool
 * @param {Object} matrix - Pool matrix
 * @param {Array} vector - Indices of condition combination to subtract
 * @returns {Object} Updated pool matrix
 */
function poolSubtraction(matrix, vector) {
  const math = getMath();
  return math.subset(matrix, math.index.apply(null, vector),
    math.subtract(math.subset(matrix, math.index.apply(null, vector)), 1));
}

/**
 * Pick a random valid combination from the pool following transition rules
 * @param {Object} pool - Remaining pool matrix
 * @param {Array} prev - Previously selected trial combinations
 * @param {number} index - Current trial index
 * @param {Array} proportions - Proportions array for weighted selection
 * @returns {Array} Randomly selected valid condition combination
 * @throws {Error} If no solution can be found after max attempts
 */
function picker(pool, prev, index, proportions) {
  const math = getMath();
  var valid = ruleTranslator(factors, transitionRules, prev, index);
  var attemptCount = 0;
  
  while (true) {
    attemptCount++;
    if (attemptCount > MAX_PICKER_ATTEMPTS) {
      throw "Couldn't find a solution. Consider using less restrictions.";
    }
    var pickedConditions = [];
    for (var i = 0; i < valid.length; i++) {
      if (Array.isArray(valid[i])) {
        pickedConditions.push(valid[i][proportionalRandint(getArrayElementsById(proportions[i], valid[i]))]);
      } else {
        pickedConditions.push(valid[i]);
      }
    }

    if (math.subset(pool, math.index.apply(null, pickedConditions)) > 0) {
      return pickedConditions;
    }
  }
}




/**
 * Generate a counterbalanced trial sequence based on specified parameters
 * @param {Object} counterBalancingParameter - Configuration object containing:
 *   - factors: Array of factor levels
 *   - factorProportions: Array of proportions (or null) for each factor
 *   - transitionRules: Array of transition rules between trials
 *   - sets: Number of counterbalanced sets
 *   - DEBUG_MODE: Optional boolean to enable debug logging
 * @returns {Array} Counterbalanced list of trial combinations
 * @throws {Error} If no valid solution exists for given constraints
 */
function counterbalance(counterBalancingParameter) {
  const math = getMath();
  
  // Set global variables from parameters
  factors = counterBalancingParameter.factors;
  factorProportions = nullToProportion(counterBalancingParameter.factorProportions, factors);
  transitionRules = counterBalancingParameter.transitionRules;
  sets = counterBalancingParameter.sets;
  DEBUG_MODE = counterBalancingParameter.DEBUG_MODE || false;

  // Local variables for this function
  var randomSeed, basePool, remainingPool, trialList, tryNr, restartNr, j, trialcount;

  //check rules
  ruleCheck(transitionRules, factors);
  //check proportions
  proportionCheck(factorProportions);

  randomSeed = pickSeed(factorProportions, factors);
  basePool = start(factors, factorProportions);

  remainingPool = math.clone(basePool);

  trialList = [randomSeed];
  remainingPool = poolSubtraction(remainingPool, randomSeed);
  tryNr = 0;
  restartNr = 0;
  j = 1;
  trialcount = math.sum(basePool);

  debugLog("Starting counterbalance with " + trialcount + " total trials");
  debugPickedConditions(0, randomSeed);
  debugPoolState(remainingPool, "Initial");

  // Pick the trial order
  while (j < trialcount) {
    debugLog("Loop check: j=" + j + ", trialcount=" + trialcount + ", pool_sum=" + math.sum(remainingPool));
    if (solveable(remainingPool, trialList, j)) {
      trialList[j] = picker(remainingPool, trialList, j, factorProportions);
      debugPickedConditions(j, trialList[j]);
      remainingPool = poolSubtraction(remainingPool, trialList[j]);
      debugPoolState(remainingPool, "After trial " + j);
      j++;
    } else {
      debugLog("No solveable combination found for trial " + j + " (Try #" + (tryNr + 1) + ")");
      if (tryNr > MAX_RETRY_ATTEMPTS) {
        debugLog("Picking new seed (Restart #" + (restartNr + 1) + ")");
        randomSeed = pickSeed(factorProportions, factors);
        tryNr = 0;
        restartNr++;
        if (restartNr > MAX_RESTART_ATTEMPTS) {
          var remainingCount = math.sum(remainingPool);
          var valid = ruleTranslator(factors, transitionRules, trialList, j);
          var availableCount = math.sum(math.subset(remainingPool, math.index.apply(null, valid)));
          throw "Can't find a solution for the specified factors.\nFailed at trial " + j + ".\nRemaining conditions in pool: " + remainingCount + ".\nAvailable conditions matching rules: " + availableCount + ".\nPool state:\n" + formatPoolState(remainingPool);
        }
      }
      remainingPool = basePool;
      trialList = [randomSeed];
      remainingPool = poolSubtraction(remainingPool, randomSeed);
      j = 1;
      tryNr++;
    }
  }

  debugLog("Counterbalance completed successfully!");
  return trialList;
}



/**
 * Prepend trials to the beginning of a trial sequence based on rules
 * @param {Array} rawList - Original trial list
 * @param {Object} counterBalancingParameter - Configuration object containing:
 *   - preprendTrials: Number of trials to prepend
 *   - prependRules: Transition rules for prepended trials
 *   - factors: Array of factor levels
 * @returns {Array} Trial list with prepended trials
 */
function prepend(rawList, counterBalancingParameter) {
  var n = counterBalancingParameter.preprendTrials;
  var rules = counterBalancingParameter.prependRules;
  var factors = counterBalancingParameter.factors;
  
  if (n == 0) {
    return rawList;
  }
  
  ruleCheck(rules, factors);
  var revList = deepCopy(rawList).reverse();
  
  for (let index = 0; index < n; index++) {
    var valid = ruleTranslator(factors, rules, revList, revList.length);
    var pickedCombo = pickRandomCombo(valid);
    revList.push(pickedCombo);
  }

  return revList.reverse();
}


/**
 * Helper function to pick a random combination based on rules
 * Used internally by prepend and append functions
 * @param {Array} validFactors - Valid factor combinations for current position
 * @returns {Array} Randomly selected combination
 * @private
 */
function pickRandomCombo(validFactors) {
  var pickedCombo = [];
  for (var i = 0; i < validFactors.length; i++) {
    if (Array.isArray(validFactors[i])) {
      pickedCombo.push(validFactors[i][randint(validFactors[i].length)]);
    } else {
      pickedCombo.push(validFactors[i]);
    }
  }
  return pickedCombo;
}
/**
 * Append trials to the end of a trial sequence based on rules
 * @param {Array} rawList - Original trial list
 * @param {Object} counterBalancingParameter - Configuration object containing:
 *   - appendTrials: Number of trials to append
 *   - appendRules: Transition rules for appended trials
 *   - factors: Array of factor levels
 * @returns {Array} Trial list with appended trials
 */
function append(rawList, counterBalancingParameter) {
  var n = counterBalancingParameter.appendTrials;
  var rules = counterBalancingParameter.appendRules;
  var factors = counterBalancingParameter.factors;
  
  if (n == 0) {
    return rawList;
  }
  
  ruleCheck(rules, factors);
  var list = deepCopy(rawList);
  
  for (let index = 0; index < n; index++) {
    var valid = ruleTranslator(factors, rules, list, list.length);
    var pickedCombo = pickRandomCombo(valid);
    list.push(pickedCombo);
  }

  return list;
}

/**
 * Create a complete trial sequence with prepended, main, and appended trials
 * @param {Object} counterBalancingParameter - Configuration object for counterbalancing
 * @returns {Array} Complete trial sequence with all phases
 */
function createTrialSequences(counterBalancingParameter) {
  var trialList = counterbalance(counterBalancingParameter);
  trialList = prepend(trialList, counterBalancingParameter);
  trialList = append(trialList, counterBalancingParameter);
  return trialList;
}

// Export functions for use in Node.js/CommonJS environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    // Main API
    createTrialSequences,
    counterbalance,
    prepend,
    append,
    
    // Validation functions
    ruleCheck,
    proportionCheck,
    
    // Core helper functions
    nullToProportion,
    pickSeed,
    start,
    solveable,
    picker,
    poolSubtraction,
    ruleTranslator,
    getArrayElementsById,
    
    // Debug functions
    debugLog,
    debugPoolState,
    formatPoolState,
    debugPickedConditions
  };
}
