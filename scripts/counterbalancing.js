// 
function balancedSubset(levels) {
  // for (var b = 0; b < factorProportions.length; i++) {
  //   if (factorProportions[b] != null) {
  //     balancedFactors.append(b)
  //   }
  // return list.map(index => balancedIDs[index])
  return levels.filter((element, index) => factorProportions[index] !== null);
}

//function to check if the transition rules are correctly specified
function ruleCheck(rules, factors) {
  nextCheck = false;
  if (!Array.isArray(rules)) {
    throw "Rules must be an array with n elements (n = number of factors)."}
  else if (rules.length != factors.length) {
    throw "Rules must be an array with n elements (n = number of factors)."
  }

  for (var i = 0; i < rules.length; i++) {
    if (rules[i] == null) {
      continue;
    } else {
      if (rules[i][0] == "identical") {
        if (rules[i][1] < 1) {
          throw "rule error; x must be larger than 0!"
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


//function to pick valid factor combinations for the next trial depending on the specified transition rurles 
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

// function to pick a random seed
function pickSeed(fa) {
  var seeds = [];
  for (var i = 0; i < fa.length; i++) {
    seeds.push(randint(fa[i]));
  }
  return seeds;
}

//function to create 
function start(factors, factorProportions, rSeed){ 
    //coding variables
    var srcpool = math.ones.apply(null, factors); //create base matrix
    for (var i = 0; i < factorProportions.length; i++) { //apply proportion rules
      if (factorProportions[i] == null) {
        continue;
      } else{
        srcpool.forEach(function (value, index, matrix) {
            srcpool = math.subset(srcpool, math.index.apply(null, index),
            math.multiply(math.subset(srcpool, math.index.apply(null, index)), factorProportions[i][index[i]]));
      });
    }
  }
  srcpool = math.multiply(srcpool , sets); //apply multiple sets of individual factor combinations
  pool = math.clone(srcpool);
  l = Array.apply(null, Array(math.sum(pool))).map(function () {});
  pool = math.subset(pool,
    math.index.apply(null, rSeed),
    math.subtract(math.subset(pool, math.index.apply(null, rSeed)), 1));
  return(pool);
}


// function used to check whether there is a legit solution for the currently picked order
function solveable(pool, prev, index){
  if (pool == undefined){
    return true
  }
  var valid = ruleTranslator(factors, transitionRules, prev, index);

  if (math.sum(math.subset(pool, math.index.apply(null, balancedSubset(valid)))) == 0) {
    return(false);
  } else {
      return(true);
  }
}


// function used to pick random variables from the matrix following the conditions
function picker(pool, prev, index){ 
  var valid = ruleTranslator(factors, transitionRules, prev, index);
  var id = 0;
  while (true) {
    id ++;
    if (id > 200) {
      throw "Couldnt find a solution. Consider using less restrictions.";
    }
    var pickedConditions = [];
    for (var i = 0; i < valid.length; i++) {
      if (Array.isArray(valid[i])) {
        pickedConditions.push(valid[i][randint(valid[i].length)]); FEHLER SIEHE CELINES EXPERIMENT
      } else {
        pickedConditions.push(valid[i]);
      }
    }

    if (math.subset(pool, math.index.apply(null, pickedConditions)) == 0) {
      continue;
    } else {
      pool = math.subset(pool, math.index.apply(null, pickedConditions),
       math.subtract(math.subset(pool, math.index.apply(null, pickedConditions)), 1));
      return(pickedConditions);
    }
  }
}




// function used for list generation, sets: amount of counterbalanced variable sets per block
function counterbalance(counterBalancingParameter) {
  factors = counterBalancingParameter.factors;
  factorProportions = counterBalancingParameter.factorProportions;
  transitionRules = counterBalancingParameter.transitionRules;
  sets = counterBalancingParameter.sets;

  //check rules
  ruleCheck(transitionRules, factors);
  //check proportions
  proportionCheck(factorProportions);

  randomSeed = pickSeed(factors);
  balancedFactors = [];

  
  
  balancedPool = start(balancedSubset(factors, balancedFactors), balancedSubset(factorProportions, balancedFactors), balancedSubset(randomSeed, balancedFactors));
  trialList = startVars[randomSeed];

  tryNr = 0;
  restartNr = 0;
  j = 1;
  //pick the order
  while (j < l.length) {
    if (solveable(balancedPool, trialList, j)) {
      trialList[j] = picker(balancedPool, trialList, j);
      j ++;
      continue;
    } else {
      if (tryNr > 25) {
        console.log("Picking new seed.");
        randomSeed = pickSeed(factors);
        tryNr = 0;
        restartNr ++;
        if (restartNr > 15) {
          throw "Can't find a solution for the specified factors.";
        }
      }
      startVars = start(randomSeed);
      pool = startVars[0];
      trialList = startVars[1];
      j = 1;
      tryNr ++;
      continue;

    }
  }
  return l;
}



function prepend(rawList, counterBalancingParameter) {
  n = counterBalancingParameter.preprendTrials;
  rules = counterBalancingParameter.prependRules;
  factors = counterBalancingParameter.factors
  if (n == 0){return rawList}
  ruleCheck(rules, factors)
  revList = deepCopy(rawList).reverse()
  for (let index = 0; index < n; index++) {
    valid = ruleTranslator(factors, rules, revList, revList.length);

    var pickedCombo = [];
    for (var i = 0; i < valid.length; i++) {
      if (Array.isArray(valid[i])) {
        pickedCombo.push(valid[i][randint(valid[i].length)]);
      } else {
        pickedCombo.push(valid[i]);
      }
    }
    revList.push(pickedCombo)
  }

  return revList.reverse()
}
  
function append(rawList, factors, transitionRules, n) {
  n = counterBalancingParameter.appendTrials;
  rules = counterBalancingParameter.appendRules;
  factors = counterBalancingParameter.factors
  if (n == 0){return rawList}
  ruleCheck(rules, factors)
  list = deepCopy(rawList)
  for (let index = 0; index < n; index++) {
    valid = ruleTranslator(factors, rules, list, list.length);

    var pickedCombo = [];
    for (var i = 0; i < valid.length; i++) {
      if (Array.isArray(valid[i])) {
        pickedCombo.push(valid[i][randint(valid[i].length)]);
      } else {
        pickedCombo.push(valid[i]);
      }
    }
    list.push(pickedCombo)
  }

  return list
}


function createTrialSequences(counterBalancingParameter) {
  trialList = counterbalance(counterBalancingParameter);
  trialList = prepend(trialList, counterBalancingParameter);
  trialList = append(trialList, counterBalancingParameter);
  return trialList;
}
