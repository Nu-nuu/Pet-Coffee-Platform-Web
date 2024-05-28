import { useEffect, useState } from "react";
import "./sidebar.css";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme, Divider } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../../../theme";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { useSelector } from "react-redux";
import { userDataSelector } from "../../../../store/sellectors";
import AccountCircleOutlined from "@mui/icons-material/AccountCircleOutlined";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import WalletOutlinedIcon from "@mui/icons-material/WalletOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import BarChartIcon from "@mui/icons-material/BarChart";
import LocalCafeOutlinedIcon from "@mui/icons-material/LocalCafeOutlined";
import DiscountOutlinedIcon from "@mui/icons-material/DiscountOutlined";
import { TruncateText } from "../../../../components/format/formatText/formatText";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { StyledSidebar } from "../../../../components/styledSidebar/styledSidebar";

const Sidebar = (props) => {
    const userData = useSelector(userDataSelector);
    const shops = userData.shopResponses || [];
    const location = useLocation();
    const navigate = useNavigate();
    const shopId = location.state?.shopId;
    const thisShop = shops.find((shop) => shop.id === shopId) || {};

    const url = new URL(window.location.href);
    const pathName = url.pathname;
    const parts = pathName?.split("/");
    const locationValue = parts[parts.length - 1];

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    let isCollapsed = props.isCollapsed;
    let setIsCollapsed = props.setIsCollapsed;
    const [selected, setSelected] = useState("Thu Chi");
    const [open, setOpen] = useState(true);

    const handleClick = () => {
        setOpen(!open);
    };

    useEffect(() => {
        switch (locationValue) {
            case "createEventField":
                setSelected("Sự Kiện");
                setIsCollapsed(true);
                break;
            case "event":
            case "eventDetail":
                setSelected("Sự Kiện");
                break;
            case "shop":
                setSelected("Thu Chi");
                break;
            case "staff":
                setSelected("Nhân Viên");
                break;
            case "order":
                setSelected("Đặt Chỗ");
                break;
            case "transaction":
                setSelected("Giao Dịch");
                break;
            case "package":
                setSelected("Gói");
                break;
            case "profile":
                setSelected("profile");
                break;
            case "product":
                setSelected("Đồ Uống");
                break;
            case "promotion":
                setSelected("Khuyến Mãi");
                break;
            case "report":
                setSelected("Báo Cáo");
                break;
            default:
                break;
        }
    }, [locationValue]);

    const Item = ({ title, to, icon, selected, setSelected, shopId }) => {
        const theme = useTheme();
        const colors = tokens(theme.palette.mode);
        return (
            <MenuItem
                active={selected === title}
                style={{
                    color: colors.grey[100],
                }}
                onClick={() =>
                    locationValue !== "createEventField"
                        ? setSelected(title)
                        : undefined
                }
                icon={icon}
            >
                <Typography>{title}</Typography>
                {locationValue !== "createEventField" && (
                    <Link to={to} state={{ shopId: shopId }} />
                )}
            </MenuItem>
        );
    };

    return (
        <div className="shopSidebar">
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
                                    onClick={() =>
                                        locationValue !== "createEventField"
                                            ? setIsCollapsed(!isCollapsed)
                                            : null
                                    }
                                >
                                    <MenuOutlinedIcon fontSize="large" />
                                </IconButton>
                            }
                        ></MenuItem>
                        {!isCollapsed && (
                            <div
                                onClick={() =>
                                    locationValue !== "createEventField"
                                        ? navigate("profile", {
                                              state: { shopId: shopId },
                                          })
                                        : undefined
                                }
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
                                    src={thisShop.avatarUrl || null}
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
                                    {TruncateText(thisShop.name || "", 15)}
                                </Typography>
                            </div>
                        )}
                        <Box>
                            <Typography
                                variant="h6"
                                color={colors.grey[300]}
                                sx={{ m: "5px 0 5px 20px" }}
                            >
                                Thống Kê
                            </Typography>
                            <Item
                                title="Thu Chi"
                                to=""
                                shopId={shopId}
                                icon={<BarChartIcon />}
                                selected={selected}
                                setSelected={setSelected}
                            />
                            <Divider />
                            <Typography
                                variant="h6"
                                color={colors.grey[300]}
                                sx={{ m: "5px 0 5px 20px" }}
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
                                        title="Đặt Chỗ"
                                        to="order"
                                        shopId={shopId}
                                        icon={<ShoppingCartOutlinedIcon />}
                                        selected={selected}
                                        setSelected={setSelected}
                                    />
                                    <Item
                                        title="Giao Dịch"
                                        to="transaction"
                                        shopId={shopId}
                                        icon={<WalletOutlinedIcon />}
                                        selected={selected}
                                        setSelected={setSelected}
                                    />
                                    <Item
                                        title="Nhân Viên"
                                        to="staff"
                                        shopId={shopId}
                                        icon={<AccountCircleOutlined />}
                                        selected={selected}
                                        setSelected={setSelected}
                                    />
                                    <Item
                                        title="Đồ Uống"
                                        to="product"
                                        shopId={shopId}
                                        icon={<LocalCafeOutlinedIcon />}
                                        selected={selected}
                                        setSelected={setSelected}
                                    />
                                    <Item
                                        title="Sự Kiện"
                                        to="event"
                                        shopId={shopId}
                                        icon={<CalendarMonthIcon />}
                                        selected={selected}
                                        setSelected={setSelected}
                                    />
                                    <Item
                                        title="Khuyến Mãi"
                                        to="promotion"
                                        shopId={shopId}
                                        icon={<DiscountOutlinedIcon />}
                                        selected={selected}
                                        setSelected={setSelected}
                                    />

                                    <Item
                                        title="Báo Cáo"
                                        to="report"
                                        shopId={shopId}
                                        icon={<ReportGmailerrorredIcon />}
                                        selected={selected}
                                        setSelected={setSelected}
                                    />
                                </Collapse>
                            </List>
                            <Divider />
                            <Typography
                                variant="h6"
                                color={colors.grey[300]}
                                sx={{ m: "5px 0 5px 20px" }}
                            >
                                {!isCollapsed ? "Đăng Ký Gói" : "Gói"}
                            </Typography>
                            <Item
                                title="Gói"
                                to="package"
                                shopId={shopId}
                                icon={<SubscriptionsIcon />}
                                selected={selected}
                                setSelected={setSelected}
                            />
                        </Box>
                    </Menu>
                </ProSidebar>
            </Box>
        </div>
    );
};

export default Sidebar;
