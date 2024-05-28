import { Box, Button, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../../theme";
import Header from "../../components/header/Header";
import { useDispatch, useSelector } from "react-redux";
import {
    transactionDetailSelector,
    transactionsFromShopSelector,
    userDataSelector,
} from "../../../../store/sellectors";
import { useLocation } from "react-router-dom";
import "./transactionTable.css";
import { useEffect } from "react";
import {
    getTransationDetailThunk,
    getTransationsFromShopThunk,
} from "../../../../store/apiThunk/transactionThunk";
import { useState } from "react";
import Coin from "../../../../assets/coin.png";
import Pagination from "../../../../components/pagination/pagination";
import {
    CustomNoRowsOverlay,
    GridLoadingOverlay,
    StyledBox,
} from "../../../../components/styledTable/styledTable";
import { TransactionBackdrop } from "../../../../components/backdrop/transactionBackdrop/transactionBackdrop";
import { FilterComponent } from "../../../../components/filter/filterComponent";
import { FormatAmountForShop } from "../../../../components/format/formatAmount/formatAmount";
import {
    AccRole,
    TransactionStatus,
    TransactionType,
} from "../../../../components/mapping/mapping";
import { FormatDateTime } from "../../../../components/format/formatDatetime/formatDatetime";

export default function TransactionTable() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const dispatch = useDispatch();
    const location = useLocation();
    const shopId = location.state?.shopId;
    const userData = useSelector(userDataSelector);
    const transactionsFromShop = useSelector(transactionsFromShopSelector);
    const transactionDetail = useSelector(transactionDetailSelector);
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [open, setOpen] = useState(false);
    const [type, setType] = useState("all");
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);

    useEffect(() => {
        setShowLoadingModal(true);
        const fetchTransactions =
            type !== "all"
                ? dispatch(
                      getTransationsFromShopThunk({
                          type: type,
                          id: shopId,
                          pageNumber,
                          pageSize,
                      })
                  )
                : dispatch(
                      getTransationsFromShopThunk({
                          type: "",
                          id: shopId,
                          pageNumber,
                          pageSize,
                      })
                  );
        fetchTransactions.then(() => setShowLoadingModal(false));
    }, [type, shopId, pageSize, pageNumber]);

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
            renderCell: ({ row: { id } }) => {
                const handleOpen = () => {
                    setShowLoadingModal(true);
                    dispatch(getTransationDetailThunk(id)).then(() => {
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
                            {id}
                        </Button>
                    </Box>
                );
            },
        },
        {
            field: "creatorFullName",
            headerName: "Người Giao Dịch",
            flex: 1,
            valueGetter: (params) => params.row.creator?.fullName || "",
            cellClassName: "name-column--cell",
        },
        {
            field: "creatorRole",
            headerName: "Vai Trò",
            flex: 1,
            valueGetter: (params) => AccRole(params.row.creator?.role) || "",
        },
        {
            field: "createdAt",
            headerName: "Ngày Giao Dịch",
            flex: 1,
            renderCell: ({ row: { createdAt } }) => (
                <div>{FormatDateTime(createdAt)}</div>
            ),
        },
        {
            field: "amount",
            headerName: "Số Tiền",
            flex: 1,
            renderCell: ({ row: { amount, id } }) => {
                return (
                    <Box
                        display="flex"
                        alignItems="center"
                        width="100%"
                        gap="5px"
                    >
                        {FormatAmountForShop(
                            amount?.toLocaleString(),
                            id,
                            transactionsFromShop?.items,
                            userData
                        )}
                        <img src={Coin} alt="" style={{ width: "30px" }} />
                    </Box>
                );
            },
        },
        {
            field: "transactionType",
            headerName: "Loại Giao Dịch",
            flex: 1,
            renderCell: ({ row: { transactionType } }) =>
                TransactionType(transactionType),
        },
        {
            field: "content",
            headerName: "Mô Tả",
            flex: 1,
        },
        {
            field: "transactionStatus",
            headerName: "Tình Trạng",
            flex: 1,
            headerAlign: "center",
            renderCell: ({ row: { transactionStatus } }) => {
                return (
                    <Box width="100%" display="flex" justifyContent="center">
                        <div
                            style={{
                                backgroundColor:
                                    transactionStatus === "Done" || transactionStatus === "Return"
                                        ? "#55ab95"
                                        : transactionStatus === "Processing"
                                        ? "#b8b800"
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
                            {TransactionStatus(transactionStatus)}
                        </div>
                    </Box>
                );
            },
        },
    ];

    const rows =
        transactionsFromShop?.items?.map((transaction, index) => ({
            ...transaction,
            order: index + 1,
        })) || [];

    return (
        <div className="transactionTable">
            <Box height="59vh" m="20px" sx={StyledBox}>
                <Header
                    title="GIAO DỊCH"
                    subtitle="Lịch Sử Giao Dịch Gần Đây"
                />
                <FilterComponent
                    label="Loại Giao Dịch"
                    name="type"
                    type={type}
                    setType={setType}
                />
                <DataGrid
                    loading={showLoadingModal}
                    slots={{
                        loadingOverlay: () => <GridLoadingOverlay />,
                        noRowsOverlay: () => <CustomNoRowsOverlay />,
                        pagination: () => (
                            <Pagination
                                data={transactionsFromShop}
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
                <TransactionBackdrop
                    open={open}
                    handleClose={handleClose}
                    transactionDetail={transactionDetail}
                />
            </Box>
        </div>
    );
}
