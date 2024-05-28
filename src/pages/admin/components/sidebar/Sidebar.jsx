import { useState } from "react";
import "./sidebar.css";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../../../theme";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { useSelector } from "react-redux";
import { userDataSelector } from "../../../../store/sellectors";
import Admin from "../../../../assets/admin.png";
import { AccountCircleOutlined } from "@mui/icons-material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import RedeemIcon from "@mui/icons-material/Redeem";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import WalletOutlinedIcon from "@mui/icons-material/WalletOutlined";
import { useEffect } from "react";
import BarChartIcon from "@mui/icons-material/BarChart";
import { StyledSidebar } from "../../../../components/styledSidebar/styledSidebar";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import PersonalVideoIcon from "@mui/icons-material/PersonalVideo";

const Item = ({ title, to, icon, selected, setSelected }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <MenuItem
            active={selected === title}
            style={{
                color: colors.grey[100],
            }}
            onClick={() => setSelected(title)}
            icon={icon}
        >
            <Typography>{title}</Typography>
            <Link to={to} />
        </MenuItem>
    );
};

const Sidebar = (props) => {
    const userData = useSelector(userDataSelector);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    let isCollapsed = props.isCollapsed;
    let setIsCollapsed = props.setIsCollapsed;
    const [selected, setSelected] = useState("Thu Nhập");
    const [open, setOpen] = useState(true);

    const handleClick = () => {
        setOpen(!open);
    };
    const url = new URL(window.location.href);
    const pathName = url.pathname;
    const parts = pathName?.split("/");
    const locationValue = parts[parts.length - 1];

    useEffect(() => {
        if (locationValue === "item") {
            setSelected("Quà Tặng");
        } else if (locationValue === "package") {
            setSelected("Gói Đăng Ký");
        } else if (
            locationValue === "admin" ||
            locationValue === "dashboardDetail"
        ) {
            setSelected("Thu Nhập");
        } else if (locationValue === "shop") {
            setSelected("Cửa Hàng");
        } else if (locationValue === "account") {
            setSelected("Tài Khoản");
        } else if (locationValue === "wallet") {
            setSelected("Ví Và Giao Dịch");
        } else if (locationValue === "report") {
            setSelected("Báo Cáo");
        }
    }, [locationValue]);

    return (
        <div className="adminSidebar">
            <Box sx={StyledSidebar}>
                <ProSidebar
                    collapsed={isCollapsed}
                    style={{
                        zIndex: 1,
                    }}
                >
                    <Menu iconShape="square">
                        <MenuItem
                            icon={
                                <IconButton
                                    onClick={() => setIsCollapsed(!isCollapsed)}
                                >
                                    <MenuOutlinedIcon fontSize="large" />
                                </IconButton>
                            }
                        ></MenuItem>
                        {!isCollapsed && (
                            <div className="box">
                                <img
                                    alt="profile-user"
                                    width="50px"
                                    height="50px"
                                    src={Admin}
                                    style={{
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                    }}
                                />
                                <Typography
                                    variant="h5"
                                    color={colors.grey[100]}
                                    fontWeight="bold"
                                >
                                    {userData.role}
                                </Typography>
                            </div>
                        )}
                        <Box>
                            <Typography
                                variant="h6"
                                color={colors.grey[300]}
                                sx={{ m: "15px 0 5px 20px" }}
                            >
                                Thống Kê
                            </Typography>
                            <Item
                                title="Thu Nhập"
                                to=""
                                icon={<BarChartIcon />}
                                selected={selected}
                                setSelected={setSelected}
                            />
                            <Divider />
                            <Typography
                                variant="h6"
                                color={colors.grey[300]}
                                sx={{ m: "15px 0 5px 20px" }}
                            >
                                Quản Lý
                            </Typography>
                            <List>
                                <ListItemButton onClick={handleClick}>
                                    {!isCollapsed && (
                                        <PersonalVideoIcon
                                            style={{
                                                marginLeft: "10px",
                                                marginRight: "19px",
                                                color: "white",
                                            }}
                                        />
                                    )}
                                    {!isCollapsed && (
                                        <ListItemText
                                            primary="Hệ Thống"
                                            style={{
                                                color: "white",
                                            }}
                                        />
                                    )}
                                    {open ? (
                                        <ExpandLess
                                            style={{
                                                marginLeft: "10px",
                                                color: "white",
                                            }}
                                        />
                                    ) : (
                                        <ExpandMore
                                            style={{
                                                marginLeft: "10px",
                                                color: "white",
                                            }}
                                        />
                                    )}
                                </ListItemButton>
                                <Collapse
                                    in={open}
                                    timeout="auto"
                                    unmountOnExit
                                    style={{
                                        paddingLeft: !isCollapsed ? "20px" : 0,
                                    }}
                                >
                                    <Item
                                        title="Tài Khoản"
                                        to="account"
                                        icon={<AccountCircleOutlined />}
                                        selected={selected}
                                        setSelected={setSelected}
                                    />
                                    <Item
                                        title="Ví Và Giao Dịch"
                                        to="wallet"
                                        icon={<WalletOutlinedIcon />}
                                        selected={selected}
                                        setSelected={setSelected}
                                    />
                                    <Item
                                        title="Cửa Hàng"
                                        to="shop"
                                        icon={<HomeOutlinedIcon />}
                                        selected={selected}
                                        setSelected={setSelected}
                                    />
                                    <Item
                                        title="Quà Tặng"
                                        to="item"
                                        icon={<RedeemIcon />}
                                        selected={selected}
                                        setSelected={setSelected}
                                    />
                                    <Item
                                        title="Gói Đăng Ký"
                                        to="package"
                                        icon={<SubscriptionsIcon />}
                                        selected={selected}
                                        setSelected={setSelected}
                                    />
                                    <Item
                                        title="Báo Cáo"
                                        to="report"
                                        icon={<ReportGmailerrorredIcon />}
                                        selected={selected}
                                        setSelected={setSelected}
                                    />
                                </Collapse>
                            </List>
                        </Box>
                    </Menu>
                </ProSidebar>
            </Box>
        </div>
    );
};

export default Sidebar;
