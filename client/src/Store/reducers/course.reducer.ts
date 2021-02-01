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

interface CourseProps {
  courses: Object[];
  loading: boolean;
  error: Object | null;
}

const initialState: CourseProps = {
  courses: [],
  loading: false,
  error: null,
}

const courseReducer = (state = initialState, action: any): any => {
  switch (action.type) {
    case GET_ALLCOURSES_REQUEST:
    case ADD_COURSE_REQUEST:
    case DELETE_COURSE_REQUEST:
      return { ...state, loading: true };
    case GET_ALLCOURSES_FAILURE:
    case ADD_COURSE_FAILURE:
    case DELETE_COURSE_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case GET_ALLCOURSES_SUCCESS:
      return { ...state, loading: false, error: null, courses: action.payload };
    case ADD_COURSE_SUCCESS:
    case DELETE_COURSE_SUCCESS:
      return { ...state, loading: false, error: null};

    default:
      return state;
  }
}

export default courseReducer;
