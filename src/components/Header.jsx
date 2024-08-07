import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { useContext } from "react";
import Swal from "sweetalert2";

export default function Header() {
  const { logout, isAuthenticated } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleHomeClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault(); // Prevent default navigation
      Swal.fire({
        title: "Login Required",
        icon: "info",
        text: "You need to log in to view blogs.",
      }).then(() => {
        navigate("/login"); // Redirect to login page
      });
    }
  };
  return (
    <Navbar expand="lg" className="bg-body-tertiary" sticky="top">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Navbar.Brand as={NavLink} to="/" onClick={handleHomeClick}>
            BlogApp
          </Navbar.Brand>
          <Nav className="ms-auto">
            {!isAuthenticated ? (
              <Nav.Link as={NavLink} to="/login">
                <i className="fa-regular fa-user"></i>Login
              </Nav.Link>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/">
                  Home
                </Nav.Link>
                <Nav.Link as={NavLink} to="/profile">
                  <i className="fa-solid fa-user-tie"></i>Profile
                </Nav.Link>

                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
