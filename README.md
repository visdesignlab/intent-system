<!-- [![Build Status](https://travis-ci.com/visdesignlab/intent-system.svg?branch=master)](https://travis-ci.com/visdesignlab/intent-system) -->

# Intent System

![GitHub Logo](app/public/imgs/teaser.png)

The system is deployed to: https://vdl.sci.utah.edu/predicting-intent

## About

The purpose of this tool is to predict user intents in the form of
patterns when brushing in scatterplots.

This project is developed at the
<a href="https://vdl.sci.utah.edu/">Visualization Design Lab</a> at
the <a href="https://www.sci.utah.edu/">SCI Institute</a> at the
University of Utah by Kiran Gadhave, Jochen Görtler, Zach Cutler,
and Alexander Lex, with contributions by Jeff Phillips, Miriah
Meyer, and Oliver Deussen.


Please visit the
<a href="https://vdl.sci.utah.edu/publications/2020_intent/">
    publication page
</a>
for more details and information on how to cite this work. The
source code and documentation is available
<a href="https://github.com/visdesignlab/intent-system">here</a>.
This project is funded by the National Science Foundation trough
grant
<a href="https://vdl.sci.utah.edu/projects/2018-nsf-reproducibility/">
    IIS 1751238
</a>.

## Other links

- Live study interface: http://vdl.sci.utah.edu/predicting-intent-study/
- The code to generate stimulus, tasks, code results and cool notebook to process the crowdsource results: https://github.com/visdesignlab/intent-data-generation/
- R analysis and original data: https://github.com/visdesignlab/intent-study-analysis/
- The provenance data exploration website: https://vdl.sci.utah.edu/intent-study-analysis/
- Source code of the provenance library: https://github.com/visdesignlab/provenance-lib-core/

## Development

To build the server you need `python3`, `pipenv` and `yarn` package manager.

### First time

After cloning the repository for the first time, ensure you have `python3` and `pipenv`, then run:

```shell
yarn run build-env
```

### Starting development server

To start the server run:

```shell
yarn start
```
