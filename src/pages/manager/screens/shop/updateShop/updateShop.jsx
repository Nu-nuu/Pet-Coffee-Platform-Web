import "./updateShop.css";
import * as React from "react";
import { Button, TextField, Grid, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import {
    getPetCoffeeShopDetailThunk,
    updatePetCoffeeShopThunk,
} from "../../../../../store/apiThunk/petCoffeeShopThunk";
import { getUserDataThunk } from "../../../../../store/apiThunk/userThunk";
import Swal from "sweetalert2";
import { useState, useEffect, useRef } from "react";
import Header from "../../../components/header/Header";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import ReactMapGL, {
    GeolocateControl,
    Marker,
    NavigationControl,
    useControl,
} from "react-map-gl";
import geolocation from "geolocation";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import MAP_API from "../../../../../utils/keyMap";
import { BackButton } from "../../../../../components/modal/backModal/backModal";
import LoadingModal from "../../../../../components/modal/loadingModal/loadingModal";
import {
    ERRORTEXT,
    SUCCESSTEXT,
    UPDATESHOPSUCCESS,
} from "../../../../../components/text/notiText/notiText";

export default function UpdateShop() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const shopId = location.state?.shopId;
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [showRender, setShowRender] = useState(false);
    const [data, setData] = useState({});
    const [formData, setFormData] = useState(new FormData());
    const mapRef = useRef(null);
    const [lng, setLng] = useState(0);
    const [lat, setLat] = useState(0);
    const [zoom, setZoom] = useState(9);

    useEffect(() => {
        setShowRender(true);
        dispatch(
            getPetCoffeeShopDetailThunk({
                id: shopId,
                longitude: 1,
                latitude: 1,
            })
        )
            .unwrap()
            .then((res) => {
                setData(res);
                setShowRender(false);
            });
    }, [shopId]);

    let formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            email: data.email || "",
            name: data.name || "",
            phone: data.phone || "",
            location: data.location || "",
            avatar: data.avatarUrl || "",
            background: data.backgroundUrl || "",
            fbUrl: data.fbUrl || "",
            instagramUrl: data.instagramUrl || "",
            websiteUrl: data.websiteUrl || "",
            startTime: data.startTime || "",
            endTime: data.endTime || "",
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Tên cửa hàng không thể trống"),
            email: Yup.string()
                .required("Email không thể trống")
                .email("Email sai định dạng"),
            phone: Yup.string()
                .matches(/^[0-9]+$/, "Số điện thoại chỉ có thể chứa số")
                .required("Số điện thoại không thể trống")
                .min(10, "Số điện thoại phải có 10 số")
                .max(10, "Số điện thoại phải có 10 số"),
            location: Yup.string().required("Địa chỉ không thể trống"),
            avatar: Yup.string().required("Xin hãy chọn ảnh avatar"),
            background: Yup.string().required("Xin hãy chọn ảnh nền"),
            startTime: Yup.string().required("Xin hãy chọn giờ mở cửa"),
            endTime: Yup.string().required("Xin hãy chọn giờ đóng cửa"),
        }),
        onSubmit: async (values) => {
            formData.append("PetCoffeeShopId", shopId);
            formData.append("Name", values.name);
            formData.append("Email", values.email);
            formData.append("Phone", values.phone);
            formData.append("Location", values.location);
            formData.append("Latitude", lat);
            formData.append("Longitude", lng);
            formData.append("OpeningTime", values.startTime);
            formData.append("ClosedTime", values.endTime);
            formData.append("FbUrl", values.fbUrl);
            formData.append("InstagramUrl", values.instagramUrl);
            formData.append("WebsiteUrl", values.websiteUrl);

            setShowLoadingModal(true);
            dispatch(updatePetCoffeeShopThunk(formData))
                .unwrap()
                .then(() => {
                    dispatch(getUserDataThunk()).then(() => {
                        setShowLoadingModal(false);
                        Swal.fire({
                            title: SUCCESSTEXT,
                            text: UPDATESHOPSUCCESS,
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

    const handleAvatarSelect = (event) => {
        const files = event.target?.files;
        if (files && files.length > 0) {
            const file = files[0];
            formData.set("Avatar", file);
            formik.setFieldValue("avatar", URL.createObjectURL(file));
        }
    };

    const handleBackgroundSelect = (event) => {
        const files = event.target?.files;
        if (files && files.length > 0) {
            const file = files[0];
            formData.set("Background", file);
            formik.setFieldValue("background", URL.createObjectURL(file));
        }
    };

    const GeoCoder = () => {
        const geoCoder = new MapboxGeocoder({
            accessToken: MAP_API,
            marker: false,
            collapsed: true,
        });
        useControl(() => geoCoder);
        geoCoder.on("result", (e) => {
            formik.setFieldValue("location", e.result?.place_name);
            const coords = e.result?.geometry?.coordinates;
            setLng(coords[0]);
            setLat(coords[1]);
        });
        return null;
    };

    useEffect(() => {
        if (!lng && !lat) {
            geolocation.getCurrentPosition(function (err, position) {
                if (err) throw err;
                let longitude = position?.coords?.longitude;
                let latitude = position?.coords?.latitude;
                mapRef?.current?.flyTo({
                    center: [longitude, latitude],
                });
                setLng(longitude);
                setLat(latitude);
            });
        }
    }, []);

    return (
        <div className="updateShop">
            <Header
                title="Cập nhật cửa hàng"
                subtitle="Cung cấp thông tin cửa hàng"
            />
            {!showRender ? (
                <form onSubmit={formik.handleSubmit}>
                    <input
                        id="avatar"
                        name="avatar"
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={handleAvatarSelect}
                        style={{ display: "none" }}
                    />
                    <input
                        id="background"
                        name="background"
                        type="file"
                        accept="image/png, image/jpeg"
                        style={{ display: "none" }}
                        onChange={handleBackgroundSelect}
                    />
                    <div style={{ position: "relative" }}>
                        <label htmlFor="background">
                            <div className="background_formik_box">
                                <img
                                    src={formik.values?.background}
                                    alt=""
                                    className="background_formik"
                                />
                                <div className="background_formik_icon_box">
                                    <PhotoCameraIcon className="background_formik_icon" />
                                </div>
                            </div>
                        </label>

                        <label htmlFor="avatar">
                            <div className="avatar_formik_box">
                                <img
                                    src={formik.values?.avatar}
                                    alt=""
                                    className="avatar_formik"
                                />
                                <div className="avatar_formik_icon_box">
                                    <PhotoCameraIcon className="avatar_formik_icon" />
                                </div>
                            </div>
                        </label>
                    </div>
                    {/* name */}
                    <>
                        <TextField
                            id="name"
                            label={
                                <span>
                                    Tên cửa hàng{" "}
                                    <span style={{ color: "red" }}>*</span>
                                </span>
                            }
                            variant="outlined"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            fullWidth
                            autoComplete="name"
                            margin="dense"
                            color="secondary"
                            style={{ marginTop: "14%" }}
                        />
                        {formik.touched.name && formik.errors.name && (
                            <div className="login__validation__error">
                                <p>{formik.errors.name}</p>
                            </div>
                        )}
                    </>
                    {/* email */}
                    <>
                        <TextField
                            id="email"
                            label={
                                <span>
                                    Email{" "}
                                    <span style={{ color: "red" }}>*</span>
                                </span>
                            }
                            variant="outlined"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            fullWidth
                            autoComplete="email"
                            margin="dense"
                            type="email"
                            color="secondary"
                        />
                        {formik.touched.email && formik.errors.email && (
                            <div className="login__validation__error">
                                <p>{formik.errors.email}</p>
                            </div>
                        )}
                    </>
                    {/* phone */}
                    <>
                        <TextField
                            id="phone"
                            label={
                                <span>
                                    Số điện thoại{" "}
                                    <span style={{ color: "red" }}>*</span>
                                </span>
                            }
                            type="text"
                            variant="outlined"
                            value={formik.values.phone}
                            onChange={formik.handleChange}
                            fullWidth
                            autoComplete="phone"
                            margin="dense"
                            inputProps={{
                                pattern: "[0-9]*",
                            }}
                            color="secondary"
                        />
                        {formik.touched.phone && formik.errors.phone && (
                            <div className="login__validation__error">
                                <p>{formik.errors.phone}</p>
                            </div>
                        )}
                    </>
                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            {/* startTime */}
                            <Typography variant="body1">
                                Giờ Bắt Đầu{" "}
                                <span style={{ color: "red" }}>*</span>
                            </Typography>
                            <TextField
                                id="startTime"
                                variant="outlined"
                                value={formik.values.startTime}
                                onChange={formik.handleChange}
                                fullWidth
                                autoComplete="startTime"
                                margin="dense"
                                type="time"
                                color="secondary"
                            />
                            {formik.touched.startTime &&
                                formik.errors.startTime && (
                                    <div className="login__validation__error">
                                        <p>{formik.errors.startTime}</p>
                                    </div>
                                )}
                        </Grid>
                        <Grid item xs={6}>
                            {/* endTime */}
                            <Typography variant="body1">
                                Giờ Kết Thúc{" "}
                                <span style={{ color: "red" }}>*</span>
                            </Typography>
                            <TextField
                                id="endTime"
                                variant="outlined"
                                value={formik.values.endTime}
                                onChange={formik.handleChange}
                                fullWidth
                                autoComplete="endTime"
                                margin="dense"
                                type="time"
                                inputProps={{
                                    min: formik.values.startTime || "",
                                }}
                                color="secondary"
                            />
                            {formik.touched.endTime &&
                                formik.errors.endTime && (
                                    <div className="login__validation__error">
                                        <p>{formik.errors.endTime}</p>
                                    </div>
                                )}
                        </Grid>
                    </Grid>
                    {/* location */}
                    <>
                        <Typography variant="body1">
                            Địa Chỉ <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <div className="map-container">
                            <ReactMapGL
                                ref={mapRef}
                                mapboxAccessToken={MAP_API}
                                initialViewState={{
                                    longitude: lng,
                                    latitude: lat,
                                    zoom: zoom,
                                }}
                                mapStyle="mapbox://styles/mapbox/streets-v12"
                            >
                                <Marker
                                    latitude={lat}
                                    longitude={lng}
                                    draggable
                                    onDragEnd={(e) => {
                                        setLng(e?.lngLat?.lng);
                                        setLat(e?.lngLat?.lat);
                                    }}
                                />
                                <NavigationControl position="bottom-right" />
                                <GeolocateControl
                                    position="top-left"
                                    trackUserLocation
                                    onGeolocate={(e) => {
                                        setLng(e?.coords?.longitude);
                                        setLat(e?.coords?.latitude);
                                    }}
                                />
                                <GeoCoder />
                            </ReactMapGL>
                            <div className="location">
                                {formik.values.location}
                            </div>
                        </div>
                        {formik.touched.location && formik.errors.location && (
                            <div className="login__validation__error">
                                <p>{formik.errors.location}</p>
                            </div>
                        )}
                    </>
                    {/* fbUrl */}
                    <>
                        <TextField
                            id="fbUrl"
                            label="Facebook"
                            variant="outlined"
                            value={formik.values.fbUrl}
                            onChange={formik.handleChange}
                            fullWidth
                            autoComplete="fbUrl"
                            margin="dense"
                            color="secondary"
                        />
                        {formik.touched.fbUrl && formik.errors.fbUrl && (
                            <div className="login__validation__error">
                                <p>{formik.errors.fbUrl}</p>
                            </div>
                        )}
                    </>
                    {/* instagramUrl */}
                    <>
                        <TextField
                            id="instagramUrl"
                            label="Instagram"
                            variant="outlined"
                            value={formik.values.instagramUrl}
                            onChange={formik.handleChange}
                            fullWidth
                            autoComplete="instagramUrl"
                            margin="dense"
                            color="secondary"
                        />
                        {formik.touched.instagramUrl &&
                            formik.errors.instagramUrl && (
                                <div className="login__validation__error">
                                    <p>{formik.errors.instagramUrl}</p>
                                </div>
                            )}
                    </>
                    {/* websiteUrl */}
                    <>
                        <TextField
                            id="websiteUrl"
                            label="Trang chủ"
                            variant="outlined"
                            value={formik.values.websiteUrl}
                            onChange={formik.handleChange}
                            fullWidth
                            autoComplete="websiteUrl"
                            margin="dense"
                            color="secondary"
                        />
                        {formik.touched.websiteUrl &&
                            formik.errors.websiteUrl && (
                                <div className="login__validation__error">
                                    <p>{formik.errors.websiteUrl}</p>
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
                                Xác nhận
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
