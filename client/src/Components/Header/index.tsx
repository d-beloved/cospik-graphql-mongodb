import React, { useState } from "react";
import { useDispatch, useMappedState } from "redux-react-hook";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { logoutAdmin } from "Store/actions/auth.action";
import { createStudent, getStudents } from "Store/actions/student.action";
import { createCourse, getCourses } from "Store/actions/course.action";
import Navbar from "react-bootstrap/Navbar";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import styles from "./style.module.scss";
import logo from "Assets/images/COSPIK.png";

interface Props {
  action?: string;
  goTo: string;
  goToLink: string;
  trigger?: string;
}

interface createDataState {
  firstname: string;
  lastname: string;
  email: string;
}

interface createCourseState {
  courseName: string;
}

export default function Header({ action, goTo, goToLink, trigger }: Props) {
  const [state, setState] = useState<createDataState>({
    firstname: "",
    lastname: "",
    email: "",
  });
  const [addCourse, setAddCourse] = useState<createCourseState>({
    courseName: ""
  });
  const [studentModal, setStudentModal] = useState(false);
  const [courseModal, setCourseModal] = useState(false);
  const dispatch = useDispatch();

  const user = useMappedState(({ adminReducer }: any) => adminReducer);
  const loading = useMappedState(
    ({ studentReducer }: any) => studentReducer
  );
  const courseLoading = useMappedState(
    ({ courseReducer }: any) => courseReducer
  );

  const handleStudentModal = () => setStudentModal(true);
  const handleCloseStudent = () => {
    setState({
      ...state,
      firstname: "",
      lastname: "",
      email: "",
    });
    setStudentModal(false);
  };

  const handleCourseModal = () => setCourseModal(true);
  const handleCloseCourse = () => {
    setAddCourse({
      ...addCourse,
      courseName: ""
    });
    setCourseModal(false);
  };

  const createStudentAction = (e: any) => {
    e && e.preventDefault();
    dispatch(createStudent({ ...state }, () => {
      dispatch(getStudents());
      handleCloseStudent();
    }));
  };

  const createCourseAction = (e: any) => {
    e && e.preventDefault();
    dispatch(createCourse({ ...addCourse }, () => {
      dispatch(getCourses());
      handleCloseCourse();
    }));
  };

  const setValue = (e: any) =>
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });

    const setCourseValue = (e: any) =>
    setAddCourse({
      ...addCourse,
      [e.target.name]: e.target.value,
    });

  const logout = () => {
    dispatch(logoutAdmin());
  };

  return (
    <>
      <Navbar expand="lg" className={styles.head} collapseOnSelect>
        <Navbar.Brand href="/students" className={styles.logo}>
          <img src={logo} alt="logo" />
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className={styles.burger}
        />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            {action ? (
              <Nav.Link
                href="#"
                id={styles.action}
                onClick={
                  trigger === "student" ? handleStudentModal : handleCourseModal
                }
              >
                {action}
              </Nav.Link>
            ) : null}
            <Nav.Link href={goToLink} id={styles.action}>
              {goTo}
            </Nav.Link>
            <Navbar.Text id={styles.user}>{user.user.username}</Navbar.Text>
            {user.isAuthenticated && (
              <Navbar.Text onClick={logout} id={styles.logout}>
                <FontAwesomeIcon icon={faSignOutAlt} size='lg' />
              </Navbar.Text>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* Add new student Modal */}
      <Modal
        show={studentModal}
        onHide={handleCloseStudent}
        backdrop="static"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Form className={styles.form}>
              <Form.Group controlId="fname">
                <Form.Label>Firstname</Form.Label>
                <Form.Control
                  type="text"
                  name="firstname"
                  value={state.firstname}
                  placeholder=""
                  onChange={setValue}
                />
              </Form.Group>

              <Form.Group controlId="lname">
                <Form.Label>Lastname</Form.Label>
                <Form.Control
                  type="text"
                  name="lastname"
                  value={state.lastname}
                  placeholder=""
                  onChange={setValue}
                />
              </Form.Group>

              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={state.email}
                  placeholder=""
                  onChange={setValue}
                />
              </Form.Group>
            </Form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="gray" onClick={handleCloseStudent}>
            Close
          </Button>
          <Button
            variant="primary"
            type="submit"
            onClick={createStudentAction}
            disabled={
              (state.firstname === "" ||
                state.lastname === "" ||
                state.email === "" ||
                loading.loading) &&
              true
            }
          >
            {loading.loading ? "Adding..." : "Add Student"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add new course Modal */}
      <Modal
        show={courseModal}
        onHide={handleCloseCourse}
        backdrop="static"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Form className={styles.form}>
              <Form.Group controlId="courseName">
                <Form.Label>Course Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="enter the course name"
                  name="courseName"
                  value={addCourse.courseName}
                  onChange={setCourseValue}
                />
              </Form.Group>
            </Form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="grey" onClick={handleCloseCourse}>
            Close
          </Button>
          <Button variant="primary" onClick={createCourseAction} disabled={
              (addCourse.courseName === "" ||
                courseLoading.loading) &&
              true
            }>
              {courseLoading.loading ? "Adding..." : "Add Course"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
