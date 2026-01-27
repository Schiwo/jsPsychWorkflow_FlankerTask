// ============================================================================
// COUNTERBALANCING SETUP - Node.js Environment Only
// ============================================================================
// This file handles all Node.js-specific setup and should NOT be used in
// production browser environments. This setup is only needed for testing
// and development in Node.js.
//
// This file:
// - Loads the math.js library (required for matrix operations)
// - Loads helper functions from baseFunctions.js
// - Makes these available globally for the counterbalancing module
// ============================================================================

// Load the math.js library for matrix calculations
try {
  global.math = require('mathjs');
  console.log('[SETUP] math.js library loaded successfully');
} catch (e) {
  console.warn('[SETUP] Warning: math.js library not available. Some features may not work.');
}

// Load helper functions from baseFunctions.js and make them globally available
try {
  const baseFuncs = require('./baseFunctions.js');
  
  // Add these functions to the global scope so they can be used by counterbalancing.js
  if (!global.deepCopy) global.deepCopy = baseFuncs.deepCopy;
  if (!global.randint) global.randint = baseFuncs.randint;
  if (!global.proportionalRandint) global.proportionalRandint = baseFuncs.proportionalRandint;
  
  console.log('[SETUP] Helper functions loaded successfully');
} catch (e) {
  console.warn('[SETUP] Warning: baseFunctions.js not available. Helper functions will not be available.');
}

// Finally, load the main counterbalancing module
try {
  const counterbalancing = require('./counterbalancing.js');
  console.log('[SETUP] Counterbalancing module loaded successfully');
  module.exports = counterbalancing;
} catch (e) {
  console.error('[SETUP] Error loading counterbalancing.js:', e);
  throw e;
}

// ============================================================================
// GLOBAL VARIABLES 
// ============================================================================
// These variables are set for testing purposes at the beginning by the counterbalance() function
// They are used throughout the program to remember key settings
var factors;                  // How many options each experimental factor has
var factorProportions;        // How often each factor option should appear
var transitionRules;          // Rules about how trials can follow each other
var sets;                     // How many complete sets of trials to create
var DEBUG_MODE;               // Whether to print debug information to the console

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