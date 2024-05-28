import { Box, Divider } from "@mui/material";
import Header from "../../../components/header/Header";
import { Link } from "react-router-dom";
import "./dashboard.css";
import { BarChart } from "@mui/x-charts";
import Coin from "../../../../../assets/coin.png";
import { useSelector } from "react-redux";
import { platformIncomeSelector } from "../../../../../store/sellectors";
import {
    GeneratePastSixMonths,
    ValueFormatter,
} from "../../../../../components/graph/graph";

export default function AdminDashboard() {
    const platformIncome = useSelector(platformIncomeSelector);

    const xLabels = GeneratePastSixMonths();

    const incomeSeriesData = platformIncome?.monthAmounts
        ? [
              {
                  data: platformIncome.monthAmounts,
                  valueFormatter: ValueFormatter,
              },
          ]
        : [];

    const incomeSeries = [
        {
            data: platformIncome?.monthAmounts,
        },
    ];

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
                    {platformIncome?.balanace?.toLocaleString()}
                    <img src={Coin} alt="" style={{ width: "30px" }} />
                </Box>
                <Box height="55vh">
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
                            incomeSeries: incomeSeries,
                        }}
                    >
                        Xem chi tiết
                    </Link>
                </div>
            </Box>
        </div>
    );
}
