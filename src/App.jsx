import { UserProvider, UserContext } from "./UserContext";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Header from "./components/Header";
import Register from "./pages/Register";
import ProfileView from "./pages/ProfileView";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PostDetails from "./pages/PostDetails";

function App() {
  return (
    <UserProvider>
      <Router basename="/">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ProfileView />} />
          <Route path="/post/:postId" element={<PostDetails />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
