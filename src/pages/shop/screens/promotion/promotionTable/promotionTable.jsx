import { Box, Button } from "@mui/material";
import "./promotionTable.css";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../../components/header/Header";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { promotionsFromShopSelector } from "../../../../../store/sellectors";
import {
    getPromotionsFromShopThunk,
    deletePromotionThunk,
} from "../../../../../store/apiThunk/promotionThunk";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Pagination from "../../../../../components/pagination/pagination";
import {
    StyledBox,
    CustomNoRowsOverlay,
    GridLoadingOverlay,
} from "../../../../../components/styledTable/styledTable";
import { FormatDate } from "../../../../../components/format/formatDatetime/formatDatetime";
import {
    CANCELTEXT,
    CONFIRMDELETEPROMOTION,
    DELETECOMFIRM,
    DELETECOMFIRMYES,
    DELETEPROMOTIONSUCCESS,
    ERRORTEXT,
    SUCCESSTEXT,
} from "../../../../../components/text/notiText/notiText";

export default function PromotionTable() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const shopId = location.state?.shopId;
    const promotions = useSelector(promotionsFromShopSelector);
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);

    useEffect(() => {
        setShowLoadingModal(true);
        dispatch(
            getPromotionsFromShopThunk({ id: shopId, pageNumber, pageSize })
        ).then(() => setShowLoadingModal(false));
    }, [shopId, pageNumber, pageSize]);

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
            headerName: "Mã Khuyến Mãi",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "from",
            headerName: "Bắt Đầu",
            flex: 1,
            renderCell: ({ row: { from } }) => <div>{FormatDate(from)}</div>,
        },
        {
            field: "to",
            headerName: "Kết Thúc",
            flex: 1,
            renderCell: ({ row: { to } }) => <div>{FormatDate(to)}</div>,
        },
        {
            field: "percent",
            headerName: "Mức Giảm Giá",
            flex: 1,
            headerAlign: "center",
            renderCell: ({ row: { percent } }) => (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width="100%"
                >
                    {percent}%
                </Box>
            ),
        },
        {
            field: "quantity",
            headerName: "Số Lượng",
            flex: 1,
            headerAlign: "center",
            renderCell: ({ row: { quantity } }) => (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width="100%"
                >
                    {quantity}
                </Box>
            ),
        },
        {
            field: "available",
            headerName: "Khả Dụng",
            flex: 1,
            headerAlign: "center",
            renderCell: ({ row: { available } }) => (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width="100%"
                >
                    {available}
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
            renderCell: ({ row: { id, available, quantity } }) => (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width="100%"
                    gap="10px"
                >
                    {available === quantity && (
                        <>
                            <Button
                                variant="contained"
                                color="warning"
                                onClick={() =>
                                    navigate(`/shop/updatePromotion`, {
                                        state: {
                                            promotionId: id,
                                            shopId: shopId,
                                        },
                                    })
                                }
                                style={{ color: "white",textTransform:'capitalize' }}
                            >
                                Sửa
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => handleDeletePromotion(id)}
                                style={{ textTransform:'capitalize' }}
                            >
                                Xóa
                            </Button>
                        </>
                    )}
                </Box>
            ),
        },
    ];

    const rows =
        promotions?.items?.map((item, index) => ({
            ...item,
            order: index + 1,
        })) || [];

    const handleDeletePromotion = (id) => {
        Swal.fire({
            icon: "warning",
            title: CONFIRMDELETEPROMOTION,
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
                dispatch(deletePromotionThunk(id))
                    .unwrap()
                    .then(() =>
                        dispatch(
                            getPromotionsFromShopThunk({
                                id: shopId,
                                pageNumber,
                                pageSize,
                            })
                        ).then(() => {
                            setShowLoadingModal(false);
                            Swal.fire({
                                icon: "success",
                                title: SUCCESSTEXT,
                                text: DELETEPROMOTIONSUCCESS,
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
        <div className="promotionTable">
            <Box m="20px">
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Header
                        title="khuyến mãi"
                        subtitle="Quản Lý khuyến mãi của cửa hàng"
                    />
                    <Button
                        onClick={() =>
                            navigate(`/shop/createPromotion`, {
                                state: { shopId: shopId },
                            })
                        }
                        className="createBtn"
                    >
                        Thêm khuyến mãi
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
                                    data={promotions}
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
