import Axios from 'axios';
import actionCreator from 'Utils/actionCreator';
import { setNotify } from './notify.action';
import {
  ADD_COURSE_FAILURE,
  ADD_COURSE_REQUEST,
  ADD_COURSE_SUCCESS,
  GET_ALLCOURSES_FAILURE,
  GET_ALLCOURSES_REQUEST,
  GET_ALLCOURSES_SUCCESS,
  DELETE_COURSE_FAILURE,
  DELETE_COURSE_REQUEST,
  DELETE_COURSE_SUCCESS
} from 'Store/constants';

export const getCourses = (action?: () => void,
  errorAction?: () => void) => async (dispatch: any) => {
    dispatch(actionCreator(GET_ALLCOURSES_REQUEST));

    try {
      const { data: response } = await Axios.get('/course');
      const { courses } = response;
      dispatch(actionCreator(GET_ALLCOURSES_SUCCESS, courses));
    } catch (error) {
      errorAction && errorAction();
      dispatch(actionCreator(GET_ALLCOURSES_FAILURE, error.response.data));
    }
  };

export const createCourse = (
  { courseName }: { courseName: string }, action?: () => void, errorAction?: () => void,
) => async (dispatch: any) => {
  dispatch(actionCreator(ADD_COURSE_REQUEST));
  try {
    const { data: response } = await Axios.post("/course", {
      course_name: courseName
    });
    dispatch(
      actionCreator(ADD_COURSE_SUCCESS, {
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
      dispatch(actionCreator(ADD_COURSE_FAILURE, error.response.data));
      dispatch(
        setNotify({
          title: 'Error',
          body: error.response.data.message,
          type: 'error'
        }));
    }
    return dispatch(actionCreator(ADD_COURSE_FAILURE, "unable to create a new course at the moment"));
  }
};

export const deleteCourse = (
  { id }: { id: string }, action?: () => void, errorAction?: () => void,
) => async (dispatch: any) => {
  dispatch(actionCreator(DELETE_COURSE_REQUEST));
  try {
    const { data: response } = await Axios.delete(`/course/${id}`);
    dispatch(
      actionCreator(DELETE_COURSE_SUCCESS, {
        ...response.deleted
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
      dispatch(actionCreator(DELETE_COURSE_FAILURE, error.response.data));
      dispatch(
        setNotify({
          title: 'Error',
          body: error.response.data.message,
          type: 'error'
        }));
    }
    return dispatch(actionCreator(DELETE_COURSE_FAILURE, "unable to delete course at the moment"));
  }
};
