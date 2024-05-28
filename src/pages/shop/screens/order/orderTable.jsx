import { Box, Button, Popover, useTheme } from "@mui/material";
import "./orderTable.css";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../../theme";
import Header from "../../components/header/Header";
import { useDispatch, useSelector } from "react-redux";
import {
    orderDetailSelector,
    ordersFromShopSelector,
} from "../../../../store/sellectors";
import {
    cancelOrderThunk,
    getOrderDetailThunk,
    getOrdersFromShopThunk,
} from "../../../../store/apiThunk/orderThunk";
import { useEffect, useState } from "react";
import Coin from "../../../../assets/coin.png";
import { useLocation } from "react-router-dom";
import Pagination from "../../../../components/pagination/pagination";
import {
    CustomNoRowsOverlay,
    GridLoadingOverlay,
    StyledBox,
} from "../../../../components/styledTable/styledTable";
import OrderBackdrop from "../../../../components/backdrop/orderBackdrop/orderBackdrop";
import { FormatPhoneNumber } from "../../../../components/format/formatText/formatText";
import { FormatDateTime } from "../../../../components/format/formatDatetime/formatDatetime";

export default function OrderTableShop() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const ordersFromShop = useSelector(ordersFromShopSelector);
    const orderDetail = useSelector(orderDetailSelector);
    const dispatch = useDispatch();
    const location = useLocation();
    const shopId = location.state?.shopId;
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [popoverId, setPopoverId] = useState(null);
    const [open, setOpen] = useState(false);
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);

    useEffect(() => {
        setShowLoadingModal(true);
        dispatch(
            getOrdersFromShopThunk({ id: shopId, pageNumber, pageSize })
        ).then(() => setShowLoadingModal(false));
    }, [shopId, pageSize, pageNumber]);

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
            field: "id",
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
                            getOrdersFromShopThunk({
                                id: shopId,
                                pageNumber,
                                pageSize,
                            })
                        ).then(() => setShowLoadingModal(false))
                    );
                };

                return (
                    <Box width="100%" display="flex" justifyContent="center">
                        {status === "Success" ? (
                            <Button
                                variant="contained"
                                style={{
                                    backgroundColor: "#55ab95",
                                    minWidth: "97px",
                                    textTransform:'capitalize'
                                }}
                                onClick={handleClick}
                            >
                                Hoàn Thành
                            </Button>
                        ) : (
                            <div
                                style={{
                                    backgroundColor: colors.redAccent[600],
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
        ordersFromShop?.items?.map((order, index) => ({
            ...order,
            order: index + 1,
        })) || [];

    return (
        <div className="orderTable">
            <Box m="20px" height="68vh" sx={StyledBox}>
                <Header
                    title="ĐƠN ĐẶT CHỖ"
                    subtitle="Quản Lý Đơn Đặt Chỗ Của Cửa Hàng"
                />
                <DataGrid
                    disableRowSelectionOnClick
                    loading={showLoadingModal}
                    slots={{
                        loadingOverlay: () => <GridLoadingOverlay />,
                        noRowsOverlay: () => <CustomNoRowsOverlay />,
                        pagination: () => (
                            <Pagination
                                data={ordersFromShop}
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
