/**
 *  Week 1 BCA project:
 *    Guessing game that is played with the computer
 *    implemented as a command line application.
 *    User and computer take turns picking a number and guessing
 *  Author: Nick Castle
 *  Start Date: 06/07/2019
 */

// boilerplate code for readline library
const readline = require("readline");
const readlineInterface = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}
// end readline setup


/****  FUNCTIONS  ****/

// function holding the game logic for the computer guessing
async function computerGuesses() {
  // variables/constants
  let MAX = process.argv[2] || 100;    // get max number from argv
  let MIN = 0;
  let currHigh = MAX;
  let currLow = MIN;
  let guessCount = 0;
  let currGuess;
  let highOrLow; // holds the answer of higher or lower
  let yesOrNo; // holds the answer of if the guess is right or wrong
  
  
  // console.log introductory message
  console.log(`Please think of a number between ${MIN} and ${MAX} (inclusive).
  I will try to guess it.`);
  
  // get a random number for the computer's guess with Math.random()
  //currGuess = randomInteger(currLow, currHigh);
  currGuess = findMid(currLow, currHigh);
  guessCount++; //increment guessCount
  
  // ask if the computer guess is the player's number
  yesOrNo = await ask(`Is it... ${currGuess}? (y or n) `);
  
  // validate user response
  yesOrNo = await validateInput(yesOrNo, currGuess);

  // need to loop through if statement so long as yesOrNo == 'N'
  while (yesOrNo.toUpperCase() == "N") {
    // if player says No (N) guess is not right, ask if it is higher or lower
    highOrLow = await ask(`Is it higher (H), or lower (L)? `);
    
    while (highOrLow.toUpperCase() !== "H" && highOrLow.toUpperCase() !== "L") {
      console.log(`I don't understand what you're telling me!`);
      highOrLow = await ask(`Is it higher (H), or lower (L)? `);
    }
    
    // update currLow or currHigh based on highOrLow
    if (highOrLow.toUpperCase() == "H") {
      if (currGuess == currHigh) {
        console.log(`It can't be higher than ${currGuess}, earlier you said it was lower than ${currHigh+1}!`);
        guessCount--;   // this adjusts for bad response
      } else {
        currLow = currGuess + 1; // since it is higher, add 1
      }
    // else highOrLow == "L"
    } else {
      if (currGuess == currLow) {
        console.log(`It can't be lower than ${currGuess} if you said it was higher than ${currLow-1}`);
        guessCount--;   // this adjusts for bad user response
      } else {
        currHigh = currGuess - 1; // since lower, subtract 1
      }
    }
    
    // recalculate guess, increment guessCount
    // currGuess = randomInteger(currLow, currHigh);
    currGuess = findMid(currLow, currHigh);

    guessCount++;
    
    // ask player about currGuess
    yesOrNo = await validateInput(await ask(`Is it... ${currGuess}? (y or n) `), currGuess);
    
  }

  console.log(`Your number was ${currGuess}!`);
  console.log(`I guessed it in ${guessCount} times!`);
    
  // exit the game
  //process.exit();
}


// function containing the game logic for the user guessing
async function userGuesses() {
  // variables & constants
  let MAX = process.argv[2] || 100;    // get max number from argv
  let MIN = 0;
  let currHigh = MAX;
  let currLow = MIN;
  let userGuess;
  let numGuesses = 0;
  let compNum;    // holds the computer's number
  let found = false;

  // log intro message
  console.log(`I will pick a number between ${MIN} and ${MAX}.`);
  console.log(`Try to guess my number in as little tries as possible!`);

  // get random number for computer
  compNum = randomInteger(MIN, MAX);

  // main while loop
  // while number is not found, user makes a guess
  while (!found) {

    // prompt user to guess
    // parseInt from user input to get a number instead of a string
    userGuess = parseInt(await ask(`Make a guess! `));
    numGuesses++;   // increment number of guesses

    // make sure user guesses a number
    while (typeof(userGuess) !== 'number') {
      console.log(`Enter a number please!`);
      userGuess = parseInt(await ask(`Make a guess! `));
    }

    // make sure user guesses within the range
    while (userGuess > currHigh || userGuess < currLow) {
      if (userGuess > currHigh) console.log(`Hey, I already told you that my number is lower than ${currHigh + 1}!`);
      if (userGuess < currLow) console.log(`Hey, I already told you my number is higher than ${currLow - 1}`);
      userGuess = parseInt(await ask(`Make a guess! `));
    }

    // if user guesses number correctly
    if (userGuess == compNum) {
      found = true;
      console.log(`You guessed it in ${numGuesses} guesses!`);
    } else if (userGuess > compNum) {   // if userGuess is greater than the computer's number
      console.log(`You guessed ${userGuess}, that's WRONG!`);
      console.log(`My number is LOWER than your guess`);
      currHigh = userGuess - 1;   // subtract one from userGuess to get the updated highest possible value
      console.log("currHigh: ", currHigh);
    } else if (userGuess < compNum) {      // else userGuess is less than the computer's number
      console.log(`You guessed ${userGuess}, that's WRONG!`)
      console.log(`My number is HIGHER than your guess`);
      currLow = userGuess + 1;    // add one to userGuess to get the updated lowest possible value
      console.log("currLow: ", currLow);
    } else {
      console.log("That's not a number!");
      numGuesses--;   // decrement number of guesses to account for bad input
    }
    
  }

  //process.exit();
}

// main game loop
async function main() {
  let keepGoing = true;
  while (keepGoing) {
    console.log(`computer turn to guess`);
    await computerGuesses();
    if ((await ask(`Keep going? `)).includes('n')) {
      keepGoing = false;
      break;
    }
    console.log(`user turn to guess`);
    await userGuesses();
    if ((await ask(`Keep going? `)).includes('n')) {
      keepGoing = false;
      break;
    }
  }
  process.exit();
}

// helper functions

// function takes a low and a high number and returns the median number
function findMid(low, high) {
  if (high > low)
    return Math.floor((high + low) / 2);
  else
    return high;
}

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

main();