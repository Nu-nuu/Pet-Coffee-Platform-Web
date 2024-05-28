import "./topbar.css";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { LogoutButton } from "../../../../components/function/logout/logout";
import { Box, IconButton, Divider } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    allNotificationsSelector,
    unreadNotificationsSelector,
    userDataSelector,
} from "../../../../store/sellectors";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import {
    getAllNotificationsThunk,
    getUnreadNotificationsThunk,
    readAllNotificationsThunk,
} from "../../../../store/apiThunk/notificationThunk";
import {
    HubConnectionBuilder,
    LogLevel,
    HttpTransportType,
} from "@microsoft/signalr";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector(userDataSelector);
    const unreadNotifications = useSelector(unreadNotificationsSelector);
    const allNotifications = useSelector(allNotificationsSelector);
    const [open, setOpen] = useState(false);
    const [count, setCount] = useState(unreadNotifications?.count || 0);
    const [openNoti, setOpenNoti] = useState(false);
    const [notiData, setNotiData] = useState(allNotifications || []);

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

    const handleClick = () => {
        setOpen((prev) => !prev);
    };

    const handleClickAway = () => {
        setOpen(false);
    };

    const handleClickNoti = () => {
        setOpenNoti((prev) => !prev);
    };

    const handleClickAwayNoti = () => {
        setOpenNoti(false);
    };

    const url = new URL(window.location.href);
    const pathName = url.pathname;
    const parts = pathName?.split("/");
    const locationValue = parts[parts.length - 1];

    const handleNavigate = (type, shopId, referenceId, isReportForComment) => {
        let path = "";
        let state = {};
        switch (type) {
            case "Shop":
                path = "shop";
                state = {
                    openNoti: true,
                    shopId: shopId,
                };
                break;
            case "Report":
                path = "report";
                state = {
                    openNoti: true,
                    reportId: referenceId,
                    reportType:
                        isReportForComment === true ? "comment" : "post",
                };
                break;
            case "Wallet":
            case "Transaction":
                path = "wallet";
                state = { openNoti: true, transactionId: referenceId };
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
        <div className="admin_topbar">
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
                                                                noti.referenceId,
                                                                noti.isReportForComment
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
                                    <LogoutButton />
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
