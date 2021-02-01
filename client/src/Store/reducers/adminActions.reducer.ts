import {
  ENROLL_COURSE_FAILURE,
  ENROLL_COURSE_REQUEST,
  ENROLL_COURSE_SUCCESS,
  UNENROLL_COURSE_FAILURE,
  UNENROLL_COURSE_REQUEST,
  UNENROLL_COURSE_SUCCESS
} from 'Store/constants';

interface AdminProps {
  response: Object;
  loading: boolean;
  error: Object | null;
}

const initialState: AdminProps = {
  response: {},
  loading: false,
  error: null,
}

const adminActionsReducer = (state = initialState, action: any): any => {
  switch (action.type) {
    case ENROLL_COURSE_REQUEST:
    case UNENROLL_COURSE_REQUEST:
      return { ...state, loading: true };
    case ENROLL_COURSE_FAILURE:
    case UNENROLL_COURSE_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case ENROLL_COURSE_SUCCESS:
    case UNENROLL_COURSE_SUCCESS:
      return { ...state, loading: false, error: null, student: action.payload };

    default:
      return state;
  }
}

export default adminActionsReducer;
