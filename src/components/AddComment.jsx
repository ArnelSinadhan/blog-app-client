import { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { Notyf } from "notyf";

export default function AddComment({ postId, onCommentAdded }) {
  const [newComment, setNewComment] = useState("");
  const notyf = new Notyf({
    position: {
      x: "center",
      y: "top",
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/posts/${postId}/addComments`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ comment: newComment }),
        }
      );

      const data = await response.json();
      console.log(data);

      if (data.message === "Comment added successfully") {
        notyf.success("Comment added successfully.");
        setNewComment("");
        if (onCommentAdded) onCommentAdded();
      } else if (data.error === "Admin cannot add comments.") {
        notyf.error("Admin can't add comments");
      } else {
        notyf.error("Error Adding Comment.");
      }
    } catch (error) {
      Swal.fire({
        title: "Internal Error",
        icon: "error",
        text: "An error occurred. Please contact Admin.",
      });
    }
  };

  return (
    <Container className="mt-4">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="d-flex gap-3">
          <Form.Control
            type="text"
            placeholder="Add comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button type="submit">
            <i className="fa-solid fa-paper-plane"></i>
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
}
