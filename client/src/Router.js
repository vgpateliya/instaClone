import React, { useContext, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { UserContext } from "./App";
import Alert from "./components/Alert";
import Navbar from "./components/Navbar";
import CreatePost from "./screens/CreatePost";
import FollowingUserPost from "./screens/FollowingUserPost";
import Home from "./screens/Home";
import Profile from "./screens/Profile";
import Signin from "./screens/Signin";
import Signup from "./screens/Signup";
import UserProfile from "./screens/UserProfile";

const Router = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(UserContext);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
    } else {
      navigate("/signin");
    } // eslint-disable-next-line
  }, []);

  const toggleAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  };
  return (
    <>
      <Navbar />
      <Alert alert={alert} />
      <Routes>
        <Route exact path="/" element={<Home toggleAlert={toggleAlert} />} />
        <Route
          exact
          path="/myfollowing"
          element={<FollowingUserPost toggleAlert={toggleAlert} />}
        />
        <Route
          exact
          path="/signin"
          element={<Signin toggleAlert={toggleAlert} />}
        />
        <Route
          exact
          path="/signup"
          element={<Signup toggleAlert={toggleAlert} />}
        />
        <Route
          exact
          path="/profile"
          element={<Profile toggleAlert={toggleAlert} />}
        />
        <Route
          exact
          path="/profile/:userid"
          element={<UserProfile toggleAlert={toggleAlert} />}
        />
        <Route
          exact
          path="/createpost"
          element={<CreatePost toggleAlert={toggleAlert} />}
        />
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </>
  );
};

export default Router;
