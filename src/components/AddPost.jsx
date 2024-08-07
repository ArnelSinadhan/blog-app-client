import { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Row, Modal, Form } from "react-bootstrap";
import { UserContext } from "../UserContext";
import Swal from "sweetalert2";
import { Notyf } from "notyf";
import { useNavigate } from "react-router-dom";

export default function AddPost({ onPostAdded }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [file, setFile] = useState(null);
  const [show, setShow] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const { user, isAuthenticated } = useContext(UserContext); // Include isAuthenticated
  const navigate = useNavigate();
  const notyf = new Notyf({
    position: {
      x: "center",
      y: "top",
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("author", author);
    if (file) {
      formData.append("file", file);
    }

    fetch(`${import.meta.env.VITE_API_URL}/posts/addPost`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.message === "Post added successfully") {
          setTitle("");
          setContent("");
          setAuthor("");
          setFile(null);
          setShow(false);
          notyf.success("Post added successfully");
          onPostAdded(); // Notify parent to refresh posts
          navigate("/");
        } else {
          notyf.error("Error adding post");
        }
      })
      .catch((error) => {
        Swal.fire({
          title: "Internal Error",
          icon: "error",
          text: "An error occurred. Please contact Admin.",
        });
      });
  };

  useEffect(() => {
    if (title !== "" && content !== "" && author !== "" && file !== null) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [title, content, author, file]);

  if (!isAuthenticated) {
    // Handle unauthenticated state if needed
    return null; // or redirect to login
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col lg={8} md={12}>
          <Container className="addPostWrapper">
            <Container className="addPostProfile">
              {/* Ensure user is available before accessing profilePic */}
              {user ? (
                <img
                  src={`${import.meta.env.VITE_API_URL}/users/images/${
                    user.profilePic
                  }`}
                  alt="profile picture"
                  className="img-fluid"
                />
              ) : (
                <div>Loading...</div> // or a placeholder image
              )}
            </Container>
            <Button className="addPostBtn" onClick={() => setShow(true)}>
              Add post
            </Button>
          </Container>
        </Col>
      </Row>
      {/* Modal */}
      <Modal
        show={show}
        onHide={() => setShow(false)}
        className="modalBg"
        centered
        size="md">
        <Modal.Header closeButton>
          <Modal.Title>Add New Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter post content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Author</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter author name"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </Form.Group>
            {isActive ? (
              <Button
                type="submit"
                variant="primary"
                className="my-4 addPostSubmit">
                Add Post
              </Button>
            ) : (
              <Button
                type="submit"
                variant="secondary"
                disabled
                className="my-4 addPostSubmit2">
                Add Post
              </Button>
            )}
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
