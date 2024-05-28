import { Box, Divider } from "@mui/material";
import Header from "../../../components/header/Header";
import "./dashboard.css";
import { BarChart } from "@mui/x-charts";
import Coin from "../../../../../assets/coin.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    managerIncomeSelector,
    managerOutcomeSelector,
} from "../../../../../store/sellectors";
import { useSelector } from "react-redux";
import {
    GeneratePastSixMonths,
    ValueFormatter,
} from "../../../../../components/graph/graph";
import { TruncateText } from "../../../../../components/format/formatText/formatText";
import { useEffect } from "react";

export default function ManagerDashboard() {
    const managerIncome = useSelector(managerIncomeSelector);
    const managerOutcome = useSelector(managerOutcomeSelector);
    const location = useLocation();
    const navigate = useNavigate();
    const direction = location.state?.direction;

    useEffect(() => {
        if (direction === "packagePage" || direction === "transferStatus") {
            navigate("wallet");
        }
    }, [direction]);

    const xLabels = GeneratePastSixMonths();

    const incomeSeriesData =
        managerIncome?.monthAmounts?.map((shop) => ({
            data: shop?.amounts,
            label: TruncateText(shop?.shopName, 20),
            valueFormatter: ValueFormatter,
        })) || [];

    const incomeSeries = managerIncome?.monthAmounts?.map((shop) => ({
        data: shop?.amounts,
        label: TruncateText(shop?.shopName, 20),
    }));

    const outcomeSeriesData =
        managerOutcome?.monthAmounts?.map((shop) => ({
            data: shop?.amounts,
            label: TruncateText(shop?.shopName, 20),
            valueFormatter: ValueFormatter,
        })) || [];

    const outcomeSeries = managerOutcome?.monthAmounts?.map((shop) => ({
        data: shop?.amounts,
        label: TruncateText(shop?.shopName, 20),
    }));

    return (
        <div className="dashboard">
            <Box m="20px">
                <Header
                    title="thu nhập"
                    subtitle="tổng thu nhập 6 tháng gần đây"
                    direction="dashboard"
                />
                <Box
                    display="flex"
                    alignItems="center"
                    width="100%"
                    gap="5px"
                    fontWeight="600"
                    fontSize="25px"
                    marginBottom="30px"
                    marginTop="10px"
                >
                    {managerIncome?.balanace?.toLocaleString()}
                    <img src={Coin} alt="" style={{ width: "30px" }} />
                </Box>
                <Box height="70vh">
                    <BarChart
                        series={[...incomeSeriesData]}
                        xAxis={[
                            {
                                data: xLabels,
                                scaleType: "band",
                                categoryGapRatio: 0.3,
                                barGapRatio: 0.2,
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
                <div style={{ paddingInline: "4%", textAlign: "right" }}>
                    <Divider />
                    <Link
                        to="dashboardDetail"
                        className="link"
                        state={{
                            direction: "income",
                            incomeSeries: incomeSeries,
                        }}
                    >
                        Xem chi tiết
                    </Link>
                </div>
            </Box>
            <Box m="20px">
                <Header
                    title="chi tiêu"
                    subtitle="tổng chi tiêu 6 tháng gần đây"
                    direction="dashboard"
                />
                <Box
                    display="flex"
                    alignItems="center"
                    width="100%"
                    gap="5px"
                    fontWeight="600"
                    fontSize="25px"
                    marginBottom="30px"
                    marginTop="10px"
                >
                    {managerOutcome?.balanace?.toLocaleString()}
                    <img src={Coin} alt="" style={{ width: "30px" }} />
                </Box>
                <Box height="70vh">
                    <BarChart
                        series={[...outcomeSeriesData]}
                        xAxis={[
                            {
                                data: xLabels,
                                scaleType: "band",
                                categoryGapRatio: 0.3,
                                barGapRatio: 0.2,
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
                <div style={{ paddingInline: "4%", textAlign: "right" }}>
                    <Divider />
                    <Link
                        to="dashboardDetail"
                        state={{
                            direction: "outcome",
                            outcomeSeries: outcomeSeries,
                        }}
                        className="link"
                    >
                        Xem chi tiết
                    </Link>
                </div>
            </Box>
        </div>
    );
}
