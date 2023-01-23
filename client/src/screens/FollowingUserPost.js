import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../App";

const FollowingUserPost = () => {
  const [data, setData] = useState([]);
  const { state } = useContext(UserContext);

  useEffect(() => {
    fetch("/getfollowposts", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        setData(result.posts);
      });
  }, []);

  const likePost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ postId: id }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        const newData = data?.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      });
  };

  const unlikePost = (id) => {
    fetch("unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ postId: id }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        const newData = data?.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      });
  };

  const makeComment = (text, postId) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ text, postId }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        const newData = data?.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      });
  };

  const deletePost = (postId) => {
    fetch(`/deletepost/${postId}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.filter((item) => {
          return item._id !== result._id;
        });
        setData(newData);
      });
  };

  const deleteComment = (commentId) => {
    fetch(`/deletecomment/${commentId}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.filter((item) => {
          return item._id !== result._id;
        });
        setData(newData);
      });
  };

  return (
    <div className="home">
      {data?.map((item) => {
        return (
          <div className="card home-card my-3" key={item._id}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}>
              <Link
                style={{ textDecoration: "none", color: "black" }}
                to={
                  item.postedBy._id === state._id
                    ? "/profile"
                    : "/profile/" + item.postedBy._id
                }>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                  }}>
                  <img
                    className="ms-5 my-2 me-2"
                    src={item.postedBy.profilePic}
                    alt="ProfilePic"
                    style={{
                      width: "1.9rem",
                      height: "1.9rem",
                      borderRadius: "0.95rem",
                    }}
                  />
                  <h5 className="my-2">{item.postedBy.name}</h5>
                </div>
              </Link>
              {item.postedBy._id === state._id && (
                <i
                  className="material-icons my-2"
                  style={{
                    fontSize: "1.75rem",
                    color: "black",
                    paddingRight: "2.75rem",
                  }}
                  onClick={() => {
                    deletePost(item._id);
                  }}>
                  delete
                </i>
              )}
            </div>
            <div
              className="card-image"
              style={{
                alignItems: "center",
                display: "flex",
                justifyContent: "space-around",
              }}>
              <img
                className="homeImage"
                src={item.photo}
                alt="{photo}"
                style={{ maxWidth: "40.5rem", maxHeight: "auto" }}
              />
            </div>
            <div className="card-content">
              <div
                className="my-2"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    width: "25%",
                    paddingLeft: "2.75rem",
                  }}>
                  {item.likes.includes(state._id) ? (
                    <i
                      className="material-icons my-1 mx-3"
                      style={{
                        fontSize: "1.75rem",
                        color: "red",
                      }}
                      onClick={() => {
                        unlikePost(item._id);
                      }}>
                      favorite
                    </i>
                  ) : (
                    <i
                      className="material-icons my-1 mx-3"
                      style={{
                        fontSize: "1.75rem",
                        color: "black",
                      }}
                      onClick={() => {
                        likePost(item._id);
                      }}>
                      favorite_border
                    </i>
                  )}
                  <i
                    className="material-icons my-1 mx-3"
                    style={{
                      fontSize: "1.75rem",
                      color: "black",
                    }}>
                    send
                  </i>
                </div>
                <i
                  className="material-icons my-1 mx-3"
                  style={{
                    paddingRight: "2.75rem",
                    fontSize: "1.75rem",
                    color: "black",
                  }}>
                  bookmark_border
                </i>
              </div>
              <h6 className="my-2 mx-5">{item.likes.length} Likes</h6>
              <div
                className="mt-2 mx-5"
                style={{ display: "flex", borderBottom: "1px solid black" }}>
                <Link
                  style={{
                    display: "flex",
                    textDecoration: "none",
                    color: "black",
                  }}
                  to={
                    item.postedBy._id === state._id
                      ? "/profile"
                      : "/profile/" + item.postedBy._id
                  }>
                  <img
                    className="me-1 mt-1"
                    src={item.postedBy.profilePic}
                    alt="ProfilePic"
                    style={{
                      width: "1.2rem",
                      height: "1.2rem",
                      borderRadius: "0.6rem",
                    }}
                  />
                  <p className="me-2" style={{ fontWeight: "bold" }}>
                    {item.postedBy.name}
                  </p>
                </Link>
                <p>{item.body}</p>
              </div>
              <div style={{ color: "rgba( 0, 0, 0, 0.8)" }}>
                {item.comments?.map((record) => {
                  return (
                    <div
                      className="mx-5"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "86%",
                      }}
                      key={record._id}>
                      <div style={{ display: "flex" }}>
                        <Link
                          style={{
                            display: "flex",
                            textDecoration: "none",
                            color: "black",
                          }}
                          to={
                            record.postedBy._id === state._id
                              ? "/profile"
                              : "/profile/" + record.postedBy._id
                          }>
                          <img
                            className="me-1 mt-2"
                            src={record.postedBy.profilePic}
                            alt="ProfilePic"
                            style={{
                              width: "1.2rem",
                              height: "1.2rem",
                              borderRadius: "0.6rem",
                            }}
                          />
                          <p
                            className="me-2 mt-1"
                            style={{ fontWeight: "bold" }}>
                            {record.postedBy.name}
                          </p>
                        </Link>
                        <p className="mt-1">{record.text}</p>
                      </div>
                      {record.postedBy._id === state._id && (
                        <i
                          className="material-icons mt-2"
                          style={{
                            fontSize: "1.2rem",
                            color: "black",
                          }}
                          onClick={() => {
                            deleteComment(record._id);
                          }}>
                          delete_sweep
                        </i>
                      )}
                    </div>
                  );
                })}
                <form
                  style={{ maxWidth: "40.5rem" }}
                  className="ms-5 mb-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (e.target[0].value === "") {
                      return;
                    } else {
                      makeComment(e.target[0].value, item._id);
                    }
                  }}>
                  <input
                    type="text"
                    className="form-control comment"
                    style={{ borderRadius: "0" }}
                    placeholder="Add Comments"
                  />
                </form>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FollowingUserPost;
