import * as React from "react";
import "./updateProduct.css";
import { Button, TextField, Grid } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import {
    getProductDetailThunk,
    getProductsFromShopThunk,
    updateProductThunk,
} from "../../../../../store/apiThunk/productThunk";
import { productDetailSelector } from "../../../../../store/sellectors";
import { useEffect } from "react";
import NoProduct from "../../../../../assets/noProduct.png";
import Header from "../../../components/header/Header";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { BackButton } from "../../../../../components/modal/backModal/backModal";
import LoadingModal from "../../../../../components/modal/loadingModal/loadingModal";
import { FormatCurrency } from "../../../../../components/format/formatAmount/formatAmount";
import {
    ERRORTEXT,
    SUCCESSTEXT,
    UPDATEPRODUCTSUCCESS,
} from "../../../../../components/text/notiText/notiText";

export default function UpdateProduct() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const productId = location.state?.productId;
    const shopId = location.state?.shopId;
    const productDetail = useSelector(productDetailSelector);
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [showRender, setShowRender] = useState(false);
    const [formData, setFormData] = useState(new FormData());

    useEffect(() => {
        setShowRender(true);
        dispatch(getProductDetailThunk(productId)).then(() =>
            setShowRender(false)
        );
    }, [productId]);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: productDetail.name,
            image: productDetail.image,
            price: productDetail.price,
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Tên không thể trống"),
            image: Yup.string().required("Xin hãy chọn ảnh"),
            price: Yup.string()
                .required("Giá không thể trống")
                .test(
                    "valid-format",
                    "Giá phải chia hết cho 1,000",
                    (value) => {
                        const amount = parseInt(value);
                        return amount % 1000 === 0;
                    }
                ),
        }),
        onSubmit: async (values) => {
            formData.append("Id", productId);
            formData.append("Name", values.name);
            formData.append("Price", values.price);
            formData.append("Images", values.image);

            setShowLoadingModal(true);
            dispatch(updateProductThunk(formData))
                .unwrap()
                .then(() => {
                    setShowLoadingModal(false);
                    Swal.fire({
                        title: SUCCESSTEXT,
                        text: UPDATEPRODUCTSUCCESS,
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

    const handleImageSelect = (event) => {
        const files = event.target?.files;
        if (files && files.length > 0) {
            const file = files[0];
            formData.set("Images", file);
            formik.setFieldValue("image", URL.createObjectURL(file));
        }
    };

    const handleInputChange = (event, formik) => {
        let inputValue = event.target.value;
        let rawValue = inputValue.replace(/[^0-9]/g, "");
        formik.setFieldValue("price", rawValue);
        event.target.value = FormatCurrency(rawValue);
    };

    return (
        <div className="updateProduct">
            <Header
                title="Cập nhật đồ uống"
                subtitle="Cung cấp thông tin đồ uống"
            />
            {!showRender ? (
                <form onSubmit={formik.handleSubmit}>
                    <input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={handleImageSelect}
                        style={{ display: "none" }}
                    />
                    <Grid
                        container
                        spacing={4}
                        display="flex"
                        alignItems="center"
                    >
                        <Grid item xs={9}>
                            {/* name */}
                            <>
                                <TextField
                                    id="name"
                                    label={
                                        <span>
                                            Tên Quà Tặng{" "}
                                            <span style={{ color: "red" }}>
                                                *
                                            </span>
                                        </span>
                                    }
                                    variant="outlined"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    fullWidth
                                    autoComplete="name"
                                    margin="dense"
                                    color="secondary"
                                />
                                {formik.touched.name && formik.errors.name && (
                                    <div className="login__validation__error">
                                        <p>{formik.errors.name}</p>
                                    </div>
                                )}
                            </>
                            {/* price */}
                            <>
                                <TextField
                                    id="price"
                                    label={
                                        <span>
                                            Giá{" "}
                                            <span style={{ color: "red" }}>
                                                *
                                            </span>
                                        </span>
                                    }
                                    variant="outlined"
                                    value={FormatCurrency(formik.values.price)}
                                    onChange={(e) =>
                                        handleInputChange(e, formik)
                                    }
                                    fullWidth
                                    autoComplete="price"
                                    margin="dense"
                                    color="secondary"
                                />
                                {formik.touched.price &&
                                    formik.errors.price && (
                                        <div className="login__validation__error">
                                            <p>{formik.errors.price}</p>
                                        </div>
                                    )}
                            </>
                        </Grid>
                        <Grid item xs={3}>
                            <label htmlFor="image">
                                <div className="avatar_formik_box">
                                    <img
                                        src={
                                            formik.values?.image === ""
                                                ? NoProduct
                                                : formik.values?.image
                                        }
                                        alt=""
                                        className="avatar_formik"
                                    />
                                    <div>
                                        <div className="avatar_formik_icon_box">
                                            <PhotoCameraIcon className="avatar_formik_icon" />
                                        </div>
                                    </div>
                                </div>
                            </label>
                            {formik.touched.image && formik.errors.image && (
                                <div
                                    className="login__validation__error"
                                    style={{
                                        paddingLeft: 0,
                                        textAlign: "center",
                                    }}
                                >
                                    <p>{formik.errors.image}</p>
                                </div>
                            )}
                        </Grid>
                    </Grid>
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
            ) : (
                <LoadingModal />
            )}
        </div>
    );
}
