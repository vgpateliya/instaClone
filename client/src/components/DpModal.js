import React, { useContext, useEffect, useRef, useState } from "react";
import { Modal } from "bootstrap";
import { UserContext } from "../App";

const DpModal = () => {
  const [image, setImage] = useState("");
  const { state, dispatch } = useContext(UserContext);
  const modalRef = useRef();
  const showModal = () => {
    const modalEle = modalRef.current;
    const bsModal = new Modal(modalEle, {
      backdrop: "static",
      keyboard: false,
    });
    bsModal.show();
  };

  const hideModal = () => {
    const modalEle = modalRef.current;
    const bsModal = Modal.getInstance(modalEle);
    bsModal.hide();
  };

  useEffect(() => {
    if (image) {
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
          fetch("/updatepic", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
            body: JSON.stringify({ profilePic: data.url }),
          })
            .then((res) => res.json())
            .then((result) => {
              localStorage.setItem(
                "user",
                JSON.stringify({ ...state, profilePic: result.profilePic })
              );
              dispatch({ type: "UPDATEPIC", payload: result.profilePic });
            });
        })
        .catch((err) => console.log(err));
    } // eslint-disable-next-line
  }, [image]);

  const uploadProfilePic = (file) => {
    setImage(file);
  };

  return (
    <>
      <div>
        <div
          className="d-grid mx-auto"
          style={{ textAlign: "center", marginBottom: "0.75rem" }}>
          <button
            type="button"
            className="btn btn-outline-secondary mt-4"
            onClick={showModal}>
            Edit Profile
          </button>
        </div>
        <div className="modal fade" ref={modalRef} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="btn-close"
                  onClick={hideModal}
                  aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="inputGroupFile01" className="form-label">
                    Profile Picture
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="inputGroupFile01"
                    onChange={(e) => uploadProfilePic(e.target.files[0])}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={hideModal}>
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DpModal;
