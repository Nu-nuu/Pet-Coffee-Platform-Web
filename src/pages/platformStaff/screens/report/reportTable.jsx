import { Box, Button, Divider, Popover, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../../theme";
import Header from "../../components/header/Header";
import { useDispatch, useSelector } from "react-redux";
import {
    allReportsSelector,
    commentDetailSelector,
    postDetailSelector,
} from "../../../../store/sellectors";
import { useState } from "react";
import {
    getAllReportsThunk,
    updateReportStatusThunk,
} from "../../../../store/apiThunk/reportThunk";
import { getPostDetailThunk } from "../../../../store/apiThunk/postThunk";
import { getCommentDetailThunk } from "../../../../store/apiThunk/commentThunk";
import { useEffect } from "react";
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
import { useLocation } from "react-router-dom";
import {
    ReportReason,
    ReportStatus,
} from "../../../../components/mapping/mapping";

export default function ReportTable() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const reports = useSelector(allReportsSelector);
    const postDetail = useSelector(postDetailSelector);
    const commentDetail = useSelector(commentDetailSelector);
    const url = new URL(window.location.href);
    const render = url.searchParams.get("render");
    const dispatch = useDispatch();
    const location = useLocation();
    const reportId = location?.state?.reportId;
    const openNoti = location?.state?.openNoti;
    const reportType = location?.state?.reportType;
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [popoverId, setPopoverId] = useState(null);
    const [open, setOpen] = useState(false);
    const [commentOpen, setCommentOpen] = useState(false);
    const [isShowAll, setIsShowAll] = useState(false);
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);

    useEffect(() => {
        setShowLoadingModal(true);
        dispatch(
            getAllReportsThunk({
                pageNumber,
                pageSize,
            })
        ).then(() => setShowLoadingModal(false));
    }, [pageNumber, pageSize]);

    useEffect(() => {
        const removeRenderQueryParameter = () => {
            const url = new URL(window.location.href);
            url.searchParams.delete("render");
            window.history.replaceState({}, "", url);
        };

        if (reportId && openNoti) {
            if (reportType === "post") {
                setShowLoadingModal(true);
                dispatch(getPostDetailThunk(reportId)).then(() => {
                    setShowLoadingModal(false);
                    setOpen(openNoti);
                    removeRenderQueryParameter();
                });
            } else {
                setShowLoadingModal(true);
                dispatch(getCommentDetailThunk(reportId)).then(() => {
                    setShowLoadingModal(false);
                    setCommentOpen(openNoti);
                    removeRenderQueryParameter();
                });
            }
        }
    }, [openNoti, reportId, reportType, render]);

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
            renderCell: ({ row: { reason } }) => <>{ReportReason(reason)}</>,
        },
        {
            field: "status",
            headerName: "Tình Trạng",
            flex: 1,
            headerAlign: "center",
            renderCell: ({ row: { id, status } }) => {
                const handleClick = (event) => {
                    setPopoverId(id);
                    setAnchorEl(event?.currentTarget);
                };

                const handleClose = () => {
                    setAnchorEl(null);
                };

                const open = Boolean(anchorEl);

                const handleChangeStatus = (id, status) => {
                    setShowLoadingModal(true);
                    handleClose();
                    dispatch(
                        updateReportStatusThunk({
                            reportId: id,
                            status: status,
                        })
                    ).then(() =>
                        dispatch(
                            getAllReportsThunk({
                                pageNumber,
                                pageSize,
                            })
                        ).then(() => setShowLoadingModal(false))
                    );
                };

                return (
                    <Box width="100%" display="flex" justifyContent="center">
                        {status === "Processing" ? (
                            <Button
                                variant="contained"
                                style={{
                                    backgroundColor: "#b8b800",
                                    minWidth: "97px",
                                    textTransform: "capitalize",
                                }}
                                onClick={handleClick}
                            >
                                {ReportStatus(status)}
                            </Button>
                        ) : (
                            <div
                                style={{
                                    backgroundColor:
                                        status === "Accept"
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
                                {ReportStatus(status)}
                            </div>
                        )}

                        <Popover
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "center",
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "center",
                            }}
                        >
                            <Button
                                style={{
                                    backgroundColor: "#55ab95",
                                    color: "white",
                                    minWidth: "97px",
                                    textTransform:'capitalize'
                                }}
                                onClick={() =>
                                    handleChangeStatus(popoverId, "Accept")
                                }
                            >
                                chấp nhận
                            </Button>
                            <Divider />
                            <Button
                                style={{
                                    backgroundColor: colors.redAccent[600],
                                    color: "white",
                                    minWidth: "97px",
                                    textTransform:'capitalize'
                                }}
                                onClick={() =>
                                    handleChangeStatus(popoverId, "Reject")
                                }
                            >
                                từ chối
                            </Button>
                        </Popover>
                    </Box>
                );
            },
        },
    ];

    const rows =
        reports?.items?.map((report, index) => ({
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
                <Header title="BÁO CÁO" subtitle="Quản Lý Báo Cáo" />
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
                                data={reports}
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
