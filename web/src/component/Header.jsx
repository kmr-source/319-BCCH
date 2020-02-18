import React from "react";
import { Menu, Popover, Position, Avatar, toaster } from "evergreen-ui";

// import css
import "../css/Header.scss";

function DropDownButton(dropDownObj) {
  return (
    <div className="header-drop-down" onClick={dropDownObj.toggle}>
      @Username
    </div>
  );
}

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

export function Header() {
  return (
    <div id="header">
      <div className="real-header-group">
        <div id="logo">
          <img src={"/assets/images/bcch_logo.png"} height={"100px"} />
        </div>
        <div id="user-buttons-group">
          <div className="button-group">
            <DropDownMenu />
          </div>
        </div>
      </div>
    </div>
  );
}
