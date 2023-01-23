import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import DpModal from "../components/DpModal";

const Profile = () => {
  const [myPics, setMyPics] = useState([]); // eslint-disable-next-line
  const [mounted, setMounted] = useState(true);
  const { state } = useContext(UserContext);

  useEffect(() => {
    fetch("/mypost", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setMyPics(result.mypost);
      });
  }, []);

  return (
    <>
      <div style={{ maxWidth: "46.75rem", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            margin: "1rem 0",
            borderBottom: "1px solid grey",
          }}>
          <div>
            <img
              src={state ? state.profilePic : "No Profile Image"}
              alt="ProfilePic"
              style={{
                width: "10rem",
                height: "10rem",
                borderRadius: "5rem",
                marginBottom: "1rem",
              }}
            />
          </div>
          <div>
            <h4>{state ? state.name : "Username"}</h4>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "125%",
              }}>
              <h6>{myPics.length} Post</h6>
              <h6>{state ? state.following.length : ""} Following</h6>
              <h6>{state ? state.followers.length : ""} Followers</h6>
            </div>
            {mounted && <DpModal />}
          </div>
        </div>
        <div className="gallery">
          {myPics?.map((item) => {
            return (
              <img
                key={item._id}
                src={item.photo}
                alt={item.title}
                className="item"
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Profile;
