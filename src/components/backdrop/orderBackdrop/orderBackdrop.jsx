import { tokens } from "../../../theme";
import {
    FormatDate,
    FormatVietnamHour,
    FormatVietnamTime,
} from "../../format/formatDatetime/formatDatetime";
import { TruncateText } from "../../format/formatText/formatText";
import { Backdrop, Box, Divider, Grid, useTheme } from "@mui/material";
import Coin from "../../../assets/coin.png";

export default function OrderBackdrop(props) {
    const orderDetail = props.orderDetail;
    const open = props.open;
    const handleClose = props.handleClose;
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const totalPrice = orderDetail.products?.reduce((total, product) => {
        return total + product.quantity * product.price;
    }, 0);

    const orderDuration =
        FormatVietnamHour(orderDetail.endTime) -
        FormatVietnamHour(orderDetail.startTime);

    const balanceTextColor = () => {
        if (orderDetail.status === "Returned") {
            return colors.redAccent[600];
        } else {
            return "#70d8bd";
        }
    };

    const BalanceText = () => {
        if (orderDetail.status === "Returned") {
            return "Đã Hủy";
        } else {
            return "Đã Thanh Toán";
        }
    };

    return (
        <Backdrop
            sx={{
                color: "#fff",
                zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            open={open}
            onClick={handleClose}
        >
            <Box sx={style}>
                <div className="overFlow">
                    <div className="box">
                        <div className="shop_name">
                            {orderDetail.petCoffeeShopResponse?.name}
                        </div>
                        <div className="shop_location">
                            {orderDetail.petCoffeeShopResponse?.location}
                        </div>
                        <p>
                            Tình Trạng:{" "}
                            <span
                                style={{
                                    color:
                                        orderDetail.status === "Returned"
                                            ? colors.redAccent[600]
                                            : "#70d8bd",
                                }}
                            >
                                {orderDetail.status === "Returned"
                                    ? "Đã Hủy"
                                    : "Hoàn Thành"}
                            </span>
                        </p>
                        <div className="time_box">
                            Thời gian:
                            <span className="time">
                                {FormatDate(orderDetail.startTime)}
                            </span>
                        </div>
                        <div className="flex-row">
                            <div className="flex-column">
                                <span>Bắt Đầu</span>
                                <span className="order_time">
                                    {FormatVietnamTime(orderDetail.startTime)}
                                </span>
                            </div>
                            <div className="flex-column">
                                <span>Kết Thúc</span>
                                <span className="order_time">
                                    {FormatVietnamTime(orderDetail.endTime)}
                                </span>
                            </div>
                        </div>
                        <Divider />
                        <div className="qty">
                            {orderDetail.bookingSeat} Người, Tầng{" "}
                            {orderDetail.areaResponse?.order}
                        </div>
                        <Divider />
                        <div style={{ marginBlock: "15px" }}>
                            <div className="acc_name">
                                {orderDetail.accountForReservation?.fullName}
                            </div>
                            <p>{orderDetail.accountForReservation?.email}</p>
                            <p>{orderDetail.accountForReservation?.address}</p>
                            <p>
                                {orderDetail.accountForReservation?.phoneNumber}
                            </p>
                        </div>
                    </div>
                    {orderDetail.products?.length !== 0 && (
                        <div className="box">
                            <Grid container spacing={2} marginBottom="20px">
                                <Grid item xs={4}>
                                    Đồ uống
                                </Grid>
                                <Grid item xs={3}>
                                    Đơn giá
                                </Grid>
                                <Grid item xs={2}>
                                    Số lượng
                                </Grid>
                                <Grid item xs={3}>
                                    Thành tiền
                                </Grid>
                            </Grid>
                            {orderDetail.products?.map((product, index) => (
                                <Grid
                                    container
                                    spacing={2}
                                    key={index}
                                    alignItems="center"
                                    marginBlock="15px"
                                >
                                    <Grid item xs={4}>
                                        <Box
                                            display="flex"
                                            width="100%"
                                            alignItems="center"
                                            gap="5px"
                                        >
                                            <img
                                                src={product.image}
                                                alt=""
                                                className="product_img"
                                            />
                                            <p className="product_name">
                                                {TruncateText(product.name, 10)}
                                            </p>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Box
                                            display="flex"
                                            width="100%"
                                            alignItems="center"
                                            gap="5px"
                                        >
                                            {product.price?.toLocaleString()}
                                            <img
                                                src={Coin}
                                                alt=""
                                                style={{
                                                    width: "30px",
                                                }}
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={2}
                                        style={{ paddingLeft: 0 }}
                                    >
                                        <div className="product_qty">
                                            x{product.quantity}
                                        </div>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            gap="5px"
                                        >
                                            {(
                                                product.price * product.quantity
                                            )?.toLocaleString()}
                                            <img
                                                src={Coin}
                                                alt=""
                                                style={{
                                                    width: "30px",
                                                }}
                                            />
                                        </Box>
                                    </Grid>
                                </Grid>
                            ))}
                            <Divider />
                            <Grid
                                container
                                spacing={2}
                                marginBlock={0}
                                alignItems="center"
                            >
                                <Grid item xs={4}></Grid>
                                <Grid item xs={3}></Grid>
                                <Grid item xs={2}>
                                    Tổng Cộng:
                                </Grid>
                                <Grid item xs={3}>
                                    <Box
                                        display="flex"
                                        width="100%"
                                        alignItems="center"
                                        gap="5px"
                                    >
                                        {totalPrice?.toLocaleString()}
                                        <img
                                            src={Coin}
                                            alt=""
                                            style={{
                                                width: "30px",
                                            }}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </div>
                    )}
                    <div className="box">
                        <Grid
                            container
                            spacing={2}
                            alignItems="center"
                            marginBottom="15px"
                        >
                            <Grid item xs={2}>
                                Tầng
                            </Grid>
                            <Grid item xs={3}>
                                Đơn giá
                            </Grid>
                            <Grid item xs={2}>
                                Số giờ
                            </Grid>
                            <Grid item xs={2}>
                                Số Người
                            </Grid>
                            <Grid item xs={3}>
                                Thành tiền
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            spacing={2}
                            marginBlock="15px"
                            alignItems="center"
                        >
                            <Grid item xs={2}>
                                <div className="order">
                                    Tầng {orderDetail.areaResponse?.order}
                                </div>
                            </Grid>
                            <Grid item xs={3}>
                                <Box
                                    display="flex"
                                    width="100%"
                                    alignItems="center"
                                    gap="5px"
                                >
                                    {orderDetail.areaResponse?.pricePerHour?.toLocaleString()}
                                    <img
                                        src={Coin}
                                        alt=""
                                        style={{ width: "30px" }}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={2}>
                                {orderDuration} giờ
                            </Grid>
                            <Grid item xs={2}>
                                {orderDetail.bookingSeat} người
                            </Grid>
                            <Grid item xs={3}>
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    gap="5px"
                                >
                                    {(
                                        orderDetail.areaResponse?.pricePerHour *
                                        orderDetail.bookingSeat *
                                        orderDuration
                                    )?.toLocaleString()}
                                    <img
                                        src={Coin}
                                        alt=""
                                        style={{ width: "30px" }}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </div>
                    <div className="box">
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={2}>
                                <div className="order">Giảm giá</div>
                            </Grid>
                            <Grid item xs={7}></Grid>
                            <Grid item xs={3}>
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    gap="5px"
                                >
                                    {orderDetail?.discount?.toLocaleString()}
                                    <img
                                        src={Coin}
                                        alt=""
                                        style={{ width: "30px" }}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </div>
                    <div className="box" style={{ paddingBlock: 0 }}>
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={8.5}>
                                <p
                                    className="balance_text"
                                    style={{
                                        color: balanceTextColor(),
                                    }}
                                >
                                    <BalanceText />
                                </p>
                            </Grid>
                            <Grid item xs={3.5}>
                                <Box
                                    display="flex"
                                    width="100%"
                                    alignItems="center"
                                    gap="5px"
                                >
                                    <span style={{ fontSize: "25px" }}>
                                        {orderDetail.totalPrice?.toLocaleString()}
                                    </span>
                                    <img
                                        src={Coin}
                                        alt=""
                                        style={{ width: "30px" }}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </Box>
        </Backdrop>
    );
}

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "#121d3c",
    boxShadow: 24,
    p: 4,
    minWidth: "593px",
};
