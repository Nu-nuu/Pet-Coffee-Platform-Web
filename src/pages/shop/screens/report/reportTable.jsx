import { Box, Button, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../../theme";
import Header from "../../components/header/Header";
import { useDispatch, useSelector } from "react-redux";
import {
    shopReportsSelector,
    commentDetailSelector,
    postDetailSelector,
} from "../../../../store/sellectors";
import { useState, useEffect } from "react";
import { getShopReportsThunk } from "../../../../store/apiThunk/reportThunk";
import { useLocation } from "react-router-dom";
import { getPostDetailThunk } from "../../../../store/apiThunk/postThunk";
import { getCommentDetailThunk } from "../../../../store/apiThunk/commentThunk";
import Pagination from "../../../../components/pagination/pagination";
import {
    CustomNoRowsOverlay,
    GridLoadingOverlay,
    StyledBox,
} from "../../../../components/styledTable/styledTable";
import {
    CommentBackDrop,
    PostBackdrop,
} from "../../../../components/backdrop/reportBackdrop/reportBackdrop";
import { ReportReason, ReportStatus } from "../../../../components/mapping/mapping";

export default function ShopReportTable() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const shopReports = useSelector(shopReportsSelector);
    const postDetail = useSelector(postDetailSelector);
    const commentDetail = useSelector(commentDetailSelector);
    const dispatch = useDispatch();
    const location = useLocation();
    const shopId = location.state?.shopId;
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [open, setOpen] = useState(false);
    const [commentOpen, setCommentOpen] = useState(false);
    const [isShowAll, setIsShowAll] = useState(false);
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);

    useEffect(() => {
        setShowLoadingModal(true);
        dispatch(
            getShopReportsThunk({
                id: shopId,
                pageNumber,
                pageSize,
            })
        ).then(() => setShowLoadingModal(false));
    }, [shopId, pageNumber, pageSize]);

    const handleClose = () => {
        setOpen(false);
    };

    const toggleShowAll = () => {
        setIsShowAll(!isShowAll);
    };

    const handleCommentClose = () => {
        setCommentOpen(false);
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
            field: "postID",
            headerName: "ID Bài Viết",
            headerAlign: "center",
            renderCell: ({ row: { postID } }) => {
                const handleOpen = () => {
                    setShowLoadingModal(true);
                    dispatch(getPostDetailThunk(postID)).then(() => {
                        setShowLoadingModal(false);
                        setOpen(true);
                    });
                };

                return (
                    <>
                        <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            width="100%"
                        >
                            {postID && (
                                <Button
                                    variant="contained"
                                    onClick={handleOpen}
                                >
                                    {postID}
                                </Button>
                            )}
                        </Box>
                    </>
                );
            },
        },
        {
            field: "commentId",
            headerName: "ID Bình Luận",
            flex: 1,
            headerAlign: "center",
            renderCell: ({ row: { commentId } }) => {
                const handleCommentOpen = () => {
                    setShowLoadingModal(true);
                    dispatch(getCommentDetailThunk(commentId)).then(() => {
                        setShowLoadingModal(false);
                        setCommentOpen(true);
                    });
                };

                return (
                    <>
                        <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            width="100%"
                        >
                            {commentId && (
                                <Button
                                    variant="contained"
                                    onClick={handleCommentOpen}
                                >
                                    {commentId}
                                </Button>
                            )}
                        </Box>
                    </>
                );
            },
        },
        {
            field: "creatorName",
            headerName: "Tên Người Báo Cáo",
            flex: 1,
        },
        {
            field: "namePoster",
            headerName: "Tên Người Vi Phạm",
            flex: 1,
        },
        {
            field: "reason",
            headerName: "Lý Do",
            flex: 1,
            renderCell: ({ row: { reason } }) => (
                <>{ReportReason(reason)}</>
            ),
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
                                    status === "Accept"
                                        ? "#55ab95"
                                        : status === "Processing"
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
                            {ReportStatus(status)}
                        </div>
                    </Box>
                );
            },
        },
    ];

    const rows =
        shopReports?.items?.map((report, index) => ({
            ...report,
            order: index + 1,
        })) || [];

    const postImages = postDetail.image?.split(";");

    return (
        <Box m="20px">
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Header title="BÁO CÁO" subtitle="Quản Lý Báo Cáo Cửa Hàng" />
            </div>
            <Box height="68vh" sx={StyledBox}>
                <DataGrid
                    disableRowSelectionOnClick
                    loading={showLoadingModal}
                    slots={{
                        loadingOverlay: () => <GridLoadingOverlay />,
                        noRowsOverlay: () => <CustomNoRowsOverlay />,
                        pagination: () => (
                            <Pagination
                                data={shopReports}
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
                <PostBackdrop
                    open={open}
                    handleClose={handleClose}
                    postDetail={postDetail}
                    postImages={postImages}
                    isShowAll={isShowAll}
                    toggleShowAll={toggleShowAll}
                />
                <CommentBackDrop
                    commentOpen={commentOpen}
                    handleCommentClose={handleCommentClose}
                    commentDetail={commentDetail}
                />
            </Box>
        </Box>
    );
}
