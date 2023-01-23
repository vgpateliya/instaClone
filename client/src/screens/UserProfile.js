import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../App";

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState();
  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();
  const [showFollow, setShowFollow] = useState(
    state ? !state.following.includes(userid) : true
  );

  useEffect(() => {
    fetch(`/user/${userid}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setUserProfile(result);
      }); // eslint-disable-next-line
  }, []);

  const followUser = () => {
    fetch("/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ followId: userid }),
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setUserProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data._id],
            },
          };
        });
        setShowFollow(false);
      });
  };

  const unfollowUser = () => {
    fetch("/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ unfollowId: userid }),
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setUserProfile((prevState) => {
          const newFollower = prevState.user.followers.filter(
            (item) => item !== data._id
          );
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollower,
            },
          };
        });
        setShowFollow(true);
      });
  };

  return (
    <>
      {userProfile ? (
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
                src={userProfile.user.profilePic}
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
              <h4>{userProfile.user.name}</h4>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "125%",
                }}>
                <h6>{userProfile.posts.length} Post</h6>
                <h6>{userProfile.user.following.length} Following</h6>
                <h6>{userProfile.user.followers.length} Followers</h6>
              </div>
              {showFollow ? (
                <div
                  className="d-grid mx-auto"
                  style={{ textAlign: "center", marginBottom: "0.75rem" }}>
                  <button
                    type="button"
                    className="btn btn-outline-primary mt-4"
                    onClick={() => {
                      followUser();
                    }}>
                    Follow
                  </button>
                </div>
              ) : (
                <div
                  className="d-grid mx-auto"
                  style={{ textAlign: "center", marginBottom: "0.75rem" }}>
                  <button
                    type="button"
                    className="btn btn-outline-secondary mt-4"
                    onClick={() => {
                      unfollowUser();
                    }}>
                    Unfollow
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="gallery">
            {userProfile.posts?.map((item) => {
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
      ) : (
        <h2>User Profile</h2>
      )}
    </>
  );
};

export default UserProfile;
