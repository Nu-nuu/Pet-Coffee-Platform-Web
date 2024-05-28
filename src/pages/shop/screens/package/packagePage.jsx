import "./packagePage.css";
import React from "react";
import { Backdrop, Box, Button, Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { packagesSelector, walletSelector } from "../../../../store/sellectors";
import CheckIcon from "@mui/icons-material/Check";
import Coin from "../../../../assets/coin.png";
import { useLocation, useNavigate } from "react-router-dom";
import { buyPackageThunk } from "../../../../store/apiThunk/packageThunk";
import { getWalletThunk } from "../../../../store/apiThunk/walletThunk";
import { useState } from "react";
import Swal from "sweetalert2";
import Lottie from "lottie-react";
import LoadingModal from "../../../../assets/loading.json";
import Pet from "../../../../assets/cutecatdog.png";
import {
    BUYPACKAGESUCCESS,
    CANCELTEXT,
    CONFIRMBUYPACKAGE,
    DELETECOMFIRM,
    DELETECOMFIRMYES,
    ERRORTEXT,
    SUCCESSTEXT,
    TOPUPTEXT,
} from "../../../../components/text/notiText/notiText";

export default function PackagePage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const shopId = location.state?.shopId;
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const wallet = useSelector(walletSelector);
    const packages = useSelector(packagesSelector);

    const CheckList = ({ count }) => {
        const checkIcons = Array.from({ length: count }, (_, index) => (
            <div className="checkIcon" key={index}>
                <CheckIcon sx={{ fontSize: "30px" }} color="success" />
            </div>
        ));

        return <div className="box_check">{checkIcons}</div>;
    };

    const handleBuyPackage = (id) => {
        Swal.fire({
            title: CONFIRMBUYPACKAGE,
            text: DELETECOMFIRM,
            icon: "question",
            showConfirmButton: true,
            showCancelButton: true,
            background: "white",
            scrollbarPadding: false,
            confirmButtonText: DELETECOMFIRMYES,
            cancelButtonText: CANCELTEXT,
        }).then((result) => {
            if (result.isConfirmed) {
                setShowLoadingModal(true);
                dispatch(
                    buyPackageThunk({
                        shopId: shopId,
                        packageId: id,
                    })
                )
                    .unwrap()
                    .then(() => {
                        dispatch(getWalletThunk()).then(() => {
                            setShowLoadingModal(false);
                            Swal.fire({
                                title: SUCCESSTEXT,
                                text: BUYPACKAGESUCCESS,
                                icon: "success",
                                showCancelButton: false,
                                showConfirmButton: false,
                                background: "white",
                                timer: 1500,
                                timerProgressBar: true,
                                scrollbarPadding: false,
                            }).then(() =>
                                navigate("/shop", {
                                    state: {
                                        direction: "packagePage",
                                        shopId: shopId,
                                    },
                                })
                            );
                        });
                    })
                    .catch((err) => {
                        setShowLoadingModal(false);
                        Swal.fire({
                            title: ERRORTEXT,
                            text: err.message,
                            icon: "error",
                            showConfirmButton: true,
                            showDenyButton: true,
                            background: "white",
                            scrollbarPadding: false,
                            confirmButtonText: TOPUPTEXT,
                            confirmButtonColor: "#55ab95",
                            denyButtonText: CANCELTEXT,
                        }).then((result) => {
                            if (result.isConfirmed) {
                                navigate("/manager", {
                                    state: {
                                        direction: "packagePage",
                                    },
                                });
                            }
                        });
                    });
            }
        });
    };

    return (
        <div className="packagePage">
            <Grid container spacing={3}>
                <Grid item xs={4}>
                    <div className="header_box">
                        <div
                            style={{
                                paddingInline: "8%",
                                paddingBlock: "10%",
                                marginBottom: "18px",
                            }}
                        >
                            <div className="header">Các Gói Đăng Ký</div>
                            <div className="desc">
                                <span className="desc_span">
                                    Đăng ký gói dịch vụ trên Nền Tảng Cà Phê Thú
                                    Cưng ngay bây giờ!
                                </span>
                            </div>
                        </div>
                        <div className="header_mid">
                            <div className="header_mid_content">Đặt Chỗ</div>
                            <div className="header_mid_content">
                                Tính Năng Xã Hội
                            </div>
                            <div className="header_mid_content">
                                Bản đồ và chỉ đường
                            </div>
                            <div className="header_mid_content">
                                Tham gia sự kiện
                            </div>
                            <div className="header_mid_content">
                                Tương tác với thú cưng
                            </div>
                        </div>
                        <div className="box_btn_box balance">
                            Số dư hiện tại:{" "}
                            {Math.floor(wallet?.balance)?.toLocaleString()}
                            <img src={Coin} alt="" style={{ width: "35px" }} />
                        </div>
                    </div>
                </Grid>
                <Grid item xs={8}>
                    {packages.length !== 0 ? (
                        <div className="overFlow">
                            {packages.map((item, index) => (
                                <div className="box" key={index}>
                                    <div
                                        className={
                                            "index_" + index + "_top" + " top"
                                        }
                                    >
                                        <div className="box_header">
                                            {item.description}
                                        </div>
                                        <div className="discount">
                                            Giảm {item.promotionDiscount}%
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-evenly",
                                            alignItems: "center",
                                            width: "100%",
                                            marginTop: "5px",
                                            paddingInline: "10px",
                                        }}
                                    >
                                        <div className="amount">
                                            {item.promotionAmount.toLocaleString()}
                                            <img
                                                src={Coin}
                                                alt=""
                                                style={{ width: "35px" }}
                                            />
                                        </div>
                                        <div
                                            className={
                                                "index_" + index + " money"
                                            }
                                        >
                                            {(
                                                (item.promotionAmount *
                                                    (100 -
                                                        item.promotionDiscount)) /
                                                100
                                            ).toLocaleString()}
                                            <img
                                                src={Coin}
                                                alt=""
                                                style={{ width: "35px" }}
                                            />
                                        </div>
                                    </div>
                                    <div className="box_duration">
                                        Cho {item.duration} Tháng
                                    </div>
                                    <CheckList count={5} />
                                    <div className="box_btn_box">
                                        <Button
                                            className={
                                                "index_" +
                                                index +
                                                "_btn" +
                                                " btn"
                                            }
                                            onClick={() =>
                                                handleBuyPackage(item.id)
                                            }
                                        >
                                            Chọn Gói
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex-box">
                            <div className="flex-center">
                                <img src={Pet} alt="" />
                                <div className="noDesc">Chưa có gói nào..</div>
                            </div>
                        </div>
                    )}
                </Grid>
                <Backdrop
                    sx={{
                        color: "#fff",
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                    }}
                    open={showLoadingModal}
                >
                    <Box sx={style}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                width: "100%",
                            }}
                        >
                            <Lottie
                                animationData={LoadingModal}
                                loop={true}
                                style={{ width: 200, height: 200 }}
                            />
                        </div>
                    </Box>
                </Backdrop>
            </Grid>
        </div>
    );
}

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    p: 4,
    minWidth: "593px",
};
