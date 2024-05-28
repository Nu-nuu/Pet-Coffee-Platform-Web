import * as React from "react";
import "./createEventField.css";
import {
    Button,
    TextField,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Radio,
    FormControlLabel,
    Switch,
    Divider,
    IconButton,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import Swal from "sweetalert2";
import {
    createEventFieldThunk,
    deleteEventThunk,
} from "../../../../../store/apiThunk/eventThunk";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Header from "../../../components/header/Header";
import LoadingModal from "../../../../../components/modal/loadingModal/loadingModal";
import {
    ADDEVENTSUCCESS,
    CANCELADD,
    CANCELTEXT,
    CLOSETEXT,
    CONFIRMTEXT,
    ERRORTEXT,
    SUCCESSTEXT,
} from "../../../../../components/text/notiText/notiText";

export default function CreateEventField() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const eventId = location.state?.eventId;
    const shopId = location.state?.shopId;
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [fields, setFields] = useState([
        {
            question: "",
            type: "radio",
            isOptional: true,
            answer: "",
            options: [{ label: "", value: "" }],
            errorMsg: "",
        },
    ]);

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

    const handleCreateEvent = () => {
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
        dispatch(createEventFieldThunk(eventData))
            .unwrap()
            .then(() => {
                setShowLoadingModal(false);
                Swal.fire({
                    title: SUCCESSTEXT,
                    text: ADDEVENTSUCCESS,
                    icon: "success",
                    showCancelButton: false,
                    showConfirmButton: false,
                    background: "white",
                    timer: 1500,
                    timerProgressBar: true,
                    scrollbarPadding: false,
                }).then(() => {
                    navigate("/shop", {
                        state: {
                            shopId: shopId,
                            direction: "createEventField",
                        },
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
    };

    const handleBack = () => {
        Swal.fire({
            icon: "warning",
            title: CANCELADD,
            text: CONFIRMTEXT,
            showDenyButton: true,
            showCancelButton: true,
            showConfirmButton: false,
            denyButtonText: CANCELTEXT,
            cancelButtonText: CLOSETEXT,
            denyButtonColor: "#af3f3b",
        }).then((result) => {
            if (result.isDenied) {
                setShowLoadingModal(true);
                dispatch(deleteEventThunk(eventId)).then(() => {
                    setShowLoadingModal(false);
                    navigate("/shop", {
                        state: {
                            shopId: shopId,
                            direction: "createEventField",
                        },
                    });
                });
            }
        });
    };

    return (
        <div className="createEventField">
            <Header
                title="Tạo sự kiện bước 2"
                subtitle="Cung cấp thông tin khảo sát"
            />
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
                                                        style={{ color: "red" }}
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
                                        <FormControl fullWidth margin="dense">
                                            <InputLabel
                                                id={`type-${index}`}
                                                color="secondary"
                                            >
                                                Loại Câu Hỏi{" "}
                                                <span style={{ color: "red" }}>
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
                                                        e.target.value
                                                    )
                                                }
                                                label="Loại"
                                                color="secondary"
                                            >
                                                <MenuItem value={"radio"}>
                                                    Trắc Nghiệm
                                                </MenuItem>
                                                <MenuItem value={"input"}>
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
                                            (option, optionIndex) => (
                                                <div
                                                    className="flex-center"
                                                    style={{
                                                        justifyContent: "left",
                                                        marginTop: "7px",
                                                    }}
                                                    key={optionIndex}
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
                                                                Tùy Chọn{" "}
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
                                                        value={option.label}
                                                        style={{ width: "62%" }}
                                                        multiline
                                                        onChange={(e) =>
                                                            handleOptionChange(
                                                                index,
                                                                optionIndex,
                                                                e.target.value
                                                            )
                                                        }
                                                        color="secondary"
                                                    />
                                                    {optionIndex !== 0 && (
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
                                                justifyContent: "left",
                                                cursor: "pointer",
                                            }}
                                            onClick={() =>
                                                handleAddOption(index)
                                            }
                                        >
                                            <Radio
                                                disabled
                                                style={{ paddingLeft: 0 }}
                                            />
                                            <p style={{ color: "#70d8bd" }}>
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
                                        justifyContent: "space-between",
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
                                                    handleRemoveField(index)
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
                                                    checked={!field.isOptional}
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
                <Grid item xs={2} display="flex" justifyContent="center">
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
                    <Button
                        className="back_btn"
                        variant="contained"
                        onClick={handleBack}
                    >
                        Hủy Bỏ
                    </Button>
                    <Button
                        className="login__btn"
                        variant="contained"
                        onClick={() => handleCreateEvent()}
                    >
                        Tạo
                    </Button>
                </div>
            ) : (
                <LoadingModal />
            )}
        </div>
    );
}
