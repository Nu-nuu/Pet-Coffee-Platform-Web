import * as React from "react";
import "./eventDetail.css";
import { Button, TextField, Radio } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import {
    getAllEventSubmitsThunk,
    getEventDetailThunk,
} from "../../../../../store/apiThunk/eventThunk";
import {
    allEventSubmitsSelector,
    eventDetailSelector,
} from "../../../../../store/sellectors";
import { useEffect } from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import ArticleIcon from "@mui/icons-material/Article";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts";
import LoadingModal from "../../../../../components/modal/loadingModal/loadingModal";
import { FormatDate } from "../../../../../components/format/formatDatetime/formatDatetime";

export default function EventDetail() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const eventId = location.state?.eventId;
    const shopId = location.state?.shopId;
    const eventDetail = useSelector(eventDetailSelector);
    const allEventSubmits = useSelector(allEventSubmitsSelector);
    const [showRender, setShowRender] = useState(false);

    useEffect(() => {
        setShowRender(true);
        dispatch(getEventDetailThunk(eventId));
        dispatch(getAllEventSubmitsThunk(eventId)).then(() =>
            setShowRender(false)
        );
    }, [eventId]);

    const [value, setValue] = React.useState("1");

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return !showRender ? (
        <div className="eventDetail">
            <div className="header">
                <div className="topBorder"></div>
                <img src={eventDetail.image} alt="" className="img" />
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                        paddingBlock: "2%",
                        paddingInline: "5%",
                    }}
                >
                    <div className="title">{eventDetail.title}</div>
                    <div className="info">
                        <AccessTimeIcon color="action" />
                        {FormatDate(eventDetail.startDate)}
                        {" - "}
                        {FormatDate(eventDetail.endDate)} (
                        {eventDetail.startTime}
                        {" - "}
                        {eventDetail.endTime})
                    </div>
                    <div className="info">
                        <LocationOnIcon color="action" />
                        {eventDetail.location}
                    </div>
                    <div className="info">
                        <ArticleIcon color="action" />
                        {eventDetail.description || "NaN"}
                    </div>
                    <div className="info">
                        <PersonIcon color="action" />
                        {eventDetail.minParticipants} người tối thiểu
                    </div>
                    <div className="info">
                        <PersonIcon color="action" />
                        {eventDetail.maxParticipants} người tối đa
                    </div>
                    <div className="info">
                        <PersonIcon color="action" />
                        {eventDetail.totalJoinEvent} người tham gia
                    </div>
                </div>
            </div>
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
                            label="Câu Hỏi"
                            value="1"
                            style={{ fontSize: "22px" }}
                        />
                        <Tab
                            label="Câu Trả Lời"
                            value="2"
                            style={{ fontSize: "22px" }}
                        />
                    </TabList>
                </Box>
                <TabPanel value="1" style={{ padding: 0, marginTop: "30px" }}>
                    {eventDetail.fields?.map((field, index) => {
                        const optionArr = field.answer?.split(";");
                        return (
                            <div className="field" key={index}>
                                <div className="question">
                                    {field.question}{" "}
                                    {field.isOptional !== true && (
                                        <span style={{ color: "red" }}>*</span>
                                    )}
                                </div>
                                {field.type === "input" ? (
                                    <TextField
                                        className="textfield"
                                        disabled
                                        placeholder="Câu Trả Lời"
                                        variant="standard"
                                        fullWidth
                                    />
                                ) : (
                                    optionArr?.map((option, index) => {
                                        return (
                                            <div key={index} className="option">
                                                <Radio
                                                    disabled
                                                    style={{ paddingLeft: 0 }}
                                                />
                                                <p>{option}</p>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        );
                    })}
                </TabPanel>
                <TabPanel value="2" style={{ padding: 0, marginTop: "30px" }}>
                    {allEventSubmits?.fields?.map((field, index) => {
                        const answerArr = field?.submittingContent
                            ?.split(";")
                            .filter((answer) => answer !== "");

                        function convertArray(arr) {
                            const counts = {};
                            const totalCount = arr?.length;
                            arr?.forEach((element) => {
                                counts[element] = (counts[element] || 0) + 1;
                            });
                            const result = Object.keys(counts).map((key) => ({
                                value: (counts[key] / totalCount) * 100,
                                label: key,
                            }));
                            return result;
                        }

                        const data = convertArray(answerArr);

                        return (
                            <div className="field" key={index}>
                                <div className="question">
                                    {field.question}{" "}
                                    {field.isOptional !== true && (
                                        <span style={{ color: "red" }}>*</span>
                                    )}
                                </div>
                                <div className="answer">
                                    {answerArr?.length} Câu trả lời
                                </div>
                                {field.type === "input" ? (
                                    <div className="answer_box">
                                        {answerArr?.map((answer, index) => (
                                            <TextField
                                                className="textfield"
                                                disabled
                                                placeholder="Câu Trả Lời"
                                                value={answer}
                                                variant="outlined"
                                                fullWidth
                                                key={index}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ display: "flex" }}>
                                        <PieChart
                                            colors={[
                                                "lime",
                                                "aqua",
                                                "yellow",
                                                "crimson",
                                                "turquoise",
                                                "teal",
                                                "golden",
                                            ]}
                                            series={[
                                                {
                                                    arcLabel: (item) =>
                                                        `${item.value?.toFixed(
                                                            2
                                                        )}%`,
                                                    arcLabelMinAngle: 45,
                                                    data,
                                                    innerRadius: 30,
                                                    outerRadius: 100,
                                                    paddingAngle: 3,
                                                    cornerRadius: 10,
                                                },
                                            ]}
                                            sx={{
                                                [`& .${pieArcLabelClasses.root}`]:
                                                    {
                                                        fill: "white",
                                                        fontWeight: "bold",
                                                    },
                                            }}
                                            width={600}
                                            height={300}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    {!allEventSubmits?.fields && (
                        <div className="field" style={{ fontSize: "18px" }}>
                            Chưa Có Câu Trả Lời..
                        </div>
                    )}
                </TabPanel>
            </TabContext>
            <div
                style={{
                    marginBottom: "50px",
                    marginTop: "30px",
                }}
            >
                <Button
                    className="back_btn"
                    variant="contained"
                    onClick={() => {
                        navigate("/shop", {
                            state: { shopId: shopId, direction: "eventDetail" },
                        });
                    }}
                >
                    Quay Lại
                </Button>
            </div>
        </div>
    ) : (
        <LoadingModal />
    );
}
