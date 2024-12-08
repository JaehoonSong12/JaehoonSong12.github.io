<a id="readme-top"></a>



# CS4460 Vizualytics

This project is a web-based information visualization project for **Vizualytics** team in **CS4460: Intro Info Visualization** by Yalong Yang (yalong.yang@gatech.edu), an instructor in *Georgia Institute of Technology*. It is designed to explore and analyze data through engaging and interactive visual representations and is hosted using Flask/Github and developed with D3.js, HTML, CSS, and JavaScript. This project enables users to derive meaningful insights from datasets by visualizing trends, patterns, and relationships in an intuitive manner.



## Website Reference
The project is deployed using **GitHub Pages**, ensuring high availability and accessibility. The interactive data story is publicly accessible via the URL, **[Project Website](https://jaehoonsong12.github.io/)**.

## Codebase Reference
The code for this project is hosted on GitHub in this repository. You can explore the source code, contribute, and access different branches as necessary:

[GitHub Repository - Jaehoon Song](https://github.com/JaehoonSong12/JaehoonSong12.github.io)

This project is forked from the repository [cs4460_vizualytics](https://github.gatech.edu/jsong421/cs4460_vizualytics.git) by `jsong421`. Original work can be found [here](https://github.gatech.edu/jsong421/cs4460_vizualytics.git).


## Features
- **Web Hosting by GitHub**: GitHub serves as a reliable platform for hosting static content, ensuring easy deployment and accessibility.
- **Local Hosting by Python Flask**: Flask, a lightweight Python framework, enables efficient local hosting for dynamic application development and testing.
- **Interactive Visualizations**: Built using D3.js, the tool offers dynamic and interactive data visualizations that allow for user-driven exploration.
- **Responsive Design**: Designed with HTML and CSS to ensure visualizations are mobile-friendly and adapt seamlessly to different screen sizes.

## Technologies

- **D3.js** (for visualizations)
- **HTML, CSS, and JavaScript** (for front-end development)

## Design References

- **Web Design Inspiration**: [Anubhav Nanda's Portfolio](https://nandaanubhav.github.io/#thirdSection)

## Datasets References

The visualizations in this project are based on the following datasets:

- **Top 10,000 Songs on Spotify (1950-Now)**: [View on Kaggle](https://www.kaggle.com/datasets/joebeachcapital/top-10000-spotify-songs-1960-now)
- **Top 100 Most Streamed Songs on Spotify**: [View on Kaggle](https://www.kaggle.com/datasets/pavan9065/top-100-most-streamed-songs-on-spotify)
- **Spotify Most Streamed Songs**: [View on Kaggle](https://www.kaggle.com/datasets/abdulszz/spotify-most-streamed-songs)
- **Normalized Spotify Song Data**: [View on Kaggle](https://www.kaggle.com/code/varunsaikanuri/spotify-data-visualization/input)

<p align="right">(<a href="#readme-top">back to top</a>)</p><br /><br /><br />





## Table of Contents
- [CS4460 Vizualytics](#cs4460-vizualytics)
  - [Website Reference](#website-reference)
  - [Codebase Reference](#codebase-reference)
  - [Features](#features)
  - [Technologies](#technologies)
  - [Design References](#design-references)
  - [Datasets References](#datasets-references)
  - [Table of Contents](#table-of-contents)
- [Instructions](#instructions)
  - [Initialization](#initialization)
  - [Usage](#usage)
  - [Folder Structure](#folder-structure)
  - [License](#license)
- [Ideation and Design Phase Outline](#ideation-and-design-phase-outline)
  - [1. Project Planning and Data Collection](#1-project-planning-and-data-collection)
  - [2. Data Exploration](#2-data-exploration)
  - [3. Story Arc Development](#3-story-arc-development)
  - [4. Visualization Sketching](#4-visualization-sketching)
  - [5. Decision-Making](#5-decision-making)
  - [6. Final Documentation and Video Submission](#6-final-documentation-and-video-submission)
- [Interactive Data Story Implementation Guide](#interactive-data-story-implementation-guide)
  - [General Overview:](#general-overview)
  - [Key Milestones:](#key-milestones)
    - [Prototype v1 (Week 12):](#prototype-v1-week-12)
    - [Prototype v2 (Week 13):](#prototype-v2-week-13)
    - [Evaluation (Week 14):](#evaluation-week-14)
    - [Final Update \& Submission (Week 16):](#final-update--submission-week-16)
  - [Submission Details:](#submission-details)

















<br /><br /><br />

---


# Instructions

## Initialization

1. **Clone the repository**:
   ```bash
   git clone <your-repository-url>
   cd <your-repository-folder>
   ```

2. **Set up the virtual environment**: This script sets up a virtual environment, installs required packages, and runs a Python application. It automatically detects the correct Python command (either `python3` or `python`) and adjusts for different OS environments (Windows, macOS, Linux).

```bash
# Check for Python command (python3 or python)
if command -v python3 &>/dev/null; then
    PYTHON_CMD=python3
elif command -v python &>/dev/null; then
    PYTHON_CMD=python
else
    echo "Python is not installed or not found in PATH"
    exit 1
fi

# Get Python version
PYTHON_VERSION=$($PYTHON_CMD -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')")

# Check if Python version is 3.3 or higher
if (( $(echo "$PYTHON_VERSION >= 3.3" | bc -l) )); then
   $PYTHON_CMD -m venv venv # use venv module
else 
   virtualenv venv # use virtualenv
fi

# Activate virtual environment based on OS type
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then # Windows
   source venv/Scripts/activate
elif [[ "$OSTYPE" == "darwin"* || "$OSTYPE" == "linux-gnu"* ]]; then # macOS or Linux
   source venv/bin/activate
else
   echo "Unsupported OS type: $OSTYPE"
   exit 1
fi

# Install requirements
pip install pipreqs
pipreqs . --force
pip install -r requirements.txt

# Run the application
$PYTHON_CMD app.py
```



## Usage

After setting up the environment, you can start the Flask server with:
```bash
cd src
python cli.py
```

Once the server is running, open your browser and go to `http://localhost:5000` to view the application.

## Folder Structure

The project includes a "static" folder where each team member has their own subdirectory to organize their individual contributions. The structure is as follows:

- `static/devika`: Folder for Devika's work
- `static/jaehoon`: Folder for Jaehoon's work
- `static/labs`: Shared space for experimental or group work
- `static/manya`: Folder for Manya's work
- `static/yashman`: Folder for Yashman's work

Each team member can place their own HTML, CSS, JS, or data files within their respective folders, allowing for organized and modular development.

## License

This is free and unencumbered software released into the public domain - see the LICENSE file for details.



<p align="right">(<a href="#readme-top">back to top</a>)</p><br /><br /><br />

















<br /><br /><br />

---


# Ideation and Design Phase Outline

This outline is tailored to guide you through the "Ideation and Design" phase of your information visualization project. It provides a structured step-by-step approach for your project planning, data exploration, sketching, and decision-making processes.

## 1. Project Planning and Data Collection

   - **Create a Project Map**: Define the project’s goals and establish directions for your visualization story.
   - **Audience Analysis**:
      - Identify at least three potential audiences and select a primary target audience.
      - Describe the target audience in detail, considering their knowledge, interests, and familiarity with visualizations.
   - **Develop Key Questions**:
      - Brainstorm questions about the data from the perspective of your audience.
      - List a minimum of 15 questions that the audience may find engaging or valuable.
   - **Data Overview**:
      - Provide a brief description of each data attribute, including type (categorical, ordinal, quantitative) or a general description if unsure.
   - **Data Processing Plan**:
      - Determine if substantial cleanup is needed and identify data-processing steps.
      - Prioritize pre-cleaned sources to minimize manual processing.

## 2. Data Exploration

   - **Preliminary Visualization Creation**:
      - Use tools like Tableau, Excel, Python, or R to create initial visualizations.
      - Attempt to answer your predefined questions; if certain questions remain unanswered, document them in your process book.
   - **Identify Key Insights**:
      - For each team member, note 3-4 interesting insights from the preliminary visualizations.
      - Record these findings along with screenshots, and document each team member’s observations in the process book.
   - **Iterative Questioning**:
      - Note any additional questions that arise during this exploration, and document them as part of your process.

## 3. Story Arc Development

   - **Define Your Core Message**:
      - As a team, choose one primary insight to emphasize, potentially supplementing with additional coherent insights.
      - Summarize the main message in one sentence and document it in the process book.
   - **Create a Data Storyboard**:
      - Use pen and paper or a digital tool (e.g., Miro) to outline the data storyboard.
      - Ensure the storyboard aligns with the four narrative elements:
         - **Hook**: Initial engagement point
         - **Rising Insights**: Develop insights logically and engagingly
         - **Main Message**: Core insight or finding
         - **Solution/Outcome**: Concluding insight or call-to-action
   - **Finalize Story Arc**:
      - Capture a photo or screenshot of the final storyboard and add it to the process book.

## 4. Visualization Sketching

   - **Individual Sketches**:
      - Each team member should create at least 8 sketches, covering various data story elements identified.
      - Consider dashboards or combinations of visualizations, being creative with layout and design.
   - **Sketch Legends**:
      - Include legends for each sketch describing the visual encoding of the data types used.
      - Take photos of each sketch and label them with the message, insight, or data story element it represents.
   - **Documentation**:
      - Upload the images to the process book, labeling them with each team member’s name and any relevant context.

## 5. Decision-Making

   - **Select Final Sketches**:
      - As a team, conduct an "affinity diagramming" session to select between 5-8 sketches for the project.
   - **Voting Process**:
      - Each team member has five votes to cast; they can allocate these votes to multiple sketches.
      - Record votes in a shared table to organize final selections.
   - **Final Arrangement**:
      - Arrange chosen sketches logically, from most to least relevant, in a sequence that strengthens the narrative.
      - Include a summary paragraph explaining the rationale behind your chosen sketches.

## 6. Final Documentation and Video Submission

   - **Process Book**:
      - Ensure each phase is well-documented in the process book, including images, notes, and decision rationales.
   - **Video Explanation**:
      - Record a 2-minute video that narratively explains your data story design.
      - Ensure the video concisely covers key design choices and project insights.

---

Each step should be documented in detail in your process book for submission.




<p align="right">(<a href="#readme-top">back to top</a>)</p>
















<br /><br /><br />

---


# Interactive Data Story Implementation Guide

## General Overview:
- **Goal**: Create and deploy a web-based interactive data story using D3.js.
- **Deployment**: Use GitHub Pages (preferred) or another hosting service to make the project publicly accessible.
- **Evaluation**: Conduct a think-aloud user evaluation, update your implementation based on feedback, and document the process.
- **Documentation**: Maintain a process book, and submit it as a PDF.
- **Final Submission**: Include the complete code repository, a process book, and a 3-minute screencast demo.

---

## Key Milestones:

### Prototype v1 (Week 12):
- **Deliverables**:
  - Real data scraped and cleaned.
  - One partially implemented D3 visualization and draft code for two others.
  - Basic webpage design and structure (placeholders allowed).
  - Clear storytelling elements and innovative view designs.
  - Text descriptions and sketches for interactions (e.g., filtering, brushing).
  - Updated process book.

### Prototype v2 (Week 13):
- **Deliverables**:
  - Full implementation of all visualizations and interactions.
  - Complete and test-ready data story for user evaluation.

### Evaluation (Week 14):
- Conduct a **think-aloud user evaluation** with a classmate.
- Document results and apply changes based on feedback.
- Record which feedback was acted on and justify omissions.

### Final Update & Submission (Week 16):
- Finalize the web-based data story and deployment.
- Document changes made based on the evaluation in the process book.
- Submit the project, including:
  1. **Code Repository**: Deployable with all necessary data included.
  2. **Process Book**: Comprehensive documentation in PDF format.
  3. **Walkthrough Video**: A 3-minute screencast demonstrating the data story.

---

## Submission Details:
- **Deadline**: Submissions are accepted until Dec 9th, 9 AM, with a 10% late penalty. No submissions after the deadline.
- **Hosting**: Ensure the public website is functional and link it in the process book.
- **Video Format**: Use a standard format with clear sound quality; if too large, provide a YouTube link.

---


<p align="right">(<a href="#readme-top">back to top</a>)</p>