import "./becomeManager.css";
import { Grid } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import AppBG from "../../../assets/appBG.png";
import AppBG1 from "../../../assets/appBG1.png";
import { useSelector } from "react-redux";
import { userDataSelector } from "../../../store/sellectors";
import {
    FormatPhoneNumber,
    TruncateText,
} from "../../../components/format/formatText/formatText";
import { signOut } from "firebase/auth";
import { auth } from "../../../../firebaseConfig";
import { PetType, ShopStatus } from "../../../components/mapping/mapping";

export default function BecomeManager() {
    const location = useLocation();
    const email = location.state?.email;
    const userData = useSelector(userDataSelector);
    const checkShop = userData?.shopResponses?.some(
        (shop) => shop.status === "Processing"
    );
    const shopData = userData?.shopResponses?.[0] ?? {};

    return (
        <div className="becomeManager">
            <Grid container spacing={6}>
                <Grid item xs={1}></Grid>
                <Grid item xs={5} className="flex-baseline">
                    <img src={AppBG} style={{ width: "50%", height: "80%" }} />
                    <img src={AppBG1} style={{ width: "50%", height: "80%" }} />
                </Grid>
                <Grid item xs={5} className="flex-center">
                    <div>
                        <h3 variant="h3" className="login__title">
                            Xin Chào {email}
                        </h3>
                        {!checkShop ? (
                            <>
                                <p className="login__desc">
                                    Bạn đang đăng nhập với vai trò người dùng
                                    <br />
                                    Vui lòng{" "}
                                    <Link
                                        to="https://drive.google.com/drive/u/1/folders/1yM6WxOLoPOjmv63m6tNWOBOJEdZDbcCs"
                                        target="_blank"
                                        style={{
                                            color: "#70d8bd",
                                            textDecoration: "underline",
                                        }}
                                    >
                                        tải
                                    </Link>{" "}
                                    ứng dụng để sử dụng
                                </p>
                                <div
                                    className="flex-center"
                                    style={{ gap: "20px" }}
                                >
                                    <div className="divider"></div>
                                    <span style={{ color: "#8b8b8b" }}>
                                        hoặc
                                    </span>
                                    <div className="divider"></div>
                                </div>
                                <p className="login__desc">
                                    <Link
                                        to="/createShop"
                                        style={{
                                            color: "#70d8bd",
                                            textDecoration: "underline",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Trở Thành
                                    </Link>{" "}
                                    một quản lý cửa hàng và
                                    <br />
                                    nhận 3 tháng sử dụng miễn phí ngay bây giờ
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="processing_text">
                                    Bạn hiện có một yêu cầu tạo cửa hàng đang
                                    được xử lý
                                </div>
                                <div className="processing_shop_box">
                                    <div className="processing_shop_field">
                                        <span className="processing_shop_span">
                                            Tên Cửa Hàng:{" "}
                                        </span>
                                        {TruncateText(shopData.name, 13)}
                                    </div>
                                    <div className="processing_shop_field">
                                        <span className="processing_shop_span">
                                            Email:{" "}
                                        </span>
                                        {shopData.email}
                                    </div>
                                    <div className="processing_shop_field">
                                        <span className="processing_shop_span">
                                            Số Điện Thoại:{" "}
                                        </span>
                                        {FormatPhoneNumber(shopData.phone)}
                                    </div>
                                    <div className="processing_shop_field">
                                        <span className="processing_shop_span">
                                            Loại Cửa Hàng:{" "}
                                        </span>
                                        {PetType(shopData.shopType)}
                                    </div>
                                    <div className="processing_shop_field">
                                        <span className="processing_shop_span">
                                            Địa Chỉ:{" "}
                                        </span>
                                        {shopData.location}
                                    </div>
                                    <div
                                        className="processing_shop_field"
                                        style={{ color: "yellow" }}
                                    >
                                        <span className="processing_shop_span">
                                            Tình Trạng:{" "}
                                        </span>
                                        {ShopStatus(shopData.status)}
                                    </div>
                                </div>
                            </>
                        )}
                        <div style={{ marginTop: "30px" }}>
                            <Link
                                onClick={() =>
                                    signOut(auth)
                                        .then(() => {
                                            localStorage.clear();
                                        })
                                        .catch((error) => {
                                            console.log({ error });
                                        })
                                }
                                to="/"
                                className="login__desc"
                                style={{
                                    color: "#70d8bd",
                                    marginTop: "30px",
                                }}
                            >
                                Trở về trang chủ
                            </Link>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={1}></Grid>
            </Grid>
        </div>
    );
}
