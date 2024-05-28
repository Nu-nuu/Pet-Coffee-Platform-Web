import * as React from "react";
import "./createPackage.css";
import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import {
    getPackagesThunk,
    createPackageThunk,
} from "../../../../../store/apiThunk/packageThunk";
import Header from "../../../components/header/Header";
import { BackButton } from "../../../../../components/modal/backModal/backModal";
import LoadingModal from "../../../../../components/modal/loadingModal/loadingModal";
import { FormatCurrency } from "../../../../../components/format/formatAmount/formatAmount";
import { ADDPACKAGESUCCESS, ERRORTEXT, SUCCESSTEXT } from "../../../../../components/text/notiText/notiText";

export default function CreatePackage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showLoadingModal, setShowLoadingModal] = useState(false);

    const formik = useFormik({
        initialValues: {
            description: "",
            duration: "",
            promotionAmount: "",
            promotionDiscount: "",
        },
        validationSchema: Yup.object({
            description: Yup.string().required("Loại gói không thể trống"),
            duration: Yup.number().required("Thời hạn không thể trống"),
            promotionAmount: Yup.string()
                .required("Giá tiền không thể trống")
                .test("valid-amount", "Giá tiền ít nhất là 10,000", (value) => {
                    const amount = parseInt(value);
                    return amount >= 10000;
                })
                .test(
                    "valid-format",
                    "Giá tiền phải chia hết cho 1,000",
                    (value) => {
                        const amount = parseInt(value);
                        return amount % 1000 === 0;
                    }
                ),
            promotionDiscount: Yup.number(),
        }),
        onSubmit: async (values) => {
            setShowLoadingModal(true);
            dispatch(
                createPackageThunk({
                    description: values.description,
                    duration: values.duration,
                    promotionAmount: values.promotionAmount,
                    promotionDiscount: values.promotionDiscount,
                })
            )
                .unwrap()
                .then(() => {
                    setShowLoadingModal(false);
                    Swal.fire({
                        title: SUCCESSTEXT,
                        text: ADDPACKAGESUCCESS,
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

    const handleInputChange = (event, formik) => {
        let inputValue = event.target.value;
        let rawValue = inputValue.replace(/[^0-9]/g, "");
        formik.setFieldValue("promotionAmount", rawValue);
        event.target.value = FormatCurrency(rawValue);
    };

    return (
        <div className="createPackage">
            <Header
                title="Tạo Gói Đăng Ký"
                subtitle="Cung cấp thông tin gói đăng ký"
            />
            <form onSubmit={formik.handleSubmit}>
                {/* description */}
                <>
                    <TextField
                        id="description"
                        label={
                            <span>
                                Loại Gói <span style={{ color: "red" }}>*</span>
                            </span>
                        }
                        variant="outlined"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        fullWidth
                        autoComplete="description"
                        margin="dense"
                        color="secondary"
                    />
                    {formik.touched.description &&
                        formik.errors.description && (
                            <div className="login__validation__error">
                                <p>{formik.errors.description}</p>
                            </div>
                        )}
                </>
                {/* duration */}
                <>
                    <TextField
                        id="duration"
                        label={
                            <span>
                                Thời Hạn (tháng){" "}
                                <span style={{ color: "red" }}>*</span>
                            </span>
                        }
                        variant="outlined"
                        value={formik.values.duration}
                        onChange={formik.handleChange}
                        fullWidth
                        autoComplete="duration"
                        margin="dense"
                        type="number"
                        color="secondary"
                    />
                    {formik.touched.duration && formik.errors.duration && (
                        <div className="login__validation__error">
                            <p>{formik.errors.duration}</p>
                        </div>
                    )}
                </>
                {/* promotionAmount */}
                <>
                    <TextField
                        id="promotionAmount"
                        label={
                            <span>
                                Giá Tiền <span style={{ color: "red" }}>*</span>
                            </span>
                        }
                        variant="outlined"
                        value={FormatCurrency(formik.values.promotionAmount)}
                        onChange={(e) => handleInputChange(e, formik)}
                        fullWidth
                        autoComplete="promotionAmount"
                        margin="dense"
                        type="string"
                        color="secondary"
                    />
                    {formik.touched.promotionAmount &&
                        formik.errors.promotionAmount && (
                            <div className="login__validation__error">
                                <p>{formik.errors.promotionAmount}</p>
                            </div>
                        )}
                </>
                {/* promotionDiscount */}
                <>
                    <TextField
                        id="promotionDiscount"
                        label={"Chiết Khấu (%)"}
                        variant="outlined"
                        value={formik.values.promotionDiscount}
                        onChange={formik.handleChange}
                        fullWidth
                        autoComplete="promotionDiscount"
                        margin="dense"
                        type="number"
                        color="secondary"
                    />
                    {formik.touched.promotionDiscount &&
                        formik.errors.promotionDiscount && (
                            <div className="login__validation__error">
                                <p>{formik.errors.promotionDiscount}</p>
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
                        <BackButton />
                        <Button
                            className="login__btn"
                            style={{
                                backgroundColor: "#70d8bd",
                            }}
                            variant="contained"
                            type="submit"
                        >
                            Tạo
                        </Button>
                    </div>
                ) : (
                    <LoadingModal />
                )}
            </form>
        </div>
    );
}
