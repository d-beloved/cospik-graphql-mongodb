import React, { useEffect } from "react";
import { useDispatch, useMappedState } from "redux-react-hook";
import Spinner from "react-bootstrap/Spinner";
import { getCourses } from "Store/actions/course.action";
import Header from "Components/Header";
import InfoTable from "Components/Table";
import Footer from "Components/Footer";
import styles from "../Student/AllStudents/style.module.scss";

const tableHeader: Array<string> = [
"Course Name",
"",
];

export default function AllStudents() {
  const dispatch = useDispatch();
  const {courses, loading} = useMappedState(({ courseReducer }: any) => courseReducer);

  useEffect(() => {
    dispatch(getCourses());
  }, [dispatch]);

  return (
    <>
      <div className={styles.students}>
        <Header
          action="New Course"
          goTo="Students"
          goToLink="/students"
          trigger="course"
        />
        <div className={styles.content}>
          <div className={styles.more}>
            <h1 className={styles.heading}>All Courses</h1>
            <hr />
          </div>
          {loading && (
            <div className={styles.wraploader}>
              <Spinner className={styles.loader} animation="grow" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            </div>
          )}{" "}
          {(courses.length || !loading) && (
            <div id={styles.around}>
              <InfoTable
                trigger="course"
                header={tableHeader}
                tableData={courses}
              />
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}
