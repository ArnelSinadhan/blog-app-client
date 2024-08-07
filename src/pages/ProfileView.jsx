import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import GetUserPost from "../components/GetUserPost";
import AdminView from "../components/AdminView";

export default function ProfileView() {
  const [details, setDetails] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/users/getProfile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        if (data.error === "User not found") {
          Swal.fire({
            title: "Error",
            icon: "error",
            text: "User Not Found",
          });
        } else {
          setDetails(data);
          setIsAdmin(data.isAdmin);
        }
      });
  }, []);

  return (
    <>
      <Container>
        {details && (
          <Row className="justify-content-center">
            <Col lg={12} className=" d-flex my-5">
              <Container className="profileView">
                <img
                  src={`${import.meta.env.VITE_API_URL}/users/images/${
                    details.profilePic
                  }`}
                  alt="Profile Picture"
                  className="img-fluid"
                />
              </Container>
              <Container className="profileViewInfo">
                <h3 className="text-center">{details.userName}</h3>
                <p className="text-center">Email: {details.email}</p>
              </Container>
            </Col>
          </Row>
        )}
      </Container>
      <Container fluid className="profileViewPost">
        <Row>
          <Col lg={12}>{isAdmin ? <AdminView /> : <GetUserPost />}</Col>
        </Row>
      </Container>
    </>
  );
}
