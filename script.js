// Game variables
let gameActive = false;
let score = 0;
let streak = 0;
let timeRemaining = 60;
let totalQuestions = 0;
let correctAnswers = 0;
let currentAnswer = null;
let timerInterval = null;

// Difficulty levels for operations
const operations = [
    { symbol: '+', calculate: (a, b) => a + b, min: 1, max: 100 },
    { symbol: '-', calculate: (a, b) => a - b, min: 1, max: 100 },
    { symbol: '×', calculate: (a, b) => a * b, min: 1, max: 12 },
    { symbol: '÷', calculate: (a, b) => {
        // Ensure clean division
        const divisor = b !== 0 ? b : 1;
        return Math.floor(a / divisor);
    }, min: 1, max: 12 }
];

// Generate a random question
function generateQuestion() {
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let num1, num2;
    
    if (operation.symbol === '÷') {
        // For division, make sure result is a whole number
        num2 = Math.floor(Math.random() * (operation.max - operation.min + 1)) + operation.min;
        const result = Math.floor(Math.random() * (operation.max - operation.min + 1)) + operation.min;
        num1 = result * num2;
    } else if (operation.symbol === '×') {
        num1 = Math.floor(Math.random() * (operation.max - operation.min + 1)) + operation.min;
        num2 = Math.floor(Math.random() * (operation.max - operation.min + 1)) + operation.min;
    } else {
        num1 = Math.floor(Math.random() * (operation.max - operation.min + 1)) + operation.min;
        num2 = Math.floor(Math.random() * (operation.max - operation.min + 1)) + operation.min;
        
        // Ensure subtraction result is not negative
        if (operation.symbol === '-' && num2 > num1) {
            [num1, num2] = [num2, num1];
        }
    }
    
    currentAnswer = operation.calculate(num1, num2);
    
    // Update the display
    document.getElementById('num1').textContent = num1;
    document.getElementById('operator').textContent = operation.symbol;
    document.getElementById('num2').textContent = num2;
}

// Handle answer submission
function submitAnswer() {
    if (!gameActive) return;
    
    const userAnswer = parseInt(document.getElementById('answerInput').value);
    const feedbackEl = document.getElementById('feedback');
    
    if (isNaN(userAnswer)) {
        feedbackEl.textContent = 'Please enter a valid number';
        feedbackEl.className = 'feedback';
        return;
    }
    
    totalQuestions++;
    
    if (userAnswer === currentAnswer) {
        // Correct answer
        correctAnswers++;
        streak++;
        score += 10 + streak; // Bonus points for streak
        
        feedbackEl.textContent = `✓ Correct! +${10 + streak} points`;
        feedbackEl.className = 'feedback correct';
    } else {
        // Wrong answer
        streak = 0;
        feedbackEl.textContent = `✗ Wrong! The answer was ${currentAnswer}`;
        feedbackEl.className = 'feedback wrong';
    }
    
    // Update score display
    document.getElementById('score').textContent = score;
    document.getElementById('streak').textContent = streak;
    
    // Clear input and generate next question after a short delay
    document.getElementById('answerInput').value = '';
    
    setTimeout(() => {
        if (gameActive) {
            generateQuestion();
            document.getElementById('answerInput').focus();
            feedbackEl.textContent = '';
            feedbackEl.className = 'feedback';
        }
    }, 1000);
}

// Handle Enter key press
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        submitAnswer();
    }
}

// Start the game
function startGame() {
    // Hide start screen, show game screen
    document.getElementById('startScreen').classList.remove('active');
    document.getElementById('gameScreen').classList.add('active');
    
    gameActive = true;
    score = 0;
    streak = 0;
    totalQuestions = 0;
    correctAnswers = 0;
    timeRemaining = 60;
    
    // Reset displays
    document.getElementById('score').textContent = '0';
    document.getElementById('streak').textContent = '0';
    
    // Initialize flip timer
    const timerFlip = document.getElementById('timerFlip');
    timerFlip.querySelector('.flip-card-front').textContent = '60';
    timerFlip.querySelector('.flip-card-back').textContent = '59';
    timerFlip.classList.remove('flip');
    
    // Generate first question
    generateQuestion();
    
    // Focus on input
    document.getElementById('answerInput').focus();
    
    // Start timer
    timerInterval = setInterval(updateTimer, 1000);
}

// Update timer
function updateTimer() {
    timeRemaining--;
    
    // Update flip card display
    const timerFlip = document.getElementById('timerFlip');
    const front = timerFlip.querySelector('.flip-card-front');
    const back = timerFlip.querySelector('.flip-card-back');
    
    // Add flip animation class
    timerFlip.classList.add('flip');
    
    // Update the values after the flip animation starts
    setTimeout(() => {
        front.textContent = timeRemaining;
        timerFlip.classList.remove('flip');
        
        // Prepare the back for the next number
        setTimeout(() => {
            back.textContent = timeRemaining - 1;
        }, 300);
    }, 300);
    
    if (timeRemaining <= 0) {
        endGame();
    }
}

// End the game
function endGame() {
    gameActive = false;
    clearInterval(timerInterval);
    
    // Hide game screen, show end screen
    document.getElementById('gameScreen').classList.remove('active');
    document.getElementById('endScreen').classList.add('active');
    
    // Calculate accuracy
    const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    
    // Update final stats
    document.getElementById('finalScore').textContent = score;
    document.getElementById('questionCount').textContent = totalQuestions;
    document.getElementById('accuracy').textContent = accuracy;
}

// Initialize - make sure start screen is active
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('startScreen').classList.add('active');
});
