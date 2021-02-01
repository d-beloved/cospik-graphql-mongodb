import { combineReducers } from "redux";
import adminReducer from "./auth.reducer";
import { studentReducer, oneStudentReducer } from "./student.reducer";
import courseReducer from "./course.reducer";
import adminActionsReducer from "./adminActions.reducer";
import notify from "./notify.reducer";

const rootReducer = combineReducers({
  adminReducer,
  studentReducer,
  notify,
  courseReducer,
  adminActionsReducer,
  oneStudentReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
