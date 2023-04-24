// import "./styles.css";
import styled from "@emotion/styled";
import React, { useRef, useEffect } from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion/dist/framer-motion";
import { CookiesProvider, useCookies } from "react-cookie";
import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti';

const AppContainer = styled.div`
  color: #202425;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Karla", sans-serif;
  border: 1px solid gray;
  padding: 20px;
  background-color: #f2f5f9;
  height: 80vh;
`;

const Button = styled.button`
  background-color: #5fcfbc;
  color: white;
  text-transform: uppercase;
  font-weight: 700;
  border: 0;
  border-radius: 16px;
  align-self: center;
  padding: 10px 20px;
  transition: all 0.2s;
  &:hover {
    transform: scale(1.05);
    transition: 150ms;
  }
`;

const Card = styled(motion.div)`
  text-align: center;
  margin: 20px auto;
  padding: 20px;
  color: #142e47;
  background-color: #fbfcfd;
  display: flex;
  flex-direction: column;
  row-gap: 15px;
  align-items: center;
  min-width: 300px;
  /* Card effects */
  box-shadow: rgba(0, 0, 0, 0.08) 0px 4px 12px;
  border-radius: 24px;
  border: 2px solid #ddd;
`;

const StatsCard = styled(Card)`
  row-gap: 5px;
`;

const CardTitle = styled.h2`
  font-weight: 600;
`;

const Subtitle = styled.h3`
  font-size: 16px;
  width: 75%;
`;

const ValueInput = styled.input`
  padding: 5px 10px;
  border-radius: 16px;
  text-align: center;
  border: 1px solid #ddd;
  max-width: ${(props) => props.maxWidth}px;
  gap: 28px;
  margin-top: 48px;
`;




// Example of what our exercises object looks like
// const exercises = [
//   {
//     id: 1,
//     question: "1 + 1 = ?",
//     answer: "2",
//     difficulty: 1,
//   },
//   ...
// ];

function QuizCard({ question, clickHandler, handleAnswer }) {
  function handleKeyDown (event) {
    if (event.key === 'Enter') {
      clickHandler(event);
    }
  };

  return (
    <Card
      key={question.id}
      initial={{
        opacity: 0,
        x: 100,
      }}
      animate={{
        opacity: 1,
        x: 0,
        transition: { ease: "easeOut", duration: 0.3 },
      }}
      exit={{
        opacity: 0,
        x: -100,
        transition: { ease: "easeIn", duration: 0.3 },
      }}
    >
      <CardTitle>{question.question}</CardTitle>
      <Subtitle>Difficulty: {question.difficulty}</Subtitle>
      <ValueInput
        type="text"
        pattern="\d*"
        placeholder="Enter answer..."
        maxWidth={160}
        onChange={handleAnswer}
        onKeyDown={handleKeyDown}
        autoFocus
      />
      <Button onClick={clickHandler}>Next</Button>
    </Card>
  );
}

function getUserIDFromMetaTag() {
  const name = "user_id";
  return document.querySelector(`meta[name='${name}']`).getAttribute("content");
}

function Freeplay({
  roundEnded,
  showExercises,
  currentExercise,
  handleNextClick,
  handleAnswer,
  handleChange,
  numberOfQuestions,
  handleShowExercises,
  handleResetApp,
}) {
  console.log({ showExercises, roundEnded });
  return (
    <>
      {roundEnded ? (
        <Card>
          <CardTitle>Thanks!</CardTitle>
          <Subtitle>Round Complete</Subtitle>
          <Button onClick={handleResetApp}>Reset</Button>
        </Card>
      ) : (
        <AnimatePresence mode={"wait"}>
          {showExercises ? (
            <QuizCard
              question={currentExercise}
              clickHandler={handleNextClick}
              handleAnswer={handleAnswer}
            />
          ) : (
            <Card
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
                transition: { ease: "easeOut", duration: 0.3 },
              }}
              exit={{
                opacity: 0,
                transition: { ease: "easeIn", duration: 0.3 },
              }}
            >
              <h2>How many exercises would you like to try?</h2>
              <ValueInput
                type="number"
                placeholder="Enter amount of exercises..."
                min="1"
                step="1"
                onChange={handleChange}
                value={numberOfQuestions}
                maxWidth={80}
                autoFocus
              />
              <Button onClick={handleShowExercises}>Next</Button>
            </Card>
          )}
        </AnimatePresence>
      )}
    </>
  );
}

function PracticePlan({
  roundEnded,
  showExercises,
  numberOfQuestions,
  handleStartPractice,
  currentExercise,
  handleNextClick,
  handleAnswer,
  handleResetApp,
}) {
  /*
    Pull number of problems from plan table for student
    1. Show student how many problems they are about to perform
    2. Hit GO -> Same code as before
  */

  return (
    <>
      {roundEnded ? (
        <Card>
          <CardTitle>Thanks!</CardTitle>
          <Subtitle>Round Complete</Subtitle>
          <Button onClick={handleResetApp}>Reset</Button>
        </Card>
      ) : (
        <AnimatePresence mode={"wait"}>
          {showExercises ? (
            <QuizCard
              question={currentExercise}
              clickHandler={handleNextClick}
              handleAnswer={handleAnswer}
            />
          ) : (
            <Card>
              <CardTitle>Ready to play?</CardTitle>
              <Subtitle>You will do {numberOfQuestions} exercise(s). Go as FAST as you can!</Subtitle> 
              <Button onClick={handleStartPractice}>Go!</Button>
            </Card>
          )}
        </AnimatePresence>
      )}
    </>
  );
}

export default function App() {
  // setup state
  const [questionCount, setQuestionCount] = useState(0);
  const [numberOfQuestions, setNumberOfQuestions] = useState(0);
  const [showExercises, setShowExercises] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [planSelected, setPlanSelected] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // misc + derived values
  const currentUserID = getUserIDFromMetaTag();
  const [cookies, setCookie] = useCookies();
  const roundID = cookies["current_round"];
  const { width, height } = useWindowSize()


  let roundEnded = false;

  if (numberOfQuestions > 0) {
    // Ensure that we are checking during a round
    roundEnded = numberOfQuestions - questionCount === 0;
  }

  async function handleShowExercises() {
    /*
      - Get how many exercises they want in a round
      -- POST /api/rounds - Going to start a round
      --- RESPONSE 1 exercise
    */
    const response = await fetch("/rounds", {
      method: "POST",
      body: JSON.stringify({
        query_round_length: numberOfQuestions,
        query_plan_selected: planSelected,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw Error(response.statusText);

    const exercise = await response.json();

    // TODO: Modify rounds controller to namespace API

    // Set next exercises to exercise in request response
    setCurrentExercise(exercise);
    setShowExercises(true);
    // setQuestionCount(questionCount + 1);
  }

  async function handleNextClick(event) {
    event.preventDefault();
    // This handles showing score when all questions have been answered
    if (roundEnded) {
      return;
    }

    setQuestionCount(questionCount + 1);

    /*
      Gather the submission
      POST to /attempts
    */
    const response = await fetch("/attempts", {
      method: "POST",
      body: JSON.stringify({
        query_submission: submission,
        query_user_id: currentUserID,
        query_exercise_id: currentExercise.id,
        query_round_id: roundID,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw Error(response.statusText);

    if (currentExercise.answer == submission) {
      setShowConfetti(true)
      setTimeout(() => {
        setShowConfetti(false)
      }, 3000);
    }
    // TODO: This could be an exercise OR could be the end of the round
    const exercise = await response.json();

    // This returns something different when all the exercises have been completed
    setCurrentExercise(exercise);
  }

  function handleChange(event) {
    setNumberOfQuestions(event.target.valueAsNumber);
  }

  function handleAnswer(event) {
    setSubmission(event.target.value);
  }

  async function changePlanSelected(planSelected) {
    setPlanSelected(planSelected);

    if (planSelected === "freeplay") {
      // Show initial choose exercises screen
      return;
    } else if (planSelected === "practice") {
      const response = await fetch("/rounds", {
        method: "POST",
        body: JSON.stringify({ query_plan_selected: planSelected }),
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw Error(response.statusText);

      const exercise = await response.json();
      // Set the next exercise, and set number of questions, use response value round_length for round length
      setCurrentExercise(exercise);
      setNumberOfQuestions(exercise.round_length);
    }
  }

  function handleStartPractice() {
    setShowExercises(true);
  }

  function handleResetApp() {
    changePlanSelected(null);
    setNumberOfQuestions(0);
    setQuestionCount(0);
    setShowExercises(false);
    setSubmission(null);
    setCurrentExercise(null);
  }

  return (
    <CookiesProvider>
      <AppContainer>

      

          {!planSelected && (
            <Card>
              <CardTitle>Welcome!</CardTitle>
              <Subtitle>Would you like to practice your tutor's plan or free play?</Subtitle>
              <Button
                onClick={() => {
                  changePlanSelected("practice");
                }}
              >
                Practice Plan
              </Button>

              <Button
                onClick={() => {
                  changePlanSelected("freeplay");
                }}
              >
                Free Play
              </Button>


              
            </Card>
          )}

          {planSelected === "freeplay" && (
            <Freeplay
              roundEnded={roundEnded}
              showExercises={showExercises}
              currentExercise={currentExercise}
              handleNextClick={handleNextClick}
              handleAnswer={handleAnswer}
              handleChange={handleChange}
              numberOfQuestions={numberOfQuestions}
              handleShowExercises={handleShowExercises}
              handleResetApp={handleResetApp}
            ></Freeplay>
          )}

          {planSelected === "practice" && (
            <PracticePlan
              numberOfQuestions={numberOfQuestions}
              handleStartPractice={handleStartPractice}
              roundEnded={roundEnded}
              currentExercise={currentExercise}
              handleNextClick={handleNextClick}
              handleAnswer={handleAnswer}
              showExercises={showExercises}
              handleResetApp={handleResetApp}
            ></PracticePlan>
          )}
   
      
          {showConfetti && <Confetti
            width={width}
            height={height}
          />}
      </AppContainer>
    </CookiesProvider>
  );
}
