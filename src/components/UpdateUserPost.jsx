import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";

export default function UpdateUserPost({
  postId,
  currentTitle,
  currentContent,
  currentAuthor,
  onUpdate,
}) {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState(currentTitle);
  const [content, setContent] = useState(currentContent);
  const [author, setAuthor] = useState(currentAuthor);
  const [image, setImage] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("author", author);
    if (image) formData.append("file", image);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/posts/updateUserPost/${postId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      const data = await response.json();
      if (data.message === "Post updated successfully") {
        Swal.fire({
          title: "Success!",
          icon: "success",
          text: "Post updated successfully",
        });
        onUpdate(); // Call onUpdate to refresh the post list or data
        handleClose();
      } else {
        Swal.fire({
          title: "Error!",
          icon: "error",
          text: "Failed to update post",
        });
      }
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  return (
    <>
      <i
        className="fa-solid fa-file-pen"
        onClick={handleShow}
        style={{ cursor: "pointer" }}></i>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formContent">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formAuthor">
              <Form.Label>Author</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formImage">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Update Post
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
