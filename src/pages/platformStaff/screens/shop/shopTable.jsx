import { Box, Button, Divider, Popover, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../../theme";
import Header from "../../components/header/Header";
import { useDispatch, useSelector } from "react-redux";
import {
    allPetCoffeeShopsSelector,
    petCoffeeShopDetailSelector,
} from "../../../../store/sellectors";
import { useState } from "react";
import {
    getAllPetCoffeeShopsThunk,
    getPetCoffeeShopDetailThunk,
    updateShopStatusThunk,
} from "../../../../store/apiThunk/petCoffeeShopThunk";
import { useEffect } from "react";
import Pagination from "../../../../components/pagination/pagination";
import {
    StyledBox,
    CustomNoRowsOverlay,
    GridLoadingOverlay,
} from "../../../../components/styledTable/styledTable";
import { FilterComponent } from "../../../../components/filter/filterComponent";
import { PetType, ShopStatus } from "../../../../components/mapping/mapping";
import { ShopBackdrop } from "../../../../components/backdrop/shopBackdrop/shopBackdrop";
import { useLocation } from "react-router-dom";
import { FormatPhoneNumber } from "../../../../components/format/formatText/formatText";

export default function ShopTableStaff() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const shops = useSelector(allPetCoffeeShopsSelector);
    const shopDetail = useSelector(petCoffeeShopDetailSelector);
    const url = new URL(window.location.href);
    const render = url.searchParams.get("render");
    const dispatch = useDispatch();
    const location = useLocation();
    const shopId = location?.state?.shopId;
    const openNoti = location?.state?.openNoti;
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [popoverId, setPopoverId] = useState(null);
    const [popoverStatus, setPopoverStatus] = useState(null);
    const [shopType, setShopType] = useState("all");
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);
    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        const fetchShops =
            shopType !== "all"
                ? dispatch(
                      getAllPetCoffeeShopsThunk({
                          type: shopType,
                          pageNumber,
                          pageSize,
                      })
                  )
                : dispatch(
                      getAllPetCoffeeShopsThunk({
                          type: "",
                          pageNumber,
                          pageSize,
                      })
                  );
        setShowLoadingModal(true);
        fetchShops.then(() => setShowLoadingModal(false));
    }, [shopType, pageNumber, pageSize]);

    useEffect(() => {
        const removeRenderQueryParameter = () => {
            const url = new URL(window.location.href);
            url.searchParams.delete("render");
            window.history.replaceState({}, "", url);
        };

        if (shopId && openNoti) {
            setShowLoadingModal(true);
            dispatch(
                getPetCoffeeShopDetailThunk({
                    id: shopId,
                    latitude: 1,
                    longitude: 1,
                })
            ).then(() => {
                removeRenderQueryParameter();
                setShowLoadingModal(false);
                setOpen(openNoti);
            });
        }
    }, [openNoti, shopId, render]);

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
            cellClassName: "name-column--cell",
            renderCell: ({ row: { id, name } }) => {
                const handleOpen = () => {
                    setShowLoadingModal(true);
                    dispatch(
                        getPetCoffeeShopDetailThunk({
                            id,
                            latitude: 1,
                            longitude: 1,
                        })
                    ).then(() => {
                        setShowLoadingModal(false);
                        setOpen(true);
                    });
                };
                return (
                    <div onClick={handleOpen} style={{ cursor: "pointer" }}>
                        {name}
                    </div>
                );
            },
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
            renderCell: ({ row: { phone } }) => (
                <div>{FormatPhoneNumber(phone)}</div>
            ),
        },
        {
            field: "type",
            headerName: "Loại Cửa Hàng",
            flex: 1,
            renderCell: ({ row: { type } }) => <div>{PetType(type)}</div>,
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
                        updateShopStatusThunk({
                            ShopId: id,
                            Status: status,
                        })
                    ).then(() => {
                        shopType !== "all"
                            ? dispatch(
                                  getAllPetCoffeeShopsThunk({
                                      type: shopType,
                                      pageNumber,
                                      pageSize,
                                  })
                              ).then(() => setShowLoadingModal(false))
                            : dispatch(
                                  getAllPetCoffeeShopsThunk({
                                      type: "",
                                      pageNumber,
                                      pageSize,
                                  })
                              ).then(() => setShowLoadingModal(false));
                    });
                };

                return (
                    <Box width="100%" display="flex" justifyContent="center">
                        <Button
                            variant="contained"
                            style={{
                                backgroundColor:
                                    status === "Processing"
                                        ? "#b8b800"
                                        : status === "Active"
                                        ? "#55ab95"
                                        : colors.redAccent[600],
                                minWidth: "97px",
                                textTransform:'capitalize'
                            }}
                            onClick={handleClick}
                        >
                            {ShopStatus(status)}
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
                                    Vô Hiệu Hóa
                                </Button>
                            ) : popoverStatus === "InActive" ? (
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
                                    Kích Hoạt
                                </Button>
                            ) : (
                                popoverStatus === "Processing" && (
                                    <>
                                        <Button
                                            style={{
                                                backgroundColor: "#55ab95",
                                                color: "white",
                                                minWidth: "97px",
                                                textTransform:'capitalize'
                                            }}
                                            onClick={() =>
                                                handleChangeStatus(
                                                    popoverId,
                                                    "Active"
                                                )
                                            }
                                        >
                                            Kích Hoạt
                                        </Button>
                                        <Divider />
                                        <Button
                                            style={{
                                                backgroundColor:
                                                    colors.redAccent[600],
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
                                            Vô Hiệu Hóa
                                        </Button>
                                    </>
                                )
                            )}
                        </Popover>
                    </Box>
                );
            },
        },
    ];

    const rows =
        shops?.items?.map((shop, index) => ({
            ...shop,
            order: index + 1,
        })) || [];

    return (
        <Box m="20px">
            <Header title="CỬA HÀNG" subtitle="Quản Lý Cửa Hàng Hệ Thống" />
            <FilterComponent
                label="Loại Cửa Hàng"
                name="shopType"
                shopType={shopType}
                setShopType={setShopType}
            />
            <Box height="59vh" sx={StyledBox}>
                <DataGrid
                    disableRowSelectionOnClick
                    loading={showLoadingModal}
                    slots={{
                        loadingOverlay: () => <GridLoadingOverlay />,
                        noRowsOverlay: () => <CustomNoRowsOverlay />,
                        pagination: () => (
                            <Pagination
                                data={shops}
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
                <ShopBackdrop
                    open={open}
                    handleClose={handleClose}
                    shopDetail={shopDetail}
                />
            </Box>
        </Box>
    );
}
