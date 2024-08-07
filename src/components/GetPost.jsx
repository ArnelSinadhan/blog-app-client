import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Accordion } from "react-bootstrap";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import AddComment from "./AddComment";
import AddPost from "./AddPost";

// Function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, "MMMM d, yyyy"); // Example format: August 6, 2024
};

export default function GetPost() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate(); // Add this line

  const fetchPosts = () => {
    fetch(`${import.meta.env.VITE_API_URL}/posts/getAllPost`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          console.error("Unexpected response format:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostAdded = () => {
    fetchPosts(); // Refresh posts after adding a new post
  };

  const handleCommentAdded = () => {
    fetchPosts(); // Refresh posts/comments after adding a comment
  };

  const handleImageClick = (postId) => {
    navigate(`/post/${postId}`); // Correct path
  };

  return (
    <>
      <Container>
        <AddPost onPostAdded={handlePostAdded} />
      </Container>

      <Container className="pt-5">
        <Row className="justify-content-center">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Col key={post._id} className="mb-5" md={12} lg={8}>
                <Card>
                  {post.user.map((user) => (
                    <Container className="p-3" key={user.userId}>
                      <Container className="d-flex align-items-center">
                        <Container className="userProfile">
                          <img
                            className="img-fluid"
                            src={`${
                              import.meta.env.VITE_API_URL
                            }/users/images/${user.profilePic}`}
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
                        onClick={() => handleImageClick(post._id)} // Add click handler
                        style={{ cursor: "pointer" }} // Add cursor pointer to indicate clickable image
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
            ))
          ) : (
            <h4 className="text-center mb-5">No posts available.</h4>
          )}
        </Row>
      </Container>
    </>
  );
}
