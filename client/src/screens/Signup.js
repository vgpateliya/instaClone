import React, { useEffect, useState } from "react";
// import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Signup = (props) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(""); // eslint-disable-next-line
  const [url, setUrl] = useState(undefined);

  useEffect(() => {
    if (url) {
      signupData();
    } // eslint-disable-next-line
  }, [url]);

  const uploadProfilePic = () => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "InstagramClone");
    formData.append("cloud_name", "do73zkvlo");
    fetch("https://api.cloudinary.com/v1_1/do73zkvlo/image/upload", {
      method: "post",
      body: formData,
    });
  };

  const signupData = () => {
    fetch("/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          props.toggleAlert(data.error, "danger");
        } else {
          props.toggleAlert(data.message, "success");
          navigate("/signin");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSignup = async () => {
    if (image) {
      await uploadProfilePic();

      // const data = { name, email, password };
      // const formData = new FormData();
      // formData.append("profilePic", image);
      // axios
      //   .post("/signup", (data, formData), {
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   })
      //   .then(({ data, formData }) => {
      //     if (data.error) {
      //       props.toggleAlert(data.error, "danger");
      //     } else {
      //       props.toggleAlert(data.message, "success");
      //       navigate("/signin");
      //     }
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
    } else {
      await signupData();
    }
  };

  return (
    <div className="container card">
      <div className="m-4">
        <div className="header mb-3" style={{ fontSize: "3rem" }}>
          Instagram
        </div>
        <form
          encType="multipart/form-data"
          onSubmit={(e) => {
            e.preventDefault();
            handleSignup();
          }}>
          <legend>Create Account</legend>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
          <div className="mb-3">
            <label htmlFor="inputGroupFile01" className="form-label">
              Profile Picture
            </label>
            <input
              type="file"
              name="profilePic"
              className="form-control"
              id="inputGroupFile01"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
          <div className="form-text mb-3" id="signUpHelp">
            Already Have An Account ?
            <Link to="/signin" className="mx-2">
              Click Here
            </Link>
          </div>
          <button
            type="submit"
            className="btn btn-outline-primary my-2"
            aria-describedby="signUpHelp">
            Sign Up To Instagram
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
