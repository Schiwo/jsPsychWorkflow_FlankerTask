function createCounterBalancingParameter() {
    let counterBalancingParameter = {
        conditions: [2,2,2,2], // [current congruency, previous congruency, stimulus set, stimulus option]
        conditionProportions: [null, null, null, null],
        transitionRules: [null, ["identical", 1, 0], ["next", 1], null],
        sets: 1,
        preprendTrials: 1,
        prependRules: [["identical", 1, 1], null, ["next", 1], null],
        appendTrials: 0,
        appendRules: [null, null, null, null],
        debugMode: false
    }

    return counterBalancingParameter
}



/*
#### COUNTERBALANCING PARAMETER ####

conditions: set conditions and condition levels.
    Input must be an array with n integers with n = the number of fators. 
    Each entry represents a condition, and the integer at each position represents this condition's number of levels.
    E. g., [2,3] means the conditionial design will be balanced along two conditions. condition 1 has 2 levels (either 0 or 1), condition 2 has 3 levels (0, 1, or 2).
    createTrialSequences()  creates an array with equally balacnced condition permutations based on transition rules, resulting in an array with the structure:
    [[trial1],[trial2]...] whereby each trial contains an array with N conditions [[condition1,condition2, ... ,conditionN], [condition1,condition2, ... ,conditionN]]

conditionProportions: Set the proportion of how often condition levels occur.
    Input must be an array with n elements, with n = the number of conditions.
    Each element must be either null, if each condition level should occur equally oftern, or an array of x integers, with x = the number of condition levels.
    Each integer reflects the proportion of occurences for this condition level.
    e.g. [[1,5], null]: condition level 0 of condition1 will be displayed 5 times as often as condition level 1 of condition1; the condition levels of condition2 will occur equally often.
    multiple condition proportions are allowed (e.g. [[1,5], [2,3], [7,3], [5,4]]).
    condition proportions can restrict transition rules.

transitionRules: Set the rules for the trial to trial transitions of each condition.
    Input must be an array with n elements, with n = the number of conditions.
    Each element must be either null, if there are no specific transition rules for this condition, a function for custom rules, or an array containing the rules parameters for this condition:
    The implemented options for transition rules are:
    null: the condition level will be pseudo randomly determined.
    function: a custom rule function (see CUSTOM TRANSITION RULES section above).
    ["identical", x, y]: The condition level must be identical as the to condition level of condition y, but x trial before the current trial.
    ["different", x, y]: The condition level cannot be different than the condition level of condition y, but x trial before the current trial.
    ["next", x]: The condition level of the same condition in the last trial will be increased by x in a circular way (e.g. condition level 0 becomes condition level 1; after the last condition level x, it restarts with condition level 0).

    #### CUSTOM TRANSITION RULES ####
    In addition to the built-in transition rules, you can define custom rule functions.
    A custom rule function receives three parameters:
    - numLevels: Number of levels for this condition
    - currentIndex: Current trial index (0-indexed)
    - previousTrials: Array of all previously selected trial combinations

    The function should return either:
    - An array of valid level indices (e.g., [0, 1, 2] means levels 0, 1, or 2 are valid)
    - A single level index (e.g., 0 means only level 0 is valid)

    For detailed examples (ABBAABBAA pattern, alternating pattern, avoid repetition, etc.),
    see COUNTERBALANCING_EXPLANATION.txt


sets: amount of trials with identical conditions per block (e.g. if sets = 3, each condition level combination will occur 3 times per block). 

preprendTrials: number of additional trials you want to prepend before the trials balanced according to the previously declared parameter (e.g. because you included transition rules and
    you want to include a matching trial). Please note that these additional trials do not come from the balanced pool as the other trials.

prependRules: Set the rules for the prepended trials. The rules are declared as described under transitionRules. PLEASE NOTE that to apply the rules for the prepended trials 
    the already created trial list is reversed (the first trial becomes the last trial), then the declared number of trials are appended to the list, and then the list is reversed again.
    This might affect how you have to specify the prependRules.

appendTrials: number of additional trials you want to append after the trials balanced according to the previously declared parameter. 
    Please note that these additional trials do not come from the balanced pool as the other trials.

appendRules: Set the rules for the appended trials. The rules are declared as described under transitionRules.

debugMode: Set to true to enable debug mode, which provides additional information in the console about the counterbalancing process.
*/

/*

*/