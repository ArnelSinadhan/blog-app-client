import Swal from "sweetalert2";

export default function DeleteUserPost({ postId, onPostDeleted }) {
  const handleDeletePost = () => {
    fetch(`${import.meta.env.VITE_API_URL}/posts/deleteUserPost/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        if (data.message === "Post deleted successfully") {
          Swal.fire({
            title: "Success!",
            icon: "success",
            text: "Post deleted successfully",
          });
          onPostDeleted(postId);
        } else {
          Swal.fire({
            title: "Error!",
            icon: "error",
            text: "Failed to delete post",
          });
        }
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
      });
  };
  return (
    <i
      className="fa-solid fa-circle-xmark"
      title="Delete Post"
      onClick={handleDeletePost}></i>
  );
}
