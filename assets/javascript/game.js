// import $ from 'jquery';

$(document).ready(function() {

    // Morty constructor
    function Morty(name, id, attack, counter, health, image) {
        this.name = name;
        this.id = id;
        this.attack = attack;
        this.counter = counter;
        this.health = health;
        this.type = 'morty';
        this.image = "assets/images/" + image;
        this.display = function(div) {
            let newDiv = $('<img>');
            newDiv.attr({id: this.id, class: this.type, height: "320", src: this.image});
            $(div).append(newDiv);
        }
    };

    // Global Variables
    let userMorty;
    let opponentMortys = [];
    let clickedMorty;
    let mortys = [];
    let currentOpponent;

    function newGame() {

        $('#user-choice').hide();
        $('#enemies').hide();
        $('#arena').hide();

        let c137 = new Morty('Morty C137', 'c137', 6, 7, 150, 'c137.png');
        c137.display('#character-selection');
        console.log(c137);

        let lasagna = new Morty('Lasagna Morty', 'lasagna', 7, 6, 175, 'lasagna.png');
        lasagna.display('#character-selection');
        console.log(lasagna);

        let punk = new Morty('Punk Morty', 'punk', 9, 8, 155, 'punk.png');
        punk.display('#character-selection');
        console.log(punk);
    
        let zombie = new Morty('Zombie Morty', 'zombie', 8, 9, 185, 'zombie.png');
        zombie.display('#character-selection');
        console.log(zombie);

        mortys = [c137, lasagna, punk, zombie];

        selectMorty();
    };

    function selectMorty() {

        $('.morty').click(function() {

            $('#user-choice').show();
            $('#enemies').show();

            clickedMorty = this.id;
            console.log(clickedMorty);
            console.log(mortys);

            if (clickedMorty) {
                console.log('HERE!!');
                $('#character-selection').empty();

                // Used for storing selected Morty into array
                userMorty = mortys.filter(function(morty) {
                    return morty.id === clickedMorty;
                });
                userMorty[0].display('#user-choice');
                console.log(userMorty);

                // Put opponent Mortys into their own array
                opponentMortys = mortys.filter(function(morty) {
                    return morty.id !== clickedMorty;
                });

                // Display Opponent Mortys
                for (let i = 0; i < opponentMortys.length; i++) {
                    opponentMortys[i].type = 'opponents';
                    opponentMortys[i].display('#enemies');
                }
                console.log(opponentMortys);
            };
        });

        selectOpponent();
    };

    function selectOpponent() {
        $('.opponents').on('click', function() {
            alert('clicked');
        });
        $('.opponents').click(function() {
            console.log("TEST");

            // Show current opponent div
            $('#current-opponent').show();

            // Move selected Morty to current opponent div
            clickedMorty = this.id;
            console.log('enemy' + clickedMorty);

            currentOpponent = opponentMortys.filter(function(morty) {
                return morty.id === clickedMorty;
            });
            currentOpponent[0].display('#current-opponent');

            // Put opponent Mortys into their own array
            opponentMortys = opponentMortys.filter(function(morty) {
                return morty.id !== clickedMorty;
            });

            // Display Opponent Mortys
            for (let i = 0; i < opponentMortys.length; i++) {
                opponentMortys[i].type = 'opponents';
                opponentMortys[i].display('#opponents');
            }
            console.log(opponentMortys);
        });
    };

    newGame();

});