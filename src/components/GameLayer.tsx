import { StyledGameLayer } from "components/index.styled";
import { GAME_SPEED, ONE_FRAME_TIME } from "data/constants";
import { useKeyHandler } from "hooks/useKeyHandler";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { moveSnake } from "Redux/actions/actions";
import { RootState } from "Redux/redux";
import { setCurrentKey, startSnakeMovement } from "Redux/slices/snakeSlice";
import { clearBoard, drawObject } from "utils/utils";

const GameLayer = () => {
  const { isGameStarted, applePos, snakeDir, isArrowsTempShown, isGameOver } =
    useSelector((state: RootState) => state.snakeReducer);
  const { gameWidth, gameHeight, itemSize } = useSelector(
    (state: RootState) => state.snakeReducer.gameSizes
  );
  const { snakeCoords, isSnakeReadyToMove } = useSelector(
    (state: RootState) => state.snakeReducer
  );
  const dispatch = useDispatch();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  const prevTimeRef = useRef(0);
  const gameLoopIDRef = useRef(0);

  const gameLoop = (curTime?: DOMHighResTimeStamp) => {
    if (curTime) {
      const isFirstRun = prevTimeRef.current === 0;
      const isFrameDelayElapsed =
        curTime - prevTimeRef.current >= GAME_SPEED - ONE_FRAME_TIME / 2;
      if (isFirstRun || isFrameDelayElapsed) {
        console.log("gameLoop", curTime - prevTimeRef.current);
        prevTimeRef.current = curTime;
        dispatch(moveSnake());
      }
    }
    gameLoopIDRef.current = window.requestAnimationFrame(gameLoop);
  };

  //start game loop
  useEffect(() => {
    if (isSnakeReadyToMove) {
      gameLoop();
    } else {
      window.cancelAnimationFrame(gameLoopIDRef.current);
    }
  }, [isSnakeReadyToMove]);

  useKeyHandler(
    snakeDir,
    setCurrentKey,
    startSnakeMovement,
    isGameStarted,
    dispatch,
    isArrowsTempShown
  );

  //draw on canvas
  useEffect(() => {
    if (canvasRef.current) {
      !context && setContext(canvasRef.current.getContext("2d"));
      clearBoard(context, gameWidth, gameHeight);

      if (isGameStarted || isGameOver) {
        drawObject(context, applePos, "red", itemSize);
        drawObject(context, snakeCoords, "black", itemSize);
      }
    }
  }, [
    snakeCoords,
    context,
    applePos,
    gameWidth,
    gameHeight,
    itemSize,
    isGameStarted,
    isGameOver,
  ]);

  return (
    <>
      <StyledGameLayer ref={canvasRef} width={gameWidth} height={gameHeight} />
    </>
  );
};

export default GameLayer;
