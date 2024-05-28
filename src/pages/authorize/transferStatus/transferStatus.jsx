import "./transferStatus.css";
import { Grid, useMediaQuery } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import Pet from "../../../assets/cutecatdog.png";
import Error from "../../../assets/error.json";
import Success from "../../../assets/success.json";
import { useState } from "react";
import { useEffect } from "react";
import Lottie from "lottie-react";
import { useDispatch } from "react-redux";
import { getUserDataThunk } from "../../../store/apiThunk/userThunk";
import { getWalletThunk } from "../../../store/apiThunk/walletThunk";
import { updatePaymentDataThunk } from "../../../store/apiThunk/topupThunk";

export default function TransferStatus() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [countdown, setCountdown] = useState(3);
    const location = useLocation();
    const transactionId = location.state?.transactionId;
    const responseCode = location.state?.responseCode;
    const status = location.state?.status;

    useEffect(() => {
        dispatch(getUserDataThunk());
        dispatch(getWalletThunk());
        dispatch(
            updatePaymentDataThunk({ id: transactionId, status: responseCode })
        );
        const timer = setInterval(() => {
            setCountdown((prevCount) => prevCount - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (countdown === 0) {
            navigate("/manager", { state: { direction: "transferStatus" } });
        }
    }, [countdown, navigate]);

    const isScreenSmall = useMediaQuery("(max-width:600px)");

    return (
        <div className="transferStatus">
            {!isScreenSmall ? (
                <Grid container spacing={2}>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={5} className="flex-center">
                        <img src={Pet} alt="" />
                    </Grid>
                    <Grid item xs={5} className="flex-center">
                        <div className="signup__form">
                            <div className="flex-center">
                                {status === "00" ? (
                                    <Lottie
                                        animationData={Success}
                                        loop={true}
                                    />
                                ) : (
                                    <Lottie animationData={Error} loop={true} />
                                )}
                            </div>
                            <h3 variant="h3" className="login__title">
                                Nạp tiền vào ví{" "}
                                {status === "00" ? "thành công!" : "thất bại!"}
                            </h3>
                            <h5 className="login__desc">
                                Bạn sẽ tự động quay lại sau {countdown} giây
                            </h5>
                        </div>
                    </Grid>
                    <Grid item xs={1}></Grid>
                </Grid>
            ) : (
                <div className="box">
                    <img src={Pet} alt="" style={{ width: "50%" }} />
                    {status === "00" ? (
                        <Lottie animationData={Success} loop={true} />
                    ) : (
                        <Lottie animationData={Error} loop={true} />
                    )}
                    <h3 variant="h3" className="login__title">
                        Nạp tiền vào ví{" "}
                        {status === "00" ? "thành công!" : "thất bại!"}
                    </h3>
                    <h5 className="login__desc">
                        Bạn sẽ tự động quay lại sau {countdown} giây
                    </h5>
                </div>
            )}
        </div>
    );
}
