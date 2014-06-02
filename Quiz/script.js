var questions = [];
var questionSubset = [];
var questionObjects = [];
var nextQuestion = 0;
var answerBoxes = 0;

questions.push('F|Defenestration is the act of being thrown out of a __.|window');
questions.push('M|What animal does Ace save at the beginning of the movie "Ace Ventura"?|a dog|an elephant|a chimpanzee|a snake|0');
questions.push('M|In The Green Lantern comic book series, what is the color used to represent will power?|orange|blue|yellow|green|3');
questions.push('F|__ is the most mountainous country in Europe.|Switzerland');
questions.push('M|Which Constitutional amendment gave Congress the power to levy tax on personal incomes?|Tenth|Twelfth|Fourteenth|Sixteenth|3');

document.getElementById("num-questions").setAttribute("max", questions.length);

var returnToStart = function () {
    document.getElementById("question-area").style.display = 'none';
    document.getElementById("finish-screen").style.display = 'none';
    document.getElementById("question-form").style.display = 'none';
    document.getElementById("begin-quiz").style.display = 'block';
    document.getElementById("num-questions").setAttribute("max", questions.length);
}
var beginQuiz = function () {
    var numQuestions = document.getElementById("num-questions").value;
    document.getElementById("begin-quiz").style.display = 'none';
    document.getElementById("question-area").style.display = 'block';
    if (numQuestions > questions.length || numQuestions <= 0) {
        numQuestions = questions.length;
    }
    questionSubset = randomize(questions).slice(0, numQuestions);
    questionObjects = new Array();
    storeQuestions(questionSubset);
    nextQuestion = 0;
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
        recallAnswer(nextQuestion);
        toggleButtons();
        nextQuestion++;
    }
}
var recallAnswer = function (index) {
    document.getElementById("question").innerHTML = questionObjects[index].question;
    switch (questionObjects[index].questionType) {
        case ('M'):
            var radioButtons = document.getElementsByName(questionObjects[index].radioGroupName);
            for (var i in radioButtons) {
                if (questionObjects[index].userAnswer === radioButtons[i].value) {
                    radioButtons[i].checked = true;
                }
            }
            break;
        case ('F'):
            var textBox = document.getElementById(questionObjects[index].idName);
            textBox.value = questionObjects[index].userAnswer;
            break;
    }
}
var showPrevQuestion = function () {
    storeAnswer(nextQuestion - 1);
    if (nextQuestion > 1) {
        recallAnswer(nextQuestion - 2)
    }
    nextQuestion--;
    toggleButtons();
}
var toggleButtons = function () {
    if (nextQuestion > 0) {
        document.getElementById("prev-button").style.display = 'inline';
    } else {
        document.getElementById("prev-button").style.display = 'none';
    }
    if (nextQuestion < questionObjects.length) {
        document.getElementById("next-button").style.display = 'inline';
    } else {
        document.getElementById("next-button").style.display = 'none';
    }
}
var FillInTheBlank = function (question, correctAnswer) {
    this.originalQuestion = question;
    this.question = question;
    this.correctAnswer = correctAnswer;
    this.questionType = 'F';
    this.userAnswer = '';
    this.correct = false;
}
var MultipleChoice = function (question, answers, correctAnswer) {
    this.originalQuestion = question;
    this.question = question;
    this.correctAnswer = correctAnswer;
    this.answers = answers;
    this.questionType = 'M';
    this.userAnswer = -1;
    this.correct = false;
}
var storeQuestions = function(questionArray) {
    for (var i in questionArray) {
        var temp = questionArray[i].split("|");
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
                multipleChoice.answers = randomize(multipleChoice.answers);
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
    scoreString += '<ul>'
    for (var i in questionObjects) {
        if (!questionObjects[i].correct) {
            scoreString += '<li>Question: ' + questionObjects[i].originalQuestion + '<br />'
                + 'Your answer: ' + questionObjects[i].userAnswer + '</li>'; 
        }
    }
    scoreString += '</ul>'
    document.getElementById('score').innerHTML = scoreString;
    document.getElementById('question-area').style.display = 'none';
    document.getElementById('finish-screen').style.display = 'block';
}
var showQuestionForm = function () {
    document.getElementById("begin-quiz").style.display = 'none';
    document.getElementById("question-form").style.display = 'block';
}
var addQuestion = function () {
    var questionString = "";
    var questionType = document.getElementById("question-type").value;
    switch (questionType) {
        case 'F':
            var question = document.getElementById("fib-question-textbox").value;
            var answer = document.getElementById("answer-textbox").value;
            questions.push([questionType, question, answer].join('|'));
            document.getElementById("fib-question-textbox").value = "";
            document.getElementById("answer-textbox").value = "";
            break;
        case 'M':
            var question = document.getElementById("mc-question-textbox").value;
            var correctAnswer = -1;
            var answers = [];
            var textBoxes = document.getElementsByName("answer-textbox");
            var correctAnswerOptions = document.getElementsByName("correct-answer");
            for (var i in textBoxes) {
                answers.push(textBoxes[i].value);
            }
            for (var i in correctAnswerOptions) {
                if (correctAnswerOptions[i].checked) {
                    correctAnswer = i;
                }
            }
            answers = answers.slice(0, answers.length - 2);
            questions.push([questionType, question, answers.join("|"), correctAnswer].join("|"));

            break;
    }
}
var addAnswerField = function () {
    var answerFieldDiv = document.createElement('div');
    var newTextBoxString = '<input type="radio" name="correct-answer" value="'
        + answerBoxes + '" /><label>Answer ' + (answerBoxes + 1)
        + ':</label><input type="text" name="answer-textbox" /><br />';
    answerFieldDiv.innerHTML = newTextBoxString;
    document.getElementById('mc-answer-textboxes').appendChild(answerFieldDiv);

    answerBoxes++;
}
var updateForm = function () {
    var questionType = document.getElementById('question-type');
    var selectedQuestionType = questionType.options[questionType.selectedIndex].value;
    document.getElementById('fill-in-the-blank').style.display = 'none';
    document.getElementById('multiple-choice').style.display = 'none';
    switch (selectedQuestionType) {
        case 'F':
            document.getElementById('fill-in-the-blank').style.display = 'block';
            break;
        case 'M':
            document.getElementById('multiple-choice').style.display = 'block';
            break;
    }
}