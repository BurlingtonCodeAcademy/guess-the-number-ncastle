/**
 *  Week 1 BCA project:
 *    Guessing game that is played with the computer
 *    implemented as a command line application
 *  Author: Nick Castle
 *  Start Date: 06/05/2019
 */

// boilerplate code for readline library
const readline = require("readline");
const readlineInterface = readline.createInterface(
  process.stdin,
  process.stdout
);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}
// end readline setup

/****  FUNCTIONS  ****/


// function holding the game logic
async function guessingGame() {
  // variables/constants
  let MAX = 100;
  if (process.argv[2]) MAX = process.argv[2];   // get max number from argv
  let MIN = 1;
  let currHigh = MAX;
  let currLow = MIN;
  let guessCount = 0;
  let currGuess;
  let highOrLow; // holds the answer of higher or lower
  let yesOrNo; // holds the answer of if the guess is right or wrong
  
  
  // console.log introductory message
  console.log(`Please think of a number between 1 and ${MAX} (inclusive).
  I will try to guess it.`);
  
  // get a random number for the computer's guess with Math.random()
  currGuess = randomInteger(currLow, currHigh);
  guessCount++; //increment guessCount
  
  // ask if the computer guess is the player's number
  yesOrNo = await ask(`Is it... ${currGuess}? `);
  
  // validate user response
  yesOrNo = await validateInput(yesOrNo, currGuess);

  // need to loop through if statement so long as yesOrNo == 'N'
  while (yesOrNo.toUpperCase() == "N") {
    // if player says No (N) guess is not right, ask if it is higher or lower
    highOrLow = await ask(`Is it higher (H), or lower (L)? `);
    
    while (highOrLow.toUpperCase() !== "H" && highOrLow.toUpperCase() !== "L") {
      console.log(`I can't tell what you're telling me!`);
      highOrLow = await ask(`Is it higher (H), or lower (L)? `);
    }
    
    // update currLow or currHigh based on highOrLow
    if (highOrLow.toUpperCase() == "H") {
      currLow = currGuess + 1; // since it is higher, add 1
    } else {
      currHigh = currGuess - 1; // since lower, subtract 1
    }
    
    // recalculate guess, increment guessCount
    currGuess = randomInteger(currLow, currHigh);
    guessCount++;
    
    // ask player about currGuess
    yesOrNo = await validateInput(await ask(`Is it... ${currGuess}? `), currGuess);
    
  }

  console.log(`Your number was ${currGuess}!`);
  console.log(`I guessed it in ${guessCount} times!`);
    
    // exit the game
  process.exit();
}

// helper functions

// function to get a random integer in a range from min to max (inclusive)
function randomInteger(min, max) {
  let range = max - min + 1;
  return min + Math.floor(Math.random() * range);
}

// error checking for user input, don't allow anything but N or Y
async function validateInput(yesOrNo, currGuess) {
  while (yesOrNo.toUpperCase() !== "N" && yesOrNo.toUpperCase() !== "Y") {
    console.log(`That's not an answer! Tell me Y or N`);
    yesOrNo = await ask(`Is it... ${currGuess}? `);
  }
  return yesOrNo;
}


//start guessing game
guessingGame();
