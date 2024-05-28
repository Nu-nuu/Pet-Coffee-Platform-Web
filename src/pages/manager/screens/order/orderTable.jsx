import { Box, Button, Popover, useTheme } from "@mui/material";
import "./orderTable.css";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../../theme";
import { useLocation } from "react-router-dom";
import Header from "../../components/header/Header";
import { useDispatch, useSelector } from "react-redux";
import {
    allOrdersSelector,
    orderDetailSelector,
} from "../../../../store/sellectors";
import {
    getAllOrdersThunk,
    cancelOrderThunk,
    getOrderDetailThunk,
} from "../../../../store/apiThunk/orderThunk";
import { useEffect, useState } from "react";
import Coin from "../../../../assets/coin.png";
import Pagination from "../../../../components/pagination/pagination";
import {
    CustomNoRowsOverlay,
    GridLoadingOverlay,
    StyledBox,
} from "../../../../components/styledTable/styledTable";
import { FormatPhoneNumber } from "../../../../components/format/formatText/formatText";
import { FormatDateTime } from "../../../../components/format/formatDatetime/formatDatetime";
import OrderBackdrop from "../../../../components/backdrop/orderBackdrop/orderBackdrop";
import { FilterComponent } from "../../../../components/filter/filterComponent";

export default function OrderTable() {
    const theme = useTheme();
    const dispatch = useDispatch();
    const location = useLocation();
    const orderId = location?.state?.orderId;
    const openNoti = location?.state?.openNoti;
    const colors = tokens(theme.palette.mode);
    const url = new URL(window.location.href);
    const render = url.searchParams.get("render");
    const orders = useSelector(allOrdersSelector);
    const orderDetail = useSelector(orderDetailSelector);
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [popoverId, setPopoverId] = useState(null);
    const [open, setOpen] = useState(false);
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);
    const [shopName, setShopName] = useState("all");

    useEffect(() => {
        setShowLoadingModal(true);
        if (shopName !== "all") {
            dispatch(
                getAllOrdersThunk({ shopId: shopName, pageNumber, pageSize })
            ).then(() => setShowLoadingModal(false));
        } else {
            dispatch(
                getAllOrdersThunk({ shopId: "", pageNumber, pageSize })
            ).then(() => setShowLoadingModal(false));
        }
    }, [shopName, pageNumber, pageSize]);

    useEffect(() => {
        const removeRenderQueryParameter = () => {
            const url = new URL(window.location.href);
            url.searchParams.delete("render");
            window.history.replaceState({}, "", url);
        };

        if (orderId && openNoti) {
            setShowLoadingModal(true);
            dispatch(getOrderDetailThunk(orderId)).then(() => {
                removeRenderQueryParameter();
                setShowLoadingModal(false);
                setOpen(openNoti);
            });
        }
    }, [openNoti, orderId, render]);

    const handleClose = () => {
        setOpen(false);
    };

    const columns = [
        {
            field: "order",
            headerName: "STT",
            headerAlign: "center",
            renderCell: ({ row: { order } }) => (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width="100%"
                >
                    {order}
                </Box>
            ),
        },
        {
            field: "code",
            headerName: "ID Giao Dịch",
            headerAlign: "center",
            flex: 1,
            renderCell: ({ row: { code, id } }) => {
                const handleOpen = () => {
                    setShowLoadingModal(true);
                    dispatch(getOrderDetailThunk(id)).then(() => {
                        setShowLoadingModal(false);
                        setOpen(true);
                    });
                };

                return (
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        width="100%"
                    >
                        <Button variant="contained" onClick={handleOpen}>
                            {code}
                        </Button>
                    </Box>
                );
            },
        },
        {
            field: "creatorName",
            headerName: "Tên Khách Hàng",
            valueGetter: (params) =>
                params.row.accountForReservation?.fullName || "",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "creatorPhone",
            headerName: "Số Điện Thoại",
            valueGetter: (params) =>
                FormatPhoneNumber(
                    params.row.accountForReservation?.phoneNumber
                ) || "",
            flex: 1,
        },
        {
            field: "shopName",
            headerName: "Tên Cửa Hàng",
            valueGetter: (params) =>
                params.row.petCoffeeShopResponse?.name || "",
            flex: 1,
        },
        {
            field: "bookingSeat",
            headerName: "Số Người",
            flex: 1,
            headerAlign: "center",
            renderCell: ({ row: { bookingSeat } }) => (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width="100%"
                >
                    {bookingSeat}
                </Box>
            ),
        },
        {
            field: "startTime",
            headerName: "Thời Gian Đặt",
            flex: 1,
            renderCell: ({ row: { startTime } }) => (
                <div>{FormatDateTime(startTime)}</div>
            ),
        },
        {
            field: "totalPrice",
            headerName: "Số Tiền",
            flex: 1,
            renderCell: ({ row: { totalPrice } }) => {
                return (
                    <Box
                        display="flex"
                        alignItems="center"
                        width="100%"
                        gap="5px"
                    >
                        {totalPrice?.toLocaleString()}
                        <img src={Coin} alt="" style={{ width: "30px" }} />
                    </Box>
                );
            },
        },
        {
            field: "status",
            headerName: "Tình Trạng",
            flex: 1,
            headerAlign: "center",
            renderCell: ({ row: { id, status } }) => {
                const handleClick = (event) => {
                    setPopoverId(id);
                    setAnchorEl(event?.currentTarget);
                };

                const handleClose = () => {
                    setAnchorEl(null);
                };

                const open = Boolean(anchorEl);

                const handleChangeStatus = (id) => {
                    setShowLoadingModal(true);
                    handleClose();
                    dispatch(cancelOrderThunk(id)).then(() =>
                        dispatch(
                            getAllOrdersThunk({ pageNumber, pageSize })
                        ).then(() => setShowLoadingModal(false))
                    );
                };

                return (
                    <Box width="100%" display="flex" justifyContent="center">
                        {status === "Success" ? (
                            <Button
                                variant="contained"
                                style={{
                                    backgroundColor:
                                        status === "Success"
                                            ? "#55ab95"
                                            : colors.redAccent[600],
                                    minWidth: "97px",
                                    textTransform: "capitalize",
                                }}
                                onClick={handleClick}
                            >
                                Hoàn Thành
                            </Button>
                        ) : (
                            <div
                                style={{
                                    backgroundColor:
                                        status === "Processing"
                                            ? "#b8b800"
                                            : status === "Active"
                                            ? "#55ab95"
                                            : colors.redAccent[600],
                                    minWidth: "97px",
                                    padding: "6px 16px",
                                    borderRadius: "4px",
                                    textTransform: "capitalize",
                                    lineHeight: "1.75",
                                    fontSize: "0.75rem",
                                    textAlign: "center",
                                }}
                            >
                                Đã Hủy
                            </div>
                        )}
                        <Popover
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "right",
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                        >
                            <Button
                                style={{
                                    backgroundColor: colors.redAccent[600],
                                    color: "white",
                                    minWidth: "97px",
                                    textTransform:'capitalize'
                                }}
                                onClick={() => handleChangeStatus(popoverId)}
                            >
                                Hủy Đơn
                            </Button>
                        </Popover>
                    </Box>
                );
            },
        },
    ];

    const rows =
        orders?.items?.map((order, index) => ({
            ...order,
            order: index + 1,
        })) || [];

    return (
        <div className="orderTable">
            <Box m="20px" height="59vh" sx={StyledBox}>
                <Header
                    title="ĐƠN ĐẶT CHỖ"
                    subtitle="Quản Lý Đơn Đặt Chỗ Của Bạn"
                />
                <FilterComponent
                    label="Tên Cửa Hàng"
                    name="shopName"
                    shopName={shopName}
                    setShopName={setShopName}
                />
                <DataGrid
                    disableRowSelectionOnClick
                    loading={showLoadingModal}
                    slots={{
                        loadingOverlay: () => <GridLoadingOverlay />,
                        noRowsOverlay: () => <CustomNoRowsOverlay />,
                        pagination: () => (
                            <Pagination
                                data={orders}
                                pageNumber={pageNumber}
                                pageSize={pageSize}
                                setPageNumber={setPageNumber}
                                setPageSize={setPageSize}
                            />
                        ),
                    }}
                    rows={rows}
                    columns={columns}
                />
                <OrderBackdrop
                    open={open}
                    handleClose={handleClose}
                    orderDetail={orderDetail}
                />
            </Box>
        </div>
    );
}
