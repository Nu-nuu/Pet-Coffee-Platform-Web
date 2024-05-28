import { Box, Divider, IconButton } from "@mui/material";
import "./topbar.css";
import React from "react";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { useLocation, useNavigate } from "react-router-dom";
import { userDataSelector } from "../../../../store/sellectors";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSelector } from "react-redux";
import { TruncateText } from "../../../../components/format/formatText/formatText";

export default function Topbar() {
    const userData = useSelector(userDataSelector);
    const shops = userData.shopResponses || [];
    const location = useLocation();
    const navigate = useNavigate();
    const shopId = location.state?.shopId;
    const thisShop = shops.find((shop) => shop.id === shopId) || {};
    const shopsData = shops.filter((shop) => shop.id !== shopId);

    const [openShop, setOpenShop] = React.useState(false);
    const [open, setOpen] = React.useState(false);

    const url = new URL(window.location.href);
    const pathName = url.pathname;
    const parts = pathName?.split("/");
    const locationValue = parts[parts.length - 1];

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

    return (
        <div className="shop_topbar">
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                p={2}
                width="auto"
            >
                <div></div>
                <Box display="flex">
                    <ClickAwayListener onClickAway={handleClickAway}>
                        <div>
                            <IconButton
                                onClick={
                                    locationValue !== "createEventField"
                                        ? handleClick
                                        : undefined
                                }
                            >
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
                                                    navigate("profile", {
                                                        state: {
                                                            shopId: shopId,
                                                        },
                                                    });
                                                }}
                                            >
                                                <img
                                                    src={thisShop.avatarUrl}
                                                    alt=""
                                                    className="img"
                                                />
                                                <div className="name">
                                                    {TruncateText(
                                                        thisShop.name,
                                                        13
                                                    )}
                                                </div>
                                            </div>
                                            <Divider color="#55ab95" style={{marginBlock:"10px"}}/>
                                            <div
                                                className="view_all"
                                                onClick={() => toggleOpenShop()}
                                            >
                                                Xem tất cả cửa hàng
                                            </div>
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
                                            <div
                                                className="shop"
                                                onClick={() =>
                                                    navigate("/manager")
                                                }
                                            >
                                                <img
                                                    src={userData.avatar}
                                                    alt=""
                                                    className="shop_img"
                                                />
                                                <div className="shop_name">
                                                    {userData.fullName}
                                                </div>
                                            </div>
                                            <Divider color="#55ab95" style={{marginBlock:"10px"}}/>
                                            {shopsData?.map((shop, index) => (
                                                <div
                                                    className={`shop ${
                                                        shop.status !==
                                                            "Active" &&
                                                        "shop_disable"
                                                    }`}
                                                    key={index}
                                                    onClick={
                                                        shop.status === "Active"
                                                            ? () => {
                                                                  handleClickAway();
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
                                            ))}
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
}
