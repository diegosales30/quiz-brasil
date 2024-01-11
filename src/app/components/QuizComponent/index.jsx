"use client";
import  {questions} from "../../db/database"; //consome um array de obj com 5 questoes
import styles from './quiz.module.scss';
import { useEffect, useState } from "react";


export default function QuizApp() {
  let timer;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");

  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const [timeRemaining, setTimeRemaining] = useState(10);
  const [isTimeUp, setIsTimeUp] = useState(false);
  console.log(showResults);
  const question = questions[currentQuestion];
  //contador regressivo.
  // useEffect(() => {
    
  //   if (timeRemaining > 0) {
  //     timer = setInterval(() => {
  //       setTimeRemaining((prevTime) => prevTime - 1);
  //       if (prevTime === 1) {
  //         setIsTimeUp(true);
  //         clearInterval(timer);
  //       }
  //     }, 1000);
  //   }

  //   return () => clearInterval(timer);
  // }, [timeRemaining]);

  useEffect(() => {
    if (isTimeUp) {
      alert("Tempo Esgotado! Por favor, reinicie o jogo.");
      setShowResults(true);
      return;
    }
    if (timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime === 1) {
            setIsTimeUp(true);
            clearInterval(timer);
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [timeRemaining]);

  // Reset the timer when a new question is displayed
  useEffect(() => {
    setTimeRemaining(10);
    setIsTimeUp(false);
  }, [currentQuestion]);

  function handleOptionSelect(option) {
    
    setSelectedOption(option);
    setShowAnswer(true);
    if (option === question.answer) {
      setScore((prevScore) => prevScore + 1);
    }
    clearInterval(timer);
  }

  function handleNextClick() {
    setCurrentQuestion((prevQn) => prevQn + 1);
    setShowAnswer(false);
    if (currentQuestion === questions.length - 1) {
      setShowResults(true);
      setCurrentQuestion(0);
    }
  }

  function restartQuiz() {
    setShowResults(false);
    setIsTimeUp(false);
    setTimeRemaining(10);
    setCurrentQuestion(0);
    setScore(0);

  }

  return (
    <>
      {showResults ? (
        <div className={styles.quizapp}>
          <h2>Your Scores</h2>
          <h3>
            You scored {score} out {questions.length}
          </h3>
          <button onClick={restartQuiz}>Start the Quiz Again</button>   
        </div>
        
      ) : (
        <div className={styles.quizapp}>
          <div className={styles.quizheader}>
            <h2>Awesome Quiz Application</h2>
          </div>
          <div className={styles.quizbody}>
            <h1>
              {question.id}. {question.question}
            </h1>
            <p>Time Remaining: {timeRemaining} seconds</p>
            <div className={styles.options}>
              {question.options.map((option, i) => {
                return (
                  <button
                    key={i}
                    className={
                      showAnswer && option === question.answer
                        ? styles.correctAnswer
                        : showAnswer && option === selectedOption
                        ? styles.wrongAnswer
                        : ""
                    }
                    onClick={() => handleOptionSelect(option)}
                    disabled={isTimeUp}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
          <div className={styles.quizfooter}>
            <p>
              {currentQuestion + 1} out of {questions.length}
            </p>
            <button onClick={handleNextClick} className={styles.next}>
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
}