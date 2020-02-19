import React, { useState } from "react";
import { Menu, Popover, Position, Avatar, toaster } from "evergreen-ui";

// import css
import "../css/Header.scss";

function DropDownMenu() {
  return (
    <Popover
      position={Position.BOTTOM_LEFT}
      content={
        <Menu>
          <Menu.Group>
            <Menu.Item onSelect={() => toaster.notify("Move")}>
              Settings
            </Menu.Item>
          </Menu.Group>
          <Menu.Divider />
          <Menu.Group>
            <Menu.Item onSelect={() => toaster.notify("Log out")}>
              Log out
            </Menu.Item>
          </Menu.Group>
        </Menu>
      }
    >
      <Avatar name="Raymond Chen" className="header-drop-down" size={50} />
    </Popover>
  );
}

export function Header(props) {
  return (
    <div id="header">
      <div className="real-header-group">
        <div id="logo">
          <img src={"/assets/images/bcch_logo.png"} height={"100px"} />
        </div>
        <div id="user-buttons-group">
          <div className="button-group">
            {props.isLoggedIn && <DropDownMenu />}
          </div>
        </div>
      </div>
    </div>
  );
}