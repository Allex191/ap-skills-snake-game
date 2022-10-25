export const clearBoard = (
  context: CanvasRenderingContext2D | null,
  gameWidth: number,
  gameHeight: number
) => {
  if (context) {
    context.clearRect(0, 0, gameWidth, gameHeight);
  }
};

export interface IObjectBody {
  x: number;
  y: number;
}

export const drawObject = (
  context: CanvasRenderingContext2D | null,
  objectBody: IObjectBody[],
  fillColor: string,
  itemSize: number,
  strokeStyle = "#146356"
) => {
  if (context) {
    objectBody.forEach((object: IObjectBody) => {
      context.fillStyle = fillColor;
      context.strokeStyle = strokeStyle;
      context?.fillRect(object.x, object.y, itemSize, itemSize);
      context?.strokeRect(object.x, object.y, itemSize, itemSize);
    });
  }
};

export const getRandomApplePos = (
  snake: any[],
  gameWidth: number,
  gameHeight: number,
  itemSize: number
) => {
  console.log("getRandomPos running");
  const getXY = () => {
    const randomX = Math.random() * gameWidth;
    const randomY = Math.random() * gameHeight;
    const x = randomX - (randomX % itemSize);
    const y = randomY - (randomY % itemSize);
    return { x, y };
  };
  const newPos = getXY();

  let isRepeated = true;
  while (isRepeated) {
    console.log("while running");
    snake.forEach((object) => {
      if (object.x !== newPos.x && object.y !== newPos.y) {
        isRepeated = false;
      }
    });
  }
  return [newPos];
};

export const checkIsAppleConsumed = (headPos, applePos) => {
  if (headPos[0].x === applePos[0].x && headPos[0].y === applePos[0].y) {
    return true;
  } else {
    return false;
  }
};

export const chechIfSnakeCollided = (
  newHeadPosition,
  snake,
  gameWidth,
  gameHeight,
  itemSize
): boolean => {
  // });
  const hasCollidedItself = snake.some(
    (object) =>
      newHeadPosition[0].x === object.x && newHeadPosition[0].y === object.y
  );

  const checkIfCollidedBorders = () => {
    if (
      newHeadPosition[0].x < 0 ||
      newHeadPosition[0].x > gameWidth - itemSize ||
      newHeadPosition[0].y < 0 ||
      newHeadPosition[0].y > gameHeight - itemSize
    ) {
      return true;
    } else {
      return false;
    }
  };
  console.log("hasCollidedItself", hasCollidedItself);
  return hasCollidedItself || checkIfCollidedBorders();
};
