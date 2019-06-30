// import $ from 'jquery';

// Morty Constructor
class Morty {
    constructor(name, id, hp) {
        this.name = name;
        this.id = id;
        this.hp = hp;
    }
}

// Declare Mortys
c137 = new Morty('Morty C137', 'c137', 150);
lasagna = new Morty('Lasgna Morty', 'lasagna', 125);
punk = new Morty('Punk Morty', 'punk', 175);
zombie = new Morty('Zombie Morty', 'zombie', 200);

// Global Variables
let fighters = [c137, lasagna, punk, zombie];

// Starts a new game
function newGame() {
    console.log('NEW GAME');

    // Display Fighters
    
}

function debug() {
    console.table(c137);
    console.table(lasagna);
    console.table(punk);
    console.table(zombie);
    console.table(fighters);
}

$(document).ready(function() {
    newGame();
    debug();
})
   

