import * as React from "react";
import "./updatePackage.css";
import { Button, TextField } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import {
    getPackagesThunk,
    getPackageDetailThunk,
    updatePackageThunk,
} from "../../../../../store/apiThunk/packageThunk";
import { packageDetailSelector } from "../../../../../store/sellectors";
import { useEffect } from "react";
import Header from "../../../components/header/Header";
import { BackButton } from "../../../../../components/modal/backModal/backModal";
import LoadingModal from "../../../../../components/modal/loadingModal/loadingModal";
import { FormatCurrency } from "../../../../../components/format/formatAmount/formatAmount";
import {
    ERRORTEXT,
    SUCCESSTEXT,
    UPDATEPACKAGESUCCESS,
} from "../../../../../components/text/notiText/notiText";

export default function UpdatePackage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const packageId = location.state?.packageId;
    const packageDetail = useSelector(packageDetailSelector);
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [showRender, setShowRender] = useState(false);

    useEffect(() => {
        setShowRender(true);
        dispatch(getPackageDetailThunk(packageId)).then(() =>
            setShowRender(false)
        );
    }, [packageId]);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            description: packageDetail.description,
            duration: packageDetail.duration,
            promotionAmount: packageDetail.promotionAmount,
            promotionDiscount: packageDetail.promotionDiscount,
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
                updatePackageThunk({
                    id: packageId,
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
                        text: UPDATEPACKAGESUCCESS,
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
        <div className="updatePackage">
            <Header
                title="Cập Nhật Gói Đăng Ký"
                subtitle="Cung cấp thông tin gói đăng ký"
            />
            {!showRender ? (
                <form onSubmit={formik.handleSubmit}>
                    {/* description */}
                    <>
                        <TextField
                            id="description"
                            label={
                                <span>
                                    Loại Gói{" "}
                                    <span style={{ color: "red" }}>*</span>
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
                                    Giá Tiền{" "}
                                    <span style={{ color: "red" }}>*</span>
                                </span>
                            }
                            variant="outlined"
                            value={FormatCurrency(
                                formik.values.promotionAmount
                            )}
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
                            <BackButton type="update" />
                            <Button
                                className="login__btn"
                                style={{
                                    backgroundColor: "#70d8bd",
                                }}
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
            ) : (
                <LoadingModal />
            )}
        </div>
    );
}
