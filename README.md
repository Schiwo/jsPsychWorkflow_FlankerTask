# jsPsych Workflow – Stroop Task (Template)

A minimal, easy-to-follow **Stroop task implementation in jsPsych** that is organized as a step-by-step workflow.  

The goal is to highlight a structured wokflow when creating online experiments with jsPsych:

This repository is meant as a **template**, not as an experiment that can be deployed directly.

---

## What’s Included

### Step 1:	Conditions and dependencies. 
- `STEP1_counterbalancing.js`
- Generate counterbalanced list of trial conditions  
- 2 congruency levels × 4 colors  
- Simple transition constraint: no immediate color repetitions

### Step 2:	Designing a trial
- `STEP2_designTrials.js`
- Transform the trial conditions into jsPsych objects.
- Each trial consists of:
  - Fixation cross  
  - Stimulus display
  - Feedback screen (correct / incorrect / too slow)

### Step 3: Adding functional elements
- `STEP3_functionalElements.js`
- Standard study components:
  - Welcome screen  
  - Informed consent gate (experiment aborts if no consent)  
  - Multi-page instructions
  - Data display placeholder  
  - End screen 

### Step 4: Building the timeline
- `STEP4_timelineBuilder.js` and `main.html`
- Combines all components into a single jsPsych timeline  
- Demonstrates how structured experiments are assembled step-by-step

---



## Quick Start (Run Locally)

1. Download or clone this repository.
3. Open `main.html` in your browser.

---

## License

This repository is released under the **GNU GPL-3.0** license.

---

## Cite this template

If you use this template to build your own study, please cite:

> REFERENCE WILL COME SOON
