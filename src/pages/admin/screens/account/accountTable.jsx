import { Box, Button, Popover, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../../theme";
import Header from "../../components/header/Header";
import { useDispatch, useSelector } from "react-redux";
import { allAccountsSelector } from "../../../../store/sellectors";
import {
    getAllAccountsThunk,
    updateStatusAccountThunk,
} from "../../../../store/apiThunk/userThunk";
import { useEffect, useState } from "react";
import Pagination from "../../../../components/pagination/pagination";
import { AccRole } from "../../../../components/mapping/mapping";
import {
    StyledBox,
    CustomNoRowsOverlay,
    GridLoadingOverlay,
} from "../../../../components/styledTable/styledTable";
import { FilterComponent } from "../../../../components/filter/filterComponent";
import { FormatPhoneNumber } from "../../../../components/format/formatText/formatText";

export default function AccountTable() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const accounts = useSelector(allAccountsSelector);
    const dispatch = useDispatch();
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [popoverId, setPopoverId] = useState(null);
    const [popoverStatus, setPopoverStatus] = useState(null);
    const [role, setRole] = useState("all");
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);

    useEffect(() => {
        setShowLoadingModal(true);
        const fetchAccounts =
            role !== "all"
                ? dispatch(
                      getAllAccountsThunk({ role: role, pageNumber, pageSize })
                  )
                : dispatch(
                      getAllAccountsThunk({ role: "", pageNumber, pageSize })
                  );
        fetchAccounts.then(() => setShowLoadingModal(false));
    }, [role, pageNumber, pageSize]);

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
            field: "email",
            headerName: "Email",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "phoneNumber",
            headerName: "Số Điện Thoại",
            flex: 1,
            renderCell: ({ row: { phoneNumber } }) => (
                <div>{FormatPhoneNumber(phoneNumber)}</div>
            ),
        },
        {
            field: "role",
            headerName: "Vai Trò",
            flex: 1,
            renderCell: ({ row: { role } }) => <div>{AccRole(role)}</div>,
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
                    ).then(() => {
                        if (role !== "all") {
                            dispatch(
                                getAllAccountsThunk({
                                    role: role,
                                    pageNumber,
                                    pageSize,
                                })
                            ).then(() => {
                                setShowLoadingModal(false);
                            });
                        } else {
                            dispatch(
                                getAllAccountsThunk({
                                    role: "",
                                    pageNumber,
                                    pageSize,
                                })
                            ).then(() => {
                                setShowLoadingModal(false);
                            });
                        }
                    });
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
                                textTransform:'capitalize'
                            }}
                            onClick={handleClick}
                        >
                            {status === "Active" ? "Hoạt động" : "Vô hiệu"}
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
                                        textTransform:'capitalize'
                                    }}
                                    onClick={() =>
                                        handleChangeStatus(
                                            popoverId,
                                            "InActive"
                                        )
                                    }
                                >
                                    Vô hiệu hóa
                                </Button>
                            ) : (
                                <Button
                                    style={{
                                        backgroundColor: "#55ab95",
                                        color: "white",
                                        minWidth: "97px",
                                        textTransform:'capitalize'
                                    }}
                                    onClick={() =>
                                        handleChangeStatus(popoverId, "Active")
                                    }
                                >
                                    kích hoạt
                                </Button>
                            )}
                        </Popover>
                    </Box>
                );
            },
        },
    ];

    const rows =
        accounts?.items?.map((account, index) => ({
            ...account,
            order: index + 1,
        })) || [];

    return (
        <Box m="20px">
            <Header title="TÀI KHOẢN" subtitle="Quản Lý Tài Khoản Hệ Thống" />
            <FilterComponent
                label="Vai Trò"
                name="role"
                role={role}
                setRole={setRole}
            />
            <Box sx={StyledBox}>
                <div style={{ height: "59vh" }}>
                    <DataGrid
                        disableRowSelectionOnClick
                        loading={showLoadingModal}
                        slots={{
                            loadingOverlay: () => <GridLoadingOverlay />,
                            noRowsOverlay: () => <CustomNoRowsOverlay />,
                            pagination: () => (
                                <Pagination
                                    data={accounts}
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
                </div>
            </Box>
        </Box>
    );
}
