import "./topbar.css";
import { Box, IconButton, Divider } from "@mui/material";
import React, { useEffect, useState } from "react";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    allNotificationsSelector,
    unreadNotificationsSelector,
    userDataSelector,
} from "../../../../store/sellectors";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PasswordIcon from "@mui/icons-material/Password";

import DoneAllIcon from "@mui/icons-material/DoneAll";
import {
    getAllNotificationsThunk,
    getUnreadNotificationsThunk,
    readAllNotificationsThunk,
} from "../../../../store/apiThunk/notificationThunk";
import { LogoutButton } from "../../../../components/function/logout/logout";
import { TruncateText } from "../../../../components/format/formatText/formatText";
import {
    HubConnectionBuilder,
    LogLevel,
    HttpTransportType,
} from "@microsoft/signalr";
import { FormatDateTimeNoti } from "../../../../components/format/formatDatetime/formatDatetime";

const Topbar = () => {
    const userData = useSelector(userDataSelector);
    const unreadNotifications = useSelector(unreadNotificationsSelector);
    const allNotifications = useSelector(allNotificationsSelector);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [count, setCount] = useState(unreadNotifications?.count || 0);
    const [open, setOpen] = useState(false);
    const [openShop, setOpenShop] = useState(false);
    const [openNoti, setOpenNoti] = useState(false);
    const [notiData, setNotiData] = useState(allNotifications);

    const joinNoti = () => {
        try {
            if (userData) {
                const connection = new HubConnectionBuilder()
                    .withUrl(
                        `wss://petcoffeshops.azurewebsites.net/notification-hub?accountId=${userData.id}`,
                        {
                            skipNegotiation: true,
                            transport: HttpTransportType.WebSockets,
                        }
                    )
                    .configureLogging(LogLevel.None)
                    .build();
                connection
                    .start()
                    .then(() => connection.invoke("OnConnectedAsync"));
                connection.on("ReceiveNotification", () => {
                    dispatch(getAllNotificationsThunk())
                        .unwrap()
                        .then((response) => {
                            setNotiData(response);
                            dispatch(getUnreadNotificationsThunk())
                                .unwrap()
                                .then((res) => setCount(res.count));
                        });
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        joinNoti();
    }, []);

    const handleClickNoti = () => {
        setOpenNoti((prev) => !prev);
    };

    const handleClickAwayNoti = () => {
        setOpenNoti(false);
    };

    const handleClick = () => {
        setOpen((prev) => !prev);
    };

    const handleClickAway = () => {
        setOpen(false);
        setOpenShop(false);
    };

    const toggleOpenShop = () => {
        setOpenShop(!openShop);
    };

    const url = new URL(window.location.href);
    const pathName = url.pathname;
    const parts = pathName?.split("/");
    const locationValue = parts[parts.length - 1];

    const handleNavigate = (type, shopId, id) => {
        let path = "";
        let state = {};
        switch (type) {
            case "Shop":
                path = "shop";
                break;
            case "Reservation":
                path = "order";
                state = { openNoti: true, orderId: id };
                break;
            case "Wallet":
            case "Donation":
            case "Transaction":
                path = "wallet";
                state = { openNoti: true, transactionId: id };
                break;
            case "Event":
            case "SubmittingEvent":
                path = "/shop";
                state = { direction: "noti", shopId: shopId, eventId: id };
                break;
            default:
                break;
        }
        if (locationValue === path) {
            const urlWithQuery = `${path}?render=true`;
            navigate(urlWithQuery, {
                state: state,
            });
        } else {
            navigate(path, { state: state });
        }
        handleClickAwayNoti();
    };

    const handleReadAll = () => {
        setCount(0);
        const updatedNotiData = notiData.map((noti) => ({
            ...noti,
            isRead: true,
        }));
        setNotiData(updatedNotiData);
        dispatch(readAllNotificationsThunk()).then(() => {
            dispatch(getUnreadNotificationsThunk());
            dispatch(getAllNotificationsThunk());
        });
    };

    return (
        <div className="manager_topbar">
            <Box display="flex" justifyContent="flex-end" p={2} width="auto">
                <Box display="flex">
                    <ClickAwayListener onClickAway={handleClickAwayNoti}>
                        <div>
                            <div
                                className="count_box"
                                onClick={handleClickNoti}
                            >
                                <IconButton>
                                    {count === 0 ? (
                                        <>
                                            <NotificationsOutlinedIcon fontSize="large" />
                                        </>
                                    ) : (
                                        <>
                                            <NotificationsIcon fontSize="large" />
                                            <div className="count"></div>
                                        </>
                                    )}
                                </IconButton>
                            </div>
                            {openNoti ? (
                                <div
                                    className="popper"
                                    style={{
                                        right: "32px",
                                        minWidth: "370px",
                                    }}
                                >
                                    <div
                                        className="flex-between"
                                        style={{ marginBottom: "20px" }}
                                    >
                                        <div></div>
                                        <div
                                            style={{
                                                fontSize: "17px",
                                                fontWeight: "500",
                                            }}
                                        >
                                            Thông báo{" "}
                                            {count !== 0 && `( ${count} )`}
                                        </div>
                                        <div className="flex-between">
                                            <IconButton onClick={handleReadAll}>
                                                <DoneAllIcon />
                                            </IconButton>
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            maxHeight: "200px",
                                            overflow: "auto",
                                        }}
                                    >
                                        {notiData?.length !== 0 ? (
                                            notiData?.map((noti, index) => (
                                                <div key={index}>
                                                    <div
                                                        className="noti_box"
                                                        onClick={() =>
                                                            handleNavigate(
                                                                noti.entityType,
                                                                noti.shopId,
                                                                noti.referenceId
                                                            )
                                                        }
                                                    >
                                                        <div
                                                            className={`title ${
                                                                !noti.isRead
                                                                    ? ""
                                                                    : "isread"
                                                            }`}
                                                        >
                                                            {noti.title}
                                                            <span className="time">
                                                                {FormatDateTimeNoti(
                                                                    noti.createdAt
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div
                                                            className={`content ${
                                                                !noti.isRead
                                                                    ? ""
                                                                    : "isread"
                                                            }`}
                                                        >
                                                            {noti.content}
                                                        </div>
                                                    </div>
                                                    <Divider />
                                                </div>
                                            ))
                                        ) : (
                                            <div
                                                style={{ paddingBlock: "10px" }}
                                            >
                                                Chưa có thông báo..
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </ClickAwayListener>
                    <ClickAwayListener onClickAway={handleClickAway}>
                        <div>
                            <IconButton onClick={handleClick}>
                                <PersonOutlinedIcon fontSize="large" />
                            </IconButton>
                            {open ? (
                                <div className="popper">
                                    {!openShop ? (
                                        <>
                                            <div
                                                className="flex-center"
                                                onClick={() => {
                                                    handleClickAway();
                                                    navigate("profile");
                                                }}
                                            >
                                                <img
                                                    src={userData.avatar}
                                                    alt=""
                                                    className="img"
                                                />
                                                <div className="name">
                                                    {userData.fullName}
                                                </div>
                                            </div>
                                            <Divider color="#55ab95" style={{marginBlock:"10px"}}/>
                                            <div
                                                className="view_all"
                                                onClick={() => toggleOpenShop()}
                                            >
                                                Xem tất cả cửa hàng
                                            </div>
                                            <div
                                                className="logout flex-center"
                                                onClick={() => {
                                                    handleClickAway();
                                                    navigate("changePassword");
                                                }}
                                            >
                                                <PasswordIcon fontSize="medium" />
                                                Đổi Mật Khẩu
                                            </div>
                                            <LogoutButton />
                                        </>
                                    ) : (
                                        <>
                                            <div className="back-flex-center">
                                                <div
                                                    onClick={() =>
                                                        toggleOpenShop()
                                                    }
                                                    className="back"
                                                >
                                                    <ArrowBackIcon fontSize="medium" />
                                                </div>
                                                Chọn Cửa Hàng
                                            </div>
                                            {userData.shopResponses?.map(
                                                (shop, index) => (
                                                    <div
                                                        className={`shop ${
                                                            shop.status !==
                                                                "Active" &&
                                                            "shop_disable"
                                                        }`}
                                                        key={index}
                                                        onClick={
                                                            shop.status ===
                                                            "Active"
                                                                ? () => {
                                                                      navigate(
                                                                          "/shop",
                                                                          {
                                                                              state: {
                                                                                  shopId: shop.id,
                                                                              },
                                                                          }
                                                                      );
                                                                  }
                                                                : undefined
                                                        }
                                                    >
                                                        <img
                                                            src={shop.avatarUrl}
                                                            alt=""
                                                            className="shop_img"
                                                        />
                                                        <div className="shop_name">
                                                            {TruncateText(
                                                                shop.name,
                                                                13
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </>
                                    )}
                                </div>
                            ) : null}
                        </div>
                    </ClickAwayListener>
                </Box>
            </Box>
        </div>
    );
};

export default Topbar;
