import React, { useEffect } from "react";
import { useDispatch, useMappedState } from "redux-react-hook";
import { getStudents } from "Store/actions/student.action";
import Spinner from "react-bootstrap/Spinner";
import Header from "Components/Header";
import InfoTable from "Components/Table";
import Footer from "Components/Footer";
import styles from "./style.module.scss";

const tableHeader: Array<string> = [
  "First Name",
  "Last Name",
  "Email",
  "Status",
  "",
];

export default function AllStudents() {
  const dispatch = useDispatch();
  const { students, loading } = useMappedState(
    ({ studentReducer }: any) => studentReducer
  );

  useEffect(() => {
    dispatch(getStudents());
  }, [dispatch]);

  return (
    <>
      <div className={styles.students}>
        <Header
          action="New Student"
          goTo="Courses"
          goToLink="/courses"
          trigger="student"
        />
        <div className={styles.content}>
          <div className={styles.more}>
            <h1 className={styles.heading}>All Students</h1>
            <hr />
          </div>
          {loading && (
            <div className={styles.wraploader}>
              <Spinner className={styles.loader} animation="grow" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            </div>
          )}
          {(students.length || !loading) && (
            <InfoTable
              trigger="student"
              header={tableHeader}
              tableData={students}
            />
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}
