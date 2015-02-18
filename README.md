# Responsive Equalizer

This is a prototype for a self balancing equaliser (always tries to make all values sum zero), with a Reset button and touch enabled.

It's build using the [d3.js library](http://d3js.org/), so it's SVG driven.

![Preview](https://raw.githubusercontent.com/beldar/Prototypes-Equalizer/master/equaliser.gif)

## Install

Dependencies
------------

You have to have installed [bower](http://bower.io/), and [compass](http://compass-style.org/install/). To install the first two you'll need [node](http://nodejs.org/) too.

This project is build with [Yeoman](http://yeoman.io/).

Install
-------

Once you have all those and cloned the repo, go to the root of the project and run:

    bower install

That will download all the js and css dependencies of the project.

Then run:

    npm install

This will download all the node dependencies (including grunt)

Finally you can launch the site running:

    grunt serve

You can build the project ready for production like this:

    grunt build

That will leave everything ready on the `/dist` folder