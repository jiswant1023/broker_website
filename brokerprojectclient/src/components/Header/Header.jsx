import React from "react";
import "./Header.css";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Header() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="header_container">
      <Link to="/">
        <div className="header_container_name">
          <h2 id="sahand">Sahand</h2>
          <h2 id="estate">Estate</h2>
        </div>
      </Link>

      <form className="header_container_search">
        <input
          id="header_container_search_input"
          type="text"
          placeholder="Search ...."
        />
        <FaSearch className="search-icon"></FaSearch>
      </form>
      <div className="header_name_button">
        <Link to="/">
          <button>Home</button>
        </Link>
        <Link to="/about">
          <button>About</button>
        </Link>

        <Link to="/profile">
          {currentUser ? (
            <img src={currentUser.rest.avatar} alt="profile" />
          ) : (
            <button style={{ color: "rgb(74, 65, 74)", fontWeight: "700" }}>
              Sign In
            </button> // Render sign-in button if not logged in
          )}
        </Link>
      </div>
    </div>
  );
}

export default Header;
