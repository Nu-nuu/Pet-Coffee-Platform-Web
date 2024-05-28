import { Box, Button, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../../theme";
import Header from "../../components/header/Header";
import { useDispatch, useSelector } from "react-redux";
import {
    transactionDetailSelector,
    userDataSelector,
    walletSelector,
} from "../../../../store/sellectors";
import "./walletTable.css";
import { useEffect } from "react";
import { getWalletThunk } from "../../../../store/apiThunk/walletThunk";
import { getTransationDetailThunk } from "../../../../store/apiThunk/transactionThunk";
import { useState } from "react";
import Coin from "../../../../assets/coin.png";
import WalletOutlinedIcon from "@mui/icons-material/WalletOutlined";
import Lottie from "lottie-react";
import LoadingModal from "../../../../assets/loading.json";
import Pagination from "../../../../components/pagination/pagination";
import { formatPaginationData } from "../../../../components/format/formatPagination/formatPagination";
import {
    StyledBox,
    CustomNoRowsOverlay,
    GridLoadingOverlay,
} from "../../../../components/styledTable/styledTable";
import {
    AccRole,
    TransactionStatus,
    TransactionType,
} from "../../../../components/mapping/mapping";
import { FormatDateTime } from "../../../../components/format/formatDatetime/formatDatetime";
import { FormatAmount } from "../../../../components/format/formatAmount/formatAmount";
import { TransactionBackdrop } from "../../../../components/backdrop/transactionBackdrop/transactionBackdrop";
import { useLocation } from "react-router-dom";

export default function WalletTableAdmin() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const url = new URL(window.location.href);
    const render = url.searchParams.get("render");
    const dispatch = useDispatch();
    const location = useLocation();
    const transactionId = location?.state?.transactionId;
    const openNoti = location?.state?.openNoti;
    const userData = useSelector(userDataSelector);
    const wallet = useSelector(walletSelector);
    const transactionDetail = useSelector(transactionDetailSelector);
    const [transData, setTransData] = useState([]);
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [showLoadingTrans, setShowLoadingTrans] = useState(false);
    const [open, setOpen] = useState(false);
    const [type, setType] = useState("all");
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);

    const trans = formatPaginationData(transData, pageNumber, pageSize);

    useEffect(() => {
        setShowLoadingModal(true);
        dispatch(getWalletThunk())
            .unwrap()
            .then((res) => {
                setTransData(res.transactions);
                setShowLoadingModal(false);
            });
    }, []);

    useEffect(() => {
        if (type === "all") {
            setTransData(wallet?.transactions);
        } else {
            setTransData(
                wallet?.transactions?.filter(
                    (data) => data.transactionType === type
                )
            );
        }
    }, [type]);

    useEffect(() => {
        const removeRenderQueryParameter = () => {
            const url = new URL(window.location.href);
            url.searchParams.delete("render");
            window.history.replaceState({}, "", url);
        };

        if (transactionId && openNoti) {
            setShowLoadingTrans(true);
            dispatch(getTransationDetailThunk(transactionId)).then(() => {
                removeRenderQueryParameter();
                setShowLoadingTrans(false);
                setOpen(openNoti);
            });
        }
    }, [openNoti, transactionId, render]);

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
                    setShowLoadingTrans(true);
                    dispatch(getTransationDetailThunk(id)).then(() => {
                        setShowLoadingTrans(false);
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
            field: "shopName",
            headerName: "Cửa Hàng",
            flex: 1,
            valueGetter: (params) => params.row.shop?.name || "",
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
                        {FormatAmount(
                            amount?.toLocaleString(),
                            id,
                            wallet,
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
            renderCell: ({ row: { transactionType } }) => (
                <div>{TransactionType(transactionType)}</div>
            ),
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
                                    transactionStatus === "Done" ||
                                    transactionStatus === "Return"
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
        trans?.items?.map((transaction, index) => ({
            ...transaction,
            order: index + 1,
        })) || [];

    return (
        <div className="walletTableAdmin">
            <Box m="20px">
                <Header
                    title="Ví tiền hệ thống"
                    subtitle="Quản Lý Nguồn Tiền hệ thống"
                />
                <div className="box">
                    <div className="content">
                        <WalletOutlinedIcon
                            color="secondary"
                            style={{ fontSize: "60px" }}
                        />
                        <div className="balance_box">
                            <span style={{ fontSize: "20px" }}>
                                Số Dư Chính
                            </span>
                            <div className="balance">
                                {!showLoadingModal ? (
                                    Math.floor(
                                        wallet?.balance
                                    )?.toLocaleString()
                                ) : (
                                    <Lottie
                                        animationData={LoadingModal}
                                        loop={true}
                                        style={{ width: 122, height: 55 }}
                                    />
                                )}
                                <img
                                    src={Coin}
                                    alt=""
                                    style={{ width: "50px" }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ marginBottom: "140px" }}>
                    <Box height="68vh" sx={StyledBox}>
                        <Header
                            title="GIAO DỊCH"
                            subtitle="Lịch Sử Giao Dịch Gần Đây"
                        />
                        <DataGrid
                            loading={showLoadingModal || showLoadingTrans}
                            slots={{
                                loadingOverlay: () => <GridLoadingOverlay />,
                                noRowsOverlay: () => <CustomNoRowsOverlay />,
                                pagination: () => (
                                    <Pagination
                                        data={trans}
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
            </Box>
        </div>
    );
}
