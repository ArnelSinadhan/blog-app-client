import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Col, Container, Row, Card, Accordion } from "react-bootstrap";
import { format } from "date-fns";
import AddComment from "../components/AddComment";

// Function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, "MMMM d, yyyy"); // Example format: August 6, 2024
};

export default function PostDetails() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/posts/${postId}/getPostDetails`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setPost(data);
      })
      .catch((error) => {
        console.error("Error fetching post details:", error);
      });
  }, [postId]);

  if (!post) {
    return <p>Loading...</p>;
  }

  const handleCommentAdded = () => {
    // Refresh post data to include new comments
    fetch(`${import.meta.env.VITE_API_URL}/posts/${postId}/getPostDetails`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setPost(data))
      .catch((error) => console.error("Error fetching post details:", error));
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col className="mb-5" md={12} lg={8}>
          <Card>
            {post.user.map((user) => (
              <Container className="p-3" key={user.userId}>
                <Container className="d-flex align-items-center">
                  <Container className="userProfile">
                    <img
                      className="img-fluid"
                      src={`${import.meta.env.VITE_API_URL}/users/images/${
                        user.profilePic
                      }`}
                      alt=""
                    />
                  </Container>
                  <Container className="userInfo">
                    <p className="m-0">{user.userName}</p>
                    <p className="m-0">{formatDate(post.createdDate)}</p>
                  </Container>
                </Container>
                <Card.Title className="mt-3 m-0">{post.title}</Card.Title>
                <Card.Text className="m-0">{post.content}</Card.Text>
                <Card.Text>By {post.author}</Card.Text>
              </Container>
            ))}

            {post.image && (
              <Container className="postImgContainer">
                <img
                  src={`${import.meta.env.VITE_API_URL}/posts/images/${
                    post.image
                  }`}
                  alt={post.title}
                  className="img-fluid postImg"
                />
              </Container>
            )}
            <Card.Body>
              <Container className="commentsWrapper">
                <Accordion className="accordion-flush p-xs-0">
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>
                      <Container className="d-flex border-bottom px-lg-4 pb-3 align-items-center justify-content-center">
                        <i className="fa-solid fa-heart"></i>
                        <strong className="accordion-custom-header">
                          {post.comments.length} Comments
                        </strong>
                      </Container>
                    </Accordion.Header>
                    <Accordion.Body>
                      {post.comments.length > 0 ? (
                        post.comments.map((comment, index) => (
                          <div key={index} className="comment">
                            {comment.user.map((user) => (
                              <Container
                                className="d-flex align-items-center"
                                key={user.userId}>
                                <Container className="commentUserImg m-0">
                                  <img
                                    src={`${
                                      import.meta.env.VITE_API_URL
                                    }/users/images/${user.profilePic}`}
                                    alt=""
                                    className="img-fluid"
                                  />
                                </Container>
                                <Container className="commentsBox">
                                  <strong className="m-0">
                                    {user.userName}
                                  </strong>
                                  <p className="m-0">{comment.comment}</p>
                                </Container>
                              </Container>
                            ))}
                          </div>
                        ))
                      ) : (
                        <p>No comments available.</p>
                      )}
                      {/* Adding comment */}
                      <AddComment
                        postId={post._id}
                        onCommentAdded={handleCommentAdded}
                      />
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Container>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
