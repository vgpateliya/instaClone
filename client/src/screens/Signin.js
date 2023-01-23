import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../App";

const Signin = (props) => {
  const { dispatch } = useContext(UserContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignin = async () => {
    await fetch("/signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          props.toggleAlert(data.error, "danger");
        } else {
          props.toggleAlert(data.message, "success");
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({ type: "USER", payload: data.user });
          navigate("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="container card">
      <div className=" m-5">
        <div className="header mb-3" style={{ fontSize: "3rem" }}>
          Instagram
        </div>
        <form>
          <legend>Sign In</legend>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              aria-describedby="emailHelp"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div id="emailHelp" className="form-text">
              We'll never share your email with anyone else.
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-text mb-3" id="signInHelp">
            Don't Have An Account?
            <Link to="/signup" className="mx-2">
              Click Here
            </Link>
          </div>
          <button
            type="button"
            className="btn btn-outline-primary my-2"
            aria-describedby="signInHelp"
            onClick={() => handleSignin()}>
            Sign In To Instagram
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signin;
