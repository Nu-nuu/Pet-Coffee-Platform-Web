import * as React from "react";
import "./updateEvent.css";
import {
    Button,
    TextField,
    Grid,
    Typography,
    Box,
    Tab,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Radio,
    Divider,
    FormControlLabel,
    IconButton,
    Switch,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import {
    getEventDetailThunk,
    updateEventFieldThunk,
    updateEventThunk,
} from "../../../../../store/apiThunk/eventThunk";
import { eventDetailSelector } from "../../../../../store/sellectors";
import { useEffect } from "react";
import Header from "../../../components/header/Header";
import NoBackground from "../../../../../assets/noBackground.png";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { BackButton } from "../../../../../components/modal/backModal/backModal";
import LoadingModal from "../../../../../components/modal/loadingModal/loadingModal";
import {
    ERRORTEXT,
    SUCCESSTEXT,
    UPDATEEVENTSUCCESS,
} from "../../../../../components/text/notiText/notiText";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

export default function UpdateEvent() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const eventId = location.state?.eventId;
    const eventDetail = useSelector(eventDetailSelector);
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [showRender, setShowRender] = useState(false);
    const [formData, setFormData] = useState(new FormData());
    const [fields, setFields] = useState([]);

    const defaultField = {
        question: "",
        type: "radio",
        isOptional: true,
        answer: "",
        options: [{ label: "", value: "" }],
        errorMsg: "",
    };

    useEffect(() => {
        const initialFields =
            eventDetail.fields && eventDetail.fields.length > 0
                ? eventDetail.fields.map(
                      ({ submittingContent, eventId, id, ...field }) => {
                          const answerArr = field?.answer?.split(";");
                          return {
                              ...field,
                              options: answerArr.map((answer) => ({
                                  label: answer,
                                  value: "",
                              })),
                              errorMsg: "",
                          };
                      }
                  )
                : [defaultField];
        setFields(initialFields);
    }, [eventDetail.fields]);

    useEffect(() => {
        setShowRender(true);
        dispatch(getEventDetailThunk(eventId)).then(() => setShowRender(false));
    }, [eventId]);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            title: eventDetail.title,
            image: eventDetail.image,
            description: eventDetail.description || "",
            startDate: new Date(eventDetail.startDate || null)
                ?.toISOString()
                .split("T")[0],
            endDate: new Date(eventDetail.endDate || null)
                ?.toISOString()
                .split("T")[0],
            startTime: eventDetail.startTime,
            endTime: eventDetail.endTime,
            location: eventDetail.location,
            min: eventDetail.minParticipants,
            max: eventDetail.maxParticipants,
        },
        validationSchema: Yup.object({
            title: Yup.string().required("Họ Tên không thể trống"),
            image: Yup.string().required("Xin hãy chọn ảnh"),
            description: Yup.string(),
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
            formData.append("Id", eventId);
            formData.append("Title", values.title);
            formData.append("Description", values.description);
            formData.append("StartDate", values.startDate);
            formData.append("EndDate", values.endDate);
            formData.append("StartTime", values.startTime);
            formData.append("EndTime", values.endTime);
            formData.append("Location", values.location);
            formData.append("MinParticipants", values.min);
            formData.append("MaxParticipants", values.max);

            setShowLoadingModal(true);
            dispatch(updateEventThunk(formData))
                .unwrap()
                .then(() => {
                    setShowLoadingModal(false);
                    Swal.fire({
                        title: SUCCESSTEXT,
                        text: UPDATEEVENTSUCCESS,
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
            formData.set("NewImageFile", file);
            formik.setFieldValue("image", URL.createObjectURL(file));
        }
    };

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    tomorrow.setHours(tomorrow.getHours() + 7);
    const tomorrowFormatted = tomorrow.toISOString().split("T")[0];

    const [tabValue, setTabValue] = React.useState("1");

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleQuestionChange = (index, value) => {
        const updatedFields = [...fields];
        const duplicateQuestion = updatedFields.some(
            (field, idx) => idx !== index && field.question === value
        );
        if (duplicateQuestion) {
            updatedFields[index] = {
                ...updatedFields[index],
                question: value,
                errorMsg: "Câu hỏi đã tồn tại trong danh sách",
            };
        } else {
            updatedFields[index] = {
                ...updatedFields[index],
                question: value,
                errorMsg: value === "" ? "Câu hỏi không được trống" : "",
            };
        }
        setFields(updatedFields);
    };

    const handleTypeChange = (index, value) => {
        const newFields = [...fields];
        const currentField = newFields[index];
        currentField.type = value;
        if (value === "input") {
            currentField.options = [{ label: "", value: "" }];
            currentField.answer = "";
            currentField.errorMsg = "";
        } else if (value === "radio") {
            if (currentField.options.length === 0) {
                currentField.options = [{ label: "", value: "" }];
            }
            currentField.answer = currentField.options
                .map((opt) => opt.label)
                .join(";");
            const existingLabels = currentField.options.map(
                (option) => option.label
            );
            const labelCounts = existingLabels.reduce((counts, label) => {
                counts[label] = (counts[label] || 0) + 1;
                return counts;
            }, {});
            const hasDuplicate = Object.values(labelCounts).some(
                (count) => count > 1
            );
            const hasEmptyOption = currentField.options.some(
                (option) => option.label.trim() === ""
            );

            if (hasDuplicate) {
                currentField.errorMsg = "Tùy chọn không được giống nhau";
            } else if (hasEmptyOption) {
                currentField.errorMsg = "Tùy chọn không được trống";
            } else {
                currentField.errorMsg = "";
            }
        }
        setFields(newFields);
    };

    const handleOptionChange = (fieldIndex, optionIndex, value) => {
        const newFields = [...fields];
        const currentField = newFields[fieldIndex];
        currentField.options[optionIndex].label = value;
        const existingLabels = currentField.options.map(
            (option, idx) => option.label
        );
        const labelCounts = existingLabels.reduce((counts, label) => {
            counts[label] = (counts[label] || 0) + 1;
            return counts;
        }, {});

        const hasDuplicate = Object.values(labelCounts).some(
            (count) => count > 1
        );
        const hasEmptyOption = currentField.options.some(
            (option) => option.label.trim() === ""
        );
        if (hasDuplicate) {
            currentField.errorMsg = "Tùy chọn không được giống nhau";
        } else if (hasEmptyOption) {
            currentField.errorMsg = "Tùy chọn không được trống";
        } else {
            currentField.errorMsg = "";
        }
        currentField.answer = currentField.options
            .map((opt) => opt.label)
            .join(";");
        setFields(newFields);
    };

    const handleAddOption = (index) => {
        const newFields = [...fields];
        newFields[index].options.push({ label: "", value: "" });
        setFields(newFields);
    };

    const handleRemoveOption = (fieldIndex, optionIndex) => {
        const newFields = [...fields];
        newFields[fieldIndex].options.splice(optionIndex, 1);
        newFields[fieldIndex].answer = newFields[fieldIndex].options
            .map((opt) => opt.label)
            .join(";");
        setFields(newFields);
    };

    const handleSwitchChange = (index) => {
        const newFields = [...fields];
        newFields[index].isOptional = !newFields[index].isOptional;
        setFields(newFields);
    };

    const handleCreateField = () => {
        setFields([
            ...fields,
            {
                question: "",
                type: "radio",
                isOptional: true,
                answer: "",
                options: [{ label: "", value: "" }],
            },
        ]);
    };

    const handleRemoveField = (index) => {
        const newFields = [...fields];
        newFields.splice(index, 1);
        setFields(newFields);
    };

    function hasDuplicateLabels(options) {
        const labels = new Set();
        for (const option of options) {
            if (labels.has(option.label)) {
                return true;
            }
            labels.add(option.label);
        }
        return false;
    }

    function hasEmptyLabels(options) {
        for (const option of options) {
            if (option.label === "") {
                return true;
            }
        }
        return false;
    }

    const handleUpdateEventField = () => {
        const check = fields.some(
            (field) =>
                field.question === "" ||
                (field.type === "radio" && field.answer === "") ||
                field.errorMsg !== "" ||
                (field.type === "radio" && hasDuplicateLabels(field.options)) ||
                (field.type === "radio" && hasEmptyLabels(field.options))
        );
        if (check) {
            const updatedFields = fields.map((field) => ({
                ...field,
                errorMsg:
                    field.question === "" ||
                    (field.type === "radio" && field.answer === "")
                        ? "Xin hãy nhập đầy đủ thông tin"
                        : field.type === "radio" &&
                          hasDuplicateLabels(field.options)
                        ? "Tùy chọn không được giống nhau"
                        : field.type === "radio" &&
                          hasEmptyLabels(field.options)
                        ? "Tùy chọn không được trống"
                        : "",
            }));
            setFields(updatedFields);
            return;
        }
        const eventData = {
            eventId: eventId,
            fields: fields,
        };
        setShowLoadingModal(true);
        dispatch(updateEventFieldThunk(eventData))
            .unwrap()
            .then(() => {
                setShowLoadingModal(false);
                Swal.fire({
                    title: SUCCESSTEXT,
                    text: UPDATEEVENTSUCCESS,
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
    };

    return (
        <div className="updateEvent">
            <Header
                title="Cập nhật sự kiện"
                subtitle="Cung cấp thông tin sự kiện"
            />
            {!showRender ? (
                <TabContext value={tabValue}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            marginTop: "30px",
                        }}
                    >
                        <TabList
                            onChange={handleTabChange}
                            textColor="secondary"
                            indicatorColor="secondary"
                        >
                            <Tab
                                label="Thông Tin"
                                value="1"
                                style={{ fontSize: "22px" }}
                            />
                            <Tab
                                label="Khảo Sát"
                                value="2"
                                style={{ fontSize: "22px" }}
                            />
                        </TabList>
                    </Box>
                    <TabPanel
                        value="1"
                        style={{ padding: 0, marginTop: "30px" }}
                    >
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
                                {formik.touched.image &&
                                    formik.errors.image && (
                                        <p>{formik.errors.image}</p>
                                    )}
                            </div>
                            {/* title */}
                            <>
                                <TextField
                                    id="title"
                                    label={
                                        <span>
                                            Tiêu Đề{" "}
                                            <span style={{ color: "red" }}>
                                                *
                                            </span>
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
                                {formik.touched.title &&
                                    formik.errors.title && (
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
                                            Địa Điểm{" "}
                                            <span style={{ color: "red" }}>
                                                *
                                            </span>
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
                                {formik.touched.location &&
                                    formik.errors.location && (
                                        <div className="login__validation__error">
                                            <p>{formik.errors.location}</p>
                                        </div>
                                    )}
                            </>
                            <Grid container spacing={3}>
                                <Grid item xs={6}>
                                    {/* startDate */}
                                    <Typography variant="body1">
                                        Ngày Bắt Đầu{" "}
                                        <span style={{ color: "red" }}>*</span>
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
                                    {formik.touched.endDate &&
                                        formik.errors.endDate && (
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
                            <Grid container spacing={3}>
                                <Grid item xs={6}>
                                    {/* min */}
                                    <TextField
                                        id="min"
                                        label={
                                            <span>
                                                Số Người Tối Thiểu{" "}
                                                <span style={{ color: "red" }}>
                                                    *
                                                </span>
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
                                    {formik.touched.min &&
                                        formik.errors.min && (
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
                                                <span style={{ color: "red" }}>
                                                    *
                                                </span>
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
                                    {formik.touched.max &&
                                        formik.errors.max && (
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
                                    label="Mô tả"
                                    variant="outlined"
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    fullWidth
                                    autoComplete="description"
                                    margin="dense"
                                    color="secondary"
                                    minRows={3}
                                    multiline
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
                                    <BackButton type="update" />
                                    <Button
                                        className="login__btn"
                                        variant="contained"
                                        type="submit"
                                    >
                                        Xác Nhận
                                    </Button>
                                </div>
                            ) : (
                                <LoadingModal />
                            )}
                        </form>
                    </TabPanel>
                    <TabPanel
                        value="2"
                        style={{ padding: 0, marginTop: "30px" }}
                    >
                        <Grid container spacing={3}>
                            <Grid item xs={10}>
                                {/* field */}
                                {fields.map((field, index) => (
                                    <div className="field" key={index}>
                                        <div className="top_border"></div>
                                        <div
                                            style={{
                                                paddingInline: "5%",
                                                paddingBlock: "4%",
                                            }}
                                        >
                                            <Grid container spacing={3}>
                                                <Grid item xs={8}>
                                                    {/* question */}
                                                    <TextField
                                                        label={
                                                            <span>
                                                                Câu Hỏi{" "}
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
                                                        fullWidth
                                                        value={field.question}
                                                        onChange={(e) =>
                                                            handleQuestionChange(
                                                                index,
                                                                e.target.value
                                                            )
                                                        }
                                                        margin="dense"
                                                        color="secondary"
                                                    />
                                                </Grid>
                                                <Grid item xs={4}>
                                                    {/* type */}
                                                    <FormControl
                                                        fullWidth
                                                        margin="dense"
                                                    >
                                                        <InputLabel
                                                            id={`type-${index}`}
                                                            color="secondary"
                                                        >
                                                            Loại Câu Hỏi{" "}
                                                            <span
                                                                style={{
                                                                    color: "red",
                                                                }}
                                                            >
                                                                *
                                                            </span>
                                                        </InputLabel>
                                                        <Select
                                                            labelId={`type-${index}`}
                                                            id={`type-${index}`}
                                                            name={`type-${index}`}
                                                            value={field.type}
                                                            onChange={(e) =>
                                                                handleTypeChange(
                                                                    index,
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            label="Loại"
                                                            color="secondary"
                                                        >
                                                            <MenuItem
                                                                value={"radio"}
                                                            >
                                                                Trắc Nghiệm
                                                            </MenuItem>
                                                            <MenuItem
                                                                value={"input"}
                                                            >
                                                                Trả Lời Ngắn
                                                            </MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                            {/* answer */}
                                            {field.type === "radio" ? (
                                                <>
                                                    {field.options.map(
                                                        (
                                                            option,
                                                            optionIndex
                                                        ) => (
                                                            <div
                                                                className="flex-center"
                                                                style={{
                                                                    justifyContent:
                                                                        "left",
                                                                    marginTop:
                                                                        "7px",
                                                                }}
                                                                key={
                                                                    optionIndex
                                                                }
                                                            >
                                                                <label
                                                                    htmlFor={`option-${index}-${optionIndex}`}
                                                                >
                                                                    <Radio
                                                                        disabled
                                                                        style={{
                                                                            paddingLeft: 0,
                                                                        }}
                                                                    />
                                                                </label>
                                                                <TextField
                                                                    id={`option-${index}-${optionIndex}`}
                                                                    label={
                                                                        <span>
                                                                            Tùy
                                                                            Chọn{" "}
                                                                            {optionIndex +
                                                                                1}{" "}
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
                                                                    margin="dense"
                                                                    value={
                                                                        option.label
                                                                    }
                                                                    style={{
                                                                        width: "62%",
                                                                    }}
                                                                    multiline
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleOptionChange(
                                                                            index,
                                                                            optionIndex,
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    color="secondary"
                                                                />
                                                                {optionIndex !==
                                                                    0 && (
                                                                    <div
                                                                        onClick={() =>
                                                                            handleRemoveOption(
                                                                                index,
                                                                                optionIndex
                                                                            )
                                                                        }
                                                                        style={{
                                                                            marginLeft:
                                                                                "20px",
                                                                        }}
                                                                        className="icon"
                                                                    >
                                                                        <IconButton>
                                                                            <CloseIcon color="error" />
                                                                        </IconButton>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )
                                                    )}
                                                    <div
                                                        className="flex-center"
                                                        style={{
                                                            justifyContent:
                                                                "left",
                                                            cursor: "pointer",
                                                        }}
                                                        onClick={() =>
                                                            handleAddOption(
                                                                index
                                                            )
                                                        }
                                                    >
                                                        <Radio
                                                            disabled
                                                            style={{
                                                                paddingLeft: 0,
                                                            }}
                                                        />
                                                        <p
                                                            style={{
                                                                color: "#70d8bd",
                                                            }}
                                                        >
                                                            Thêm Tùy Chọn Khác
                                                        </p>
                                                    </div>
                                                </>
                                            ) : (
                                                <TextField
                                                    disabled
                                                    label={`Câu Trả Lời`}
                                                    variant="outlined"
                                                    margin="dense"
                                                    style={{
                                                        marginBottom: "20px",
                                                        width: "65.5%",
                                                    }}
                                                />
                                            )}
                                            <Divider />
                                            {/* isOptional */}
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent:
                                                        "space-between",
                                                    marginTop: "10px",
                                                }}
                                            >
                                                <div style={{ color: "red" }}>
                                                    {field.errorMsg}
                                                </div>
                                                <div className="flex-center">
                                                    {index !== 0 && (
                                                        <div
                                                            onClick={() =>
                                                                handleRemoveField(
                                                                    index
                                                                )
                                                            }
                                                            className="icon"
                                                        >
                                                            <IconButton>
                                                                <DeleteOutlineOutlinedIcon color="error" />
                                                            </IconButton>
                                                        </div>
                                                    )}
                                                    <FormControlLabel
                                                        control={
                                                            <Switch
                                                                checked={
                                                                    !field.isOptional
                                                                }
                                                                onChange={() =>
                                                                    handleSwitchChange(
                                                                        index
                                                                    )
                                                                }
                                                                color="secondary"
                                                            />
                                                        }
                                                        label="Bắt buộc"
                                                        labelPlacement="start"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </Grid>
                            <Grid
                                item
                                xs={2}
                                display="flex"
                                justifyContent="center"
                            >
                                <Button
                                    className="add__btn"
                                    variant="contained"
                                    onClick={handleCreateField}
                                >
                                    <AddIcon fontSize="large" />
                                </Button>
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
                                    onClick={() => handleUpdateEventField()}
                                >
                                    Xác Nhận
                                </Button>
                            </div>
                        ) : (
                            <LoadingModal />
                        )}
                    </TabPanel>
                </TabContext>
            ) : (
                <LoadingModal />
            )}
        </div>
    );
}
