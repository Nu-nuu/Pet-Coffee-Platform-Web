import "./verifyAccount.css";
import { useState } from "react";
import {
    Button,
    TextField,
    Grid,
    InputAdornment,
    IconButton,
    CssBaseline,
    ThemeProvider,
} from "@mui/material";
import { VisibilityOutlined, VisibilityOffOutlined } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import {
    sendOTPThunk,
    verifyUserThunk,
    verifyForgotThunk,
    sendOTPForgotPasswordThunk,
    getUserDataThunk,
} from "../../../store/apiThunk/userThunk";
import Swal from "sweetalert2";
import Pet from "../../../assets/cutecatdog.png";
import { ColorModeContext, useMode } from "./../../../theme";
import LoadingModal from "../../../components/modal/loadingModal/loadingModal";
import {
    ERRORTEXT,
    SENDMAILSUCCESS,
    SUCCESSTEXT,
    VERIFYFAIL,
    VERIFYSUCCESS,
} from "../../../components/text/notiText/notiText";

export default function VerifyAccount() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [theme, colorMode] = useMode();

    const email = location?.state?.email;
    const direction = location?.state?.direction;

    const [showCode, setShowCode] = useState(false);
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [isSent, setIsSent] = useState(true);

    const formik = useFormik({
        initialValues: {
            code: "",
        },
        validationSchema: Yup.object({
            code: Yup.string().required("Mã xác thực không thể trống"),
        }),
        onSubmit: async (values) => {
            setIsSent(true);
            setShowLoadingModal(true);
            {
                direction === "signup"
                    ? dispatch(verifyUserThunk({ otp: values.code }))
                          .unwrap()
                          .then((res) => {
                              setShowLoadingModal(false);
                              setIsSent(true);
                              if (res === true) {
                                  dispatch(getUserDataThunk()).then(() => {
                                      Swal.fire({
                                          title: SUCCESSTEXT,
                                          text: VERIFYSUCCESS,
                                          icon: "success",
                                          showCancelButton: false,
                                          showConfirmButton: false,
                                          background: "white",
                                          timer: 1500,
                                          timerProgressBar: true,
                                          scrollbarPadding: false,
                                      }).then(() => {
                                          navigate("/becomeManager", {
                                              state: { email: email },
                                          });
                                      });
                                  });
                              } else {
                                  Swal.fire({
                                      title: ERRORTEXT,
                                      text: VERIFYFAIL,
                                      icon: "error",
                                      showConfirmButton: false,
                                      showCancelButton: false,
                                      background: "white",
                                      timer: 1500,
                                      timerProgressBar: true,
                                      scrollbarPadding: false,
                                  });
                                  values.code = "";
                              }
                          })
                          .catch((err) => {
                              setShowLoadingModal(false);
                              Swal.fire({
                                  title: ERRORTEXT,
                                  text: err.message,
                                  icon: "error",
                                  showConfirmButton: false,
                                  background: "white",
                                  timer: 1500,
                                  timerProgressBar: true,
                                  scrollbarPadding: false,
                              });
                              values.code = "";
                          })
                    : dispatch(
                          verifyForgotThunk({ email: email, otp: values.code })
                      )
                          .unwrap()
                          .then((res) => {
                              setShowLoadingModal(false);
                              setIsSent(true);
                              if (res === true) {
                                  Swal.fire({
                                      title: SUCCESSTEXT,
                                      text: VERIFYSUCCESS,
                                      icon: "success",
                                      showCancelButton: false,
                                      showConfirmButton: false,
                                      background: "white",
                                      timer: 1500,
                                      timerProgressBar: true,
                                      scrollbarPadding: false,
                                  }).then(() => {
                                      navigate("/newPassword", {
                                          state: {
                                              email: email,
                                          },
                                      });
                                  });
                              } else {
                                  Swal.fire({
                                      title: ERRORTEXT,
                                      text: VERIFYFAIL,
                                      icon: "error",
                                      showConfirmButton: false,
                                      background: "white",
                                      timer: 1500,
                                      timerProgressBar: true,
                                      scrollbarPadding: false,
                                  });
                                  values.code = "";
                              }
                          })
                          .catch((err) => {
                              setShowLoadingModal(false);
                              Swal.fire({
                                  title: ERRORTEXT,
                                  text: err.message,
                                  icon: "error",
                                  showConfirmButton: false,
                                  background: "white",
                                  timer: 1500,
                                  timerProgressBar: true,
                                  scrollbarPadding: false,
                              });
                              values.code = "";
                          });
            }
        },
    });

    const sendEmail = () => {
        setShowLoadingModal(true);
        {
            direction === "signup"
                ? dispatch(sendOTPThunk())
                      .then(() => {
                          setShowLoadingModal(false);
                          setIsSent(false);
                          Swal.fire({
                              title: SUCCESSTEXT,
                              text: SENDMAILSUCCESS,
                              icon: "success",
                              showCancelButton: false,
                              showConfirmButton: false,
                              background: "white",
                              timer: 2000,
                              timerProgressBar: true,
                              scrollbarPadding: false,
                          });
                      })
                      .catch((err) => {
                          setShowLoadingModal(false);
                          Swal.fire({
                              title: ERRORTEXT,
                              text: err.message,
                              icon: "error",
                              showConfirmButton: false,
                              background: "white",
                              timer: 1500,
                              timerProgressBar: true,
                              scrollbarPadding: false,
                          });
                      })
                : dispatch(sendOTPForgotPasswordThunk(email))
                      .then(() => {
                          setShowLoadingModal(false);
                          setIsSent(false);
                          Swal.fire({
                              title: SUCCESSTEXT,
                              text: SENDMAILSUCCESS,
                              icon: "success",
                              showCancelButton: false,
                              showConfirmButton: false,
                              background: "white",
                              timer: 2000,
                              timerProgressBar: true,
                              scrollbarPadding: false,
                          });
                      })
                      .catch((err) => {
                          setShowLoadingModal(false);
                          Swal.fire({
                              title: ERRORTEXT,
                              text: err.message,
                              icon: "error",
                              showConfirmButton: false,
                              background: "white",
                              timer: 1500,
                              timerProgressBar: true,
                              scrollbarPadding: false,
                          });
                      });
        }
    };

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div className="verifyAccount">
                    <Grid container spacing={2}>
                        <Grid item xs={1}></Grid>
                        <Grid item xs={5} className="flex-center">
                            <img src={Pet} style={{ width: "100%" }} />
                        </Grid>
                        <Grid item xs={5} className="flex-center">
                            <div className="signup__form">
                                <h3 variant="h3" className="login__title">
                                    Xác thực tài khoản
                                </h3>
                                <h5 className="login__desc">
                                    Chúng tôi đã gửi mã xác thực tới{" "}
                                    <a
                                        style={{ textDecoration: "none" }}
                                        href="https://mail.google.com/"
                                        target="_blank"
                                    >
                                        <span style={{ color: "#70d8bd" }}>
                                            {email}
                                        </span>
                                    </a>
                                    !
                                </h5>
                                <form onSubmit={formik.handleSubmit}>
                                    <div>
                                        <TextField
                                            className="login__input"
                                            id="code"
                                            label={
                                                <span>
                                                    Mã Xác Thực{" "}
                                                    <span
                                                        style={{ color: "red" }}
                                                    >
                                                        *
                                                    </span>
                                                </span>
                                            }
                                            variant="outlined"
                                            type={
                                                showCode ? "text" : "password"
                                            }
                                            value={formik.values.code}
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
                                                                setShowCode(
                                                                    !showCode
                                                                )
                                                            }
                                                        >
                                                            {showCode ? (
                                                                <VisibilityOffOutlined className="login__view__password__btn" />
                                                            ) : (
                                                                <VisibilityOutlined className="login__view__password__btn" />
                                                            )}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        {formik.touched.code &&
                                        formik.errors.code ? (
                                            <div className="login__validation__error">
                                                {formik.errors.code}
                                            </div>
                                        ) : null}
                                    </div>
                                    <p className="login__link">
                                        Chưa nhận được?{" "}
                                        <span
                                            style={{
                                                color: isSent
                                                    ? "#70d8bd"
                                                    : "gray",
                                                cursor: isSent
                                                    ? "pointer"
                                                    : "text",
                                            }}
                                            disabled={!isSent}
                                            onClick={() => {
                                                isSent ? sendEmail() : null;
                                            }}
                                        >
                                            Gửi lại!
                                        </span>
                                    </p>
                                    {!showLoadingModal ? (
                                        <Button
                                            className="login__btn"
                                            variant="contained"
                                            type="submit"
                                            fullWidth
                                        >
                                            Xác thực
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
