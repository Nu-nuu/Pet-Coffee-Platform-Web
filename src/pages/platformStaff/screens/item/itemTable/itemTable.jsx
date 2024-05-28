import { Box, Button } from "@mui/material";
import "./itemTable.css";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../../components/header/Header";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { allItemsSelector } from "../../../../../store/sellectors";
import {
    deleteItemThunk,
    getAllItemsThunk,
} from "../../../../../store/apiThunk/itemThunk";
import { useState } from "react";
import { useEffect } from "react";
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
    CONFIRMDELETEITEM,
    DELETECOMFIRM,
    DELETECOMFIRMYES,
    DELETEITEMSUCCESS,
    ERRORTEXT,
    SUCCESSTEXT,
} from "../../../../../components/text/notiText/notiText";

export default function ItemTable(props) {
    const direction = props.direction;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const items = useSelector(allItemsSelector);
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);

    useEffect(() => {
        setShowLoadingModal(true);
        dispatch(getAllItemsThunk({ pageNumber, pageSize })).then(() =>
            setShowLoadingModal(false)
        );
    }, [pageNumber, pageSize]);

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
            headerName: "Tên Quà Tặng",
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
            field: "description",
            headerName: "Mô Tả",
            flex: 1,
            headerAlign: "center",
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
                            navigate(`/${direction}/updateItem`, {
                                state: { itemId: id },
                            })
                        }
                        style={{ color: "white", textTransform: "capitalize" }}
                    >
                        Sửa
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        style={{ textTransform: "capitalize" }}
                        onClick={() => handleDeleteItem(id)}
                    >
                        Xóa
                    </Button>
                </Box>
            ),
        },
    ];

    const rows =
        items?.items?.map((item, index) => ({
            ...item,
            order: index + 1,
            id: item.itemId,
        })) || [];

    const handleDeleteItem = (id) => {
        Swal.fire({
            icon: "warning",
            title: CONFIRMDELETEITEM,
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
                dispatch(deleteItemThunk(id))
                    .unwrap()
                    .then(() =>
                        dispatch(
                            getAllItemsThunk({ pageNumber, pageSize })
                        ).then(() => {
                            setShowLoadingModal(false);
                            Swal.fire({
                                icon: "success",
                                title: SUCCESSTEXT,
                                text: DELETEITEMSUCCESS,
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
        <div className="itemTable">
            <Box m="20px">
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Header
                        title="QUÀ TẶNG"
                        subtitle="Quản Lý Quà Tặng Hệ Thống"
                    />
                    <Button
                        onClick={() => navigate(`/${direction}/createItem`)}
                        className="createBtn"
                    >
                        Thêm Quà Tặng
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
                                    data={items}
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
