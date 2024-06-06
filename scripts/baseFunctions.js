// function used to deep copy trials
function deepCopy(oldObj) {
  var newObj = oldObj;
  if (oldObj && typeof oldObj === 'object') {
      newObj = Object.prototype.toString.call(oldObj) === "[object Array]" ? [] : {};
      for (var i in oldObj) {
          newObj[i] = deepCopy(oldObj[i]);
      }
  }
  return newObj;
}

// function used to get random int 0 to max (non inclusive)
function randint(max) {
min = 0
max = Math.floor(max) - 1;
return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function used to select an index from an array of proportions such that the probability of selecting each index is proportional to the value at that index
function proportionalRandint(proportions) {
  let sum = proportions.reduce((a, b) => a + b, 0)
  let pick = randint(sum)

  let steps = 0
  for (i = 0; i < proportions.length; i++) {
      steps += proportions[i];
      if (pick < steps){
        return i
      }
  }
}


function instrLoader(folder, instrLength){
  var imgArray = [];
  for (var i = 0; i < instrLength; i++) {
    imgArray[i] = new Image();
    imgArray[i].src = `instructions/${folder}/Folie${i + 1}.JPG`;
  }
  return imgArray;
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}



function loadScriptAsync(path) {
  return new Promise((resolve, reject) => {
      var script = document.createElement("script");
      script.src = path;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
  });
}


async function loadScripts(directory, files, extension = ".js", callback) {
  var scripts = [];
  for (var file of files) {
      var path = directory + file + extension;
      console.log(path);
      scripts.push(loadScriptAsync(path));
  }

  try {
      await Promise.all(scripts);
      console.log("All scripts loaded successfully");
      if (callback && typeof callback === 'function') {
          callback(); // Call the callback function if provided
      }
  } catch (error) {
      console.error("Error loading scripts:", error);
  }
}

