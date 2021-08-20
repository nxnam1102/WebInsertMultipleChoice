import React, { useState } from "react";
import { AiFillAppstore, AiFillQuestionCircle } from "react-icons/ai";
import { IoMenu, IoPerson } from "react-icons/io5";
import { RiFileListFill, RiImage2Fill } from "react-icons/ri";
import { FaFileImage } from "react-icons/fa";
import { Menu, MenuItem, ProSidebar } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { Link, useLocation } from "react-router-dom";
import "./index.scss";

const MenuBar = () => {
  //#region ------------hook function------------
  //state
  const [collapse, setCollapse] = useState(
    localStorage.getItem("menu_bar_collapse") === "true" ? true : false
  );
  //locaion
  const { pathname } = useLocation();
  //#endregion
  //#region ------------variable------------
  const menuPath = {
    user: "/user",
    set: "/set",
    category: "/category",
    question: "/question",
  };
  //#endregion
  //#region ------------function------------
  const onCollapse = () => {
    localStorage.setItem("menu_bar_collapse", `${!collapse}`);
    setCollapse(!collapse);
  };
  //#endregion
  return (
    <div className={"menu"}>
      <ProSidebar collapsed={collapse}>
        <Menu popperArrow={true} iconShape="round">
          <MenuItem
            className={"menu-item menu-item-collapse"}
            onClick={onCollapse}
            icon={<IoMenu className={"io5"} />}
          >{`Multiple Choice`}</MenuItem>
          <MenuItem
            className={"menu-item"}
            active={pathname.includes(menuPath.category)}
            icon={<AiFillAppstore className={"io5"} />}
          >
            <Link to={menuPath.category}>{"Danh nục"}</Link>
          </MenuItem>
          <MenuItem
            className={"menu-item"}
            active={pathname.includes(menuPath.set)}
            icon={<RiFileListFill className={"io5"} />}
          >
            <Link to={menuPath.set}>{"Bộ câu hỏi"}</Link>
          </MenuItem>
          <MenuItem
            className={"menu-item"}
            active={pathname.includes(menuPath.question)}
            icon={<AiFillQuestionCircle className={"io5"} />}
          >
            <Link to={menuPath.question}>{"Câu hỏi"}</Link>
          </MenuItem>
          <MenuItem
            className={"menu-item"}
            active={pathname.includes(menuPath.user)}
            icon={<IoPerson className={"io5"} />}
          >
            <Link to={menuPath.user}>{"Người dùng"}</Link>
          </MenuItem>
        </Menu>
      </ProSidebar>
    </div>
  );
};
export default MenuBar;
