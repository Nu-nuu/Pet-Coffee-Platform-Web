import "./newPassword.css";
import { useState } from "react";
import {
    Button,
    TextField,
    Grid,
    InputAdornment,
    IconButton,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { newPasswordThunk } from "../../../store/apiThunk/userThunk";
import Swal from "sweetalert2";
import Pet from "../../../assets/cutecatdog.png";
import { VisibilityOutlined, VisibilityOffOutlined } from "@mui/icons-material";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./../../../theme";
import LoadingModal from "../../../components/modal/loadingModal/loadingModal";
import {
    CHANGEPASSWORDSUCCESS,
    ERRORTEXT,
    SUCCESSTEXT,
} from "../../../components/text/notiText/notiText";

export default function NewPassword() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const email = location?.state?.email;
    const [theme, colorMode] = useMode();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassWord, setShowConfirmPassword] = useState(false);
    const [showLoadingModal, setShowLoadingModal] = useState(false);

    const formik = useFormik({
        initialValues: {
            newPassword: "",
            confirmPassword: "",
        },
        validationSchema: Yup.object({
            newPassword: Yup.string()
                .required("Mật khẩu không thể trống")
                .min(8, "Mật khẩu phải có ít nhất 8 chữ số"),
            confirmPassword: Yup.string()
                .required("Xác nhận mật khẩu không thể trống")
                .oneOf(
                    [Yup.ref("newPassword"), null],
                    "Xác nhận mật khẩu chưa đúng"
                ),
        }),
        onSubmit: async (values) => {
            setShowLoadingModal(true);
            dispatch(
                newPasswordThunk({
                    email: email,
                    newPassword: values.newPassword,
                })
            )
                .then(() => {
                    setShowLoadingModal(false);
                    Swal.fire({
                        title: SUCCESSTEXT,
                        text: CHANGEPASSWORDSUCCESS,
                        icon: "success",
                        showCancelButton: false,
                        showConfirmButton: false,
                        background: "white",
                        timer: 1500,
                        timerProgressBar: true,
                        scrollbarPadding: false,
                    }).then(() => {
                        navigate("/login");
                    });
                })
                .catch((error) => {
                    setShowLoadingModal(false);
                    Swal.fire({
                        title: ERRORTEXT,
                        text: error.message,
                        icon: "error",
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
                <div className="newPassword">
                    <Grid container spacing={2}>
                        <Grid item xs={1}></Grid>
                        <Grid item xs={5} className="flex-center">
                            <img src={Pet} style={{ width: "100%" }} />
                        </Grid>
                        <Grid item xs={5} className="flex-center">
                            <div className="signup__form">
                                <h3 variant="h3" className="login__title">
                                    Đổi mật khẩu mới
                                </h3>
                                <h5 className="login__desc">
                                    Nhập mật khẩu mới cho{" "}
                                    <span style={{ color: "#70d8bd" }}>
                                        {email}
                                    </span>
                                </h5>
                                <form onSubmit={formik.handleSubmit}>
                                    <TextField
                                        id="newPassword"
                                        label={
                                            <span>
                                                Mật Khẩu Mới{" "}
                                                <span style={{ color: "red" }}>
                                                    *
                                                </span>
                                            </span>
                                        }
                                        variant="outlined"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        value={formik.values.newPassword}
                                        onChange={(e) => {
                                            formik.handleChange(e);
                                        }}
                                        fullWidth
                                        margin="dense"
                                        color="secondary"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() =>
                                                            setShowPassword(
                                                                !showPassword
                                                            )
                                                        }
                                                    >
                                                        {showPassword ? (
                                                            <VisibilityOffOutlined className="login__view__password__btn" />
                                                        ) : (
                                                            <VisibilityOutlined className="login__view__password__btn" />
                                                        )}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    {formik.touched.newPassword &&
                                        formik.errors.newPassword && (
                                            <div className="login__validation__error">
                                                {formik.errors.newPassword}
                                            </div>
                                        )}
                                    <TextField
                                        id="confirmPassword"
                                        label={
                                            <span>
                                                Xác Nhận Mật Khẩu{" "}
                                                <span style={{ color: "red" }}>
                                                    *
                                                </span>
                                            </span>
                                        }
                                        variant="outlined"
                                        type={
                                            showConfirmPassWord
                                                ? "text"
                                                : "password"
                                        }
                                        value={formik.values.confirmPassword}
                                        onChange={(e) => {
                                            formik.handleChange(e);
                                        }}
                                        fullWidth
                                        margin="dense"
                                        color="secondary"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() =>
                                                            setShowConfirmPassword(
                                                                !showConfirmPassWord
                                                            )
                                                        }
                                                    >
                                                        {showConfirmPassWord ? (
                                                            <VisibilityOffOutlined className="login__view__password__btn" />
                                                        ) : (
                                                            <VisibilityOutlined className="login__view__password__btn" />
                                                        )}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    {formik.touched.confirmPassword &&
                                        formik.errors.confirmPassword && (
                                            <div className="login__validation__error">
                                                {formik.errors.confirmPassword}
                                            </div>
                                        )}
                                    {!showLoadingModal ? (
                                        <Button
                                            className="login__btn"
                                            variant="contained"
                                            type="submit"
                                            fullWidth
                                        >
                                            Xác nhận
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
