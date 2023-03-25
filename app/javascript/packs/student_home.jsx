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

// const exercises = [
//   {
//     id: 1,
//     question: "1 + 1 = ?",
//     answer: "2",
//     difficulty: 1,
//   },
//   {
//     id: 2,
//     question: "3 - 2 = ?",
//     answer: "1",
//     difficulty: 1,
//   },
//   {
//     id: 3,
//     question: "4 * 2 = ?",
//     answer: "8",
//     difficulty: 1,
//   },
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

export default function App() {
  // TODO:
  // Implement scoring and score card features
  // Implement a graph https://recharts.org/en-US/examples/SimpleLineChart
  // Could use stacked bar chart with wrong/right answers for each difficulty https://recharts.org/en-US/examples/StackedBarChart
  // Make fetch requests to https://guides.rubyonrails.org/api_app.html
  const [questionCount, setQuestionCount] = useState(0);
  const [numberOfQuestions, setNumberOfQuestions] = useState(0);
  const [showExercises, setShowExercises] = useState(false);
  const [showScore, setShowScore] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [submission, setSubmission] = useState(null);
  const currentUserID = getUserIDFromMetaTag();
  const [cookies, setCookie] = useCookies();
  const roundID = cookies["current_round"];

  async function addRound(newRound) {
    try {
      const response = await window.fetch("/api/rounds", {
        method: "POST",
        body: JSON.stringify(newRound),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw Error(response.statusText);

      const savedRound = await response.json();
      // TODO: set exercises from our returned round
      // const newExercises = [...exercises, savedRound];
      // setExercises(newExercises);
      // console.log("Round Added!");
    } catch (error) {
      console.error(error);
    }
  }

  async function handleShowExercises(event) {
    event.preventDefault();
    // TODO: Make a request to backend
    /*
      - Get how many exercises they want in a round
      -- POST /api/rounds - Going to start a round
      --- RESPONSE 1 exercise
    */

    // Change query round length to match input value
    const response = await fetch("/rounds", {
      method: "POST",
      body: JSON.stringify({ query_round_length: numberOfQuestions }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw Error(response.statusText);

    const exercise = await response.json();

    // TODO: Response should contain the exercise. Modify rounds controller
    // to namespace API
    console.log(exercise);

    // Set exercises to current exercise
    setCurrentExercise(exercise);
    setShowExercises(true);
    setQuestionCount(questionCount + 1);
  }

  async function handleNextClick(event) {
    event.preventDefault();
    // This handles showing score when all questions have been answered
    if (numberOfQuestions - questionCount === 0) {
      // TODO: Figure out what to do here
      setShowScore(true);
      return;
    }

    setQuestionCount(questionCount + 1);

    /*
      Gather the submission
      // POST to /attempts
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

    debugger;
    // This contains the result of the previous submission
    // Check the submission
    // FIX: Why does the submission get returned on the last submission
    setCurrentExercise(exercise);
  }

  function handleChange(event) {
    // TODO: Hook up numberOfQuestions to render that many questions
    setNumberOfQuestions(event.target.valueAsNumber);
  }

  function handleAnswer(event) {
    setSubmission(event.target.value);
  }

  useEffect(() => {
    // TODO: Fetch exercises from API, either on page load or when # of exercises is POST
    // console.log(exercises);
    /*
      - Get how many exercises they want in a round
      -- POST /api/rounds - Going to start a round
      --- RESPONSE 1 exercise

      +++ Show Exercise +++
      
      - Get the answer
      -- POST /api/attempts - Record the attempt
      --- RESPONSE 1 exercise
      
      ...

      +++ Reach end of round +++ 
      +++ Show the score (OPTIONAL) +++
    */
    // fetch("/api/exercises");
  }, []);

  return (
    <CookiesProvider>
      <AppContainer>
        {showScore ? (
          // <StatsCard>
          //   <CardTitle>Stats for this round</CardTitle>
          //   <CardStats>{exercises.length} exercises</CardStats>
          //   <CardStats>??? correct</CardStats>
          //   <CardStats>??? incorrect</CardStats>
          //   <CardStats>Accuracy: ???</CardStats>
          //   <CardStats>Difficulty Reached: ???</CardStats>
          //   <Button>Next lesson</Button>
          // </StatsCard>
          <h1>End of round</h1>
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
                {/* TODO: Change the style below to be a property passed into ValueInput */}
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
      </AppContainer>
    </CookiesProvider>
  );
}
