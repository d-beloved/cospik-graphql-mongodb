import Axios from 'axios';
import actionCreator from 'Utils/actionCreator';
import { setNotify } from './notify.action';
import {
  GET_ALLSTUDENT_SUCCESS,
  GET_ALLSTUDENT_REQUEST,
  GET_ALLSTUDENT_FAILURE,
  ADD_STUDENT_FAILURE,
  ADD_STUDENT_REQUEST,
  ADD_STUDENT_SUCCESS,
  EDIT_STUDENT_FAILURE,
  EDIT_STUDENT_REQUEST,
  EDIT_STUDENT_SUCCESS,
  GET_STUDENT_REQUEST,
  GET_STUDENT_SUCCESS,
  GET_STUDENT_FAILURE,
} from 'Store/constants';

export const getStudents = (action?: () => void,
  errorAction?: () => void) => async (dispatch: any) => {
    dispatch(actionCreator(GET_ALLSTUDENT_REQUEST));

    try {
      const { data: response } = await Axios.get('/student');
      const { students } = response;
      dispatch(actionCreator(GET_ALLSTUDENT_SUCCESS, students));
    } catch (error) {
      errorAction && errorAction();
      dispatch(actionCreator(GET_ALLSTUDENT_FAILURE, error.response.data));
    }
  };

export const createStudent = (
  { firstname, lastname, email }: { firstname: string; lastname: string; email: string }, action?: () => void, errorAction?: () => void,
) => async (dispatch: any) => {
  dispatch(actionCreator(ADD_STUDENT_REQUEST));
  try {
    const { data: response } = await Axios.post("/student", {
      firstname, lastname, email
    });
    dispatch(
      actionCreator(ADD_STUDENT_SUCCESS, {
        ...response.data
      })
    );
    dispatch(
      setNotify({
        title: 'student',
        body: response.message,
        type: 'success'
      })
    );

    return action && action();
  } catch (error) {
    errorAction && errorAction();
    if (error.response) {
      dispatch(actionCreator(ADD_STUDENT_FAILURE, error.response.data));
      dispatch(
        setNotify({
          title: 'Error',
          body: error.response.data.message,
          type: 'error'
        }));
    }
    return dispatch(actionCreator(ADD_STUDENT_FAILURE, "unable to create a new student at the moment"));
  }
};

export const updateStudent = (
  { firstname, lastname, id }: { firstname: string; lastname: string; id: string }, action?: () => void, errorAction?: () => void,
) => async (dispatch: any) => {
  dispatch(actionCreator(EDIT_STUDENT_REQUEST));
  try {
    const { data: response } = await Axios.put(`/student/${id}`, {
      firstname, lastname
    });
    dispatch(
      actionCreator(EDIT_STUDENT_SUCCESS, {
        ...response.student
      })
    );
    dispatch(
      setNotify({
        title: 'student',
        body: response.message,
        type: 'success'
      })
    );

    return action && action();
  } catch (error) {
    errorAction && errorAction();
    if (error.response) {
      dispatch(actionCreator(EDIT_STUDENT_FAILURE, error.response.data));
      dispatch(
        setNotify({
          title: 'Error',
          body: error.response.data.message,
          type: 'error'
        }));
    }
    return dispatch(actionCreator(EDIT_STUDENT_FAILURE, "unable to update student at the moment"));
  }
};

export const getOneStudent = (
  { id }: { id: string }, action?: () => void, errorAction?: () => void,
) => async (dispatch: any) => {
  dispatch(actionCreator(GET_STUDENT_REQUEST));
  try {
    const { data: response } = await Axios.get(`/student/${id}`);
    const { message, ...rest } = response;
    dispatch(actionCreator(GET_STUDENT_SUCCESS, rest));

    return action && action();
  } catch (error) {
    errorAction && errorAction();
    if (error.response) {
      dispatch(actionCreator(GET_STUDENT_FAILURE, error.response));
      dispatch(
        setNotify({
          title: 'Error',
          body: error.response.data.message,
          type: 'error'
        }));
    }
    return dispatch(actionCreator(GET_STUDENT_FAILURE, "unable to display student at the moment"));
  }
};
