import React, { useState, useEffect } from "react";
import { useDispatch, useMappedState } from "redux-react-hook";
import { getOneStudent } from "Store/actions/student.action";
import { getCourses } from "Store/actions/course.action";
import { enrollStudent } from "Store/actions/adminActions.action";
import Spinner from "react-bootstrap/Spinner";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Header from "Components/Header";
import Table from "Components/Table";
import Footer from "Components/Footer";
import styles from "./style.module.scss";

const tableHeader: Array<string> = ["Course Name", ""];

interface getOneState {
  studentId: string;
  courseId: string;
  courseName: string;
}

interface Props {
  match: any;
}

export default function OneStudent({ match }: Props) {
  const dispatch = useDispatch();
  const {student, enrolled_courses, loading} = useMappedState(
    ({ oneStudentReducer }: any) => oneStudentReducer);
  const { courses } = useMappedState(
    ({ courseReducer }: any) => courseReducer
  );
  const enroll = useMappedState(
    ({ adminActionsReducer }: any) => adminActionsReducer
  );
  const [state, setState] = useState<getOneState>({
    studentId: "",
    courseId: "",
    courseName: "",
  });

  const [enrollForCourseModal, setEnrollModal] = useState(false);
  const handleEnrollModal = () => {
    setEnrollModal(true);
  }

  const handleCloseEnroll = () => {
    setState({
      ...state,
      courseId: "",
    })
    setEnrollModal(false);
  };

  const setValue = (e: any) =>
  setState({
      ...state,
      [e.target.name]: e.target.value,
    });

  useEffect(() => {
    const id = match.params.id;
    setState({
      ...state,
      studentId: id,
    });
    dispatch(getOneStudent({ id }));
    dispatch(getCourses());
  // eslint-disable-next-line
  }, [dispatch]);

  const enrollCourseAction = (e: any) => {
    e && e.preventDefault();
    dispatch(
      enrollStudent({ ...state }, () => {
        dispatch(getOneStudent({ id: state.studentId }));
        handleCloseEnroll();
      })
    );
  };

  return (
    <>
      <div className={styles.detail}>
        <Header goTo="Students" goToLink="/students" />
        <div className={styles.content}>
          {loading && (
            <div className={styles.wraploader}>
              <Spinner className={styles.loader} animation="grow" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            </div>
          )}
            <>
              {(student.email || !loading) && (
                <div className={styles.top}>
                  <div className={styles.student}>
                    <h1>{`${student.firstname} ${student.lastname}`}</h1>
                    <p>{student.email}</p>
                  </div>
                  <div className={styles.info}>
                    <p className={styles.numb}>
                      {enrolled_courses?.length}
                    </p>
                    <p className={styles.text}>
                      {enrolled_courses?.length > 1
                        ? "ENROLLED COURSES"
                        : "ENROLLED COURSE"}
                    </p>
                  </div>
                </div>
              )}
              <div className={styles.course}>
                <div className={styles.head}>
                  <p className={styles.act}>ACTIVE COURSES</p>
                  <p className={styles.buton} onClick={handleEnrollModal}>
                    Enroll Course
                  </p>
                </div>
                {student && enrolled_courses && (
                  <Table
                    trigger="oneStudent"
                    header={tableHeader}
                    tableData={enrolled_courses}
                    parameter={state.studentId}
                  />
                )}
              </div>
            </>
        </div>
        <Footer />
      </div>

      <Modal
        show={enrollForCourseModal}
        onHide={handleCloseEnroll}
        backdrop="static"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Course For Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Form>
              <Form.Group>
                <Form.Control
                  as="select"
                  size="lg"
                  custom
                  name="courseId"
                  value={state.courseId}
                  onChange={setValue}
                >
                  <option>select...</option>
                  {courses?.map((options: any, i: any) => (
                    <option value={options.course_id}>{options.course_name}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="grey" onClick={handleCloseEnroll}>
            Close
          </Button>
          <Button variant="primary" onClick={enrollCourseAction}
          disabled={(state.courseId === "" || enroll.loading) && true}>
            {enroll.loading ? "Enrolling..." : "Enroll"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
