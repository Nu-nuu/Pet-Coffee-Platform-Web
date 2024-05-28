import { Box, Button, useTheme, TextField } from "@mui/material";
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
import { createTopupThunk } from "../../../../store/apiThunk/topupThunk";
import { useState } from "react";
import Coin from "../../../../assets/coin.png";
import WalletOutlinedIcon from "@mui/icons-material/WalletOutlined";
import Swal from "sweetalert2";
import Lottie from "lottie-react";
import LoadingModal from "../../../../assets/loading.json";
import { useFormik } from "formik";
import * as Yup from "yup";
import Pagination from "../../../../components/pagination/pagination";
import { formatPaginationData } from "../../../../components/format/formatPagination/formatPagination";
import {
    CustomNoRowsOverlay,
    GridLoadingOverlay,
    StyledBox,
} from "../../../../components/styledTable/styledTable";
import { FilterComponent } from "../../../../components/filter/filterComponent";
import {
    AccRole,
    TransactionStatus,
    TransactionType,
} from "../../../../components/mapping/mapping";
import { TransactionBackdrop } from "../../../../components/backdrop/transactionBackdrop/transactionBackdrop";
import { FormatDateTime } from "../../../../components/format/formatDatetime/formatDatetime";
import {
    FormatAmount,
    FormatCurrency,
} from "../../../../components/format/formatAmount/formatAmount";
import { useLocation } from "react-router-dom";
import { ERRORTEXT } from "../../../../components/text/notiText/notiText";

export default function WalletTable() {
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
    const [showRender, setShowRender] = useState(false);
    const [showTopUp, setShowTopUp] = useState(false);
    const [open, setOpen] = useState(false);
    const [checkTransfer, setCheckTransfer] = useState(false);
    const [type, setType] = useState("all");
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);

    const trans = formatPaginationData(transData, pageNumber, pageSize);

    useEffect(() => {
        setShowLoadingModal(true);
        dispatch(getWalletThunk())
            .unwrap()
            .then((res) => {
                setTransData(res?.transactions);
                setShowLoadingModal(false);
            });
    }, []);

    useEffect(() => {
        if (type === "all") {
            setTransData(wallet?.transactions);
        } else {
            setTransData(
                wallet?.transactions?.filter(
                    (data) => data?.transactionType === type
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
            setShowRender(true);
            dispatch(getTransationDetailThunk(transactionId)).then(() => {
                removeRenderQueryParameter();
                setShowRender(false);
                setOpen(openNoti);
            });
        }
    }, [openNoti, transactionId, render]);

    const formik = useFormik({
        initialValues: {
            amount: "",
        },
        validationSchema: Yup.object({
            amount: Yup.string()
                .required("Số tiền không thể trống")
                .test(
                    "valid-amount",
                    "Số tiền ít nhất là 10.000 VND",
                    (value) => {
                        const amount = parseInt(value);
                        return amount >= 10000;
                    }
                )
                .test(
                    "valid-format",
                    "Số tiền phải chia hết cho 1,000",
                    (value) => {
                        const amount = parseInt(value);
                        return amount % 1000 === 0;
                    }
                ),
        }),
        onSubmit: (values) => {
            setShowTopUp(true);
            dispatch(
                createTopupThunk({
                    paymentContent: "Nạp tiền vào ví",
                    requiredAmount: values.amount,
                })
            )
                .unwrap()
                .then((res) => {
                    dispatch(getWalletThunk()).then(() => setShowTopUp(false));
                    window.location.href = res.url;
                })
                .catch((err) => {
                    setShowTopUp(false);
                    Swal.fire({
                        title: ERRORTEXT,
                        text: err.message,
                        icon: "error",
                        showConfirmButton: false,
                        background: "white",
                        timer: 2000,
                        timerProgressBar: true,
                        scrollbarPadding: false,
                    });
                });
        },
    });

    const handleOpenTransfer = () => {
        setCheckTransfer(true);
    };

    const handleCloseTransfer = async () => {
        await formik.setFieldValue("amount", "");
        await formik.setFieldError("amount", "");
        setCheckTransfer(false);
    };

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
                    setShowRender(true);
                    dispatch(getTransationDetailThunk(id)).then(() => {
                        setShowRender(false);
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

    const handleInputChange = (event, formik) => {
        let inputValue = event.target.value;
        let rawValue = inputValue.replace(/[^0-9]/g, "");
        formik.setFieldValue("amount", rawValue);
        event.target.value = FormatCurrency(rawValue);
    };

    return (
        <div className="walletTable">
            <Box m="20px">
                <Header
                    title="VÍ tiền CỦA BẠN"
                    subtitle="Quản Lý Nguồn Tiền Của Bạn"
                />
                <div className="box">
                    <div className="content">
                        <WalletOutlinedIcon
                            color="secondary"
                            style={{ fontSize: "60px" }}
                        />
                        <div className="balance_box">
                            <span style={{ fontSize: "20px" }}>
                                Số dư chính
                            </span>
                            <div className="balance">
                                {!showLoadingModal ? (
                                    Math.floor(wallet.balance)?.toLocaleString()
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
                                <div
                                    className="balance"
                                    style={{
                                        fontSize: "16px",
                                        gap: "0px",
                                        marginLeft: "15px",
                                    }}
                                >
                                    (1,000 VND tương đương 100
                                    <img
                                        src={Coin}
                                        alt=""
                                        style={{ width: "30px" }}
                                    />
                                    )
                                </div>
                            </div>
                        </div>
                    </div>
                    {!checkTransfer ? (
                        <Button
                            variant="contained"
                            className="submit_btn"
                            onClick={handleOpenTransfer}
                        >
                            Nạp Tiền
                        </Button>
                    ) : (
                        <form
                            onSubmit={formik.handleSubmit}
                            style={{
                                display: "flex",
                                gap: "20px",
                                alignItems: "flex-start",
                                minHeight: "83.28px",
                                paddingTop: "20px",
                            }}
                        >
                            <div style={{ width: "240px" }}>
                                <TextField
                                    id="amount"
                                    label={
                                        <span>
                                            Số Tiền{" "}
                                            <span style={{ color: "red" }}>
                                                *
                                            </span>
                                        </span>
                                    }
                                    variant="outlined"
                                    type="text"
                                    placeholder="Nhập Số Tiền"
                                    value={FormatCurrency(formik.values.amount)}
                                    onChange={(e) =>
                                        handleInputChange(e, formik)
                                    }
                                    color="secondary"
                                    fullWidth
                                />
                                <div
                                    style={{
                                        color: "red",
                                        fontWeight: "bold",
                                        marginTop: "10px",
                                        minHeight: "20.56px",
                                    }}
                                >
                                    {formik.touched.amount &&
                                    formik.errors.amount
                                        ? formik.errors.amount
                                        : null}
                                </div>
                            </div>
                            {!showTopUp ? (
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        className="back_btn"
                                        onClick={handleCloseTransfer}
                                    >
                                        Hủy
                                    </Button>
                                    <Button
                                        variant="contained"
                                        className="submit_btn"
                                        type="submit"
                                    >
                                        Nạp
                                    </Button>
                                </div>
                            ) : (
                                <div>
                                    <Lottie
                                        animationData={LoadingModal}
                                        loop={true}
                                        style={{ width: 144, height: 50 }}
                                    />
                                </div>
                            )}
                        </form>
                    )}
                </div>
                <div style={{ marginBottom: "200px" }}>
                    <Box height="68vh" sx={StyledBox}>
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
                            loading={showLoadingModal || showRender}
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
