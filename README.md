# jsPsych Workflow Flanker Task

This repository provides a jsPsych workflow template for a Flanker Task that is designed for efficient multi-study development within a shared code framework.

The core idea is to keep:
- **experiment-specific configuration** (what to show, how to balance, how to order blocks)
separate from
- **generic implementation logic** (how balancing works, how timelines are built, how data is saved)

This separation improves transparency, promotes code reuse, and reduces error-proneness when adapting the framework to new paradigms.

## 4 steps workflow

The implementation follows a step-wise workflow, but each step is modularized into dedicated files.

1. Conditions and dependencies: Define counterbalancing requirements in a parameter object.
2. Designing a trial: Translate generated factor-level combinations into concrete jsPsych trial objects.
3. Adding functional elements: Add functional (non-stimulus) elements such as consent, browser checks, demographics, and data saving.
4. Building the timeline: Assemble everything into the complete study timeline with training and main blocks.

Because logic and configuration are separated, creating a new experiment typically means editing a small number of input/config files rather than rewriting the core algorithm.

## Workflow-to-File Mapping

- **Step 1 (Conditions and dependencies):**
	- `input/counterbalancing_parameter.js`
	- `scripts/counterbalancing.js`
- **Step 2 (Designing a trial):**
	- `input/stimulus_constructor.js`
- **Step 3 (Adding functional elements):**
	- `input/functional_trials.js`
- **Step 4 (Building the timeline):**
	- `main.html`
	- `input/timeline_builder.js`
	- `input/block_builder.js`
- **Central experiment configurations:**
	- `input/experiment_information.js`
- **Utilities:**
	- `scripts/base_functions.js`
	- `scripts/instructions_reader.js`
	- `scripts/stimulus_helper.js`

## JATOS Integration and Data Handling

This project is configured for deployment in **[JATOS](https://www.jatos.org/)** (Just Another Tool for Online Studies).

- `main.html` loads `jatos.js` and starts the experiment in `jatos.onLoad(...)`.
- Data are collected through jsPsych and submitted to the server in CSV format via `jatos.submitResultData(...)` (implemented in `input/functional_trials.js`).
- At study completion, the session is closed via `jatos.endStudy()`.

Compared to browser-only demos, this setup is intended for real data collection in lab or online settings.

## Quick Start

To run this experiment locally, you need a local JATOS installation.

1. Download and start JATOS on your machine.
2. Prepare the study in JATOS using one of the following options.

### Option 1: Import a ready-made study package

1. Download the zipped JATOS study package for this project.
2. In JATOS, use **Import study**.
3. Select the downloaded zip file and complete the import.
4. Open the imported study and run it.

### Option 2: Create the study manually from this repository

1. Create a new study in JATOS.
2. Copy all files from this repository into the study folder.
3. In JATOS, create a new **Study component**.
4. Set the component's HTML file path to `main.html`.
5. Open the study and run it.

## Debugging and Development Features

The codebase includes explicit support for testing and debugging:

- **Skim mode** (`skimMode`): sets trial durations to `0` for rapid timeline walkthrough.
- **Skip-to-main mode** (`skipToMain`): bypasses early parts (e.g., training/instructions) during development.
- **Counterbalancing debug mode** (`debugMode` in counterbalancing parameters): enables detailed balancing diagnostics.

## Visual Customization

- `css/experimentStyle.css` defines CSS variables and style hooks.
- `input/experiment_information.js` sets experiment-specific visual settings (e.g., background and font colors) and exposes them as CSS variables.

This enables study-specific visual theming without changing core logic.

## Repository Structure (Brief File Guide)

### Root

- `main.html`: Main entry point; loads jsPsych/plugins/libraries, project scripts, JATOS integration, and starts timeline execution.

### css/

- `css/experimentStyle.css`: Base stylesheet using CSS variables for experiment-specific color theming.

### input/

- `input/counterbalancing_parameter.js`: Central parameter object describing counterbalancing factors, proportions, transition constraints, prepend/append behavior, and debug flag.
- `input/experiment_information.js`: Global experiment configuration (timings, stimuli, keys, block counts, instruction metadata, color settings).
- `input/functional_trials.js`: Reusable functional jsPsych trials (consent, browser check, demographics, block pause, save data, exit).
- `input/stimulus_constructor.js`: Converts counterbalancing factor levels and general trial specific parameters into concrete jsPsych trial objects.
- `input/block_builder.js`: Builds start/end sequences and block-level trial insertion logic.
- `input/timeline_builder.js`: High-level study assembly that creates lists, inserts instructions/training/main blocks, and returns full timeline.

### scripts/

- `scripts/base_functions.js`: Generic utility helpers.
- `scripts/counterbalancing.js`: Generalized counterbalancing algorithm.
- `scripts/instructions_reader.js`: Generates jsPsych instruction trials dynamically from config-defined image sets.
- `scripts/stimulus_helper.js`: Helper functions for stimulus funcitonality (accuracy checks, visual feedback, background reset).

### instructions/

- Includes folders of .jpg images that provide instructions for the experiment. The images were created using the export function of MS PowerPoint. 


## Notes

- The browser runtime expects jsPsych and JATOS to be available as loaded in `main.html`.
- Development flags (`skimMode`, `skipToMain`) can be set by adding additional components with added component input (e.g. {"skimMode": true, "skipToMain": true}).
- An implementation of a different experimental paradigm using the same code structure is available at https://github.com/Schiwo/jsPsychWorkflow_ImmediateSerialRecallTask.

## License

This repository is released under the **GNU GPL-3.0** license.

---

## Cite this template

If you use this template to build your own study, please cite:

> REFERENCE WILL COME SOON
