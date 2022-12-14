import {
  AnyAction,
  createAction,
  ListenerEffectAPI,
  ThunkDispatch,
} from "@reduxjs/toolkit";
import { DIR_DOWN, DIR_LEFT, DIR_RIGHT, DIR_UP } from "data/gameConst";
import { Idirections } from "hooks/useKeysHandler";
import { startAppListening } from "Redux/middleware/listenerMiddleware";
import { RootState } from "Redux/redux";
import { setCurrentKey, startSnakeMovement } from "Redux/slices/snakeSlice";

export const userPressedMoveSnakeKey = createAction<Idirections>(
  "snake/manageUserMoveSnakeKey"
);

export const manageUserMoveSnakeKey = (
  action: {
    payload: Idirections;
    type: string;
  },
  listenerApi: ListenerEffectAPI<
    RootState,
    ThunkDispatch<unknown, unknown, AnyAction>,
    unknown
  >
) => {
  const { isGameStarted, isArrowsTempShown, snakeDir } =
    listenerApi.getState().snakeReducer;

  const dispatch = listenerApi.dispatch;
  const { moveLeft, moveRight, moveUp, moveDown } = action.payload;

  if (isGameStarted) {
    if (snakeDir === DIR_UP || snakeDir === DIR_DOWN) {
      if (moveLeft) {
        dispatch(setCurrentKey(DIR_LEFT));
      }
      if (moveRight) {
        dispatch(setCurrentKey(DIR_RIGHT));
      }
    }
    if (snakeDir === DIR_LEFT || snakeDir === DIR_RIGHT) {
      if (moveUp) {
        dispatch(setCurrentKey(DIR_UP));
      }
      if (moveDown) {
        dispatch(setCurrentKey(DIR_DOWN));
      }
    }

    if (isArrowsTempShown) {
      const startingMov = moveUp
        ? DIR_UP
        : moveRight
        ? DIR_RIGHT
        : moveDown
        ? DIR_DOWN
        : moveLeft
        ? DIR_LEFT
        : null;
      startingMov && dispatch(startSnakeMovement(startingMov));
    }
  }
};

export const snakeKeyPressListener = () => {
  startAppListening({
    actionCreator: userPressedMoveSnakeKey,
    effect: manageUserMoveSnakeKey,
  });
};
