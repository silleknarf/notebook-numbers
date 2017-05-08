ARCHITECTURE REWRITE PLAN
=========================

When I started writing this code two years ago, I didn't understand many of the architecture principles that I've now become familiar with - it's time for a major overhaul of the architecture which will offer better maintainability and separation of concerns.

COMPONENTS
==========

Grid
	Public
	- create() : Returns new instance of the logical game grid
	- check(Cell a, Cell b) : Returns whether selecting Cell A and Cell B is a valid move
	- refillGrid()
	- checkGridCompleted() 

GridView
	Public
	- render()

Cell
	Public
	- isBefore

	Properties
	- i : index position on y-axis
	- j : index position on x-axis

CellView
	Public 
	- render()	

Config
	Properties
	- backgroundColour
	- titleColour
	- numbersColour
	- titleFont
    - font

Cursor
	Public
	- makeMove()
	- check() 

	Events
	Generates CURSOR:MOVE_MADE

CursorView
	- render()

BackgroundView
	Public Methods
	- render()

Tutorial
	Public
	- create() : Returns new instance of the logical game grid
	- check(Cell a, Cell b) : Returns whether selecting Cell A and Cell B is a valid move
	- refillGrid()

TutorialView
	- render()

Classic
	Public
	- create()
	- check(Cell a, Cell b) : Returns whether selecting Cell A and Cell B is a valid move
	- refillGrid()

ClassicView
	- render()

Entity
	Properties
	- controller
	- view

Game
	Public
	- create()

Dimensions
	Public
	- create()
	- tick()

ENGINE
======

Entities - several of these which are iterated through
Components - this contains the data used by a component of the system
System - these are applied in turn to each of the entities

Entities
Game - [Grid, Cell, Cursor, Bounds, Renderable] 
Background - [Bounds, Renderable]
Menu - [Bounds, Renderable]
Overlay Text  - [Bounds, Renderable, TextInfo]

Components
Grid
Bounds
Renderable

Systems
Dimensions [Bounds] - Loop
Render [Bounds, Renderable] - Loop
Game [Grid, Cursor] - Event Reactive
Tutorial - Event Reactive
Classic - Event Reative
Menu - Event Reactive

Loop
Dimensions - Update all entity bounds and sub-entities bounds
Render - Re-draw all renderable entities and all sub-entity components

Startup
- Create Background prefab 
- Create Game prefab 
- Create Cursor prefab
- Create Menu prefab
- Add Cursor prefab to game
- Add Game prefab to background
- Add Menu prefab to background
- Add Background to entities
- GAME:START
- CURSOR:START
- CLASSIC:START
- CELL:START
- Start Game loop

Game System 
- Responds to events
GAME:START
ACTION:MOVE_MADE
- Create events
GAME:COMPLETE

Cursor System 
- Responds to events
CURSOR:START
USER:HOVER
USER:CLICK
- Create events
ACTION:MOVE_MADE

Classic System 
- Responds to events
CLASSIC:START
GAME:COMPLETE

Tutorial System
- Responds to events
TUTORIAL:START

Menu System - Events
- Creates events 
TUTORIAL:START
GAME:START

Cell System

GRID VIEW
=========

Option 1 - Grid has no sub entities
- Render the all the numbers in the grid up front
- If we're in "web" mode, notify the bounds system when we need 
  more space
- If we're in mobile mode, we can respond to changes in the scroll in order to render in the correct place
- How do we place the cursor?

[SELECTED] Option 2 - Grid has an entity per cell and a cursor entity
- No view component for the grid itself
- Logic component adds new cell entities
- Cell entities have view component
- Cursor system interacts with cell entities
- If we're in "web" mode, logic system notifies the bounds system when we need more space, which is not ideal
- If we're in mobile mode, how can we can respond to changes in the scroll in order to render the cells in the correct place
- Logic system to create entities? Yes
- Game system has bounds which are passed in to the render system

Scroll System
=============
- We need to track the current scroll position
	- 0 is the start
	- scroll position increases if we scroll down and vice versa when we scroll up
	- the max scroll position is based on the size of the grid + refill grid button height (game space)
	




