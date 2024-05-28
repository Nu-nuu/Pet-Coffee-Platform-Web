import { Box, Button, Divider } from "@mui/material";
import Header from "../../../components/header/Header";
import { useLocation, useNavigate } from "react-router-dom";
import "./dashboardDetail.css";
import { BarChart, PieChart, pieArcLabelClasses } from "@mui/x-charts";
import Coin from "../../../../../assets/coin.png";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { platformMonthIncomeSelector } from "../../../../../store/sellectors";
import { getPlatformMonthIncomeThunk } from "../../../../../store/apiThunk/walletThunk";
import Lottie from "lottie-react";
import LoadingModal from "../../../../../assets/loading.json";
import {
    ConvertDashboardArray,
    GeneratePastSixMonths,
    HandleMonthChange,
    ValueFormatter,
} from "../../../../../components/graph/graph";
import { FilterGraphComponent } from "../../../../../components/graph/filterGraph";

export default function AdminDashboardDetail() {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const incomeSeries = location.state?.incomeSeries;
    const [month, setMonth] = useState("");
    const [data, setData] = useState([]);
    const [dateRange, setDateRange] = useState({ from: "", to: "" });
    const [xLabels, setXLabels] = useState([]);
    const platformMonthIncome = useSelector(platformMonthIncomeSelector);
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [checkHaveTrans, setCheckHaveTrans] = useState(false);
    const [checkIsUp, setCheckIsUp] = useState(false);

    useEffect(() => {
        const months = GeneratePastSixMonths();
        const lastMonth = months[months.length - 1];
        setMonth(lastMonth);
        const [month, year] = lastMonth.split("/");
        const startDate = `${month}/01/${year}`;
        const endDate = `${month}/${new Date(
            year,
            month,
            0
        ).getDate()}/${year}`;

        setDateRange({ from: startDate, to: endDate });
        setXLabels(months);
    }, []);

    useEffect(() => {
        setShowLoadingModal(true);
        if (dateRange.from && dateRange.to) {
            dispatch(getPlatformMonthIncomeThunk(dateRange))
                .unwrap()
                .then((res) => {
                    setData(ConvertDashboardArray(res?.transactions || []));
                    setCheckHaveTrans(res.transactions !== null);
                    setCheckIsUp(res.isUp === true);
                    setShowLoadingModal(false);
                });
        }
    }, [dateRange, dispatch]);

    const incomeSeriesData = incomeSeries?.map((series) => ({
        ...series,
        valueFormatter: ValueFormatter,
        stack: "total",
    }));

    const incomeArr = platformMonthIncome?.transactions;

    return (
        <div className="adminDashboardDetail">
            <Box m="20px">
                <Header
                    title={"thu nhập"}
                    subtitle={"tổng thu nhập"}
                    direction="dashboardDetail"
                />
                {!showLoadingModal ? (
                    <>
                        <Box display="flex" alignItems="center" gap="3em">
                            <FilterGraphComponent
                                label="Thời Gian"
                                name="month"
                                month={month}
                                handleMonthChange={(e) =>
                                    HandleMonthChange(e, setDateRange, setMonth)
                                }
                                xLabels={xLabels}
                            />
                            <Box
                                display="flex"
                                alignItems="center"
                                width="100%"
                                gap=".5em"
                            >
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    gap="5px"
                                    fontWeight="600"
                                    fontSize="25px"
                                >
                                    {Math.floor(
                                        platformMonthIncome?.balance
                                    )?.toLocaleString()}
                                    <img
                                        src={Coin}
                                        alt=""
                                        style={{ width: "30px" }}
                                    />
                                </Box>
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    gap="5px"
                                    fontWeight="600"
                                    fontSize="25px"
                                >
                                    {"( "}
                                    {checkIsUp ? (
                                        <ArrowUpwardIcon
                                            color="secondary"
                                            fontSize="large"
                                        />
                                    ) : (
                                        <ArrowDownwardIcon
                                            color="error"
                                            fontSize="large"
                                        />
                                    )}
                                    <div>
                                        {platformMonthIncome?.percent?.toFixed(2)}
                                        {"% "}
                                        <span className="span">
                                            So với tháng trước{" "}
                                        </span>
                                    </div>
                                    {" )"}
                                </Box>
                            </Box>
                        </Box>
                        {checkHaveTrans ? (
                            <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                width="100%"
                            >
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
                                                `${item.value}%`,
                                            arcLabelMinAngle: 45,
                                            data,
                                            innerRadius: 30,
                                            outerRadius: 100,
                                            paddingAngle: 3,
                                            cornerRadius: 10,
                                        },
                                    ]}
                                    sx={{
                                        [`& .${pieArcLabelClasses.root}`]: {
                                            fill: "white",
                                            fontWeight: "bold",
                                        },
                                    }}
                                    height={300}
                                />
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    gap="7px"
                                    width="100%"
                                >
                                    {incomeArr.map((income, index) => (
                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            gap="3px"
                                            key={index}
                                        >
                                            {income?.amount?.toLocaleString()}
                                            <img
                                                src={Coin}
                                                alt=""
                                                style={{ width: "25px" }}
                                            />
                                            <div>
                                                ( {income?.totalTransaction}{" "}
                                                Giao dịch )
                                            </div>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        ) : (
                            <div className="noTrans">Chưa có giao dịch..</div>
                        )}
                    </>
                ) : (
                    <Lottie
                        animationData={LoadingModal}
                        loop={true}
                        style={{ width: 100, height: 100 }}
                    />
                )}
                <Divider />
                <Box height="72vh" paddingBlock="30px">
                    <BarChart
                        series={[...incomeSeriesData]}
                        xAxis={[
                            {
                                data: xLabels,
                                scaleType: "band",
                                categoryGapRatio: 0.4,
                            },
                        ]}
                        colors={[
                            "lime",
                            "aqua",
                            "yellow",
                            "crimson",
                            "turquoise",
                            "teal",
                            "golden",
                        ]}
                    />
                </Box>
                <Button
                    className="back_btn"
                    variant="contained"
                    onClick={() => navigate(-1)}
                >
                    Quay lại
                </Button>
            </Box>
        </div>
    );
}
