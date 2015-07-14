//set global variables

var points = 0,
    qNum = 0,
    game = $('.row'),
    selected = false; // global boolean to determine if an option is selected

//randomizes questions & answers
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex ;

    while (0 !== currentIndex) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


//set questions prototype
function Question(pic, choices, answer) {
    this.pic = pic;
    this.choices = choices;
    this.answer = answer;

}

//sets question objects
var q1 = new Question("img/bicep.png", ["Vastus Medialis", "Latissimus Dorsi", "Trapezius", "Biceps Brachii"], "Biceps Brachii");

var q2 = new Question("img/pec.png", ["Rectus Femoris", "Teres Minor", "Pectoralis Minor", "Pectoralis Major"], "Pectoralis Major");

var q3 = new Question("img/quad.png", ["Lattisimus Dorsi", "Gastrocnemius", "Deltiod", "Quadriceps Femoris"], "Quadriceps Femoris");

var q4 = new Question("img/lat.png", ["Soleus", "Rectus Abdominus", "Serratus Anterior", "Lattisimus Dorsi"], "Lattisimus Dorsi");

var q5 = new Question("img/gastro.png", ["Vastus Medialis", "Adductor Brevis", "Brachioradialis", "Gastrocnemius"], "Gastrocnemius");

var questions = [q1, q2, q3, q4, q5];



//checks answer
function checkAnswer() {
    var current = questions[qNum];
    var userAnswer = $('.answers .option.animated.pulse.selected').text();

    if (userAnswer === current.answer) {

        points += 1;

    }
}


//shows question
function showQuestion() {
    var current = questions[qNum];
    var currChoices = current.choices;
    selected = false;
    shuffle(currChoices)

    for (var i = 0; i < currChoices.length; i++) {
        $(".image img").attr("src", current.pic);
        $(".count").text(qNum + 1);

        $(".answers").prepend("<li class= 'animated bounceInRight'><button class='option'>" + currChoices[i] + "</button></li>");
    }

}


//removes game elements
function removeGame() {

    $('.image').addClass('animated slideOutUp');
    $(".title").addClass('animated slideOutLeft');
    $('.input').addClass('animated slideOutRight');
}

//shows result screen
function showResults() {
    var results = "<div class='row animated slideInDown'><div class='one-full column'><h1>Quiz Complete!</h1><h3>You answered " + points + " of 5 questions correctly</h3><paper-button raised class='reset'>Play Again</paper-button></div></div>";


    $(game).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
        $(this).detach();
        $('.container').append(results);

    });

}

//DOCUMENT READY EVENTS------------------------------------------
$(document).ready(function () {

    shuffle(questions);


    showQuestion();

    //answer selection handler
    $('.answers').on('click', '.option', function () {
        $('.answers .option').removeClass('animated pulse selected');

        $(this).toggleClass('animated pulse selected');

        selected = true;

    });



    //user submits answer

    $('.submit').on('click', function () {
        console.log(points);

        if (qNum === 4) {
            checkAnswer();
            removeGame();
            showResults();
            ///returns false, adds shake animation if no answer is selected
        } else if (selected === false) {
            $('.answers').addClass('animated shake');
            $('.answers').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                $(this).removeClass('animated shake');
            });

        } else {
            checkAnswer();
            qNum++
            $('.option').remove();
            showQuestion();
        }

    });
    //reloads game
    $('.container').on('click', '.reset', function () {
        window.location.reload(false);
    });

});
