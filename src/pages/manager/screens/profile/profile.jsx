import React from "react";
import "./profile.css";
import { useDispatch, useSelector } from "react-redux";
import { userDataSelector } from "../../../../store/sellectors";
import { Button, useTheme } from "@mui/material";
import { useState } from "react";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
    getUserDataThunk,
    updateUserDataThunk,
} from "../../../../store/apiThunk/userThunk";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { BackButton } from "../../../../components/modal/backModal/backModal";
import { FormatPhoneNumber } from "../../../../components/format/formatText/formatText";
import LoadingModal from "../../../../components/modal/loadingModal/loadingModal";
import { signOut } from "firebase/auth";
import { auth } from "../../../../../firebaseConfig";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { tokens } from "../../../../theme";
import { Link } from "react-router-dom";
import {
    ERRORTEXT,
    SUCCESSTEXT,
    UPDATEPROFILESUCCESS,
} from "../../../../components/text/notiText/notiText";
import { ShopStatus } from "../../../../components/mapping/mapping";
import NoBackground from "../../../../assets/noBackground.png";

export default function ManagerProfile() {
    const userData = useSelector(userDataSelector);
    const dispatch = useDispatch();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [formData, setFormData] = useState(new FormData());
    const [isUpdate, setIsUpdate] = useState(false);
    const [showLoadingModal, setShowLoadingModal] = useState(false);

    const toggleUpdate = () => {
        setIsUpdate(!isUpdate);
    };

    const handleAvatarSelect = (event) => {
        const files = event.target?.files;
        if (files && files.length > 0) {
            const file = files[0];
            formData.set("AvatarFile", file);
            formik.setFieldValue("avatar", URL.createObjectURL(file));
        }
    };

    const handleBackgroundSelect = (event) => {
        const files = event.target?.files;
        if (files && files.length > 0) {
            const file = files[0];
            formData.set("BackgroundFile", file);
            formik.setFieldValue("background", URL.createObjectURL(file));
        }
    };

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: userData.fullName,
            email: userData.email,
            phone: userData.phoneNumber,
            address: userData.address,
            avatar: userData.avatar,
            background: userData.background,
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Họ tên không thể trống"),
            email: Yup.string()
                .required("Email không thể trống")
                .email("Email sai định dạng"),
            phone: Yup.string()
                .matches(/^[0-9]+$/, "Số điện thoại chỉ có thể chứa số")
                .required("Số điện thoại không thể trống")
                .min(10, "Số điện thoại phải có 10 số")
                .max(10, "Số điện thoại phải có 10 số"),
            address: Yup.string().required("Địa chỉ không thể trống"),
            avatar: Yup.string().required("Xin hãy chọn ảnh đại diện"),
            background: Yup.string().required("Xin hãy chọn ảnh nền"),
        }),
        onSubmit: async (values) => {
            formData.append("FullName", values.name);
            formData.append("Email", values.email);
            formData.append("PhoneNumber", values.phone);
            formData.append("Address", values.address);

            setShowLoadingModal(true);
            dispatch(updateUserDataThunk(formData))
                .unwrap()
                .then(() => {
                    dispatch(getUserDataThunk()).then(() => {
                        setShowLoadingModal(false);
                        Swal.fire({
                            title: SUCCESSTEXT,
                            text: UPDATEPROFILESUCCESS,
                            icon: "success",
                            showCancelButton: false,
                            showConfirmButton: false,
                            background: "white",
                            timer: 1500,
                            timerProgressBar: true,
                            scrollbarPadding: false,
                        }).then(() => {
                            if (values.email !== userData.email) {
                                signOut(auth)
                                    .then(() => {
                                        localStorage.clear();
                                        navigate("/");
                                    })
                                    .catch((error) => {
                                        console.log({ error });
                                    });
                            } else {
                                toggleUpdate();
                                formik.resetForm();
                            }
                        });
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

    const [value, setValue] = React.useState("1");

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className="managerProfile">
            <input
                id="backgroundInput"
                name="backgroundInput"
                type="file"
                accept="image/png, image/jpeg"
                style={{ display: "none" }}
                onChange={handleBackgroundSelect}
            />
            <input
                id="avatarInput"
                name="avatarInput"
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleAvatarSelect}
                style={{ display: "none" }}
            />
            <div style={{ position: "relative" }}>
                {!isUpdate ? (
                    <>
                        <img src={userData.avatar} alt="" className="avatar" />
                        <img
                            src={userData.background || NoBackground}
                            alt=""
                            className="background"
                        />
                    </>
                ) : (
                    <>
                        <label htmlFor="backgroundInput">
                            <div className="background_formik_box">
                                <img
                                    src={formik.values.background || NoBackground}
                                    alt=""
                                    className="background_formik"
                                />
                                <div className="background_formik_icon_box">
                                    <PhotoCameraIcon className="background_formik_icon" />
                                </div>
                            </div>
                        </label>

                        <label htmlFor="avatarInput">
                            <div className="avatar_formik_box">
                                <img
                                    src={formik.values.avatar}
                                    alt=""
                                    className="avatar_formik"
                                />
                                <div className="avatar_formik_icon_box">
                                    <PhotoCameraIcon className="avatar_formik_icon" />
                                </div>
                            </div>
                        </label>
                    </>
                )}
            </div>
            <div className="role">Quản Lý Cửa Hàng</div>
            <TabContext value={value}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "30px",
                    }}
                >
                    <TabList
                        onChange={handleChange}
                        textColor="secondary"
                        indicatorColor="secondary"
                    >
                        <Tab
                            label="Giới Thiệu"
                            value="1"
                            style={{ fontSize: "22px" }}
                        />
                        <Tab
                            label="Cửa Hàng"
                            value="2"
                            style={{ fontSize: "22px" }}
                        />
                    </TabList>
                </Box>
                <TabPanel value="1" style={{ padding: 0, marginTop: "30px" }}>
                    <div className="flex-column">
                        <div className="field">
                            <span className="span">Họ tên: </span>
                            {!isUpdate ? (
                                userData.fullName
                            ) : (
                                <>
                                    <input
                                        id="name"
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        className="input"
                                    />
                                    {formik.touched.name &&
                                        formik.errors.name && (
                                            <span className="error">
                                                {formik.errors.name}
                                            </span>
                                        )}
                                </>
                            )}
                        </div>
                        <div className="field">
                            <span className="span">Email: </span>
                            {!isUpdate ? (
                                userData.email
                            ) : (
                                <>
                                    <input
                                        id="email"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        className="input"
                                        disabled
                                    />
                                    {formik.touched.email &&
                                        formik.errors.email && (
                                            <span className="error">
                                                {formik.errors.email}
                                            </span>
                                        )}
                                </>
                            )}
                        </div>
                        <div className="field">
                            <span className="span">Số Điện Thoại: </span>
                            {!isUpdate ? (
                                FormatPhoneNumber(userData.phoneNumber)
                            ) : (
                                <>
                                    <input
                                        id="phone"
                                        value={formik.values.phone}
                                        onChange={formik.handleChange}
                                        className="input"
                                        maxLength={10}
                                    />
                                    {formik.touched.phone &&
                                        formik.errors.phone && (
                                            <span className="error">
                                                {formik.errors.phone}
                                            </span>
                                        )}
                                </>
                            )}
                        </div>
                        <div
                            className="field"
                            style={{ alignItems: "baseline" }}
                        >
                            <span className="span">Địa Chỉ: </span>
                            {!isUpdate ? (
                                <span style={{ lineBreak: "anywhere" }}>
                                    {userData.address}
                                </span>
                            ) : (
                                <>
                                    <textarea
                                        cols="50"
                                        rows="3"
                                        id="address"
                                        value={formik.values.address}
                                        onChange={formik.handleChange}
                                        className="input"
                                    ></textarea>
                                    {formik.touched.address &&
                                        formik.errors.address && (
                                            <span className="error">
                                                {formik.errors.address}
                                            </span>
                                        )}
                                </>
                            )}
                        </div>
                        <div style={{ marginTop: "16px" }}>
                            {!isUpdate ? (
                                <Button
                                    variant="contained"
                                    className="btn"
                                    onClick={toggleUpdate}
                                >
                                    Cập Nhật
                                </Button>
                            ) : !showLoadingModal ? (
                                <div className="flex_center">
                                    <BackButton
                                        toggleUpdate={toggleUpdate}
                                        type="update"
                                    />
                                    <Button
                                        variant="contained"
                                        className="btn"
                                        onClick={formik.handleSubmit}
                                    >
                                        Xác Nhận
                                    </Button>
                                </div>
                            ) : (
                                <LoadingModal />
                            )}
                        </div>
                    </div>
                </TabPanel>
                <TabPanel value="2" style={{ padding: 0, marginTop: "30px" }}>
                    {userData?.shopResponses?.map((shop, index) => (
                        <Link
                            className="field"
                            key={index}
                            style={{
                                gap: "20px",
                                fontSize: "17px",
                                color: "white",
                                textDecoration: "none",
                                cursor:
                                    shop.status === "Active"
                                        ? "pointer"
                                        : "not-allowed",
                            }}
                            to={shop.status === "Active" ? "/shop" : ""}
                            state={{ shopId: shop.id }}
                        >
                            <img
                                src={shop.avatarUrl}
                                alt=""
                                className="shop_img"
                            />
                            <div>
                                <p>
                                    <span className="shop_span">
                                        Tên Cửa Hàng:{" "}
                                    </span>
                                    <span className="shop_name">
                                        {shop?.name}
                                    </span>
                                </p>
                                <p>
                                    <span className="shop_span">
                                        Tình Trạng:{" "}
                                    </span>
                                    <span
                                        style={{
                                            color:
                                                shop.status === "Active"
                                                    ? "#70d8bd"
                                                    : shop.status === "Inactive"
                                                    ? colors.redAccent[600]
                                                    : "#b8b800",
                                        }}
                                    >
                                        {ShopStatus(shop?.status)}
                                    </span>
                                </p>
                                <p>
                                    <span className="shop_span">Email: </span>
                                    {shop?.email}
                                </p>
                                <p>
                                    <span className="shop_span">
                                        Số Điện Thoại:{" "}
                                    </span>
                                    {FormatPhoneNumber(shop?.phone)}
                                </p>
                                <p>
                                    <span className="shop_span">Địa Chỉ: </span>
                                    <span style={{ lineBreak: "anywhere" }}>
                                        {shop?.location}
                                    </span>
                                </p>
                            </div>
                        </Link>
                    ))}
                </TabPanel>
            </TabContext>
        </div>
    );
}
