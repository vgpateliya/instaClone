import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CreatePost = (props) => {
  const navigate = useNavigate();
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (url) {
      fetch("/createpost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ body, photo: url }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            props.toggleAlert(data.error, "danger");
          } else {
            props.toggleAlert(data.message, "success");
            navigate("/");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } // eslint-disable-next-line
  }, [url]);

  const postDetails = () => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "InstagramClone");
    formData.append("cloud_name", "do73zkvlo");
    fetch("https://api.cloudinary.com/v1_1/do73zkvlo/image/upload", {
      method: "post",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.url);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container card">
      <div className=" m-5">
        <form>
          <legend>Create Post</legend>
          <div className="mb-3">
            <label htmlFor="Body" className="form-label">
              Body
            </label>
            <input
              type="text"
              className="form-control"
              id="Body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <input
              type="file"
              className="form-control"
              id="inputGroupFile01"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
          <button
            type="button"
            className="btn btn-outline-primary my-2"
            aria-describedby="signInHelp"
            onClick={postDetails}>
            Upload Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
