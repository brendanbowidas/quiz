//set global variables

var points = 0,
    qNum = 0, //question #
    game = $('.row'),
    selected = false, // global boolean to determine if an option is selected
    correct = false; //determines if previous answer was correct or not in order to append appropriate message to modal


//randomizes questions & answers
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

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

var q3 = new Question("img/quad.png", ["Lattisimus Dorsi", "Gastrocnemius", "Brachialis", "Quadriceps Femoris"], "Quadriceps Femoris");

var q4 = new Question("img/lat.png", ["Soleus", "Rectus Abdominus", "Serratus Anterior", "Lattisimus Dorsi"], "Lattisimus Dorsi");

var q5 = new Question("img/gastro.png", ["Vastus Medialis", "Adductor Brevis", "Brachioradialis", "Gastrocnemius"], "Gastrocnemius");

var questions = [q1, q2, q3, q4, q5];



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


//checks answer
function checkAnswer() {
    var current = questions[qNum];
    var userAnswer = $('.answers .option.animated.pulse.selected').text();

    if (userAnswer === current.answer) {

        points += 1;
        correct = true;

    } else {
        correct = false;
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
    var results = "<div class='row animated slideInDown'><div class='one-full column'><h1>Quiz Complete!</h1><h3>You answered " + points + " out of 5 questions correctly</h3><button class='reset'>Play Again</button></div></div>";


    $(game).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
        $(this).detach();
        $('.container').append(results);

    });

}


// sends AJAX request for wikipeida information
var getWiki = function () {
    var current = questions[qNum];
    var userAnswer = $('.answers .option.animated.pulse.selected').text();
    var request = {
        text: userAnswer,
        lang: "en",
        limit: 1,
        include: "image,abstract",
        $app_id: "85311c92",
        $app_key: "c3de6c90d0b45b24e447975896ec1b00",

    }


    var result = $.ajax({
            url: "https://api.dandelion.eu/datagraph/wikisearch/v1",
            data: request,
            dataType: "jsonp",
            type: "GET",

        })

        .done(function (result) {  //compiles information to template

            var source = $("#entry-template").html();
            var template = Handlebars.compile(source);
            var context = result.entities;
            var html = "";


            $.each(context, function (index, item) {  //appends template to DOM, opens modal
                html += template(item);

                $('.modal').html(html);
                if (correct === true) {
                    $('.correct').text('Correct!');
                } else {
                    $('.correct').text('Incorrect! You guessed:');
                }
                var inst = $('[data-remodal-id=modal]').remodal();

                inst.open();


            });

        })


};



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

    $('.answers').on('click', '.option.animated.pulse.selected', function () {
        $(this).removeClass('animated pulse selected');

        selected = false;
    });





    //user submits answer

    $('.submit').on('click', function () {

        if (qNum === 4 && selected === true) { //shows result screen if last question

            checkAnswer();
            getWiki();

            $(document).ajaxComplete(function () { //waits until ajax request is complete to proceed

                $(document).on('confirmation', '.remodal', function (e) { //waits until popup is closed to show results screen
                   $('.answers').remove();
                    removeGame();
                        showResults();
                    });
                });
                ///adds shake animation if no answer is selected
        } else if (selected === false) {
            $('.answers').addClass('animated shake');
            $('.answers').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                $(this).removeClass('animated shake');
            });

        } else {
            getWiki();
            checkAnswer();

            $(document).ajaxComplete(function () { //waits until ajax request is complete to proceed

                $(document).on('confirmation', '.remodal', function (e) { //waits until popup is closed to display next question
                    $(this).remove();

                    $('.option').remove();
                    showQuestion();

                });

            })
            qNum++


        }

    });
    //reloads game
    $('.container').on('click', '.reset', function () {
        window.location.reload(false);
    });

});
