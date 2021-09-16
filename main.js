///get the elements
let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let spansContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".answers-area");
let button = document.querySelector(".submit-btn");
let results = document.querySelector(".results");
let counter = document.querySelector(".count-down");

let questionDuration = 5;
let countDownInterval;
let currentIndex = 0;
let rightAnswers = 0;

function getQuestions() {
  let request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObj = JSON.parse(this.responseText);
      let questionsCount = questionsObj.length;

      createBullets(questionsCount);

      //start the counter for each question
      countDown(questionDuration, questionsCount);

      addQuestionsData(questionsObj[currentIndex], questionsCount);

      button.onclick = () => {
        let rightAnswer = questionsObj[currentIndex].right_answer;
        currentIndex++;
        checkAnswer(rightAnswer, questionsCount);

        //remove the current question and get the next one
        quizArea.innerHTML = '';
        answerArea.innerHTML= '';
        addQuestionsData(questionsObj[currentIndex], questionsCount);

        //start the counter again
        clearInterval(countDownInterval);
        countDown(questionDuration, questionsCount);

        //handle the bullets
        handleBullets();

        showResults(questionsCount);
      }

    }
  };
  request.open("GET", "questions.json", true);
  request.send();
}
getQuestions();

function createBullets(num) {
  countSpan.innerHTML = num;

  for (let i = 0; i < num; i++) {
    let bullet = document.createElement("span");
    if (i === 0) {
      bullet.className = "on";
    }
    spansContainer.appendChild(bullet);
  }
}

function addQuestionsData(obj, count) {
  if (currentIndex < count) {
    //create the question h2
  let question = document.createElement("h2");
  let questionText = document.createTextNode(obj.question);
  question.appendChild(questionText);
  quizArea.appendChild(question);

  //create the 4 answers
  for (let i = 1; i <= 4; i++) {
    let answerDiv = document.createElement("div");
    answerDiv.className = "answer";

    //create the input
    let inputRadio = document.createElement("input");
    inputRadio.type = "radio";
    inputRadio.name = "questions";
    inputRadio.id = `answer_${i}`;
    if (i === 1) {
      inputRadio.checked = true;
    }
    answerDiv.appendChild(inputRadio);

    //create the label
    let label = document.createElement("label");
    label.htmlFor = `answer_${i}`;
    label.innerHTML = obj[`answer_${i}`];
    answerDiv.appendChild(label);

    answerArea.appendChild(answerDiv);
  };
  }
}

function checkAnswer(rightAnswer, count) {
  let rightRadio = document.getElementById(rightAnswer);
  if (rightRadio.checked === true) {
    rightAnswers++;
  }
}

function handleBullets() {
  let bullets = document.querySelectorAll(".bullets .spans span");
  bullets.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

function showResults(count) {
  if (currentIndex === count) {
    quizArea.remove();
    answerArea.remove();
    button.remove();
    bullets.remove();
    
    results.style.display = "block"

    let Result;
    if (rightAnswers >= (count / 2) && rightAnswers < count) {
      Result = `<span class="good">Good,</span> ${rightAnswers} From ${count}`;
    } else if (rightAnswers === count) {
      Result = `<span class="perfect">Perfect,</span> You answered all of the questions`;
    } else {
      Result = `<span class="bad">Bad,</span> ${rightAnswers} From ${count}`;
    }

    results.innerHTML = Result;
  }
}

function countDown(duration, count) {
  if (currentIndex < count) {
    let min, sec;
    countDownInterval = setInterval(() => {
      min = parseInt(duration / 60);
      sec = parseInt(duration % 60);

      min = min < 10 ? `0${min}` : min;
      sec = sec < 10 ? `0${sec}` : sec;

      counter.innerHTML = `${min} : ${sec}`;

      if(--duration < 0) {
        clearInterval(countDownInterval);
        button.click();
      }
    }, 1000);
  }
}