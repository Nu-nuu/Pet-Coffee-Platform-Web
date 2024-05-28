import { Backdrop, Box, Divider, Grid, useTheme } from "@mui/material";
import { TruncateText } from "../../format/formatText/formatText";
import {
    FormatDate,
    FormatDateTime,
    FormatVietnamHour,
    FormatVietnamTime,
} from "../../format/formatDatetime/formatDatetime";
import Coin from "../../../assets/coin.png";
import { tokens } from "../../../theme";

export function TransactionBackdrop(props) {
    const theme = useTheme();

    const colors = tokens(theme.palette.mode);
    const open = props.open;
    const handleClose = props.handleClose;
    const transactionDetail = props.transactionDetail;

    const checkTopup = transactionDetail.transactionType === "TopUp";

    const checkType =
        transactionDetail.transactionType === "Donate" ||
        transactionDetail.transactionType === "Reserve" ||
        transactionDetail.transactionType === "Refund" ||
        transactionDetail.transactionType === "AddProducts" ||
        transactionDetail.transactionType === "RemoveProducts";

    const checkDiscount =
        transactionDetail.transactionType === "Reserve" ||
        transactionDetail.transactionType === "Refund";

    const orderDuration =
        FormatVietnamHour(transactionDetail.reservation?.endTime) -
        FormatVietnamHour(transactionDetail.reservation?.startTime);

    const balanceTextColor = () => {
        if (transactionDetail.transactionStatus === "Processing") {
            return "#b8b800";
        } else if (transactionDetail.transactionStatus === "Cancel") {
            return colors.redAccent[600];
        } else {
            return "#70d8bd";
        }
    };

    const BalanceText = () => {
        if (transactionDetail.transactionType === "Refund") {
            return "Đã Hoàn Tiền";
        } else {
            if (transactionDetail.transactionStatus === "Processing") {
                return "Đang Xử Lý";
            } else if (transactionDetail.transactionStatus === "Return") {
                return "Đã Hoàn Tiền";
            } else if (transactionDetail.transactionStatus === "Cancel") {
                return "Đã Hủy";
            } else {
                return "Đã Thanh Toán";
            }
        }
    };

    const totalProductPrice = transactionDetail?.reservation?.products?.reduce(
        (acc, product) => {
            return acc + (product.price || 0) * (product.quantity || 1);
        },
        0
    );

    const packagePrice =
        (transactionDetail.package?.promotionAmount *
            (100 - transactionDetail.package?.promotionDiscount)) /
        100;

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
                    <>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                marginBottom: "20px",
                            }}
                        >
                            <img
                                style={{
                                    width: "100px",
                                    height: "100px",
                                    borderRadius: "50px",
                                    objectFit: "cover",
                                }}
                                src={transactionDetail.creator?.avatar}
                                alt=""
                            />
                            <p
                                style={{
                                    fontSize: "20px",
                                    fontWeight: "600",
                                    textTransform: "capitalize",
                                }}
                            >
                                {transactionDetail.creator?.fullName}
                                <br />
                                <span
                                    style={{
                                        fontSize: "13px",
                                        fontWeight: "normal",
                                        color: "#dddddd",
                                    }}
                                >
                                    {FormatDateTime(
                                        transactionDetail.createdAt
                                    )}
                                </span>
                            </p>
                        </div>
                        <p>
                            {transactionDetail.content}{" "}
                            {checkTopup && (
                                <>
                                    của{" "}
                                    <span
                                        style={{
                                            color: "#70d8bd",
                                        }}
                                    >
                                        {transactionDetail.creator?.fullName}
                                    </span>
                                </>
                            )}
                            {checkType && "tại cửa hàng "}
                            {!checkTopup && (
                                <span style={{ color: "#70d8bd" }}>
                                    {transactionDetail.shop?.name}
                                </span>
                            )}
                        </p>
                        <p>
                            Tình Trạng:{" "}
                            <span
                                style={{
                                    color:
                                        transactionDetail.transactionStatus ===
                                        "Cancel"
                                            ? colors.redAccent[600]
                                            : transactionDetail.transactionStatus ===
                                              "Processing"
                                            ? "#b8b800"
                                            : "#70d8bd",
                                }}
                            >
                                {transactionDetail.transactionStatus ===
                                "Cancel"
                                    ? "Đã Hủy"
                                    : transactionDetail.transactionStatus ===
                                      "Processing"
                                    ? "Đang Xử Lý"
                                    : "Hoàn Thành"}
                            </span>
                        </p>
                    </>
                    {transactionDetail.transactionType === "Reserve" && (
                        <>
                            <div className="trans_box">
                                <div className="trans_shop_name">
                                    {transactionDetail.shop?.name}
                                </div>
                                <div className="trans_shop_location">
                                    {transactionDetail.shop?.location}
                                </div>
                                <div className="trans_time_box">
                                    Thời gian:
                                    <span className="trans_time">
                                        {FormatDate(
                                            transactionDetail.reservation
                                                ?.startTime
                                        )}
                                    </span>
                                </div>
                                <div className="trans_flex-row">
                                    <div className="trans_flex-column">
                                        <span>Bắt Đầu</span>
                                        <span className="trans_order_time">
                                            {FormatVietnamTime(
                                                transactionDetail.reservation
                                                    ?.startTime
                                            )}
                                        </span>
                                    </div>
                                    <div className="trans_flex-column">
                                        <span>Kết Thúc</span>
                                        <span className="trans_order_time">
                                            {FormatVietnamTime(
                                                transactionDetail.reservation
                                                    ?.endTime
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <Divider />
                                <div className="trans_qty">
                                    {transactionDetail.reservation?.bookingSeat}{" "}
                                    Người, Tầng{" "}
                                    {
                                        transactionDetail.reservation
                                            ?.areaResponse?.order
                                    }
                                </div>
                                <Divider />
                                <div
                                    style={{
                                        marginBlock: "15px",
                                    }}
                                >
                                    <div className="trans_acc_name">
                                        {transactionDetail.creator?.fullName}
                                    </div>
                                    <p>{transactionDetail.creator?.email}</p>
                                    <p>{transactionDetail.creator?.address}</p>
                                    <p>
                                        {transactionDetail.creator?.phoneNumber}
                                    </p>
                                </div>
                            </div>
                            <div className="trans_box">
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
                                        <p>
                                            Tầng{" "}
                                            {
                                                transactionDetail.reservation
                                                    ?.areaResponse?.order
                                            }
                                        </p>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Box
                                            display="flex"
                                            width="100%"
                                            alignItems="center"
                                            gap="5px"
                                        >
                                            {transactionDetail.reservation?.areaResponse?.pricePerHour?.toLocaleString()}
                                            <img
                                                src={Coin}
                                                alt=""
                                                style={{
                                                    width: "30px",
                                                }}
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid item xs={2}>
                                        {orderDuration} giờ
                                    </Grid>
                                    <Grid item xs={2}>
                                        {
                                            transactionDetail.reservation
                                                ?.bookingSeat
                                        }{" "}
                                        người
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            gap="5px"
                                        >
                                            {(
                                                transactionDetail.reservation
                                                    ?.areaResponse
                                                    ?.pricePerHour *
                                                transactionDetail.reservation
                                                    ?.bookingSeat *
                                                orderDuration
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
                            </div>
                        </>
                    )}
                    {transactionDetail.transactionType === "Refund" && (
                        <>
                            <div className="trans_box">
                                <div className="trans_shop_name">
                                    {transactionDetail.shop?.name}
                                </div>
                                <div className="trans_shop_location">
                                    {transactionDetail.shop?.location}
                                </div>
                                <div className="trans_time_box">
                                    Thời gian:
                                    <span className="trans_time">
                                        {FormatDate(
                                            transactionDetail.reservation
                                                ?.startTime
                                        )}
                                    </span>
                                </div>
                                <div className="trans_flex-row">
                                    <div className="trans_flex-column">
                                        <span>Bắt Đầu</span>
                                        <span className="trans_order_time">
                                            {FormatVietnamTime(
                                                transactionDetail.reservation
                                                    ?.startTime
                                            )}
                                        </span>
                                    </div>
                                    <div className="trans_flex-column">
                                        <span>Kết Thúc</span>
                                        <span className="trans_order_time">
                                            {FormatVietnamTime(
                                                transactionDetail.reservation
                                                    ?.endTime
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <Divider />
                                <div className="trans_qty">
                                    {transactionDetail.reservation?.bookingSeat}{" "}
                                    Người, Tầng{" "}
                                    {
                                        transactionDetail.reservation
                                            ?.areaResponse?.order
                                    }
                                </div>
                                <Divider />
                                <div
                                    style={{
                                        marginBlock: "15px",
                                    }}
                                >
                                    <div className="trans_acc_name">
                                        {transactionDetail.creator?.fullName}
                                    </div>
                                    <p>{transactionDetail.creator?.email}</p>
                                    <p>{transactionDetail.creator?.address}</p>
                                    <p>
                                        {transactionDetail.creator?.phoneNumber}
                                    </p>
                                </div>
                            </div>
                            {transactionDetail.reservation?.products?.length !==
                                0 && (
                                <div className="trans_box">
                                    <Grid
                                        container
                                        spacing={2}
                                        marginBottom="20px"
                                    >
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
                                    {transactionDetail?.reservation?.products?.map(
                                        (product, index) => (
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
                                                            className="trans_product_img"
                                                        />
                                                        <p>
                                                            {TruncateText(
                                                                product.name,
                                                                10
                                                            )}
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
                                                    style={{
                                                        paddingLeft: 0,
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            textAlign: "center",
                                                        }}
                                                    >
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
                                                            product.price *
                                                            product.quantity
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
                                        )
                                    )}
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
                                                {totalProductPrice?.toLocaleString()}
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
                            <div className="trans_box">
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
                                        <p>
                                            Tầng{" "}
                                            {
                                                transactionDetail.reservation
                                                    ?.areaResponse?.order
                                            }
                                        </p>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Box
                                            display="flex"
                                            width="100%"
                                            alignItems="center"
                                            gap="5px"
                                        >
                                            {transactionDetail.reservation?.areaResponse?.pricePerHour?.toLocaleString()}
                                            <img
                                                src={Coin}
                                                alt=""
                                                style={{
                                                    width: "30px",
                                                }}
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid item xs={2}>
                                        {orderDuration} giờ
                                    </Grid>
                                    <Grid item xs={2}>
                                        {
                                            transactionDetail.reservation
                                                ?.bookingSeat
                                        }{" "}
                                        người
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            gap="5px"
                                        >
                                            {(
                                                transactionDetail.reservation
                                                    ?.areaResponse
                                                    ?.pricePerHour *
                                                transactionDetail.reservation
                                                    ?.bookingSeat *
                                                orderDuration
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
                            </div>
                        </>
                    )}
                    {transactionDetail.transactionType === "RemoveProducts" && (
                        <>
                            <div className="trans_box">
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
                                {transactionDetail?.transactionProducts?.map(
                                    (product, index) => (
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
                                                        src={product.productImage}
                                                        alt=""
                                                        className="trans_product_img"
                                                    />
                                                    <p>
                                                        {TruncateText(
                                                            product.productName,
                                                            10
                                                        )}
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
                                                style={{
                                                    paddingLeft: 0,
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        textAlign: "center",
                                                    }}
                                                >
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
                                                        product.price *
                                                        product.quantity
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
                                    )
                                )}
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
                                            {transactionDetail.amount?.toLocaleString()}
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
                        </>
                    )}
                    {transactionDetail.transactionType === "Donate" && (
                        <div className="trans_box">
                            <Grid container spacing={2} marginBottom="20px">
                                <Grid item xs={4}>
                                    Quà Tặng
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
                            {transactionDetail?.transactionItems?.map(
                                (item, index) => (
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
                                                    src={item.icon}
                                                    alt=""
                                                    className="trans_product_img"
                                                />
                                                <p>
                                                    {TruncateText(
                                                        item.itemName,
                                                        10
                                                    )}
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
                                                {item.price?.toLocaleString()}
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
                                            style={{
                                                paddingLeft: 0,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    textAlign: "center",
                                                }}
                                            >
                                                x{item.totalItem}
                                            </div>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Box
                                                display="flex"
                                                alignItems="center"
                                                gap="5px"
                                            >
                                                {(
                                                    item.price * item.totalItem
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
                                )
                            )}
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
                                        {transactionDetail.amount?.toLocaleString()}
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
                    {transactionDetail.transactionType === "BuyItem" && (
                        <div className="trans_box">
                            <Grid container spacing={2} marginBottom="20px">
                                <Grid item xs={4}>
                                    Quà Tặng
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
                            {transactionDetail?.transactionItems?.map(
                                (item, index) => (
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
                                                    src={item.icon}
                                                    alt=""
                                                    className="trans_product_img"
                                                />
                                                <p>
                                                    {TruncateText(
                                                        item.itemName,
                                                        10
                                                    )}
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
                                                {item.price?.toLocaleString()}
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
                                            style={{
                                                paddingLeft: 0,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    textAlign: "center",
                                                }}
                                            >
                                                x{item.totalItem}
                                            </div>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Box
                                                display="flex"
                                                alignItems="center"
                                                gap="5px"
                                            >
                                                {(
                                                    item.price * item.totalItem
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
                                )
                            )}
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
                                        {transactionDetail.amount?.toLocaleString()}
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
                    {transactionDetail.transactionType === "AddProducts" && (
                        <div className="trans_box">
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
                            {transactionDetail?.transactionProducts?.map(
                                (product, index) => (
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
                                                    src={product.productImage}
                                                    alt=""
                                                    className="trans_product_img"
                                                />
                                                <p>
                                                    {TruncateText(
                                                        product.productName,
                                                        10
                                                    )}
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
                                            style={{
                                                paddingLeft: 0,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    textAlign: "center",
                                                }}
                                            >
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
                                                    product.price *
                                                    product.quantity
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
                                )
                            )}
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
                                        {transactionDetail.amount?.toLocaleString()}
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
                    {transactionDetail.transactionType === "Package" && (
                        <div className="trans_box">
                            <Grid container spacing={2} marginBottom="20px">
                                <Grid item xs={3}>
                                    Loại Gói
                                </Grid>
                                <Grid item xs={2}>
                                    Thời Hạn
                                </Grid>
                                <Grid item xs={2.5}>
                                    Đơn Giá
                                </Grid>
                                <Grid item xs={2}>
                                    Số Lượng
                                </Grid>
                                <Grid item xs={2.5}>
                                    Thành tiền
                                </Grid>
                            </Grid>
                            <Grid
                                container
                                spacing={2}
                                alignItems="center"
                                marginBlock="15px"
                            >
                                <Grid item xs={3}>
                                    <p>
                                        {transactionDetail.package?.description}
                                    </p>
                                </Grid>
                                <Grid item xs={2}>
                                    <p>
                                        {transactionDetail.package?.duration}{" "}
                                        Tháng
                                    </p>
                                </Grid>
                                <Grid item xs={2.5}>
                                    <Box
                                        display="flex"
                                        width="100%"
                                        alignItems="center"
                                        gap="5px"
                                    >
                                        {packagePrice?.toLocaleString()}
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
                                    style={{
                                        paddingLeft: 0,
                                    }}
                                >
                                    <div
                                        style={{
                                            textAlign: "center",
                                        }}
                                    >
                                        x1
                                    </div>
                                </Grid>
                                <Grid item xs={2.5}>
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        gap="5px"
                                    >
                                        {packagePrice?.toLocaleString()}
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
                            <Divider />
                            <Grid
                                container
                                spacing={2}
                                marginBlock={0}
                                alignItems="center"
                            >
                                <Grid item xs={3}></Grid>
                                <Grid item xs={2}></Grid>
                                <Grid item xs={2.5}></Grid>
                                <Grid item xs={2}>
                                    Tổng Cộng:
                                </Grid>
                                <Grid item xs={2.5}>
                                    <Box
                                        display="flex"
                                        width="100%"
                                        alignItems="center"
                                        gap="5px"
                                    >
                                        {transactionDetail.amount?.toLocaleString()}
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
                    {checkDiscount && (
                        <div className="trans_box">
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
                                        {transactionDetail?.reservation?.discount?.toLocaleString()}
                                        <img
                                            src={Coin}
                                            alt=""
                                            style={{ width: "30px" }}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </div>
                    )}
                    <div
                        className="trans_box"
                        style={{
                            paddingBlock: 0,
                            marginTop: "20px",
                        }}
                    >
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
                                        {transactionDetail.amount?.toLocaleString()}
                                    </span>
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
