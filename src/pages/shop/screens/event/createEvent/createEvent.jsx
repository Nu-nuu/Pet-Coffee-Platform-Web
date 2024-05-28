import * as React from "react";
import "./createEvent.css";
import { Button, TextField, Grid, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import { createEventThunk } from "../../../../../store/apiThunk/eventThunk";
import Header from "../../../components/header/Header";
import NoBackground from "../../../../../assets/noBackground.png";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { userDataSelector } from "../../../../../store/sellectors";
import { BackButton } from "../../../../../components/modal/backModal/backModal";
import LoadingModal from "../../../../../components/modal/loadingModal/loadingModal";
import { ERRORTEXT } from "../../../../../components/text/notiText/notiText";

export default function CreateEvent() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const shopId = location.state?.shopId;
    const userData = useSelector(userDataSelector);
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [formData, setFormData] = useState(new FormData());
    const [imagePic, setImagePic] = useState({});

    const formik = useFormik({
        initialValues: {
            title: "",
            image: "",
            description: "",
            startDate: "",
            endDate: "",
            startTime: "",
            endTime: "",
            location: userData.address,
            min: "",
            max: "",
        },
        validationSchema: Yup.object({
            title: Yup.string().required("Họ Tên không thể trống"),
            image: Yup.string().required("Xin hãy chọn ảnh"),
            description: Yup.string().required("Mô tả không thể trống"),
            startDate: Yup.date()
                .required("Xin hãy chọn ngày bắt đầu")
                .test(
                    "is-after-day-after-tomorrow",
                    "Ngày bắt đầu phải lớn hơn hoặc bằng ngày kia",
                    function (value) {
                        const currentDate = new Date();
                        currentDate.setDate(currentDate.getDate() + 2);
                        const dayAfterTomorrow = currentDate
                            .toISOString()
                            .split("T")[0];
                        const inputDate = new Date(value)
                            .toISOString()
                            .split("T")[0];
                        return inputDate >= dayAfterTomorrow;
                    }
                )
                .test(
                    "is-current-year",
                    "Ngày bắt đầu phải trong năm nay",
                    function (value) {
                        const currentYear = new Date().getFullYear();
                        const inputYear = new Date(value).getFullYear();
                        return inputYear === currentYear;
                    }
                ),
            endDate: Yup.date()
                .required("Xin hãy chọn ngày kết thúc")
                .when("startDate", (startDate, schema) => {
                    return schema
                        .test({
                            test: function (endDate) {
                                if (startDate && endDate) {
                                    const startDateOnly = new Date(
                                        startDate
                                    ).setHours(0, 0, 0, 0);
                                    const endDateOnly = new Date(
                                        endDate
                                    ).setHours(0, 0, 0, 0);
                                    return endDateOnly >= startDateOnly;
                                }
                                return true;
                            },
                            message:
                                "Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu",
                        })
                        .test(
                            "is-current-year",
                            "Ngày kết thúc phải trong năm nay",
                            function (value) {
                                const currentYear = new Date().getFullYear();
                                const inputYear = new Date(value).getFullYear();
                                return inputYear === currentYear;
                            }
                        );
                }),
            startTime: Yup.string().required("Xin hãy chọn giờ bắt đầu"),
            endTime: Yup.string().required("Xin hãy chọn giờ kết thúc"),
            location: Yup.string().required("Địa điểm không thể trống"),
            min: Yup.number()
                .required("Số người tham gia tối thiểu không thể trống")
                .min(10, "Số người tham gia tối thiểu ít nhất là 10"),
            max: Yup.number()
                .required("Số người tham gia tối đa không thể trống")
                .min(
                    Yup.ref("min"),
                    "Số người tham gia tối đa phải lớn hơn số người tham gia tối thiểu"
                ),
        }),
        onSubmit: async (values) => {
            formData.append("PetCoffeeShopId", shopId);
            formData.append("Title", values.title);
            formData.append("ImageFile", imagePic);
            formData.append("Description", values.description);
            formData.append("StartDate", values.startDate);
            formData.append("EndDate", values.endDate);
            formData.append("StartTime", values.startTime);
            formData.append("EndTime", values.endTime);
            formData.append("Location", values.location);
            formData.append("MinParticipants", values.min);
            formData.append("MaxParticipants", values.max);

            setShowLoadingModal(true);
            dispatch(createEventThunk(formData))
                .unwrap()
                .then((res) => {
                    setShowLoadingModal(false);
                    navigate("/shop", {
                        state: {
                            eventId: res.id,
                            shopId: shopId,
                            direction: "createEvent",
                        },
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
            setImagePic(file);
            formik.setFieldValue("image", URL.createObjectURL(file));
        }
    };

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    tomorrow.setHours(tomorrow.getHours() + 7);
    const tomorrowFormatted = tomorrow.toISOString().split("T")[0];

    return (
        <div className="createStaff">
            <Header
                title="Tạo sự kiện bước 1"
                subtitle="Cung cấp thông tin sự kiện"
            />
            <form onSubmit={formik.handleSubmit}>
                <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/png, image/jpeg"
                    style={{ display: "none" }}
                    onChange={handleImageSelect}
                />
                <label htmlFor="image">
                    <div className="background_formik_box">
                        <img
                            src={
                                formik.values?.image === ""
                                    ? NoBackground
                                    : formik.values?.image
                            }
                            alt=""
                            className="background_formik"
                        />
                        <div className="background_formik_icon_box">
                            <PhotoCameraIcon className="background_formik_icon" />
                        </div>
                    </div>
                </label>
                <div className="login__validation__error">
                    {formik.touched.image && formik.errors.image && (
                        <p>{formik.errors.image}</p>
                    )}
                </div>
                {/* title */}
                <>
                    <TextField
                        id="title"
                        label={
                            <span>
                                Tiêu Đề <span style={{ color: "red" }}>*</span>
                            </span>
                        }
                        variant="outlined"
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        fullWidth
                        autoComplete="title"
                        margin="dense"
                        color="secondary"
                    />
                    {formik.touched.title && formik.errors.title && (
                        <div className="login__validation__error">
                            <p>{formik.errors.title}</p>
                        </div>
                    )}
                </>
                {/* location */}
                <>
                    <TextField
                        id="location"
                        label={
                            <span>
                                Địa Điểm <span style={{ color: "red" }}>*</span>
                            </span>
                        }
                        variant="outlined"
                        value={formik.values.location}
                        onChange={formik.handleChange}
                        fullWidth
                        autoComplete="location"
                        margin="dense"
                        color="secondary"
                    />
                    {formik.touched.location && formik.errors.location && (
                        <div className="login__validation__error">
                            <p>{formik.errors.location}</p>
                        </div>
                    )}
                </>
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        {/* startDate */}
                        <Typography variant="body1">
                            Ngày Bắt Đầu <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <TextField
                            id="startDate"
                            variant="outlined"
                            value={formik.values.startDate}
                            onChange={formik.handleChange}
                            fullWidth
                            autoComplete="startDate"
                            margin="dense"
                            type="date"
                            inputProps={{
                                min: tomorrowFormatted,
                            }}
                            color="secondary"
                        />
                        {formik.touched.startDate &&
                            formik.errors.startDate && (
                                <div className="login__validation__error">
                                    <p>{formik.errors.startDate}</p>
                                </div>
                            )}
                    </Grid>
                    <Grid item xs={6}>
                        {/* endDate */}
                        <Typography variant="body1">
                            Ngày Kết Thúc{" "}
                            <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <TextField
                            id="endDate"
                            variant="outlined"
                            value={formik.values.endDate}
                            onChange={formik.handleChange}
                            fullWidth
                            autoComplete="endDate"
                            margin="dense"
                            type="date"
                            inputProps={{
                                min: formik.values.startDate || "",
                            }}
                            color="secondary"
                        />
                        {formik.touched.endDate && formik.errors.endDate && (
                            <div className="login__validation__error">
                                <p>{formik.errors.endDate}</p>
                            </div>
                        )}
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        {/* startTime */}
                        <Typography variant="body1">
                            Giờ Bắt Đầu <span style={{ color: "red" }}>*</span>
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
                            Giờ Kết Thúc <span style={{ color: "red" }}>*</span>
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
                        {formik.touched.endTime && formik.errors.endTime && (
                            <div className="login__validation__error">
                                <p>{formik.errors.endTime}</p>
                            </div>
                        )}
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        {/* min */}
                        <TextField
                            id="min"
                            label={
                                <span>
                                    Số Người Tối Thiểu{" "}
                                    <span style={{ color: "red" }}>*</span>
                                </span>
                            }
                            variant="outlined"
                            value={formik.values.min}
                            onChange={formik.handleChange}
                            fullWidth
                            autoComplete="min"
                            margin="dense"
                            color="secondary"
                            type="number"
                        />
                        {formik.touched.min && formik.errors.min && (
                            <div className="login__validation__error">
                                <p>{formik.errors.min}</p>
                            </div>
                        )}
                    </Grid>
                    <Grid item xs={6}>
                        {/* max */}
                        <TextField
                            id="max"
                            label={
                                <span>
                                    Số Người Tối Đa{" "}
                                    <span style={{ color: "red" }}>*</span>
                                </span>
                            }
                            variant="outlined"
                            value={formik.values.max}
                            onChange={formik.handleChange}
                            fullWidth
                            autoComplete="max"
                            margin="dense"
                            color="secondary"
                            type="number"
                        />
                        {formik.touched.max && formik.errors.max && (
                            <div className="login__validation__error">
                                <p>{formik.errors.max}</p>
                            </div>
                        )}
                    </Grid>
                </Grid>
                {/* description */}
                <>
                    <TextField
                        id="description"
                        label={
                            <span>
                                Mô Tả <span style={{ color: "red" }}>*</span>
                            </span>
                        }
                        variant="outlined"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        fullWidth
                        autoComplete="description"
                        margin="dense"
                        color="secondary"
                        multiline
                        minRows={3}
                    />
                    {formik.touched.description &&
                        formik.errors.description && (
                            <div className="login__validation__error">
                                <p>{formik.errors.description}</p>
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
                            Tiếp Tục
                        </Button>
                    </div>
                ) : (
                    <LoadingModal />
                )}
            </form>
        </div>
    );
}
