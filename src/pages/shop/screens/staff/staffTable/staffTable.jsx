import { Box, Button, Popover, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../../../theme";
import Header from "../../../components/header/Header";
import { useDispatch, useSelector } from "react-redux";
import { staffsSelector } from "../../../../../store/sellectors";
import { useLocation, useNavigate } from "react-router-dom";
import "./staffTable.css";
import { useEffect } from "react";
import {
    getStaffsThunk,
    updateStatusAccountThunk,
} from "../../../../../store/apiThunk/userThunk";
import { useState } from "react";
import Pagination from "../../../../../components/pagination/pagination";
import {
    CustomNoRowsOverlay,
    GridLoadingOverlay,
    StyledBox,
} from "../../../../../components/styledTable/styledTable";
import { FormatPhoneNumber } from "../../../../../components/format/formatText/formatText";
import { StaffStatus } from "../../../../../components/mapping/mapping";

export default function StaffTable() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const staffs = useSelector(staffsSelector);
    const location = useLocation();
    const shopId = location.state?.shopId;
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [popoverId, setPopoverId] = useState(null);
    const [popoverStatus, setPopoverStatus] = useState(null);
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);

    useEffect(() => {
        setShowLoadingModal(true);
        dispatch(getStaffsThunk({ id: shopId, pageNumber, pageSize })).then(
            () => setShowLoadingModal(false)
        );
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
            field: "fullName",
            headerName: "Họ Tên",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "email",
            headerName: "Email",
            flex: 1,
        },
        {
            field: "phoneNumber",
            headerName: "Số Điện Thoại",
            flex: 1,
            renderCell: ({ row: { phoneNumber } }) =>
                FormatPhoneNumber(phoneNumber),
        },
        {
            field: "status",
            headerName: "Tình Trạng",
            flex: 1,
            headerAlign: "center",
            renderCell: ({ row: { id, status } }) => {
                const handleClick = (event) => {
                    setPopoverId(id);
                    setPopoverStatus(status);
                    setAnchorEl(event.currentTarget);
                };

                const handleClose = () => {
                    setAnchorEl(null);
                };

                const open = Boolean(anchorEl);

                const handleChangeStatus = (id, status) => {
                    setShowLoadingModal(true);
                    handleClose();
                    dispatch(
                        updateStatusAccountThunk({
                            id: id,
                            accountStatus: status,
                        })
                    ).then(() =>
                        dispatch(
                            getStaffsThunk({ id: shopId, pageNumber, pageSize })
                        ).then(() => setShowLoadingModal(false))
                    );
                };

                return (
                    <Box width="100%" display="flex" justifyContent="center">
                        <Button
                            variant="contained"
                            style={{
                                backgroundColor:
                                    status === "Active"
                                        ? "#55ab95"
                                        : colors.redAccent[600],
                                minWidth: "97px",
                                textTransform: "capitalize",
                            }}
                            onClick={handleClick}
                        >
                            {StaffStatus(status)}
                        </Button>
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
                            {popoverStatus === "Active" ? (
                                <Button
                                    style={{
                                        backgroundColor: colors.redAccent[600],
                                        color: "white",
                                        minWidth: "97px",
                                        textTransform: "capitalize",
                                    }}
                                    onClick={() =>
                                        handleChangeStatus(
                                            popoverId,
                                            "InActive"
                                        )
                                    }
                                >
                                    Vô Hiệu Hóa
                                </Button>
                            ) : (
                                <Button
                                    style={{
                                        backgroundColor: "#55ab95",
                                        color: "white",
                                        minWidth: "97px",
                                        textTransform: "capitalize",
                                    }}
                                    onClick={() =>
                                        handleChangeStatus(popoverId, "Active")
                                    }
                                >
                                    Kích Hoạt
                                </Button>
                            )}
                        </Popover>
                    </Box>
                );
            },
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
                >
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={() =>
                            navigate("/shop/changePasswordStaff", {
                                state: { staffId: id, shopId: shopId },
                            })
                        }
                        style={{ color: "white", textTransform: "capitalize" }}
                    >
                        Đổi Mật Khẩu
                    </Button>
                </Box>
            ),
        },
    ];

    const rows =
        staffs?.items?.map((staff, index) => ({
            ...staff,
            order: index + 1,
        })) || [];

    return (
        <div className="staffTable">
            <Box m="20px">
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Header
                        title="NHÂN VIÊN"
                        subtitle="Quản Lý Nhân Viên Của Cửa Hàng"
                    />
                    <Button
                        onClick={() =>
                            navigate("/shop/createStaff", {
                                state: { shopId: shopId },
                            })
                        }
                        className="createBtn"
                    >
                        Thêm Nhân Viên
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
                                    data={staffs}
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
