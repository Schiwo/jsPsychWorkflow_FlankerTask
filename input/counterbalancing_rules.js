function createCounterBalancingParameter() {
    let counterBalancingParameter = {
        factors: [2,2,2,2], // [current congruency, previous congruency, stimulus set, stimulus option]
        factorProportions: [null, null, null, null],
        transitionRules: [null, ["identical", 1, 0], ["next", 1], null],
        sets: 5,
        preprendTrials: 1,
        prependRules: [["identical", 1, 1], null, ["next", 1], null],
        appendTrials: 0,
        appendRules: [null, null, null, null],
    }

    return counterBalancingParameter
}

/*
#### COUNTERBALANCING PARAMETER ####

factors: set factors and factor levels.
    Input must be an array with n integers with n = the number of fators. 
    Each entry represents a factor, and the integer at each position represents this factor's number of levels.
    E. g., [2,3] means the factorial design will be balanced along two factors. Factor 1 has 2 levels (either 0 or 1), factor 2 has 3 levels (0, 1, or 2).
    createTrialSequences()  creates an array with equally balacnced factor permutations based on transition rules, resulting in an array with the structure:
    [[trial1],[trial2]...] whereby each trial contains an array with N factors [[factor1,factor2, ... ,factorN], [factor1,factor2, ... ,factorN]]

factorProportions: Set the proportion of how often factor levels occur.
    Input must be an array with n elements, with n = the number of factors.
    Each element must be either null, if each factor level should occur equally oftern, or an array of x integers, with x = the number of factor levels.
    Each integer reflects the proportion of occurences for this factor level.
    e.g. [[1,5], null]: factor level 0 of factor1 will be displayed 5 times as often as factor level 1 of factor1; the factor levels of factor2 will occur equally often.
    multiple factor proportions are allowed (e.g. [[1,5], [2,3], [7,3], [5,4]]).
    factor proportions can restrict transition rules.

transitionRules: Set the rules for the trial to trial transitions of each factor.
    Input must be an array with n elements, with n = the number of factors.
    Each element must be either null, if there are no specific transition rules for this factor, or an array containing the rules parameters for this factor:
    The implemented options for transition rules are:
    null: the factor level will be pseudo randomly determined.
    ["identical", x, y]: The factor level must be identical as the to factor level of factor y, but x trial before the current trial.
    ["different", x, y]: The factor level cannot be different than the factor level of factor y, but x trial before the current trial.
    ["next", x]: The factor level of the same factor in the last trial will be increased by x in a circular way (e.g. factor level 0 becomes factor level 1; after the last factor level x, it restarts with factor level 0).

sets: amount of trials with identical conditions per block (e.g. if sets = 3, each factor level combination will occur 3 times per block). 

preprendTrials: number of additional trials you want to prepend before the trials balanced according to the previously declared parameter (e.g. because you included transition rules and
    you want to include a matching trial). Please note that these additional trials do not come from the balanced pool as the other trials.

prependRules: Set the rules for the prepended trials. The rules are declared as described under transitionRules. PLEASE NOTE that to apply the rules for the prepended trials 
    the already created trial list is reversed (the first trial becomes the last trial), then the declared number of trials are appended to the list, and then the list is reversed again.
    This might affect how you have to specify the prependRules.

appendTrials: number of additional trials you want to append after the trials balanced according to the previously declared parameter. 
    Please note that these additional trials do not come from the balanced pool as the other trials.

appendRules: Set the rules for the appended trials. The rules are declared as described under transitionRules.
*/
