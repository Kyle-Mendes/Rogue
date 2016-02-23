# Rogue Term
This project is a super simple framework for developing terminal based Rogue-like games using Node.js.

# Getting started
Right now, this package isn't on NPM.  But you can clone this repository and run `npm link` to get a symlink to this package.

1. `npm build`
2. `npm link`
3. Go to your game's directory
4. `npm link rogue`
5. Look in `examples/simple/app.js` for details on getting started
6. Run `npm build` and `npm run run` in `examples/simple` to see it in action!

# Roadmap
1. Add the ability to have complex connections between rooms (right angles).  Right now, they can only be straight lines
2. Add a viewport, so the map can be very large, but only the values in view are rendered to the screen
3. Add the ability to link dungeons together.  This would act like floors for deep dunegone traversal.
