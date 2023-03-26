// import "./styles.css";
import styled from "@emotion/styled";
import React, { useEffect } from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion/dist/framer-motion";
import { CookiesProvider, useCookies } from "react-cookie";

const AppContainer = styled.div`
  color: #202425;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Montserrat", sans-serif;
  min-width: 500px;
  border: 1px solid gray;
  padding: 20px;
  background-color: #f2f2f2;
  height: 80vh;
`;

const Button = styled.button`
  background-color: #6cd97d;
  color: #202425;
  text-transform: uppercase;
  font-weight: 700;
  border: 0;
  border-radius: 2px;
  align-self: center;
  padding: 10px 20px;
  transition: all 0.2s;
  &:hover {
    cursor: pointer;
    background-image: linear-gradient(rgb(0 0 0/20%) 0 0);
    transform: translateY(-1px);
  }
`;

const Card = styled(motion.div)`
  text-align: center;
  margin: 20px auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  row-gap: 15px;
  align-items: center;
  min-width: 300px;
  /* Card effects */
  box-shadow: 0 4px 21px -12px rgba(0, 0, 0, 0.66);
  border-radius: 3px;
  border: 2px solid #ddd;
`;

const StatsCard = styled(Card)`
  row-gap: 5px;
`;

const CardTitle = styled.h2`
  font-weight: 800;
`;

const Subtitle = styled.h3`
  font-size: 12px;
`;

const ValueInput = styled.input`
  padding: 5px 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
  max-width: ${(props) => props.maxWidth}px;
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
        <>
          <h1>End of round</h1>
          <Button onClick={handleResetApp}>Reset</Button>
        </>
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
              <h2>How many exercises?</h2>
              <ValueInput
                type="number"
                placeholder="Enter amount of exercises..."
                min="1"
                step="1"
                onChange={handleChange}
                value={numberOfQuestions}
                maxWidth={80}
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
        <>
          <h1>End of round</h1>
          <Button onClick={handleResetApp}>Reset</Button>
        </>
      ) : (
        <AnimatePresence mode={"wait"}>
          {showExercises ? (
            <QuizCard
              question={currentExercise}
              clickHandler={handleNextClick}
              handleAnswer={handleAnswer}
            />
          ) : (
            <>
              <h1>Are you ready to start?</h1>
              <h2>You will do {numberOfQuestions} exercise(s)</h2>
              <Button onClick={handleStartPractice}>Go!</Button>
            </>
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

  // misc + derived values
  const currentUserID = getUserIDFromMetaTag();
  const [cookies, setCookie] = useCookies();
  const roundID = cookies["current_round"];

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
          <>
            <Button
              onClick={() => {
                changePlanSelected("freeplay");
              }}
            >
              Free Play
            </Button>

            <br></br>

            <Button
              onClick={() => {
                changePlanSelected("practice");
              }}
            >
              Practice Plan
            </Button>
          </>
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
      </AppContainer>
    </CookiesProvider>
  );
}
