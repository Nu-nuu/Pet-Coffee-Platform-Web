import "./forgotPassword.css";
import { Button, TextField, Grid } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import {
    checkEmailThunk,
    sendOTPForgotPasswordThunk,
} from "../../../store/apiThunk/userThunk";
import Swal from "sweetalert2";
import Pet from "../../../assets/cutecatdog.png";
import { useState } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./../../../theme";
import LoadingModal from "../../../components/modal/loadingModal/loadingModal";
import {
    ERRORTEXT,
    NOTREGISTERED,
} from "../../../components/text/notiText/notiText";

export default function ForgotPassword() {
    const [theme, colorMode] = useMode();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showLoadingModal, setShowLoadingModal] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .required("Email không thể trống")
                .email("Email sai định dạng"),
        }),
        onSubmit: async (values) => {
            setShowLoadingModal(true);
            dispatch(checkEmailThunk(values.email))
                .unwrap()
                .then((response) => {
                    if (response === true) {
                        dispatch(sendOTPForgotPasswordThunk(values.email)).then(
                            () => {
                                setShowLoadingModal(false);
                                navigate(`/verifyAccount`, {
                                    state: {
                                        email: values.email,
                                        direction: "forgotPassword",
                                    },
                                });
                            }
                        );
                    } else {
                        setShowLoadingModal(false);
                        Swal.fire({
                            title: ERRORTEXT,
                            text: NOTREGISTERED,
                            icon: "error",
                            showConfirmButton: false,
                            background: "white",
                            timer: 1500,
                            timerProgressBar: true,
                            scrollbarPadding: false,
                        });
                    }
                })
                .catch((error) => {
                    setShowLoadingModal(false);
                    Swal.fire({
                        title: ERRORTEXT,
                        text: error.message,
                        icon: "error",
                        showConfirmButton: false,
                        background: "white",
                        timer: 1500,
                        timerProgressBar: true,
                        scrollbarPadding: false,
                    });
                });
        },
    });

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div className="forgotPassword">
                    <Grid container spacing={2}>
                        <Grid item xs={1}></Grid>
                        <Grid item xs={5} className="flex-center">
                            <img src={Pet} style={{ width: "100%" }} />
                        </Grid>
                        <Grid item xs={5} className="flex-center">
                            <div className="signup__form">
                                <h3 variant="h3" className="login__title">
                                    Quên mật khẩu
                                </h3>
                                <form onSubmit={formik.handleSubmit}>
                                    <div>
                                        <TextField
                                            id="email"
                                            label={
                                                <span>
                                                    Email{" "}
                                                    <span
                                                        style={{ color: "red" }}
                                                    >
                                                        *
                                                    </span>
                                                </span>
                                            }
                                            variant="outlined"
                                            type="email"
                                            value={formik.values.email}
                                            onChange={formik.handleChange(
                                                "email"
                                            )}
                                            fullWidth
                                            margin="dense"
                                            color="secondary"
                                        />
                                        {formik.touched.email &&
                                            formik.errors.email && (
                                                <div className="login__validation__error">
                                                    {formik.errors.email}
                                                </div>
                                            )}
                                    </div>
                                    <p className="login__link">
                                        Nhớ mật khẩu?
                                        <Link
                                            to="/login"
                                            style={{
                                                textDecoration: "none",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    color: "#70d8bd",
                                                }}
                                            >
                                                {" "}
                                                Đăng nhập!
                                            </span>
                                        </Link>
                                    </p>
                                    {!showLoadingModal ? (
                                        <Button
                                            className="login__btn"
                                            variant="contained"
                                            type="submit"
                                            fullWidth
                                        >
                                            Gửi Mã
                                        </Button>
                                    ) : (
                                        <LoadingModal />
                                    )}
                                </form>
                            </div>
                        </Grid>
                        <Grid item xs={1}></Grid>
                    </Grid>
                </div>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}
