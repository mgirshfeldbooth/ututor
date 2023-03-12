// import "./styles.css";
import styled from "@emotion/styled";
import React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion/dist/framer-motion";

const AppContainer = styled.div`
  color: #202425;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: "Montserrat", sans-serif;
  min-width: 500px;
  border: 1px solid gray;
  padding: 20px;
  background-color: #f2f2f2;
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

const CardStats = styled.h4``;

const Subtitle = styled.h3`
  font-size: 12px;
`;

const MathleticsTitle = styled.h3`
  font-size: 12px;
  text-transform: uppercase;
  align-self: flex-start;
`;

const ValueInput = styled.input`
  padding: 5px 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
  max-width: ${(props) => props.maxWidth}px;
`;

const exercises = [
  {
    desc: "1 + 1 = ?",
    difficulty: 1,
    answer: 1,
  },
  {
    desc: "3 - 2 = ?",
    difficulty: 1,
    answer: 1,
  },
  {
    desc: "4 * 2 = ?",
    difficulty: 1,
    answer: 8,
  },
];

export default function App() {
  // TODO:
  // Implement scoring and score card features
  // Implement a graph https://recharts.org/en-US/examples/SimpleLineChart
  // Could use stacked bar chart with wrong/right answers for each difficulty https://recharts.org/en-US/examples/StackedBarChart
  // Make fetch requests to https://guides.rubyonrails.org/api_app.html
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [numberOfQuestions, setNumberOfQuestions] = useState(0);
  const [showExercises, setShowExercises] = useState(false);
  const [showScore, setShowScore] = useState(false);

  function handleShowExercises() {
    setShowExercises(true);
  }

  function handleNextClick(props) {
    // This handles showing score when all questions have been answered
    if (currentQuestion === exercises.length - 1) {
      setShowScore(true);
      return;
    }

    // TODO: Keep track of score and other stats
    const nextQuestion = currentQuestion + 1;
    setCurrentQuestion(nextQuestion);
  }

  function handleChange(event) {
    // TODO: Hook up numberOfQuestions to render that many questions
    setNumberOfQuestions(event.target.valueAsNumber);
  }

  return (
    <AppContainer>
      <MathleticsTitle>Mathletics</MathleticsTitle>
      {showScore ? (
        <StatsCard>
          <CardTitle>Stats for this round</CardTitle>
          <CardStats>{exercises.length} exercises</CardStats>
          <CardStats>??? correct</CardStats>
          <CardStats>??? incorrect</CardStats>
          <CardStats>Accuracy: ???</CardStats>
          <CardStats>Difficulty Reached: ???</CardStats>
          <Button>Next lesson</Button>
        </StatsCard>
      ) : (
        <AnimatePresence mode={"wait"}>
          {showExercises ? (
            <Card
              key={currentQuestion}
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
              <CardTitle>{exercises[currentQuestion].desc}</CardTitle>
              <Subtitle>
                Difficulty: {exercises[currentQuestion].difficulty}
              </Subtitle>
              <ValueInput
                type="text"
                pattern="\d*"
                placeholder="Enter answer..."
                maxWidth={160}
              />
              <Button onClick={handleNextClick}>Next</Button>
            </Card>
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
  );
}

// /api/rounds
