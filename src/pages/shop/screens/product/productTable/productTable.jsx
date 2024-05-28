import { Box, Button } from "@mui/material";
import "./productTable.css";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../../components/header/Header";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { productsFromShopSelector } from "../../../../../store/sellectors";
import {
    deleteProductThunk,
    getProductsFromShopThunk,
} from "../../../../../store/apiThunk/productThunk";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Coin from "../../../../../assets/coin.png";
import Pagination from "../../../../../components/pagination/pagination";
import {
    StyledBox,
    CustomNoRowsOverlay,
    GridLoadingOverlay,
} from "../../../../../components/styledTable/styledTable";
import {
    CANCELTEXT,
    CONFIRMDELETEPRODUCT,
    DELETECOMFIRM,
    DELETECOMFIRMYES,
    DELETEPRODUCTSUCCESS,
    ERRORTEXT,
    SUCCESSTEXT,
} from "../../../../../components/text/notiText/notiText";

export default function ProductTable() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const shopId = location.state?.shopId;
    const products = useSelector(productsFromShopSelector);
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);

    useEffect(() => {
        setShowLoadingModal(true);
        dispatch(
            getProductsFromShopThunk({ id: shopId, pageNumber, pageSize })
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
            field: "name",
            headerName: "Tên Đồ Uống",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "price",
            headerName: "Giá Tiền",
            headerAlign: "center",
            flex: 1,
            renderCell: ({ row: { price } }) => (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width="100%"
                    gap="6px"
                >
                    {price?.toLocaleString()}
                    <img src={Coin} alt="" style={{ width: "35px" }} />
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
            renderCell: ({ row: { id } }) => (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width="100%"
                    gap="10px"
                >
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={() =>
                            navigate(`/shop/updateProduct`, {
                                state: { productId: id, shopId: shopId },
                            })
                        }
                        style={{ color: "white",textTransform:'capitalize' }}
                    >
                        Sửa
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDeleteProduct(id)}
                        style={{ textTransform:'capitalize' }}
                    >
                        Xóa
                    </Button>
                </Box>
            ),
        },
    ];

    const rows =
        products?.items?.map((item, index) => ({
            ...item,
            order: index + 1,
        })) || [];

    const handleDeleteProduct = (id) => {
        Swal.fire({
            icon: "warning",
            title: CONFIRMDELETEPRODUCT,
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
                dispatch(deleteProductThunk(id))
                    .unwrap()
                    .then(() =>
                        dispatch(
                            getProductsFromShopThunk({
                                id: shopId,
                                pageNumber,
                                pageSize,
                            })
                        ).then(() => {
                            setShowLoadingModal(false);
                            Swal.fire({
                                icon: "success",
                                title: SUCCESSTEXT,
                                text: DELETEPRODUCTSUCCESS,
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
        <div className="productTable">
            <Box m="20px">
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Header
                        title="Đồ Uống"
                        subtitle="Quản Lý Đồ Uống Của Cửa Hàng"
                    />
                    <Button
                        onClick={() =>
                            navigate(`/shop/createProduct`, {
                                state: { shopId: shopId },
                            })
                        }
                        className="createBtn"
                    >
                        Thêm Đồ Uống
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
                                    data={products}
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
