import Coin from "../../assets/coin.png";
import { TransactionType } from "../mapping/mapping";

export const GeneratePastSixMonths = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const months = [];
    for (let i = 0; i <= 5; i++) {
        let month = currentMonth - i;
        let year = currentYear;
        if (month < 0) {
            month += 12;
            year--;
        }
        months.unshift(`${(month + 1).toString().padStart(2, "0")}/${year}`);
    }

    return months;
};

export const ValueFormatter = (value) => {
    return (
        <span
            style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                gap: "5px",
            }}
        >
            {value?.toLocaleString()}
            <img src={Coin} alt="" style={{ width: "30px" }} />
        </span>
    );
};

export function ConvertDashboardArray(arr) {
    let totalTransactionCount = 0;
    arr.forEach((element) => {
        totalTransactionCount += element.totalTransaction;
    });
    const result = arr.map((element) => {
        const proportion =
            (element.totalTransaction / totalTransactionCount) * 100;
        return {
            value: proportion.toFixed(2),
            label: TransactionType(element.transactionTypes),
        };
    });
    return result;
}

export const HandleMonthChange = (e, setDateRange, setMonth) => {
    const selectedMonth = e.target.value;
    const [selectedMonthNumber, selectedYear] = selectedMonth.split("/");
    const startDate = `${selectedMonthNumber}/01/${selectedYear}`;
    const endDate = `${selectedMonthNumber}/${new Date(
        selectedYear,
        selectedMonthNumber,
        0
    ).getDate()}/${selectedYear}`;
    setDateRange({ from: startDate, to: endDate });
    setMonth(selectedMonth);
};

export const HandleShopMonthChange = (e, setDateRange, setMonth, shopId) => {
    const selectedMonth = e.target.value;
    const [selectedMonthNumber, selectedYear] = selectedMonth.split("/");
    const startDate = `${selectedMonthNumber}/01/${selectedYear}`;
    const endDate = `${selectedMonthNumber}/${new Date(
        selectedYear,
        selectedMonthNumber,
        0
    ).getDate()}/${selectedYear}`;
    setDateRange({ from: startDate, to: endDate, id: shopId });
    setMonth(selectedMonth);
};
