import "./createShop.css";
import * as React from "react";
import {
    Button,
    TextField,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { createPetCoffeeShopThunk } from "../../../store/apiThunk/petCoffeeShopThunk";
import { getUserDataThunk } from "../../../store/apiThunk/userThunk";
import Swal from "sweetalert2";
import Pet from "../../../assets/cutecatdog.png";
import { useState } from "react";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import NoShop from "../../../assets/noShop.png";
import NoBackground from "../../../assets/noBackground.png";
import { useRef } from "react";
import { useEffect } from "react";
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
import MAP_API from "../../../utils/keyMap";
import { userDataSelector } from "../../../store/sellectors";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./../../../theme";
import LoadingModal from "../../../components/modal/loadingModal/loadingModal";
import { signOut } from "firebase/auth";
import { auth } from "../../../../firebaseConfig";
import {
    ADDSHOPSUCCESS,
    ERRORTEXT,
    SUCCESSTEXT,
} from "../../../components/text/notiText/notiText";

export default function CreateShop() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userData = useSelector(userDataSelector);
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [avatarPic, setAvatarPic] = useState({});
    const [backgroundPic, setBackgroundPic] = useState({});
    const [formData, setFormData] = useState(new FormData());
    const mapRef = useRef(null);
    const [lng, setLng] = useState(0);
    const [lat, setLat] = useState(0);
    const [zoom, setZoom] = useState(9);
    const [theme, colorMode] = useMode();

    const formik = useFormik({
        initialValues: {
            name: "",
            email: userData.email,
            phone: userData.phoneNumber,
            location: userData.address,
            avatar: "",
            background: "",
            shopType: "",
            taxCode: "",
            fbUrl: "",
            instagramUrl: "",
            websiteUrl: "",
            startTime: "",
            endTime: "",
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
            taxCode: Yup.string()
                .matches(/^[0-9]+$/, "Mã số thuế chỉ có thể chứa số")
                .required("Mã số thuế không thể trống")
                .min(10, "Mã số thuế phải có 10 số")
                .max(10, "Mã số thuế phải có 10 số"),
            avatar: Yup.string().required("Xin hãy chọn ảnh avatar"),
            background: Yup.string().required("Xin hãy chọn ảnh nền"),
            shopType: Yup.string().required("Loại không thể trống"),
            startTime: Yup.string().required("Xin hãy chọn giờ mở cửa"),
            endTime: Yup.string().required("Xin hãy chọn giờ đóng cửa"),
            fbUrl: Yup.string(),
            instagramUrl: Yup.string(),
            websiteUrl: Yup.string(),
        }),
        onSubmit: async (values) => {
            formData.append("Name", values.name);
            formData.append("Email", values.email);
            formData.append("Phone", values.phone);
            formData.append("Avatar", avatarPic);
            formData.append("Background", backgroundPic);
            formData.append("WebsiteUrl", values.websiteUrl);
            formData.append("FbUrl", values.fbUrl);
            formData.append("InstagramUrl", values.instagramUrl);
            formData.append("Location", values.location);
            formData.append("TaxCode", values.taxCode);
            formData.append("Latitude", lat);
            formData.append("Longitude", lng);
            formData.append("StartTime", values.startTime);
            formData.append("EndTime", values.endTime);
            formData.append("Type", values.shopType);

            setShowLoadingModal(true);
            dispatch(createPetCoffeeShopThunk(formData))
                .unwrap()
                .then(() => {
                    setShowLoadingModal(false);
                    Swal.fire({
                        title: SUCCESSTEXT,
                        text: ADDSHOPSUCCESS,
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
                                navigate("/login");
                            })
                            .catch((error) => {
                                console.log({ error });
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
            setAvatarPic(file);
            formik.setFieldValue("avatar", URL.createObjectURL(file));
        }
    };

    const handleBackgroundSelect = (event) => {
        const files = event.target?.files;
        if (files && files.length > 0) {
            const file = files[0];
            setBackgroundPic(file);
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
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div className="createShop">
                    <Grid container spacing={2}>
                        <Grid item xs={1}></Grid>
                        <Grid item xs={4}>
                            <img
                                src={Pet}
                                style={{
                                    position: "sticky",
                                    top: "7em",
                                }}
                            />
                        </Grid>
                        <Grid item xs={6} className="flex-center">
                            <div className="signup__form">
                                <h3 variant="h3" className="login__title">
                                    Tạo cửa hàng
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
                                                            ?.background === ""
                                                            ? NoBackground
                                                            : formik.values
                                                                  ?.background
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
                                                            ? NoShop
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
                                    {formik.touched.background &&
                                        formik.errors.background && (
                                            <div className="login__validation__error">
                                                <p>
                                                    {formik.errors.background}
                                                </p>
                                            </div>
                                        )}

                                    <Grid container spacing={3}>
                                        {/* name */}
                                        <Grid item xs={7}>
                                            <TextField
                                                id="name"
                                                label={
                                                    <span>
                                                        Tên Cửa Hàng{" "}
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
                                                value={formik.values.name}
                                                onChange={formik.handleChange}
                                                fullWidth
                                                autoComplete="name"
                                                margin="dense"
                                                color="secondary"
                                            />
                                            {formik.touched.name &&
                                                formik.errors.name && (
                                                    <div className="login__validation__error">
                                                        <p>
                                                            {formik.errors.name}
                                                        </p>
                                                    </div>
                                                )}
                                        </Grid>
                                        <Grid item xs={5}>
                                            {/* shopType */}
                                            <FormControl
                                                sx={{ m: 1 }}
                                                style={{ width: "97%" }}
                                            >
                                                <InputLabel
                                                    id="shopType"
                                                    color="secondary"
                                                >
                                                    <span>
                                                        Loại Cửa Hàng{" "}
                                                        <span
                                                            style={{
                                                                color: "red",
                                                            }}
                                                        >
                                                            *
                                                        </span>
                                                    </span>
                                                </InputLabel>
                                                <Select
                                                    labelId="shopType"
                                                    id="shopType"
                                                    name="shopType"
                                                    value={
                                                        formik.values.shopType
                                                    }
                                                    label={
                                                        <span>
                                                            Loại Cửa Hàng{" "}
                                                            <span
                                                                style={{
                                                                    color: "red",
                                                                }}
                                                            >
                                                                *
                                                            </span>
                                                        </span>
                                                    }
                                                    onChange={
                                                        formik.handleChange
                                                    }
                                                    color="secondary"
                                                >
                                                    <MenuItem value={""}>
                                                        Loại Cửa Hàng
                                                    </MenuItem>
                                                    <MenuItem value={"Cat"}>
                                                        Cà Phê Mèo
                                                    </MenuItem>
                                                    <MenuItem value={"Dog"}>
                                                        Cà Phê Chó
                                                    </MenuItem>
                                                    <MenuItem
                                                        value={"CatAndDog"}
                                                    >
                                                        Cà Phê Chó Và Mèo
                                                    </MenuItem>
                                                </Select>
                                            </FormControl>
                                            {formik.touched.shopType &&
                                                formik.errors.shopType && (
                                                    <div className="login__validation__error">
                                                        <p>
                                                            {
                                                                formik.errors
                                                                    .shopType
                                                            }
                                                        </p>
                                                    </div>
                                                )}
                                        </Grid>
                                    </Grid>
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
                                            value={formik.values.email}
                                            onChange={formik.handleChange}
                                            fullWidth
                                            autoComplete="email"
                                            margin="dense"
                                            type="email"
                                            color="secondary"
                                        />
                                        {formik.touched.email &&
                                            formik.errors.email && (
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
                                                    Số Điện Thoại{" "}
                                                    <span
                                                        style={{ color: "red" }}
                                                    >
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
                                            inputProps={{
                                                pattern: "[0-9]*",
                                            }}
                                            color="secondary"
                                        />
                                        {formik.touched.phone &&
                                            formik.errors.phone && (
                                                <div className="login__validation__error">
                                                    <p>{formik.errors.phone}</p>
                                                </div>
                                            )}
                                    </>
                                    <Grid container spacing={3}>
                                        <Grid item xs={6}>
                                            {/* startTime */}
                                            <Typography variant="body1">
                                                Giờ Mở Cửa{" "}
                                                <span style={{ color: "red" }}>
                                                    *
                                                </span>
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
                                                        <p>
                                                            {
                                                                formik.errors
                                                                    .startTime
                                                            }
                                                        </p>
                                                    </div>
                                                )}
                                        </Grid>
                                        <Grid item xs={6}>
                                            {/* endTime */}
                                            <Typography variant="body1">
                                                Giờ Đóng Cửa{" "}
                                                <span style={{ color: "red" }}>
                                                    *
                                                </span>
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
                                                    min:
                                                        formik.values
                                                            .startTime || "",
                                                }}
                                                color="secondary"
                                            />
                                            {formik.touched.endTime &&
                                                formik.errors.endTime && (
                                                    <div className="login__validation__error">
                                                        <p>
                                                            {
                                                                formik.errors
                                                                    .endTime
                                                            }
                                                        </p>
                                                    </div>
                                                )}
                                        </Grid>
                                    </Grid>
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
                                            <div className="location">
                                                {formik.values.location}
                                            </div>
                                        </div>
                                        {formik.touched.location &&
                                            formik.errors.location && (
                                                <div className="login__validation__error">
                                                    <p>
                                                        {formik.errors.location}
                                                    </p>
                                                </div>
                                            )}
                                    </>
                                    {/* taxCode */}
                                    <>
                                        <TextField
                                            id="taxCode"
                                            label={
                                                <span>
                                                    Mã Số Thuế{" "}
                                                    <span
                                                        style={{ color: "red" }}
                                                    >
                                                        *
                                                    </span>
                                                </span>
                                            }
                                            variant="outlined"
                                            value={formik.values.taxCode}
                                            onChange={formik.handleChange}
                                            fullWidth
                                            autoComplete="taxCode"
                                            margin="dense"
                                            color="secondary"
                                        />
                                        {formik.touched.taxCode &&
                                            formik.errors.taxCode && (
                                                <div className="login__validation__error">
                                                    <p>
                                                        {formik.errors.taxCode}
                                                    </p>
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
                                        {formik.touched.fbUrl &&
                                            formik.errors.fbUrl && (
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
                                                    <p>
                                                        {
                                                            formik.errors
                                                                .instagramUrl
                                                        }
                                                    </p>
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
                                                    <p>
                                                        {
                                                            formik.errors
                                                                .websiteUrl
                                                        }
                                                    </p>
                                                </div>
                                            )}
                                    </>
                                    <p className="login__link">
                                        Không muốn tạo?
                                        <Link
                                            to={-1}
                                            style={{
                                                textDecoration: "none",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    color: "#70d8bd",
                                                }}
                                            >
                                                {" "}
                                                Quay Lại
                                            </span>
                                        </Link>
                                    </p>
                                    {!showLoadingModal ? (
                                        <Button
                                            className="login__btn"
                                            variant="contained"
                                            type="submit"
                                            fullWidth
                                        >
                                            Tạo
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
