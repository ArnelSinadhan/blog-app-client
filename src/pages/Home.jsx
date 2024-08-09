import { Container } from "react-bootstrap";
import GetPost from "../components/GetPost";
import { UserContext } from "../UserContext";
import { useContext } from "react";
import Login from "../pages/Login";
export default function Home() {
  const { isAuthenticated } = useContext(UserContext);

  return (
    <Container fluid className="home">
      {!isAuthenticated ? <GetPost /> : <Login />}
    </Container>
  );
}
