let currentDifficulty = 1; // Start at level 1 difficulty
const MAX_DIFFICULTY = 6;  // Set a cap on difficulty
let startTime;
let question;
let correctAnswer;
let answeredQuestions = 0;
let totalQuestions = 10; // Set a total number of questions for the session

// Function to generate questions based on grade level and subject
function generateQuestionForGrade(grade, subject) {
  let maxNumber;
  let operations;

  // Define question parameters based on grade
  switch (grade) {
    case 'K': // Kindergarten - Basic addition within 10
      maxNumber = 10;
      operations = ["+"];
      break;
    case '1': // Grade 1 - Addition and subtraction within 20
      maxNumber = 20;
      operations = ["+", "-"];
      break;
    case '2': // Grade 2 - Addition and subtraction within 50
      maxNumber = 50;
      operations = ["+", "-"];
      break;
    case '3': // Grade 3 - Addition, subtraction, and basic multiplication within 100
      maxNumber = 100;
      operations = ["+", "-", "*"];
      break;
    case '4': // Grade 4 - Multiplication and division within 100
      maxNumber = 100;
      operations = ["+", "-", "*", "/"];
      break;
    case '5': // Grade 5 - Multi-step operations within 200
      maxNumber = 200;
      operations = ["+", "-", "*", "/"];
      break;
    default:
      maxNumber = 10;
      operations = ["+"];
      break;
  }

  // Adjust multiplication question generation based on difficulty
  if (subject === 'multiply') {
    generateMultiplicationQuestion(currentDifficulty);
  } else {
    // Handle addition, subtraction, or other subjects here
    generateQuestion(maxNumber, operations);
  }
}

// Function to generate a multiplication question based on current difficulty
function generateMultiplicationQuestion(difficulty) {
  let num1, num2;
  // Determine problem difficulty
  if (difficulty === 1) { // Multiplying by 0, 1, 2, or 3
    num1 = Math.floor(Math.random() * 4); // Random number 0-3
    num2 = Math.floor(Math.random() * 4); // Random number 0-3
  } else if (difficulty === 2) { // Single-digit multiplication
    num1 = Math.floor(Math.random() * 10); // Random number 0-9
    num2 = Math.floor(Math.random() * 10); // Random number 0-9
  } else if (difficulty === 3) { // Single by double (1-9 by 10-99)
    num1 = Math.floor(Math.random() * 9) + 1; // Random number 1-9
    num2 = Math.floor(Math.random() * 90) + 10; // Random number 10-99
  } else if (difficulty === 4) { // Double by double (10-99 by 10-99)
    num1 = Math.floor(Math.random() * 90) + 10; // Random number 10-99
    num2 = Math.floor(Math.random() * 90) + 10; // Random number 10-99
  } else if (difficulty === 5) { // Double by triple (100-999 by 10-99)
    num1 = Math.floor(Math.random() * 900) + 100; // Random number 100-999
    num2 = Math.floor(Math.random() * 90) + 10; // Random number 10-99
  } else if (difficulty === 6) { // Triple by triple (100-999 by 100-999)
    num1 = Math.floor(Math.random() * 900) + 100; // Random number 100-999
    num2 = Math.floor(Math.random() * 900) + 100; // Random number 100-999
  }

  question = `${num1} * ${num2}`;
  correctAnswer = num1 * num2;
  if (isNaN(correctAnswer)) {
    generateMultiplicationQuestion(difficulty); // Regenerate if answer is invalid
    return;
  }
  document.getElementById("question").innerText = `What is ${question}?`;
  document.getElementById("answer").value = ""; // Clear input

  // Start timing
  startTime = new Date();
}

// Function to generate a general question (addition, subtraction, etc.)
function generateQuestion(maxNumber, operations) {
  const num1 = Math.floor(Math.random() * maxNumber) + 1;
  const num2 = Math.floor(Math.random() * maxNumber) + 1;
  const operator = operations[Math.floor(Math.random() * operations.length)];

  // Prevent undefined results (e.g., division by zero)
  if (operator === "/" && num2 === 0) {
    generateQuestion(maxNumber, operations); // Regenerate the question
    return;
  }

  question = `${num1} ${operator} ${num2}`;
  correctAnswer = eval(question);

  // If evaluation results in an undefined or invalid answer, regenerate the question
  if (isNaN(correctAnswer) || correctAnswer === undefined) {
    generateQuestion(maxNumber, operations);
    return;
  }

  // Update the question and reset the answer field
  document.getElementById("question").innerText = `What is ${question}?`;
  document.getElementById("answer").value = ""; // Clear input

  // Start timing
  startTime = new Date();
}

function checkAnswer() {
  const userAnswer = parseInt(document.getElementById("answer").value);
  const endTime = new Date();
  const timeTaken = (endTime - startTime) / 1000; // Time in seconds

  let feedback = "";
  
  if (userAnswer === correctAnswer) {
    feedback = "Correct!";
    answeredQuestions++;
    if (timeTaken < 5) currentDifficulty = Math.min(MAX_DIFFICULTY, currentDifficulty + 1); 
    else currentDifficulty = Math.min(MAX_DIFFICULTY, currentDifficulty + 0.5);
  } else {
    feedback = "Incorrect.";
    if (timeTaken < 5) currentDifficulty = Math.max(1, currentDifficulty - 0.5);
    else currentDifficulty = Math.max(1, currentDifficulty - 1);
  }

  document.getElementById("feedback").innerText = `${feedback} (Difficulty: ${currentDifficulty.toFixed(1)})`;

  // Update progress bar
  updateProgressBar();

  // Generate a new question for the same grade level and subject
  const urlParams = new URLSearchParams(window.location.search);
  const grade = urlParams.get('grade');
  const subject = urlParams.get('subject');
  generateQuestionForGrade(grade, subject);
}

function updateProgressBar() {
  const progress = (answeredQuestions / totalQuestions) * 100;
  document.getElementById("progress-bar").style.width = `${progress}%`;
  document.getElementById("progress-text").innerText = `${answeredQuestions}/${totalQuestions} Questions Answered`;
}

// Function to skip to the next question manually
function nextQuestion() {
  const urlParams = new URLSearchParams(window.location.search);
  const grade = urlParams.get('grade');
  const subject = urlParams.get('subject');
  generateQuestionForGrade(grade, subject);
}
