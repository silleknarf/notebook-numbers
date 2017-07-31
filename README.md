Notebook Numbers Web
====================

Welcome to Notebook Numbers Web Source! Notebook numbers is a web-based puzzle game written in JS.

Play it now!
============

The game is playable at [http://notebooknumbers.com](http://notebooknumbers.com). Please ensure that all bugs are reported with instructions on how to repeat them/detailed game state description, see below for how to submit. 

It's also available to buy on [Android](https://play.google.com/store/apps/details?id=com.silleknarf.notebooknumbers&hl=en) and iOS will be coming shortly.

Architectural Overview
======================

Notebook number uses an HTML canvas as the game's drawing surface and this was made as a conscious choice so that the game is portable across platforms. 

## [Entity Component System](src/ecs/ecs.js)
The core of the game is a built-for-purpose [Entity-Component System](https://en.wikipedia.org/wiki/Entity%E2%80%93component%E2%80%93system) which ties all of the different subsystems together in a way such that coupling between systems is minimised.

## [Bounds System](src/systems/bounds_system.js)

So that it is possible for the game to be rendered at any size there is system that is responsible for translating components which represent relative positions and sizing into absolute positions and sizing. The rendering system then only works off of the absolute co-ordinate space which is specifically tailored to the screen size is question.

## [Render System](src/systems/render_system.js)

The render system traverses all of the entities in the game and extracts their view components and then uses these to render the entity on the game canvas. Each view component contains methods for setup, rendering and disposal and the view system manages the calling of the methods on these components in the appropriate point of the object's lifetime. The view's are aware of the entity they belong to and are able to extract their absolute position from the entity's bounds component in order to work out where to draw themselves.

## [Logic System](src/systems/logic_system.js)

The games internal business logic for playing the game is contained in the logic system and the utilies it depends it on. When the game is in play there is a grid component which holds the game state and the logic system modifies the grid component in response to game events such as the player making a move. The grid also holds any text that the game displays and the logic system may update this, for example, completing the game will cause the grid to display a congratulatory message.

## [Mode System](src/systems/mode_systems.js)

There is a tutorial mode as well as the main game mode, the mode system sends signals to the other systems and modifies the entity graph in order to change game modes. It performs these operations in response to mode change events such as switch from the tutorial mode to a new game, or simply starting a new game during an existing one.

## [Tutorial System](src/systems/tutorial_system.js)

In tutorial mode, there is a series of lines of text combined with playable grids which introduce the player to the game by introducing the game mechanics in stages. The tutorial system handles the progression through the rounds of the tutorial, revealing each tutorial step in response the previous step being completed.

## [Preload System](src/systems/preload_system.js)

There are graphical and code dependencies which needs to be loaded into memory before the game is able to run - the preload system runs on startup to do this loading and once complete it triggers the main game startup.

## [Scroll System](src/systems/scroll_system.js)

This system is responsible for detecting scroll events across the various platforms and apply them homogenously to the canvas.

## [Score System](src/systems/score_system.js)

There are various events such as starting a new game, clearing lines and completing the game that cause the score to be updated. Grid entities have got a score component which is updated in response to these events occuring.

## [Gizmo System](src/systems/gizmo_system.js)

This is used for rendering debug view components, providing the programmer with a graphical depiction of how the view components are being placed in the scene.

## Key Dependencies

The rendering on the canvas is all done using the wrappers provided by the [EASELJS](http://www.createjs.com/easeljs) library which provides utilities for common drawing tasks such as painting images, displaying text and placing the elements in 2D space.

[Backbone Events](http://backbonejs.org/#Events) is used to provide a simple messaging service which allows the systems to communicate with each other.

[lodash](https://lodash.com/) is an excellent library which provides functional programming constructs in JS.

[keymaster](https://github.com/madrobby/keymaster) is a useful library which is used in the scroll system to detect scrolling using the arrows on the keyboard.

[jQuery](https://jquery.com/) is used to manipulate the DOM when outside the primary canvas rendering environment.

[plaform.js](https://github.com/bestiejs/platform.js/) provides utilities for working out what the browser environment the game is running in, so that the mobile apps can be served as appropriate.

Installation
============

Notebook Numbers web is implemented as a javascript web-app, the easiest way to get it running is to spin up a server locally.

Doing this is simple if you have python:

    git clone https://github.com/silleknarf/notebook-numbers.git
    cd notebook-numbers/bin
    ./run.sh

Then visit [localhost:8000](localhost:8000)

Testing
=======

The production tests are running at [http://notebooknumbers.com/test/tests.html](http://notebooknumbers.com/test/tests.html).
They can also be run locally when you have a server running by visiting [http://localhost:8000/test/tests.html](http://localhost:8000/test/tests.html) or running the following commands in a terminal:

     cd notebook-numbers/test
     ./test.sh

Bug Reports
===========

Please submit bug reports to the [issue tracker](https://github.com/silleknarf/notebook-numbers/issues)

Licensing
=========

This repository is provided without an explicit licence and as such, all copyright is reserved. 
Pull requests will only be considered if the contributor agrees to the terms of our CLA license.

--silleknarf
