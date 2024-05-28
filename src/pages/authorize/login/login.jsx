import "./login.css";
import { useState } from "react";
import {
    Button,
    TextField,
    Grid,
    InputAdornment,
    IconButton,
} from "@mui/material";
import { VisibilityOutlined, VisibilityOffOutlined } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import {
    getUserDataThunk,
    loginGGThunk,
    loginThunk,
} from "../../../store/apiThunk/userThunk";
import Swal from "sweetalert2";
import { auth } from "../../../../firebaseConfig";
import Google from "../../../assets/google.png";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import Pet from "../../../assets/cutecatdog.png";
import { getPackagesThunk } from "../../../store/apiThunk/packageThunk";
import {
    getManagerIncomeThunk,
    getManagerOutcomeThunk,
    getPlatformIncomeThunk,
} from "../../../store/apiThunk/walletThunk";
import {
    getAllNotificationsThunk,
    getUnreadNotificationsThunk,
} from "../../../store/apiThunk/notificationThunk";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./../../../theme";
import LoadingModal from "../../../components/modal/loadingModal/loadingModal";
import {
    ERRORTEXT,
    LOGINSUCCESS,
    NOTALLOW,
    SUCCESSTEXT,
} from "../../../components/text/notiText/notiText";

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [theme, colorMode] = useMode();
    const [showPassword, setShowPassword] = useState(false);
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [showLoadingGGModal, setShowLoadingGGModal] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .required("Email không thể trống")
                .email("Email sai định dạng"),
            password: Yup.string()
                .required("Mật khẩu không thể trống")
                .min(8, "Mật khẩu phải có ít nhất 8 chữ số"),
        }),
        onSubmit: async (values) => {
            setShowLoadingModal(true);
            dispatch(
                loginThunk({
                    email: values.email,
                    password: values.password,
                })
            )
                .unwrap()
                .then((response) => {
                    localStorage.setItem(
                        "accessToken",
                        JSON.stringify(response.accessToken)
                    );
                    dispatch(getUserDataThunk())
                        .unwrap()
                        .then((res) => {
                            switch (res.role) {
                                case "Customer":
                                    setShowLoadingModal(false);
                                    Swal.fire({
                                        title: SUCCESSTEXT,
                                        text: LOGINSUCCESS,
                                        icon: "success",
                                        showCancelButton: false,
                                        showConfirmButton: false,
                                        background: "white",
                                        timer: 1500,
                                        timerProgressBar: true,
                                        scrollbarPadding: false,
                                    }).then(() => {
                                        if (res.status !== "Verifying") {
                                            navigate("/becomeManager", {
                                                state: { email: res.email },
                                            });
                                        } else {
                                            navigate(`/verifyAccount`, {
                                                state: {
                                                    email: res.email,
                                                    direction: "signup",
                                                },
                                            });
                                        }
                                    });
                                    break;
                                case "Manager":
                                    dispatch(getPackagesThunk());
                                    dispatch(getManagerOutcomeThunk());
                                    dispatch(getAllNotificationsThunk());
                                    dispatch(getUnreadNotificationsThunk());
                                    dispatch(getManagerIncomeThunk()).then(
                                        () => {
                                            setShowLoadingModal(false);
                                            Swal.fire({
                                                title: SUCCESSTEXT,
                                                text: LOGINSUCCESS,
                                                icon: "success",
                                                showCancelButton: false,
                                                showConfirmButton: false,
                                                background: "white",
                                                timer: 1500,
                                                timerProgressBar: true,
                                                scrollbarPadding: false,
                                            }).then(() => {
                                                navigate("/manager");
                                            });
                                        }
                                    );
                                    break;
                                case "Admin":
                                    dispatch(getAllNotificationsThunk());
                                    dispatch(getUnreadNotificationsThunk());
                                    dispatch(getPlatformIncomeThunk()).then(
                                        () => {
                                            setShowLoadingModal(false);
                                            Swal.fire({
                                                title: SUCCESSTEXT,
                                                text: LOGINSUCCESS,
                                                icon: "success",
                                                showCancelButton: false,
                                                showConfirmButton: false,
                                                background: "white",
                                                timer: 1500,
                                                timerProgressBar: true,
                                                scrollbarPadding: false,
                                            }).then(() => {
                                                navigate("/admin");
                                            });
                                        }
                                    );
                                    break;
                                case "PlatformStaff":
                                    dispatch(getAllNotificationsThunk());
                                    dispatch(
                                        getUnreadNotificationsThunk()
                                    ).then(() => {
                                        setShowLoadingModal(false);
                                        Swal.fire({
                                            title: SUCCESSTEXT,
                                            text: LOGINSUCCESS,
                                            icon: "success",
                                            showCancelButton: false,
                                            showConfirmButton: false,
                                            background: "white",
                                            timer: 1500,
                                            timerProgressBar: true,
                                            scrollbarPadding: false,
                                        }).then(() => {
                                            navigate("/staff");
                                        });
                                    });
                                    break;
                                case "Staff":
                                    localStorage.clear();
                                    setShowLoadingModal(false);
                                    Swal.fire({
                                        title: ERRORTEXT,
                                        text: NOTALLOW,
                                        icon: "error",
                                        showConfirmButton: false,
                                        background: "white",
                                        timer: 1500,
                                        timerProgressBar: true,
                                        scrollbarPadding: false,
                                    });
                                    break;
                                default:
                                    break;
                            }
                        });
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

    const SignInUsingGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const token = await result.user.getIdToken();
            setShowLoadingGGModal(true);
            dispatch(loginGGThunk({ firebaseToken: token }))
                .unwrap()
                .then((res) => {
                    localStorage.setItem(
                        "accessToken",
                        JSON.stringify(res.accessToken)
                    );
                    dispatch(getUserDataThunk())
                        .unwrap()
                        .then((res) => {
                            switch (res.role) {
                                case "Customer":
                                    setShowLoadingGGModal(false);
                                    Swal.fire({
                                        title: SUCCESSTEXT,
                                        text: LOGINSUCCESS,
                                        icon: "success",
                                        showCancelButton: false,
                                        showConfirmButton: false,
                                        background: "white",
                                        timer: 1500,
                                        timerProgressBar: true,
                                        scrollbarPadding: false,
                                    }).then(() => {
                                        if (res.status !== "Verifying") {
                                            navigate("/becomeManager", {
                                                state: { email: res.email },
                                            });
                                        } else {
                                            navigate(`/verifyAccount`, {
                                                state: {
                                                    email: res.email,
                                                    direction: "signup",
                                                },
                                            });
                                        }
                                    });
                                    break;
                                case "Manager":
                                    dispatch(getPackagesThunk());
                                    dispatch(getManagerOutcomeThunk());
                                    dispatch(getAllNotificationsThunk());
                                    dispatch(getUnreadNotificationsThunk());
                                    dispatch(getManagerIncomeThunk()).then(
                                        () => {
                                            setShowLoadingGGModal(false);
                                            Swal.fire({
                                                title: SUCCESSTEXT,
                                                text: LOGINSUCCESS,
                                                icon: "success",
                                                showCancelButton: false,
                                                showConfirmButton: false,
                                                background: "white",
                                                timer: 1500,
                                                timerProgressBar: true,
                                                scrollbarPadding: false,
                                            }).then(() => {
                                                navigate("/manager");
                                            });
                                        }
                                    );
                                    break;
                                case "Admin":
                                    dispatch(getAllNotificationsThunk());
                                    dispatch(getUnreadNotificationsThunk());
                                    dispatch(getPlatformIncomeThunk()).then(
                                        () => {
                                            setShowLoadingGGModal(false);
                                            Swal.fire({
                                                title: SUCCESSTEXT,
                                                text: LOGINSUCCESS,
                                                icon: "success",
                                                showCancelButton: false,
                                                showConfirmButton: false,
                                                background: "white",
                                                timer: 1500,
                                                timerProgressBar: true,
                                                scrollbarPadding: false,
                                            }).then(() => {
                                                navigate("/admin");
                                            });
                                        }
                                    );
                                    break;
                                case "PlatformStaff":
                                    dispatch(getAllNotificationsThunk());
                                    dispatch(
                                        getUnreadNotificationsThunk()
                                    ).then(() => {
                                        setShowLoadingGGModal(false);
                                        Swal.fire({
                                            title: SUCCESSTEXT,
                                            text: LOGINSUCCESS,
                                            icon: "success",
                                            showCancelButton: false,
                                            showConfirmButton: false,
                                            background: "white",
                                            timer: 1500,
                                            timerProgressBar: true,
                                            scrollbarPadding: false,
                                        }).then(() => {
                                            navigate("/staff");
                                        });
                                    });
                                    break;
                                case "Staff":
                                    localStorage.clear();
                                    setShowLoadingGGModal(false);
                                    Swal.fire({
                                        title: ERRORTEXT,
                                        text: NOTALLOW,
                                        icon: "error",
                                        showConfirmButton: false,
                                        background: "white",
                                        timer: 1500,
                                        timerProgressBar: true,
                                        scrollbarPadding: false,
                                    });
                                    break;
                                default:
                                    break;
                            }
                        });
                })
                .catch((error) => {
                    setShowLoadingGGModal(false);
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
        } catch (error) {
            setShowLoadingGGModal(false);
            Swal.fire({
                title: ERRORTEXT,
                text: error.message,
                icon: "error",
                background: "white",
                timer: 1500,
                timerProgressBar: true,
                scrollbarPadding: false,
            });
        }
    };

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div className="login">
                    <Grid container spacing={2}>
                        <Grid item xs={1}></Grid>
                        <Grid item xs={5} className="flex-center">
                            <img src={Pet} alt="" />
                        </Grid>
                        <Grid item xs={5} className="flex-center">
                            <div className="login__form">
                                <h3 className="login__title">đăng nhập</h3>
                                <form onSubmit={formik.handleSubmit}>
                                    <TextField
                                        id="email"
                                        label={
                                            <span>
                                                Email{" "}
                                                <span style={{ color: "red" }}>
                                                    *
                                                </span>
                                            </span>
                                        }
                                        variant="outlined"
                                        value={formik.values.email}
                                        onChange={(e) => {
                                            formik.handleChange(e);
                                        }}
                                        type="email"
                                        fullWidth
                                        color="secondary"
                                        margin="dense"
                                    />
                                    {formik.touched.email &&
                                    formik.errors.email ? (
                                        <div className="login__validation__error">
                                            {formik.errors.email}
                                        </div>
                                    ) : null}
                                    <TextField
                                        id="password"
                                        label={
                                            <span>
                                                Mật Khẩu{" "}
                                                <span style={{ color: "red" }}>
                                                    *
                                                </span>
                                            </span>
                                        }
                                        variant="outlined"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        value={formik.values.password}
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
                                    {formik.touched.password &&
                                    formik.errors.password ? (
                                        <div className="login__validation__error">
                                            {formik.errors.password}
                                        </div>
                                    ) : null}
                                    <p style={{ textAlign: "right" }}>
                                        <Link
                                            to="/forgotPassword"
                                            variant="body2"
                                            className="login__forgot"
                                        >
                                            Quên mật khẩu?
                                        </Link>
                                    </p>
                                    {!showLoadingModal ? (
                                        <Button
                                            className="login__btn"
                                            variant="contained"
                                            type="submit"
                                            fullWidth
                                        >
                                            Đăng nhập
                                        </Button>
                                    ) : (
                                        <LoadingModal />
                                    )}

                                    <p className="login__link">
                                        Không có tài khoản?
                                        <Link
                                            to="/signup"
                                            variant="body2"
                                            className="login__link__btn"
                                        >
                                            <span
                                                style={{
                                                    color: "#70d8bd",
                                                }}
                                            >
                                                {" "}
                                                Đăng ký ngay!
                                            </span>
                                        </Link>
                                    </p>
                                </form>
                                <div className="login__google">
                                    <div className="login__flex">
                                        <div className="login__divide"></div>
                                        <span style={{ color: "#8b8b8b" }}>
                                            hoặc đăng nhập với
                                        </span>
                                        <div className="login__divide"></div>
                                    </div>
                                    {!showLoadingGGModal ? (
                                        <div
                                            onClick={() => SignInUsingGoogle()}
                                            className="login__google__btn flex-center"
                                        >
                                            <img
                                                src={Google}
                                                className="login__google__img"
                                            />
                                            <span className="login__google__text">
                                                Google
                                            </span>
                                        </div>
                                    ) : (
                                        <LoadingModal />
                                    )}
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={1}></Grid>
                    </Grid>
                </div>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}
