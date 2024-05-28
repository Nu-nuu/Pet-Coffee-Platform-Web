import { useState } from "react";
import "./sidebar.css";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme, Divider } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import WalletOutlinedIcon from "@mui/icons-material/WalletOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { useSelector } from "react-redux";
import { userDataSelector } from "../../../../store/sellectors";
import BarChartIcon from "@mui/icons-material/BarChart";
import { useEffect } from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { TruncateText } from "../../../../components/format/formatText/formatText";
import { StyledSidebar } from "../../../../components/styledSidebar/styledSidebar";

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
    const navigate = useNavigate();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    let isCollapsed = props.isCollapsed;
    let setIsCollapsed = props.setIsCollapsed;
    const [selected, setSelected] = useState("Thu Chi");
    const [open, setOpen] = useState(true);

    const handleClick = () => {
        setOpen(!open);
    };

    const url = new URL(window.location.href);
    const pathName = url.pathname;
    const parts = pathName?.split("/");
    const locationValue = parts[parts.length - 1];

    useEffect(() => {
        if (locationValue === "shop") {
            setSelected("Danh Sách");
        } else if (
            locationValue === "manager" ||
            locationValue === "dashboardDetail"
        ) {
            setSelected("Thu Chi");
        } else if (locationValue === "order") {
            setSelected("Đặt Chỗ");
        } else if (locationValue === "wallet") {
            setSelected("Ví Và Giao Dịch");
        } else if (
            locationValue === "profile" ||
            locationValue === "changePassword"
        ) {
            setSelected("profile");
        }
    }, [locationValue]);

    return (
        <div className="managerSidebar">
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
                            <div
                                onClick={() => navigate("profile")}
                                className={
                                    selected !== "profile"
                                        ? "box"
                                        : "selected_box"
                                }
                            >
                                <img
                                    alt="profile-user"
                                    width="50px"
                                    height="50px"
                                    src={userData.avatar}
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
                                    {TruncateText(userData.fullName || "", 13)}
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
                                title="Thu Chi"
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
                                        <HomeOutlinedIcon
                                            style={{
                                                marginLeft: "10px",
                                                marginRight: "19px",
                                                color: "white",
                                            }}
                                        />
                                    )}
                                    {!isCollapsed && (
                                        <ListItemText
                                            primary="Cửa Hàng"
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
                                        title="Danh Sách"
                                        to="shop"
                                        icon={<FormatListBulletedIcon />}
                                        selected={selected}
                                        setSelected={setSelected}
                                    />
                                    <Item
                                        title="Đặt Chỗ"
                                        to="order"
                                        icon={<ShoppingCartOutlinedIcon />}
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
