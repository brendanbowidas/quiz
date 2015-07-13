//set global variables

var points = 0;
var qNum = 0;
var game = $('.image, .title, .input');





//set questions prototype
function Question(pic, choices, answer) {
    this.pic = pic;
    this.choices = choices;
    this.answer = answer;

}

//sets question-related variables
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
        points++;

    } else if (!userAnswer) {
        $('.submit').toggleClass('animated shake');


    }



}

//shows question
function showQuestion() {
    var current = questions[qNum];
    var currChoices = current.choices;


    for (var i = 0; i < currChoices.length; i++) {
        $(".image img").attr("src", current.pic).addClass('animated fadeIn');
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
    game.detach();
    console.log(true);
    $('.row').append("<div class='one-third column'><h1>test</h1></div>");
}


$(document).ready(function () {

    //answer selection handler
    $('.answers').on('click', '.option', function () {
        $('.answers .option').removeClass('animated pulse selected');

        $(this).addClass('animated pulse selected');

    });

    showQuestion();

    //user submits answer
    $('.submit').click(function () {

        if (qNum === 4) {
            checkAnswer();
             removeGame();
             showResults();
        } else {
            checkAnswer();

            qNum++
            $('.option').remove();
            showQuestion();
        }

    });

});
