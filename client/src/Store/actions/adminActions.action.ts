import Axios from 'axios';
import actionCreator from 'Utils/actionCreator';
import { setNotify } from './notify.action';
import {
  ENROLL_COURSE_FAILURE,
  ENROLL_COURSE_REQUEST,
  ENROLL_COURSE_SUCCESS,
  UNENROLL_COURSE_FAILURE,
  UNENROLL_COURSE_REQUEST,
  UNENROLL_COURSE_SUCCESS
} from 'Store/constants';

export const enrollStudent = (
  { courseId, studentId }: { courseId: string, studentId: string }, action?: () => void, errorAction?: () => void,
) => async (dispatch: any) => {
  dispatch(actionCreator(ENROLL_COURSE_REQUEST));
  try {
    const { data: response } = await Axios.post("/student/enroll", {
      student_id: studentId,
      course_id: courseId
    });
    dispatch(
      actionCreator(ENROLL_COURSE_SUCCESS, {
        ...response.enrolled
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
      dispatch(actionCreator(ENROLL_COURSE_FAILURE, error.response.data));
      dispatch(
        setNotify({
          title: 'Error',
          body: error.response.data.message,
          type: 'error'
        }));
    }
    return dispatch(actionCreator(ENROLL_COURSE_FAILURE, "unable to create a new course at the moment"));
  }
};

export const unenrollStudent = (
  { courseId, studentId }: { courseId: string, studentId: string }, action?: () => void, errorAction?: () => void,
) => async (dispatch: any) => {
  dispatch(actionCreator(UNENROLL_COURSE_REQUEST));
  try {
    const { data: response } = await Axios.delete(`/student/unenroll?student_id=${studentId}&course_id=${courseId}`);
    dispatch(
      actionCreator(UNENROLL_COURSE_SUCCESS, {
        ...response.unenrolled
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
      dispatch(actionCreator(UNENROLL_COURSE_FAILURE, error.response.data));
      dispatch(
        setNotify({
          title: 'Error',
          body: error.response.data.message,
          type: 'error'
        }));
    }
    return dispatch(actionCreator(UNENROLL_COURSE_FAILURE, "unable to unenroll student for course at the moment"));
  }
};
