import * as React from "react";
import "./createPromotion.css";
import { Button, TextField, Grid, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import {
    createPromotionThunk,
    getPromotionsFromShopThunk,
} from "../../../../../store/apiThunk/promotionThunk";
import Header from "../../../components/header/Header";
import { BackButton } from "../../../../../components/modal/backModal/backModal";
import LoadingModal from "../../../../../components/modal/loadingModal/loadingModal";
import {
    ADDPROMOTIONSUCCESS,
    ERRORTEXT,
    SUCCESSTEXT,
} from "../../../../../components/text/notiText/notiText";

export default function CreatePromotion() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const shopId = location.state?.shopId;
    const [showLoadingModal, setShowLoadingModal] = useState(false);

    const formik = useFormik({
        initialValues: {
            from: "",
            to: "",
            percent: "",
            quantity: "",
        },
        validationSchema: Yup.object({
            from: Yup.string().required("Xin hãy chọn ngày bắt đầu"),
            to: Yup.string().required("Xin hãy chọn ngày kết thúc"),
            percent: Yup.number().required("Mức giảm giá không thể trống"),
            quantity: Yup.number().required("Số lượng không thể trống"),
        }),
        onSubmit: async (values) => {
            setShowLoadingModal(true);
            dispatch(
                createPromotionThunk({
                    petCoffeeShopId: shopId,
                    from: values.from,
                    to: values.to,
                    percent: values.percent,
                    quantity: values.quantity,
                })
            )
                .unwrap()
                .then(() => {
                    setShowLoadingModal(false);
                    Swal.fire({
                        title: SUCCESSTEXT,
                        text: ADDPROMOTIONSUCCESS,
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

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(tomorrow.getHours() + 7);
    const tomorrowFormatted = tomorrow.toISOString().split("T")[0];

    return (
        <div className="createPromotion">
            <Header
                title="Tạo khuyến mãi"
                subtitle="Cung cấp thông tin khuyến mãi"
            />
            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        {/* from */}
                        <Typography variant="body1">
                            Ngày Bắt Đầu <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <TextField
                            id="from"
                            variant="outlined"
                            value={formik.values.from}
                            onChange={formik.handleChange}
                            fullWidth
                            autoComplete="from"
                            margin="dense"
                            type="date"
                            inputProps={{
                                min: tomorrowFormatted,
                            }}
                            color="secondary"
                        />
                        {formik.touched.from && formik.errors.from && (
                            <div className="login__validation__error">
                                <p>{formik.errors.from}</p>
                            </div>
                        )}
                    </Grid>
                    <Grid item xs={6}>
                        {/* to */}
                        <Typography variant="body1">
                            Ngày Kết Thúc{" "}
                            <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <TextField
                            id="to"
                            variant="outlined"
                            value={formik.values.to}
                            onChange={formik.handleChange}
                            fullWidth
                            autoComplete="to"
                            margin="dense"
                            type="date"
                            inputProps={{
                                min: formik.values.from || "",
                            }}
                            color="secondary"
                        />
                        {formik.touched.to && formik.errors.to && (
                            <div className="login__validation__error">
                                <p>{formik.errors.to}</p>
                            </div>
                        )}
                    </Grid>
                </Grid>
                {/* percent */}
                <>
                    <TextField
                        id="percent"
                        label={
                            <span>
                                Mức Giảm Giá (%){" "}
                                <span style={{ color: "red" }}>*</span>
                            </span>
                        }
                        variant="outlined"
                        value={formik.values.percent}
                        onChange={formik.handleChange}
                        fullWidth
                        autoComplete="percent"
                        margin="dense"
                        color="secondary"
                        type="number"
                    />
                    {formik.touched.percent && formik.errors.percent && (
                        <div className="login__validation__error">
                            <p>{formik.errors.percent}</p>
                        </div>
                    )}
                </>
                {/* quantity */}
                <>
                    <TextField
                        id="quantity"
                        label={
                            <span>
                                Số Lượng <span style={{ color: "red" }}>*</span>
                            </span>
                        }
                        variant="outlined"
                        value={formik.values.quantity}
                        onChange={formik.handleChange}
                        fullWidth
                        autoComplete="quantity"
                        margin="dense"
                        color="secondary"
                        type="number"
                    />
                    {formik.touched.quantity && formik.errors.quantity && (
                        <div className="login__validation__error">
                            <p>{formik.errors.quantity}</p>
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
