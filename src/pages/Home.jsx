import { Container } from "react-bootstrap";
import GetPost from "../components/GetPost";

export default function Home() {
  return (
    <Container fluid className="home">
      <GetPost />
    </Container>
  );
}
