import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../App";

const Navbar = () => {
  const { state, dispatch } = useContext(UserContext);
  const renderList = () => {
    if (state) {
      return [
        <li className="nav-item mx-2">
          <Link
            className="nav-link active"
            aria-current="page"
            to="/myfollowing">
            Following
          </Link>
        </li>,
        <li className="nav-item mx-2">
          <Link
            className="nav-link active"
            aria-current="page"
            to="/createpost">
            Add Post
          </Link>
        </li>,
        <li className="nav-item mx-2">
          <Link className="nav-link active" aria-current="page" to="/profile">
            Profile
          </Link>
        </li>,
        <li className="nav-item mx-2">
          <Link
            className="nav-link active"
            aria-current="page"
            to="/signin"
            onClick={() => {
              localStorage.clear();
              dispatch({
                type: "CLEAR",
              });
            }}>
            SignOut
          </Link>
        </li>,
      ];
    } else {
      return [
        <li className="nav-item mx-2">
          <Link className="nav-link active" aria-current="page" to="/signin">
            Signin
          </Link>
        </li>,
      ];
    }
  };
  return (
    <>
      <nav className="navbar sticky-top navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link
            className="mx-4 header navbar-brand float-left"
            to={state ? "/" : "/signin"}
            style={{ fontSize: "1.75rem" }}>
            Instagram
          </Link>
          <div>
            <ul className="navbar-nav mr-5 ml-auto">{renderList()}</ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
