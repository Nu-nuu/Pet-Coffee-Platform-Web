import { Box, Button, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../../../theme";
import Header from "../../../components/header/Header";
import { useSelector } from "react-redux";
import { userDataSelector } from "../../../../../store/sellectors";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./shopTable.css";
import { useEffect, useState } from "react";
import Pagination from "../../../../../components/pagination/pagination";
import { formatPaginationData } from "../../../../../components/format/formatPagination/formatPagination";
import { ShopStatus, PetType } from "../../../../../components/mapping/mapping";
import { FormatPhoneNumber } from "../../../../../components/format/formatText/formatText";
import {
    CustomNoRowsOverlay,
    StyledBox,
} from "../../../../../components/styledTable/styledTable";
import { FilterComponent } from "../../../../../components/filter/filterComponent";

export default function ShopTable() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const userData = useSelector(userDataSelector);
    const navigate = useNavigate();
    const [shopData, setShopData] = useState(userData?.shopResponses);
    const location = useLocation();
    const direction = location.state?.direction;
    const check = shopData.some((shop) => shop.status === "Processing");
    const [shopType, setShopType] = useState("all");
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);

    const shop = formatPaginationData(shopData, pageNumber, pageSize);

    useEffect(() => {
        if (direction === "packagePage" || direction === "transferStatus") {
            navigate("wallet");
        }
        if (shopType === "all") {
            setShopData(userData?.shopResponses);
        } else {
            setShopData(
                userData?.shopResponses?.filter(
                    (shop) => shop.shopType === shopType
                )
            );
        }
    }, [shopType, userData, direction]);

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
            headerName: "Tên Cửa Hàng",
            flex: 1,
            renderCell: ({ row: { name, id, status } }) =>
                status !== "Processing" ? (
                    <Link
                        to="/shop"
                        state={{
                            shopId: id,
                        }}
                        style={{ textDecoration: "none", color: "#94e2cd" }}
                    >
                        {name}
                    </Link>
                ) : (
                    <div style={{ textDecoration: "none", color: "#94e2cd", cursor:'not-allowed' }}>
                        {name}
                    </div>
                ),
        },
        {
            field: "email",
            headerName: "Email",
            flex: 1,
        },
        {
            field: "phone",
            headerName: "Số Điện Thoại",
            flex: 1,
            renderCell: ({ row: { phone } }) => FormatPhoneNumber(phone),
        },
        {
            field: "shopType",
            headerName: "Loại Cửa Hàng",
            flex: 1,
            renderCell: ({ row: { shopType } }) => (
                <div>{PetType(shopType)}</div>
            ),
        },
        {
            field: "location",
            headerName: "Địa Chỉ",
            flex: 1,
        },
        {
            field: "status",
            headerName: "Tình Trạng",
            flex: 1,
            headerAlign: "center",
            renderCell: ({ row: { status } }) => {
                return (
                    <Box width="100%" display="flex" justifyContent="center">
                        <div
                            style={{
                                backgroundColor:
                                    status === "Processing"
                                        ? "#b8b800"
                                        : status === "Active"
                                        ? "#55ab95"
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
                            {ShopStatus(status)}
                        </div>
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
                            navigate("/manager/updateShop", {
                                state: { shopId: id },
                            })
                        }
                        style={{ color: "white", textTransform:'capitalize' }}
                    >
                        Sửa
                    </Button>
                </Box>
            ),
        },
    ];

    const rows = shop?.items?.map((shop, index) => ({
        ...shop,
        order: index + 1,
    }));

    return (
        <div className="shopTable">
            <Box m="20px">
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Header
                        title="CỬA HÀNG"
                        subtitle="Quản Lý Cửa Hàng Của Bạn"
                    />
                    {!check ? (
                        <div
                            onClick={() =>
                                navigate("/manager/createShopManager")
                            }
                            className="createBtn"
                        >
                            Thêm Cửa Hàng
                        </div>
                    ) : (
                        <div></div>
                    )}
                </div>
                <FilterComponent
                    label="Loại Cửa Hàng"
                    name="shopType"
                    shopType={shopType}
                    setShopType={setShopType}
                />
                <Box height="59vh" sx={StyledBox}>
                    <DataGrid
                        disableRowSelectionOnClick
                        slots={{
                            noRowsOverlay: () => <CustomNoRowsOverlay />,
                            pagination: () => (
                                <Pagination
                                    data={shop}
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
                </Box>
            </Box>
        </div>
    );
}
