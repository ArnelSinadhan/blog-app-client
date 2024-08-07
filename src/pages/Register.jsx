import { useState } from "react";
import { Col, Container, Row, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Register() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const registerUser = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("email", email);
    formData.append("password", password);
    if (file) {
      formData.append("file", file);
    }

    fetch(`${import.meta.env.VITE_API_URL}/users/register`, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Registered Successfully") {
          setUserName("");
          setEmail("");
          setPassword("");
          setFile("");

          Swal.fire({
            title: "Success!",
            icon: "success",
            text: "Registered Successfully",
          });

          // Optionally navigate to another page after successful registration
          navigate("/login");
        } else {
          Swal.fire({
            title: "Error!",
            icon: "error",
            text: "Registration Failed. Check All Fields!",
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          title: "Server Error!",
          icon: "error",
          text: "An error occurred. Please contact admin!",
        });
      });
  };

  return (
    <Container fluid className="registerWrapper">
      <Row className="justify-content-center align-items-center registerRow">
        <Col md={6} lg={6}>
          <h2 className="text-center my-5 registerTitle">Register</h2>
          <Form onSubmit={registerUser} className="regForm">
            <Form.Group className="mb-lg-3">
              <Form.Label>Profile Picture</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </Form.Group>

            <Form.Group className="mb-lg-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-lg-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-lg-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <div className="registerBtnBox mt-5 d-flex justify-content-center">
              <Button variant="primary" type="submit" className="regBtn">
                Register
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
