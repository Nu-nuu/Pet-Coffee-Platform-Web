import "./landingPage.css";
import { Button, Grid } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import CuteCatDog from "../../../assets/cutecatdog.png";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import XIcon from "@mui/icons-material/X";
import { useEffect } from "react";

export default function LandingPage() {
    const navigate = useNavigate();
    const url = new URL(window.location.href);
    const direction = url.searchParams.get("direction");
    const transactionId = url.searchParams.get("status");
    const responseCode = url.searchParams.get("vnp_ResponseCode");
    const status = url.searchParams.get("vnp_TransactionStatus");

    useEffect(() => {
        if (direction === "transferStatus") {
            navigate("/transferStatus", {
                state: {
                    transactionId: transactionId,
                    responseCode: responseCode,
                    status: status,
                },
            });
        }
    }, [direction]);

    const MenuItem = ({ text }) => (
        <Grid item xs={12 / 5}>
            <Link className="body_mid_box" to="/login">
                <img src={CuteCatDog} alt="" className="body_mid_img" />
                <p className="body_mid_text">{text}</p>
            </Link>
        </Grid>
    );

    return (
        <div className="landingPage">
            <div className="header">
                <Button
                    variant="contained"
                    onClick={() => navigate("/login")}
                    className="header_btn"
                >
                    Đăng nhập
                </Button>
                <Button
                    variant="contained"
                    className="header_btn"
                    onClick={() => navigate("/signup")}
                >
                    Đăng ký
                </Button>
            </div>
            <div className="body">
                <div className="body_top">
                    <div>
                        <p className="body_top_text">
                            Nền Tảng <br /> Cà Phê <br /> Thú Cưng
                        </p>
                        <p className="body_top_desc">
                            Trải nghiệm sự đa dạng của hệ thống chúng tôi ngay
                            bây giờ
                        </p>
                    </div>
                    <img src={CuteCatDog} alt="" className="body_top_img" />
                </div>
                <Grid container spacing={2}>
                    <MenuItem text="Đặt Chỗ" />
                    <MenuItem text="Tính năng xã hội" />
                    <MenuItem text="Bản đồ và chỉ đường" />
                    <MenuItem text="Tham gia sự kiện" />
                    <MenuItem text="Tương tác thú cưng" />
                </Grid>
            </div>
            <div className="footer">
                <Grid container spacing={2}>
                    <Grid item xs={3}></Grid>
                    <Grid item xs={6}>
                        <div className="footer_flex_center">
                            <p className="footer_text">
                                &copy; 2024 Copyright:{" "}
                                <Link
                                    to="https://pet-coffee-platform.vercel.app"
                                    className="footer_url"
                                    target="_blank"
                                >
                                    pet-coffee-platform.vercel.app
                                </Link>
                            </p>
                        </div>
                    </Grid>
                    <Grid item xs={3}>
                        <div
                            className="footer_flex_center"
                            style={{ justifyContent: "flex-end" }}
                        >
                            <p
                                className="footer_text"
                                style={{ color: "white" }}
                            >
                                Theo dõi tại:
                            </p>
                            <Link
                                to="https://www.facebook.com"
                                target="_blank"
                                className="footer_icon_url"
                            >
                                <FacebookIcon className="footer_icon" />
                            </Link>
                            <Link
                                to="https://www.instagram.com"
                                target="_blank"
                                className="footer_icon_url"
                            >
                                <InstagramIcon className="footer_icon" />
                            </Link>
                            <Link
                                to="https://www.youtube.com"
                                target="_blank"
                                className="footer_icon_url"
                            >
                                <YouTubeIcon className="footer_icon" />
                            </Link>
                            <Link
                                to="https://twitter.com"
                                target="_blank"
                                className="footer_icon_url"
                            >
                                <XIcon className="footer_icon" />
                            </Link>
                        </div>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}
