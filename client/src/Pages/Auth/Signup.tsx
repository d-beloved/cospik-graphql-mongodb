import React, { useState, useEffect } from "react";
import { useHistory, Link } from 'react-router-dom';
import { useDispatch, useMappedState } from "redux-react-hook";
import { registerAdmin } from "Store/actions/auth.action";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import styles from './auth.module.scss';
import logo from 'Assets/images/COSPIK.png'

interface SignupState {
  username: string;
  password: string;
}

export default function Signup() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [state, setState] = useState<SignupState>({
    username: "",
    password: "",
  });
  const { loading, isAuthenticated } = useMappedState(({ adminReducer }: any) => adminReducer);

  const signUpAction = (e: any) => {
    e && e.preventDefault();
    dispatch(
      registerAdmin({ ...state }, () =>
        history.push("/students")
      )
    );
  };

  const setValue = (e: any) =>
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });

  useEffect(() => {
    isAuthenticated && history.push("/students");
  }, [isAuthenticated, history]);

  return (
    <div className={styles.auth}>
      <p className={styles.welcome}>
        Welcome to{" "}
        <span className={styles.logo}>
          <img src={logo} alt="logo" />
        </span>
      </p>
      <Form className={styles.form}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={state.username}
            placeholder="Enter username"
            onChange={setValue}
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={state.password}
            placeholder="Password"
            onChange={setValue}
          />
        </Form.Group>

        <Form.Text className={styles.textShow}>
          Have an account? <Link to="/login">Login here</Link>
        </Form.Text>

        <Button
          variant="primary"
          type="submit"
          block
          onClick={signUpAction}
          disabled={
            (state.username === "" || state.password === "" || loading) && true
          }
        >
          {loading ? "Loading..." : "Signup"}
        </Button>
      </Form>
    </div>
  );
}
