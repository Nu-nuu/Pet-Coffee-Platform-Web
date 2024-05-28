import { Box, Divider } from "@mui/material";
import Header from "../../../components/header/Header";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./dashboard.css";
import { BarChart } from "@mui/x-charts";
import Coin from "../../../../../assets/coin.png";
import { useSelector, useDispatch } from "react-redux";
import {
    shopIncomeSelector,
    shopOutcomeSelector,
} from "../../../../../store/sellectors";
import { useEffect, useState } from "react";
import {
    GeneratePastSixMonths,
    ValueFormatter,
} from "../../../../../components/graph/graph";
import {
    getShopIncomeThunk,
    getShopOutcomeThunk,
} from "../../../../../store/apiThunk/walletThunk";
import LoadingModal from "../../../../../components/modal/loadingModal/loadingModal";

export default function ShopDashboard() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const shopId = location.state?.shopId;
    const direction = location.state?.direction;
    const eventId = location.state?.eventId;
    const shopIncome = useSelector(shopIncomeSelector);
    const shopOutcome = useSelector(shopOutcomeSelector);
    const [showLoading, setShowLoading] = useState(false);

    useEffect(() => {
        switch (direction) {
            case "createEventField":
            case "eventDetail":
                navigate("event", { state: { shopId: shopId } });
                break;
            case "createEvent":
                navigate("createEventField", {
                    state: { eventId: eventId, shopId: shopId },
                });
                break;
            case "eventTable":
            case "noti":
                navigate("eventDetail", {
                    state: { eventId: eventId, shopId: shopId },
                });
                break;
            case "packagePage":
                navigate("transaction", { state: { shopId: shopId } });
                break;
            default:
                break;
        }
        setShowLoading(true);
        dispatch(getShopIncomeThunk(shopId));
        dispatch(getShopOutcomeThunk(shopId)).then(() => setShowLoading(false));
    }, [shopId, direction]);

    const xLabels = GeneratePastSixMonths();

    const incomeSeriesData = shopIncome?.monthAmounts
        ? [
              {
                  data: shopIncome?.monthAmounts,
                  valueFormatter: ValueFormatter,
              },
          ]
        : [];

    const incomeSeries = [
        {
            data: shopIncome?.monthAmounts,
        },
    ];

    const outcomeSeriesData = shopOutcome?.monthAmounts
        ? [
              {
                  data: shopOutcome?.monthAmounts,
                  valueFormatter: ValueFormatter,
              },
          ]
        : [];

    const outcomeSeries = [
        {
            data: shopOutcome?.monthAmounts,
        },
    ];

    return (
        <div className="shopDashboard">
            {!showLoading ? (
                <>
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
                            {shopIncome?.balanace?.toLocaleString()}
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
                        <div
                            style={{ paddingInline: "4%", textAlign: "right" }}
                        >
                            <Divider />
                            <Link
                                to="dashboardDetail"
                                className="link"
                                state={{
                                    direction: "income",
                                    shopId: shopId,
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
                            {shopOutcome?.balanace?.toLocaleString()}
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
                        <div
                            style={{ paddingInline: "4%", textAlign: "right" }}
                        >
                            <Divider />
                            <Link
                                to="dashboardDetail"
                                className="link"
                                state={{
                                    direction: "outcome",
                                    shopId: shopId,
                                    outcomeSeries: outcomeSeries,
                                }}
                            >
                                Xem chi tiết
                            </Link>
                        </div>
                    </Box>
                </>
            ) : (
                <LoadingModal />
            )}
        </div>
    );
}
