import "./signup.css";
import { useState, useEffect, useRef } from "react";
import {
    Button,
    TextField,
    Grid,
    InputAdornment,
    IconButton,
    Typography,
} from "@mui/material";
import { VisibilityOutlined, VisibilityOffOutlined } from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { signupThunk } from "../../../store/apiThunk/userThunk";
import Swal from "sweetalert2";
import Pet from "../../../assets/cutecatdog.png";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./../../../theme";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import NoAvatar from "../../../assets/noAvatar.png";
import NoBackground from "../../../assets/noBackground.png";
import ReactMapGL, {
    GeolocateControl,
    Marker,
    NavigationControl,
    useControl,
} from "react-map-gl";
import geolocation from "geolocation";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import MAP_API from "../../../utils/keyMap";
import LoadingModal from "../../../components/modal/loadingModal/loadingModal";
import {
    CREATEACCOUNTSUCCESS,
    ERRORTEXT,
    SUCCESSTEXT,
} from "../../../components/text/notiText/notiText";

export default function Signup() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [theme, colorMode] = useMode();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [avatarPic, setAvatarPic] = useState({});
    const [backgroundPic, setBackgroundPic] = useState({});
    const [formData, setFormData] = useState(new FormData());
    const mapRef = useRef(null);
    const [lng, setLng] = useState(0);
    const [lat, setLat] = useState(0);
    const [zoom, setZoom] = useState(13);

    const formik = useFormik({
        initialValues: {
            password: "",
            confirm_password: "",
            email: "",
            fullName: "",
            phone: "",
            address: "",
            avatar: "",
            backgroundImg: "",
        },
        validationSchema: Yup.object({
            password: Yup.string()
                .required("Mật khẩu không thể trống")
                .min(8, "Mật khẩu phải có ít nhất 8 chữ số"),
            confirm_password: Yup.string()
                .required("Xác nhận mật khẩu không thể trống")
                .oneOf(
                    [Yup.ref("password"), null],
                    "Xác nhận mật khẩu chưa đúng"
                ),
            email: Yup.string()
                .required("Email không thể trống")
                .email("Email sai định dạng"),
            fullName: Yup.string().required("Họ tên không thể trống"),
            phone: Yup.string()
                .matches(/^[0-9]+$/, "Số điện thoại chỉ có thể chứa số")
                .required("Số điện thoại không thể trống")
                .min(10, "Số điện thoại phải có 10 số")
                .max(10, "Số điện thoại phải có 10 số"),
            address: Yup.string().required("Xin hãy chọn địa chỉ"),
            avatar: Yup.string().required("Xin hãy chọn ảnh đại diện"),
            backgroundImg: Yup.string().required("Xin hãy chọn ảnh nền"),
        }),
        onSubmit: async (values) => {
            formData.append("Email", values.email);
            formData.append("Password", values.password);
            formData.append("FullName", values.fullName);
            formData.append("Address", values.address);
            formData.append("PhoneNumber", values.phone);
            formData.append("Avatar", avatarPic);
            formData.append("Background", backgroundPic);

            setShowLoadingModal(true);
            dispatch(signupThunk(formData))
                .unwrap()
                .then((res) => {
                    setShowLoadingModal(false);
                    localStorage.setItem(
                        "accessToken",
                        JSON.stringify(res.accessToken)
                    );
                    Swal.fire({
                        title: SUCCESSTEXT,
                        text: CREATEACCOUNTSUCCESS,
                        icon: "success",
                        showCancelButton: false,
                        showConfirmButton: false,
                        background: "white",
                        timer: 1500,
                        timerProgressBar: true,
                        scrollbarPadding: false,
                    }).then(
                        navigate(`/verifyAccount`, {
                            state: {
                                email: values.email,
                                direction: "signup",
                            },
                        })
                    );
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

    const handleAvatarSelect = (event) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            setAvatarPic(file);
            formik.setFieldValue("avatar", URL.createObjectURL(file));
        }
    };

    const handleBackgroundSelect = (event) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            setBackgroundPic(file);
            formik.setFieldValue("backgroundImg", URL.createObjectURL(file));
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
            formik.setFieldValue("address", e.result?.place_name);
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
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div className="signup">
                    <Grid container spacing={2}>
                        <Grid item xs={1}></Grid>
                        <Grid item xs={4}>
                            <img src={Pet} className="sticky" />
                        </Grid>
                        <Grid item xs={6} className="flex-center">
                            <div className="signup__form">
                                <h3 variant="h3" className="login__title">
                                    Đăng ký
                                </h3>
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
                                                    src={
                                                        formik.values
                                                            ?.backgroundImg ===
                                                        ""
                                                            ? NoBackground
                                                            : formik.values
                                                                  ?.backgroundImg
                                                    }
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
                                                    src={
                                                        formik.values
                                                            ?.avatar === ""
                                                            ? NoAvatar
                                                            : formik.values
                                                                  ?.avatar
                                                    }
                                                    alt=""
                                                    className="avatar_formik"
                                                />
                                                <div className="avatar_formik_icon_box">
                                                    <PhotoCameraIcon className="avatar_formik_icon" />
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                    <div
                                        className="login__validation__error"
                                        style={{ marginTop: "14%" }}
                                    >
                                        {formik.touched.avatar &&
                                            formik.errors.avatar && (
                                                <p>{formik.errors.avatar}</p>
                                            )}
                                    </div>
                                    {formik.touched.backgroundImg &&
                                        formik.errors.backgroundImg && (
                                            <div className="login__validation__error">
                                                <p>
                                                    {
                                                        formik.errors
                                                            .backgroundImg
                                                    }
                                                </p>
                                            </div>
                                        )}
                                    {/* email */}
                                    <>
                                        <TextField
                                            id="email"
                                            label={
                                                <span>
                                                    Email{" "}
                                                    <span
                                                        style={{ color: "red" }}
                                                    >
                                                        *
                                                    </span>
                                                </span>
                                            }
                                            variant="outlined"
                                            type="email"
                                            value={formik.values.email}
                                            onChange={(e) => {
                                                formik.handleChange(e);
                                            }}
                                            fullWidth
                                            margin="dense"
                                            color="secondary"
                                        />
                                        {formik.touched.email &&
                                            formik.errors.email && (
                                                <div className="login__validation__error">
                                                    {formik.errors.email}
                                                </div>
                                            )}
                                    </>
                                    <Grid container spacing={3}>
                                        <Grid item xs={6}>
                                            <TextField
                                                id="password"
                                                label={
                                                    <span>
                                                        Mật Khẩu{" "}
                                                        <span
                                                            style={{
                                                                color: "red",
                                                            }}
                                                        >
                                                            *
                                                        </span>
                                                    </span>
                                                }
                                                color="secondary"
                                                variant="outlined"
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={formik.values.password}
                                                onChange={(e) => {
                                                    formik.handleChange(e);
                                                }}
                                                fullWidth
                                                margin="dense"
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
                                                formik.errors.password && (
                                                    <div className="login__validation__error">
                                                        {formik.errors.password}
                                                    </div>
                                                )}
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                id="confirm_password"
                                                label={
                                                    <span>
                                                        Xác Nhận Mật Khẩu{" "}
                                                        <span
                                                            style={{
                                                                color: "red",
                                                            }}
                                                        >
                                                            *
                                                        </span>
                                                    </span>
                                                }
                                                variant="outlined"
                                                type={
                                                    showConfirmPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={
                                                    formik.values
                                                        .confirm_password
                                                }
                                                onChange={(e) => {
                                                    formik.handleChange(e);
                                                }}
                                                fullWidth
                                                color="secondary"
                                                margin="dense"
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
                                                formik.errors
                                                    .confirm_password && (
                                                    <div className="login__validation__error">
                                                        {
                                                            formik.errors
                                                                .confirm_password
                                                        }
                                                    </div>
                                                )}
                                        </Grid>
                                    </Grid>

                                    <TextField
                                        id="fullName"
                                        label={
                                            <span>
                                                Họ Tên{" "}
                                                <span style={{ color: "red" }}>
                                                    *
                                                </span>
                                            </span>
                                        }
                                        variant="outlined"
                                        value={formik.values.fullName}
                                        onChange={formik.handleChange}
                                        fullWidth
                                        autoComplete="fullName"
                                        margin="dense"
                                        color="secondary"
                                    />
                                    {formik.touched.fullName &&
                                        formik.errors.fullName && (
                                            <div className="login__validation__error">
                                                {formik.errors.fullName}
                                            </div>
                                        )}
                                    <TextField
                                        id="phone"
                                        label={
                                            <span>
                                                Số Điện Thoại{" "}
                                                <span style={{ color: "red" }}>
                                                    *
                                                </span>
                                            </span>
                                        }
                                        type="text"
                                        variant="outlined"
                                        value={formik.values.phone}
                                        onChange={formik.handleChange}
                                        fullWidth
                                        autoComplete="phone"
                                        margin="dense"
                                        color="secondary"
                                        inputProps={{
                                            pattern: "[0-9]*",
                                        }}
                                    />
                                    {formik.touched.phone &&
                                        formik.errors.phone && (
                                            <div className="login__validation__error">
                                                {formik.errors.phone}
                                            </div>
                                        )}
                                    {/* location */}
                                    <>
                                        <Typography variant="body1">
                                            Địa Chỉ{" "}
                                            <span style={{ color: "red" }}>
                                                *
                                            </span>
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
                                                        setLng(
                                                            e?.coords?.longitude
                                                        );
                                                        setLat(
                                                            e?.coords?.latitude
                                                        );
                                                    }}
                                                />
                                                <GeoCoder />
                                            </ReactMapGL>
                                            {formik.values.address && (
                                                <div className="location">
                                                    {formik.values.address}
                                                </div>
                                            )}
                                        </div>
                                        {formik.touched.address &&
                                            formik.errors.address && (
                                                <div className="login__validation__error">
                                                    <p>
                                                        {formik.errors.address}
                                                    </p>
                                                </div>
                                            )}
                                    </>
                                    <p className="login__link">
                                        Đã có tài khoản?{" "}
                                        <Link
                                            to="/login"
                                            variant="body2"
                                            style={{
                                                textDecoration: "none",
                                                color: "#70d8bd",
                                            }}
                                        >
                                            Đăng nhập ngay!
                                        </Link>
                                    </p>
                                    {!showLoadingModal ? (
                                        <Button
                                            className="login__btn"
                                            variant="contained"
                                            type="submit"
                                            fullWidth
                                        >
                                            Đăng ký
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
