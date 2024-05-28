import "./changePasswordStaff.css";
import * as React from "react";
import { Button, TextField, InputAdornment, IconButton } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { useState } from "react";
import { updateStaffPasswordThunk } from "../../../../../store/apiThunk/userThunk";
import { VisibilityOutlined, VisibilityOffOutlined } from "@mui/icons-material";
import Header from "../../../components/header/Header";
import { BackButton } from "../../../../../components/modal/backModal/backModal";
import LoadingModal from "../../../../../components/modal/loadingModal/loadingModal";
import {
    CHANGEPASSWORDSUCCESS,
    ERRORTEXT,
    SUCCESSTEXT,
} from "../../../../../components/text/notiText/notiText";

export default function ChangePasswordStaff() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const staffId = location.state?.staffId;

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showLoadingModal, setShowLoadingModal] = useState(false);

    const formik = useFormik({
        initialValues: {
            password: "",
            confirm_password: "",
        },
        validationSchema: Yup.object({
            password: Yup.string()
                .required("Mật khẩu không thể trống")
                .min(8, "Mật khẩu phải có ít nhất 8 chữ cái"),
            confirm_password: Yup.string()
                .required("Xác nhận mật khẩu không thể trống")
                .oneOf(
                    [Yup.ref("password"), null],
                    "Xác nhận mật khẩu chưa đúng"
                ),
        }),
        onSubmit: async (values) => {
            setShowLoadingModal(true);
            dispatch(
                updateStaffPasswordThunk({
                    id: staffId,
                    newPassword: values.password,
                })
            )
                .unwrap()
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
                        navigate(-1);
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
                        timer: 2000,
                        timerProgressBar: true,
                        scrollbarPadding: false,
                    });
                });
        },
    });

    return (
        <div className="changePasswordStaff">
            <Header
                title="Đổi Mật Khẩu Nhân Viên"
                subtitle="Cung cấp mật khẩu mới"
            />
            <form onSubmit={formik.handleSubmit}>
                {/* password */}
                <>
                    <TextField
                        id="password"
                        label={
                            <span>
                                Mật Khẩu <span style={{ color: "red" }}>*</span>
                            </span>
                        }
                        variant="outlined"
                        type={showPassword ? "text" : "password"}
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
                                            setShowPassword(!showPassword)
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
                    {formik.touched.password && formik.errors.password && (
                        <div className="login__validation__error">
                            <p>{formik.errors.password}</p>
                        </div>
                    )}
                </>
                {/* confirm_password */}
                <>
                    <TextField
                        id="confirm_password"
                        label={
                            <span>
                                Xác Nhận Mật Khẩu{" "}
                                <span style={{ color: "red" }}>*</span>
                            </span>
                        }
                        variant="outlined"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formik.values.confirm_password}
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
                                                !showConfirmPassword
                                            )
                                        }
                                    >
                                        {showConfirmPassword ? (
                                            <VisibilityOffOutlined className="login__view__password__btn" />
                                        ) : (
                                            <VisibilityOutlined className="login__view__password__btn" />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    {formik.touched.confirm_password &&
                        formik.errors.confirm_password && (
                            <div className="login__validation__error">
                                <p>{formik.errors.confirm_password}</p>
                            </div>
                        )}
                </>
                {!showLoadingModal ? (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "30px",
                            marginBottom: "50px",
                            marginTop: "30px",
                        }}
                    >
                        <BackButton type="update" />
                        <Button
                            className="login__btn"
                            variant="contained"
                            type="submit"
                        >
                            Cập Nhật
                        </Button>
                    </div>
                ) : (
                    <LoadingModal />
                )}
            </form>
        </div>
    );
}
