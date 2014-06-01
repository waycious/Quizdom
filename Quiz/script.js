var questions = [];
var questionObjects = [];
var nextQuestion = 0;
questions.push('F|Defenestration is the act of being thrown out of a __.|window');
questions.push('M|What animal does Ace save at the beginning of the movie "Ace Ventura"?|a dog|an elephant|a chimpanzee|a snake|0');
questions.push('M|In The Green Lantern comic book series, what is the color used to represent will power?|orange|blue|yellow|green|3');
questions.push('F|__ is the most mountainous country in Europe.|Switzerland');
questions.push('M|Which Constitutional amendment gave Congress the power to levy tax on personal incomes?|Tenth|Twelfth|Fourteenth|Sixteenth|3');


window.onload = function () {
    storeQuestions();
    showNextQuestion();
}
var randomize = function (array) {
    var i = array.length, j, temp;
    while (--i) {
        j = Math.floor(Math.random() * (i - 1));
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
var showNextQuestion = function () {

    if (nextQuestion) {
        var currentQuestion = nextQuestion - 1;
        if (storeAnswer(currentQuestion)) {
            alert("You are correct sir!");
        } else {
            alert("That was just plain wrong.");
        }
        if (nextQuestion == questionObjects.length) {
            showScore();
            return;
        }
    }
    if (nextQuestion != questionObjects.length) {
        document.getElementById("question").innerHTML = questionObjects[nextQuestion].question;
        nextQuestion++;
    }
}
var FillInTheBlank = function(question, correctAnswer){
    this.question = question;
    this.correctAnswer = correctAnswer;
    this.questionType = 'F';
    this.userAnswer = '';
    this.correct = false;
}
var MultipleChoice = function(question, answers, correctAnswer){
    this.question = question;
    this.correctAnswer = correctAnswer;
    this.answers = answers;
    this.questionType = 'M';
    this.userAnswer = -1;
    this.correct = false;
}
var storeQuestions = function() {
    for (var i in questions) {
        var temp = questions[i].split("|");
        var questionType = temp[0];
        switch (questionType) {
            case 'F':
                var fillInTheBlankQuestion = new FillInTheBlank(temp[1], temp[2]);
                fillInTheBlankQuestion.questionType = questionType;
                fillInTheBlankQuestion.idName = 'blank' + i;
                fillInTheBlankQuestion.question = '<p>' + fillInTheBlankQuestion.question + '</p>';
                fillInTheBlankQuestion.question =
                    fillInTheBlankQuestion.question.replace('__', '<input type="text" id='
                    + '"' + fillInTheBlankQuestion.idName + '"' + ' size="'
                    + fillInTheBlankQuestion.correctAnswer.length + '" />');
                questionObjects.push(fillInTheBlankQuestion);
                break;
            case 'M':
                var multipleChoice = new MultipleChoice(temp[1], temp.slice(2, temp.length - 1), temp.pop());
                //Overwrite numerical answer with answer value
                multipleChoice.correctAnswer = multipleChoice.answers[multipleChoice.correctAnswer];
                multipleChoice.questionType = questionType;
                multipleChoice.question = '<p>' + multipleChoice.question + '</p>';
                multipleChoice.question += '<ul>';
                multipleChoice.radioGroupName = 'mcq' + i;
                for (var j in multipleChoice.answers) {
                    multipleChoice.question += '<li><input type="radio" name="'
                        + multipleChoice.radioGroupName + '" value="' + multipleChoice.answers[j] + '">'
                        + multipleChoice.answers[j] + '</li>';
                }
                multipleChoice.question += '<ul>';
                questionObjects.push(multipleChoice);
                break;
        }
    }
}
var storeAnswer = function (index) {
    var currentQuestion = questionObjects[index];
    switch (currentQuestion.questionType) {
        case 'F':
            currentQuestion.userAnswer = document.getElementById(currentQuestion.idName).value;
            currentQuestion.correct = (currentQuestion.userAnswer == currentQuestion.correctAnswer);
            break;
        case 'M':
            var radioButtons = document.getElementsByName(currentQuestion.radioGroupName);
            for (var i in radioButtons) {
                if (radioButtons[i].checked) {
                    currentQuestion.userAnswer = radioButtons[i].value;
                    currentQuestion.correct = (currentQuestion.userAnswer == currentQuestion.correctAnswer);
                }
            }
            break;
    }
    return currentQuestion.correct;
}
var showScore = function () {
    var score = 0;
    for (var i in questionObjects) {
        if (questionObjects[i].correct) {
            score++;
        } 
    }
    var scoreString = '<p>You scored ' + score + ' out of '
        + (questionObjects.length) + ' points!<p>';
    document.getElementById('score').innerHTML = scoreString;
    document.getElementById('questionArea').style.display = 'none';
    document.getElementById('score').style.display = 'block';
}