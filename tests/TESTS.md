# Counterbalancing Tests

This directory contains comprehensive tests for the counterbalancing functionality used in the Flanker Task experiment.

## Overview

The test suite covers:
- **Basic Validation Functions**: Rule and proportion checking
- **Rule Translator**: Transition rule application
- **Helper Functions**: Utility functions like array manipulation and pool operations
- **Full Counterbalancing Process**: Complete trial sequence generation
- **Prepend/Append Functionality**: Adding trials before and after main sequences
- **Complex Scenarios**: Multi-factor designs with various constraint combinations

## Running Tests

### Prerequisites
Install Jest (if not already installed):
```bash
npm install --save-dev jest
```

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm test -- --watch
```

### Run tests with coverage
```bash
npm test -- --coverage
```

### Run a specific test file
```bash
npm test -- scripts/counterbalancing.test.js
```

## Test Structure

### 1. Basic Validation Functions
Tests that verify the validation logic for counterbalancing parameters:
- Valid and invalid rule specifications
- Proper error handling for misconfigured rules
- Proportion validation

### 2. Rule Translator Tests
Verifies that transition rules are correctly applied:
- `null` rules (no constraints)
- `["identical", x, y]` - factor must match previous trial
- `["different", x, y]` - factor must differ from previous trial
- `["next", x]` - factor increments circularly

### 3. Helper Function Tests
Tests utility functions used throughout the counterbalancing process

### 4. Full Counterbalancing Tests
Comprehensive tests of the main `counterbalance()` function:
- Correct number of trials generated
- All factor combinations included
- Proportion ratios respected
- Transition rules enforced

### 5. Prepend/Append Tests
Tests for adding additional trials before or after the main balanced sequence

### 6. Complex Scenarios
Real-world test cases including:
- 4-factor designs with mixed rules
- Multiple sets per factor combination
- Unequal factor proportions

## Key Test Cases

### Simple 2x2 Design
```javascript
const param = {
  factors: [2, 2],
  factorProportions: [null, null],
  transitionRules: [null, null],
  sets: 1
};
// Expected: 4 trials (all combinations)
```

### 4-Factor Design with Constraints
```javascript
const param = {
  factors: [2, 2, 2, 2],
  transitionRules: [
    null,
    ["identical", 1, 0],  // Factor 1 matches factor 0 from previous
    ["next", 1],          // Factor 2 increments by 1 each trial
    null
  ],
  sets: 1
};
// Expected: 16 trials with enforced transition rules
```

### With Prepend/Append
```javascript
const param = {
  factors: [2, 2],
  sets: 1,
  preprendTrials: 1,      // 1 trial prepended
  appendTrials: 1,        // 1 trial appended
  preprendRules: [...],
  appendRules: [...]
};
// Expected: 1 + 4 + 1 = 6 trials
```

## Interpreting Test Results

- **PASS**: The function behaves as expected
- **FAIL**: Either the function has a bug or the test expectations need adjustment

### Common Issues

1. **Rule constraints cannot be satisfied**: If you have very restrictive rules, the algorithm may fail to find valid trial sequences. The test suite includes a test for this expected error.

2. **Proportion constraints conflict with transition rules**: Be careful when combining strict proportions with strict transition rules - they may be mutually exclusive.

3. **Random seed failures**: Some tests use randomization. If a test fails randomly but not consistently, it may indicate an edge case in the randomization logic.

## Adding New Tests

To add new test cases:

1. Open `scripts/counterbalancing.test.js`
2. Add a new test case in the appropriate `describe` block
3. Use the format:
```javascript
test('description of what should happen', () => {
  const param = { /* your test parameters */ };
  const result = counterbalance(param);
  expect(result.length).toBe(expectedLength);
});
```

## Troubleshooting

### Jest not found
Make sure to run `npm install --save-dev jest` in the project root

### Tests hang or timeout
This can happen if the counterbalancing algorithm is stuck in an infinite loop due to unsatisfiable constraints. Increase the Jest timeout:
```javascript
test('my test', () => {
  // ...
}, 10000); // 10 second timeout
```

### Math library errors
The tests include a mock implementation of the math.js library used by counterbalancing.js. If you're adding new math operations, update the mock in the test file.

## Future Improvements

- Integration tests with actual HTML/jsPsych setup
- Performance benchmarks for large factor designs
- Statistical tests to verify randomization quality
- Visualization of trial sequences for validation
