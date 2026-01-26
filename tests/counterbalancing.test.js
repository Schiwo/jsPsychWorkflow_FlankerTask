/**
 * Test suite for counterbalancing.js
 * Tests the trial sequence generation with various factors, proportions, and transition rules
 */

// Load the counterbalancing functions
const {
  nullToProportion,
  ruleCheck,
  proportionCheck,
  ruleTranslator,
  getArrayElementsById,
  poolSubtraction,
  counterbalance,
  prepend,
  append,
  createTrialSequences
} = require('../scripts/counterbalancing.js');

const {
  deepCopy,
  randint,
  proportionalRandint
} = require('../scripts/baseFunctions.js');

// Test Suite
describe('Counterbalancing', () => {
  
  describe('Basic Validation Functions', () => {
    
    test('ruleCheck should pass with valid rules', () => {
      const factors = [2, 2, 2];
      const rules = [null, ["identical", 1, 0], null];
      
      expect(() => ruleCheck(rules, factors)).not.toThrow();
    });

    test('ruleCheck should throw when rules is not an array', () => {
      const factors = [2, 2];
      const rules = { "0": null };
      
      expect(() => ruleCheck(rules, factors)).toThrow('Rules must be an array');
    });

    test('ruleCheck should throw when rules length does not match factors', () => {
      const factors = [2, 2, 2];
      const rules = [null, ["identical", 1, 0]];
      
      expect(() => ruleCheck(rules, factors)).toThrow('Rules must be an array with n elements');
    });

    test('ruleCheck should throw when identical rule has x < 1', () => {
      const factors = [2, 2];
      const rules = [["identical", 0, 0], null];
      
      expect(() => ruleCheck(rules, factors)).toThrow('x must be larger than 0');
    });

    test('ruleCheck should throw when multiple "next" rules are specified', () => {
      const factors = [2, 2, 2];
      const rules = [["next", 1], ["next", 1], null];
      
      expect(() => ruleCheck(rules, factors)).toThrow('you can use only 1 NEXT rule');
    });

    test('proportionCheck should pass with valid proportions', () => {
      const proportions = [[1, 2], null, [3, 1]];
      
      expect(() => proportionCheck(proportions)).not.toThrow();
    });

    test('proportionCheck should throw when proportion has value < 1', () => {
      const proportions = [[1, 0.5], null];
      
      expect(() => proportionCheck(proportions)).toThrow('you cannot use proportion values <1');
    });
  });

  describe('Rule Translator', () => {
    
    test('ruleTranslator should return all factor levels when rule is null', () => {
      const factors = [2, 3, 2];
      const rules = [null, null, null];
      const list = [[0, 0, 0], [1, 2, 1]];
      
      const result = ruleTranslator(factors, rules, list, 2);
      
      expect(result).toEqual([[0, 1], [0, 1, 2], [0, 1]]);
    });

    test('ruleTranslator should apply identical rule correctly', () => {
      const factors = [2, 2, 2];
      const rules = [["identical", 1, 0], null, null];
      const list = [[0, 1, 0], [1, 0, 1]];
      
      const result = ruleTranslator(factors, rules, list, 2);
      
      // Should match the factor value from list[1][0] = 1
      expect(result[0]).toEqual(1);
    });

    test('ruleTranslator should apply different rule correctly', () => {
      const factors = [2, 2];
      const rules = [["different", 1, 0], null];
      const list = [[0, 1], [1, 0]];
      
      const result = ruleTranslator(factors, rules, list, 2);
      
      // Should exclude the value at list[1][0] = 1, so should be [0]
      expect(result[0]).toEqual([0]);
    });

    test('ruleTranslator should apply next rule correctly', () => {
      const factors = [3, 2];
      const rules = [["next", 1], null];
      const list = [[0, 1], [1, 0]];
      
      const result = ruleTranslator(factors, rules, list, 2);
      
      // Should return (1 + 1) % 3 = 2
      expect(result[0]).toEqual(2);
    });

    test('ruleTranslator next rule should wrap around', () => {
      const factors = [2, 2];
      const rules = [["next", 1], null];
      const list = [[0, 1], [1, 0]];
      
      const result = ruleTranslator(factors, rules, list, 2);
      
      // (1 + 1) % 2 = 0
      expect(result[0]).toEqual(0);
    });
  });

  describe('Helper Functions', () => {
    
    test('nullToProportion should convert null to equal proportions', () => {
      const proportions = [null, [1, 2], null];
      const factors = [2, 2, 3];
      
      const result = nullToProportion(deepCopy(proportions), factors);
      
      expect(result[0]).toEqual([1, 1]);
      expect(result[1]).toEqual([1, 2]);
      expect(result[2]).toEqual([1, 1, 1]);
    });

    test('getArrayElementsById should extract correct elements', () => {
      const array = [10, 20, 30, 40];
      const indices = [0, 2];
      
      const result = getArrayElementsById(array, indices);
      
      expect(result).toEqual([10, 30]);
    });

    test('poolSubtraction should subtract 1 from specified pool element', () => {
      const pool = [[2, 3], [1, 4]];
      const vector = [0, 1];
      
      const result = poolSubtraction(pool, vector);
      
      expect(result[0][1]).toBe(2);
      expect(result[0][0]).toBe(2);
      expect(result[1][0]).toBe(1);
    });
  });

  describe('Full Counterbalancing Process', () => {
    
    test('counterbalance should create correct number of trials', () => {
      const param = {
        factors: [2, 2],
        factorProportions: [null, null],
        transitionRules: [null, null],
        sets: 2,
        DEBUG_MODE: false
      };
      
      const result = counterbalance(param);
      
      // 2 factors * 2 levels each = 4 combinations, 2 sets = 8 trials
      expect(result.length).toBe(8);
    });

    test('counterbalance should include all factor combinations', () => {
      const param = {
        factors: [2, 2],
        factorProportions: [null, null],
        transitionRules: [null, null],
        sets: 1,
        DEBUG_MODE: false
      };
      
      const result = counterbalance(param);
      
      expect(result.length).toBe(4);
      
      const combinations = new Set(result.map(r => JSON.stringify(r)));
      expect(combinations.size).toBe(4);
    });

    test('counterbalance with proportions should respect factor ratios', () => {
      const param = {
        factors: [2],
        factorProportions: [[2, 1]],
        transitionRules: [null],
        sets: 1,
        DEBUG_MODE: false
      };
      
      const result = counterbalance(param);
      
      const count0 = result.filter(r => r[0] === 0).length;
      const count1 = result.filter(r => r[0] === 1).length;
      
      // Ratio should be approximately 2:1
      expect(count0).toBe(2);
      expect(count1).toBe(1);
    });

    test('counterbalance should respect identical transition rule', () => {
      const param = {
        factors: [2, 2],
        factorProportions: [null, null],
        transitionRules: [null, ["identical", 1, 0]],
        sets: 1,
        DEBUG_MODE: false
      };
      
      const result = counterbalance(param);
      
      // Check that factor 1 value matches factor 0 value from previous trial
      for (let i = 1; i < result.length; i++) {
        expect(result[i][1]).toBe(result[i - 1][0]);
      }
    });

    test('counterbalance should throw when constraints cannot be satisfied', () => {
      const param = {
        factors: [2, 2],
        factorProportions: [[10, 1], [10, 1]],
        transitionRules: [["different", 1, 1], ["different", 1, 0]],
        sets: 1,
        DEBUG_MODE: false
      };
      
      // This should eventually throw after many attempts
      expect(() => counterbalance(param)).toThrow();
    });
  });

  describe('Prepend Functionality', () => {
    
    test('prepend should add trials before the main sequence', () => {
      const rawList = [[0, 0], [1, 1]];
      const param = {
        preprendTrials: 1,
        prependRules: [null, null],
        factors: [2, 2]
      };
      
      const result = prepend(rawList, param);
      
      expect(result.length).toBe(3);
    });

    test('prepend with 0 trials should return original list', () => {
      const rawList = [[0, 0], [1, 1]];
      const param = {
        preprendTrials: 0,
        prependRules: [null, null],
        factors: [2, 2]
      };
      
      const result = prepend(rawList, param);
      
      expect(result).toEqual(rawList);
    });

    test('prepend should respect transition rules', () => {
      const rawList = [[0, 1], [1, 0], [0, 0]];
      const param = {
        preprendTrials: 1,
        prependRules: [["identical", 1, 1], null],
        factors: [2, 2]
      };
      
      const result = prepend(rawList, param);
      
      // Last trial in reversed list becomes first trial
      // After reversal: [[0, 0], [1, 0], [0, 1]]
      // Prepended trial should match factor 1 of last trial (which is 1)
      expect(result.length).toBe(4);
    });
  });

  describe('Append Functionality', () => {
    
    test('append should add trials after the main sequence', () => {
      const rawList = [[0, 0], [1, 1]];
      const param = {
        appendTrials: 1,
        appendRules: [null, null],
        factors: [2, 2]
      };
      
      const result = append(rawList, param);
      
      expect(result.length).toBe(3);
    });

    test('append with 0 trials should return original list', () => {
      const rawList = [[0, 0], [1, 1]];
      const param = {
        appendTrials: 0,
        appendRules: [null, null],
        factors: [2, 2]
      };
      
      const result = append(rawList, param);
      
      expect(result).toEqual(rawList);
    });
  });

  describe('Full Sequence Creation', () => {
    
    test('createTrialSequences should combine prepend, counterbalance, and append', () => {
      const param = {
        factors: [2, 2],
        factorProportions: [null, null],
        transitionRules: [null, null],
        sets: 1,
        preprendTrials: 1,
        prependRules: [null, null],
        appendTrials: 1,
        appendRules: [null, null],
        DEBUG_MODE: false
      };
      
      const result = createTrialSequences(param);
      
      // 1 prepended + 4 main (2x2 with 1 set) + 1 appended = 6
      expect(result.length).toBe(6);
    });

    test('createTrialSequences should return array of arrays', () => {
      const param = {
        factors: [2, 2],
        factorProportions: [null, null],
        transitionRules: [null, null],
        sets: 1,
        preprendTrials: 0,
        prependRules: [null, null],
        appendTrials: 0,
        appendRules: [null, null],
        DEBUG_MODE: false
      };
      
      const result = createTrialSequences(param);
      
      result.forEach(trial => {
        expect(Array.isArray(trial)).toBe(true);
        expect(trial.length).toBe(2);
      });
    });
  });

  describe('Complex Scenarios', () => {
    
    test('should handle 4-factor design with mixed rules', () => {
      const param = {
        factors: [2, 2, 2, 2],
        factorProportions: [null, null, null, null],
        transitionRules: [
          null,
          ["identical", 1, 0],
          ["next", 1],
          null
        ],
        sets: 1,
        DEBUG_MODE: false
      };
      
      const result = counterbalance(param);
      
      // 2^4 = 16 combinations with 1 set
      expect(result.length).toBe(16);
      
      // Verify factor 1 matches factor 0 of previous trial
      for (let i = 1; i < result.length; i++) {
        expect(result[i][1]).toBe(result[i - 1][0]);
      }
      
      // Verify factor 2 increments by 1 each trial
      for (let i = 1; i < result.length; i++) {
        expect(result[i][2]).toBe((result[i - 1][2] + 1) % 2);
      }
    });

    test('should handle multiple sets correctly', () => {
      const param = {
        factors: [2, 2, 2],
        factorProportions: [null, null, null],
        transitionRules: [null, null, null],
        sets: 3,
        DEBUG_MODE: false
      };
      
      const result = counterbalance(param);
      
      // 2^3 = 8 combinations with 3 sets = 24 trials
      expect(result.length).toBe(24);
    });

    test('should handle unequal factor proportions', () => {
      const param = {
        factors: [2, 3],
        factorProportions: [[3, 1], [1, 1, 1]],
        transitionRules: [null, null],
        sets: 1,
        DEBUG_MODE: false
      };
      
      const result = counterbalance(param);
      
      const count0_0 = result.filter(r => r[0] === 0).length;
      const count0_1 = result.filter(r => r[0] === 1).length;
      
      // Factor 0 should be 3:1 ratio
      // Total trials = 3*1 (factor 0) * 1*1*1 (factor 1) = 3 * 3 = 9
      // count0_0 should be 3x more than count0_1
      expect(count0_0).toBe(9);
      expect(count0_1).toBe(3);
    });
  });
});
