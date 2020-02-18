import React from "react";
import { Menu, Popover, Position, Avatar, Button } from "evergreen-ui";

// import css
import "../css/DashboardUser.scss";

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
            <Menu.Item onSelect={() => toaster.notify("Share")}>
              Share...
            </Menu.Item>
            <Menu.Item onSelect={() => toaster.notify("Move")}>
              Move...
            </Menu.Item>
            <Menu.Item
              onSelect={() => toaster.notify("Rename")}
              secondaryText="⌘R"
            >
              Rename...
            </Menu.Item>
          </Menu.Group>
          <Menu.Divider />
          <Menu.Group>
            <Menu.Item
              onSelect={() => toaster.danger("Delete")}
              intent="danger"
            >
              Delete...
            </Menu.Item>
          </Menu.Group>
        </Menu>
      }
    >
      <Avatar name="Raymond Chen" className="header-drop-down" size={50} />
    </Popover>
  );
}

function UploadIcon() {
  return (
    <Button
      is="a"
      href="#"
      marginRight={16}
      iconBefore="arrow-up"
      appearance="primary"
      intent="success"
    >
      UPLOAD
    </Button>
  );
}

export function DashboardUser() {
  return (
    <div id="dash-board-user-container">
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
      <div id="container">
        <div className="left-container">
          <p>Hello,</p>
          <div id="username">@Raymond Chen</div>
          <UploadIcon />
        </div>
        <div className="vertical-line">
          <hr />
        </div>
        <div className="right-container">
          <div id="name-container">Name:</div>
          <div id="real-name">Raymond Chen</div>
          <hr />
          <div id="gender-container">Gender:</div>
          <div id="real-gender">Male</div>
          <hr />
          <div id="dob-container">Date of Birth:</div>
          <div id="real-dob">1997/01/19</div>
          <hr />
        </div>
      </div>
    </div>
  );
}
