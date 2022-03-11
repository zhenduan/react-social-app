import { Button, TextField } from "@material-ui/core";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, logout } from "../firebase";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import ExitToAppOutlinedIcon from "@material-ui/icons/ExitToAppOutlined";

import { Link } from "react-router-dom";

function Header() {
  const [user, loading, error] = useAuthState(auth);
  return (
    <header>
      <div className="header__container">
        <Link to="/">My Social App</Link>

        <div className="header__navLinks">
          {/* search box */}
          <div class="header__searchBoxContainer header__mr">
            <TextField label="Search" />
            <SearchOutlinedIcon />
          </div>
          {user && !loading && (
            <Link to="/create-post" className="header__mr">
              <Button variant="contained">Create</Button>
            </Link>
          )}
          {!user && !loading && (
            <Link to="/login">
              {" "}
              <Button>Sign In</Button>
            </Link>
          )}{" "}
          {user && !loading && (
            <p className="header__mr">Hi {user.displayName}</p>
          )}
          {user && !loading && <ExitToAppOutlinedIcon onClick={logout} />}
        </div>
      </div>
    </header>
  );
}

export default Header;
