import React from "react";
import "./changePassword.css";
import { useDispatch } from "react-redux";
import { Button, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";
import { updatePasswordThunk } from "../../../store/apiThunk/userThunk";
import Header from "../../../pages/manager/components/header/Header";
import { VisibilityOutlined, VisibilityOffOutlined } from "@mui/icons-material";
import LoadingModal from "../../../components/modal/loadingModal/loadingModal";
import { signOut } from "firebase/auth";
import { auth } from "../../../../firebaseConfig";
import {
    ERRORTEXT,
    SUCCESSTEXT,
    UPDATEPASSWORDSUCCESS,
} from "../../../components/text/notiText/notiText";

export default function ChangePassword() {
    const dispatch = useDispatch();

    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassWord, setShowConfirmPassword] = useState(false);

    const formik = useFormik({
        initialValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
        validationSchema: Yup.object({
            oldPassword: Yup.string()
                .required("Mật khẩu cũ không thể trống")
                .min(8, "Mật khẩu phải có ít nhất 8 chữ số"),
            newPassword: Yup.string()
                .required("Mật khẩu mới không thể trống")
                .min(8, "Mật khẩu phải có ít nhất 8 chữ số"),
            confirmPassword: Yup.string()
                .required("Xác nhận mật khẩu không thể trống")
                .oneOf(
                    [Yup.ref("newPassword"), null],
                    "Xác nhận mật khẩu chưa đúng"
                ),
        }),
        onSubmit: async (values) => {
            try {
                setShowLoadingModal(true);
                dispatch(
                    updatePasswordThunk({
                        currentPassword: values.oldPassword,
                        newPassword: values.newPassword,
                    })
                ).then(() => {
                    setShowLoadingModal(false);
                    Swal.fire({
                        title: SUCCESSTEXT,
                        text: UPDATEPASSWORDSUCCESS,
                        icon: "success",
                        showCancelButton: false,
                        showConfirmButton: false,
                        background: "white",
                        timer: 1500,
                        timerProgressBar: true,
                        scrollbarPadding: false,
                    }).then(() =>
                        signOut(auth)
                            .then(() => {
                                localStorage.clear();
                                navigate("/");
                            })
                            .catch((error) => {
                                console.log({ error });
                            })
                    );
                });
            } catch (error) {
                setShowLoadingModal(false);
                Swal.fire({
                    title: ERRORTEXT,
                    text: error.message,
                    icon: "error",
                    showConfirmButton: false,
                    background: "white",
                    timer: 2000,
                    timerProgressBar: true,
                    scrollbarPadding: false,
                });
            }
        },
    });

    return (
        <div className="changePassword">
            <Header
                title="Cập nhật mật khẩu"
                subtitle="Cung cấp mật khẩu mới"
            />
            <div className="flex-column">
                <div className="field">
                    <TextField
                        id="oldPassword"
                        label={
                            <span>
                                Mật Khẩu Cũ{" "}
                                <span style={{ color: "red" }}>*</span>
                            </span>
                        }
                        variant="outlined"
                        value={formik.values.oldPassword}
                        onChange={(e) => {
                            formik.handleChange(e);
                        }}
                        fullWidth
                        margin="dense"
                        color="secondary"
                    />
                    {formik.touched.oldPassword &&
                        formik.errors.oldPassword && (
                            <div className="login__validation__error">
                                {formik.errors.oldPassword}
                            </div>
                        )}
                </div>
                <div className="field">
                    <TextField
                        id="newPassword"
                        label={
                            <span>
                                Mật Khẩu Mới{" "}
                                <span style={{ color: "red" }}>*</span>
                            </span>
                        }
                        variant="outlined"
                        type={showPassword ? "text" : "password"}
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
                                    {showPassword ? (
                                        <VisibilityOffOutlined
                                            style={{
                                                color: "#70d8bd",
                                                cursor: "pointer",
                                            }}
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                        />
                                    ) : (
                                        <VisibilityOutlined
                                            style={{
                                                color: "#70d8bd",
                                                cursor: "pointer",
                                            }}
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                        />
                                    )}
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
                </div>
                <div className="field">
                    <TextField
                        id="confirmPassword"
                        label={
                            <span>
                                Xác Nhận Mật Khẩu{" "}
                                <span style={{ color: "red" }}>*</span>
                            </span>
                        }
                        variant="outlined"
                        type={showConfirmPassWord ? "text" : "password"}
                        value={formik.values.confirmPassword}
                        onChange={(e) => {
                            formik.handleChange(e);
                        }}
                        fullWidth
                        color="secondary"
                        margin="dense"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    {showConfirmPassWord ? (
                                        <VisibilityOffOutlined
                                            style={{
                                                color: "#70d8bd",
                                                cursor: "pointer",
                                            }}
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    !showConfirmPassWord
                                                )
                                            }
                                        />
                                    ) : (
                                        <VisibilityOutlined
                                            style={{
                                                color: "#70d8bd",
                                                cursor: "pointer",
                                            }}
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    !showConfirmPassWord
                                                )
                                            }
                                        />
                                    )}
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
                </div>
                {!showLoadingModal ? (
                    <Button
                        variant="contained"
                        className="btn"
                        onClick={formik.handleSubmit}
                    >
                        Xác Nhận
                    </Button>
                ) : (
                    <LoadingModal />
                )}
            </div>
        </div>
    );
}
