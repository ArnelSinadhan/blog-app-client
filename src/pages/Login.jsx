import { useContext, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { UserContext } from "../UserContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  const loginUser = (e) => {
    e.preventDefault();

    fetch(`${import.meta.env.VITE_API_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error === "Invalid Email") {
          Swal.fire({
            title: "Error",
            icon: "error",
            text: "Invalid Email",
          });
        } else if (data.error === "No email found") {
          Swal.fire({
            title: "Error",
            icon: "error",
            text: "No email found",
          });
        } else if (data.message === "Email and password do not match") {
          Swal.fire({
            title: "Error",
            icon: "error",
            text: "Email and password do not match",
          });
        } else {
          console.log(data.access);
          login(data.access);
          setEmail("");
          setPassword("");
          Swal.fire({
            title: "Success",
            icon: "success",
            text: "Login successful",
          });
          navigate("/");
        }
      })
      .catch((error) => {
        Swal.fire({
          title: "Error",
          icon: "error",
          text: "An error occurred. Please contact administrator.",
        });
      });
  };

  return (
    <Container className="loginContainer">
      <Row className="justify-content-center align-items-center loginRow">
        <Col
          md={7}
          className="d-flex flex-column justify-content-center align-items-center">
          <h2 className="text-center mb-4 loginTitle">BlogApp</h2>
          <p className="text-center mb-lg-5 mb-3 loginSubtitle">
            Blog with friends and have fun with BlogApp
          </p>
        </Col>
        <Col md={5}>
          <h2 className="text-center mb-lg-5 mb-3 loginTitle">
            Login to BlogApp
          </h2>
          <Form onSubmit={loginUser}>
            <Form.Group className="my-lg-5 my-2">
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="my-lg-5 my-2">
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <div className="d-grid gap-2">
              <Button variant="primary" type="submit" className="my-lg-5">
                Log In
              </Button>
              <hr />
              <NavLink to="/register" className="text-center createAccountBtn">
                Create Account
              </NavLink>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
