import { Box, Button, useTheme } from "@mui/material";
import "./eventTable.css";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../../../theme";
import Header from "../../../components/header/Header";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { eventsFromShopSelector } from "../../../../../store/sellectors";
import {
    deleteEventThunk,
    getEventsFromShopThunk,
} from "../../../../../store/apiThunk/eventThunk";
import { useState } from "react";
import { useEffect } from "react";
import Swal from "sweetalert2";
import Pagination from "../../../../../components/pagination/pagination";
import {
    CustomNoRowsOverlay,
    GridLoadingOverlay,
    StyledBox,
} from "../../../../../components/styledTable/styledTable";
import { FormatDate } from "../../../../../components/format/formatDatetime/formatDatetime";
import {
    EventColor,
    EventStatus,
} from "../../../../../components/mapping/mapping";
import {
    CANCELTEXT,
    CONFIRMDELETEEVENT,
    DELETECOMFIRM,
    DELETECOMFIRMYES,
    DELETEEVENTSUCCESS,
    ERRORTEXT,
    SUCCESSTEXT,
} from "../../../../../components/text/notiText/notiText";

export default function EventTable() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const events = useSelector(eventsFromShopSelector);
    const location = useLocation();
    const shopId = location.state?.shopId;
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);

    useEffect(() => {
        setShowLoadingModal(true);
        dispatch(
            getEventsFromShopThunk({ id: shopId, pageNumber, pageSize })
        ).then(() => setShowLoadingModal(false));
    }, [shopId, pageSize, pageNumber]);

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
            field: "title",
            headerName: "Tiêu Đề",
            flex: 1,
            renderCell: ({ row: { title, id } }) => (
                <Link
                    to="/shop"
                    state={{
                        eventId: id,
                        shopId: shopId,
                        direction: "eventTable",
                    }}
                    style={{ textDecoration: "none", color: "#94e2cd" }}
                >
                    {title}
                </Link>
            ),
        },
        {
            field: "totalJoinEvent",
            headerName: "Người Tham Gia",
            headerAlign: "center",
            flex: 1,
            renderCell: ({ row: { totalJoinEvent } }) => (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width="100%"
                >
                    {totalJoinEvent}
                </Box>
            ),
        },
        {
            field: "startDate",
            headerName: "Ngày Bắt Đầu",
            flex: 1,
            renderCell: ({ row: { startDate } }) => FormatDate(startDate),
        },
        {
            field: "endDate",
            headerName: "Ngày Kết Thúc",
            flex: 1,
            renderCell: ({ row: { endDate } }) => FormatDate(endDate),
        },
        {
            field: "startTime",
            headerName: "Giờ Bắt Đầu",
            headerAlign: "center",
            renderCell: ({ row: { startTime } }) => (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width="100%"
                >
                    {startTime}
                </Box>
            ),
        },
        {
            field: "endTime",
            headerName: "Giờ Kết Thúc",
            flex: 1,
            headerAlign: "center",
            renderCell: ({ row: { endTime } }) => (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width="100%"
                >
                    {endTime}
                </Box>
            ),
        },
        {
            field: "status",
            headerName: "Tình Trạng",
            flex: 1,
            headerAlign: "center",
            renderCell: ({ row: { status, startDate, endDate } }) => (
                <Box width="100%" display="flex" justifyContent="center">
                    <div
                        style={{
                            backgroundColor: EventColor(
                                status,
                                startDate,
                                endDate
                            ),
                            minWidth: "97px",
                            padding: "6px 16px",
                            borderRadius: "4px",
                            textTransform: "capitalize",
                            lineHeight: "1.75",
                            fontSize: "0.75rem",
                            textAlign: "center",
                        }}
                    >
                        {EventStatus(status, startDate, endDate)}
                    </div>
                </Box>
            ),
        },
        {
            field: "activity",
            headerName: "Hành Động",
            flex: 1,
            headerAlign: "center",
            sortable: false,
            disableColumnMenu: true,
            renderCell: ({ row: { id, totalJoinEvent } }) =>
                totalJoinEvent === 0 && (
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        width="100%"
                        gap="5px"
                    >
                        <Button
                            variant="contained"
                            color="warning"
                            onClick={() =>
                                navigate("/shop/updateEvent", {
                                    state: { eventId: id, shopId: shopId },
                                })
                            }
                            style={{ color: "white",textTransform:'capitalize' }}
                        >
                            Sửa
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleDeleteEvent(id)}
                            style={{ textTransform:'capitalize' }}
                        >
                            Xóa
                        </Button>
                    </Box>
                ),
        },
    ];

    const rows =
        events?.items?.map((event, index) => ({
            ...event,
            order: index + 1,
            id: event.eventId,
        })) || [];

    const handleDeleteEvent = (id) => {
        Swal.fire({
            icon: "warning",
            title: CONFIRMDELETEEVENT,
            text: DELETECOMFIRM,
            showDenyButton: true,
            showCancelButton: false,
            showConfirmButton: true,
            confirmButtonText: DELETECOMFIRMYES,
            denyButtonText: CANCELTEXT,
            confirmButtonColor: "#55ab95",
        }).then((result) => {
            if (result.isConfirmed) {
                setShowLoadingModal(true);
                dispatch(deleteEventThunk(id))
                    .unwrap()
                    .then(() =>
                        dispatch(
                            getEventsFromShopThunk({
                                id: shopId,
                                pageNumber,
                                pageSize,
                            })
                        ).then(() => {
                            setShowLoadingModal(false);
                            Swal.fire({
                                icon: "success",
                                title: SUCCESSTEXT,
                                text: DELETEEVENTSUCCESS,
                                showCancelButton: false,
                                showConfirmButton: false,
                                background: "white",
                                timer: 1500,
                                timerProgressBar: true,
                                scrollbarPadding: false,
                            });
                        })
                    )
                    .catch((error) => {
                        setShowLoadingModal(false);
                        Swal.fire({
                            title: ERRORTEXT,
                            text: error.message,
                            icon: "error",
                            showConfirmButton: false,
                            background: "white",
                            timer: 2000,
                            timerProgressBar: true,
                            scrollbarPadding: false,
                        });
                    });
            }
        });
    };

    return (
        <div className="eventTable">
            <Box m="20px">
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Header
                        title="SỰ KIỆN"
                        subtitle="Quản Lý Sự Kiện Của Cửa Hàng"
                    />
                    <Button
                        onClick={() =>
                            navigate("/shop/createEvent", {
                                state: { shopId: shopId },
                            })
                        }
                        className="createBtn"
                    >
                        Tạo Sự Kiện
                    </Button>
                </div>
                <Box height="68vh" sx={StyledBox}>
                    <DataGrid
                        loading={showLoadingModal}
                        slots={{
                            loadingOverlay: () => <GridLoadingOverlay />,
                            noRowsOverlay: () => <CustomNoRowsOverlay />,
                            pagination: () => (
                                <Pagination
                                    data={events}
                                    pageNumber={pageNumber}
                                    pageSize={pageSize}
                                    setPageNumber={setPageNumber}
                                    setPageSize={setPageSize}
                                />
                            ),
                        }}
                        disableRowSelectionOnClick
                        rows={rows}
                        columns={columns}
                    />
                </Box>
            </Box>
        </div>
    );
}
