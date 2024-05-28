import { Box, Button } from "@mui/material";
import "./packageTable.css";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../../components/header/Header";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { packagesSelector } from "../../../../../store/sellectors";
import {
    deletePackageThunk,
    getPackagesThunk,
} from "../../../../../store/apiThunk/packageThunk";
import { useState } from "react";
import { useEffect } from "react";
import Swal from "sweetalert2";
import Coin from "../../../../../assets/coin.png";
import Pagination from "../../../../../components/pagination/pagination";
import { formatPaginationData } from "../../../../../components/format/formatPagination/formatPagination";
import {
    CustomNoRowsOverlay,
    GridLoadingOverlay,
    StyledBox,
} from "../../../../../components/styledTable/styledTable";
import {
    CANCELTEXT,
    CONFIRMDELETEPACKAGE,
    DELETECOMFIRM,
    DELETECOMFIRMYES,
    DELETEPACKAGESUCCESS,
    ERRORTEXT,
    SUCCESSTEXT,
} from "../../../../../components/text/notiText/notiText";

export default function PackageTable(props) {
    const direction = props.direction;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const packages = useSelector(packagesSelector);
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);

    const packagesData = formatPaginationData(packages, pageNumber, pageSize);

    useEffect(() => {
        setShowLoadingModal(true);
        dispatch(getPackagesThunk()).then(() => setShowLoadingModal(false));
    }, []);

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
            field: "description",
            headerName: "Loại Gói",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "duration",
            headerName: "Thời hạn",
            renderCell: ({ row: { duration } }) => <div>{duration} Tháng</div>,
        },
        {
            field: "promotionAmount",
            headerName: "Giá Tiền Trước Chiết Khấu",
            headerAlign: "center",
            flex: 1,
            renderCell: ({ row: { promotionAmount } }) => (
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    width="100%"
                    gap="6px"
                >
                    {promotionAmount.toLocaleString()}
                    <img src={Coin} alt="" style={{ width: "35px" }} />
                </Box>
            ),
        },
        {
            field: "promotionDiscount",
            headerName: "Chiết Khấu",
            headerAlign: "center",
            renderCell: ({ row: { promotionDiscount } }) => (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width="100%"
                >
                    {promotionDiscount} %
                </Box>
            ),
        },
        {
            headerName: "Giá Tiền Sau Chiết Khấu",
            headerAlign: "center",
            flex: 1,
            renderCell: ({ row: { promotionDiscount, promotionAmount } }) => (
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    width="100%"
                    gap="6px"
                >
                    {(
                        (promotionAmount * (100 - promotionDiscount)) /
                        100
                    ).toLocaleString()}
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
                            navigate(`/${direction}/updatePackage`, {
                                state: { packageId: id },
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
                        onClick={() => handleDeletePackage(id)}
                    >
                        Xóa
                    </Button>
                </Box>
            ),
        },
    ];

    const rows = packagesData?.items?.map((packageItem, index) => ({
        ...packageItem,
        order: index + 1,
    }));

    const handleDeletePackage = (id) => {
        Swal.fire({
            icon: "warning",
            title: CONFIRMDELETEPACKAGE,
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
                dispatch(deletePackageThunk(id))
                    .unwrap()
                    .then(() =>
                        dispatch(getPackagesThunk()).then(() => {
                            setShowLoadingModal(false);
                            Swal.fire({
                                icon: "success",
                                title: SUCCESSTEXT,
                                text: DELETEPACKAGESUCCESS,
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
        <div className="packageTable">
            <Box m="20px">
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Header
                        title="GÓI ĐĂNG KÝ"
                        subtitle="Quản Lý Gói Đăng Ký Hệ Thống"
                    />
                    <Button
                        onClick={() => navigate(`/${direction}/createPackage`)}
                        className="createBtn"
                    >
                        Tạo Gói
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
                                    data={packagesData}
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
