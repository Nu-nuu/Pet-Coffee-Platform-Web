import { Backdrop, Box } from "@mui/material";
import { FormatDateTime } from "../../format/formatDatetime/formatDatetime";
import { TruncateText } from "../../format/formatText/formatText";

export function PostBackdrop(props) {
    const open = props.open;
    const handleClose = props.handleClose;
    const postDetail = props.postDetail;
    const postImages = props.postImages;
    const isShowAll = props.isShowAll;
    const toggleShowAll = props.toggleShowAll;

    return (
        <Backdrop
            sx={{
                color: "#fff",
                zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            open={open}
            onClick={handleClose}
        >
            <Box sx={style}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "30px",
                    }}
                >
                    <img
                        style={{
                            width: "100px",
                            height: "100px",
                            borderRadius: "50px",
                            objectFit: "cover",
                        }}
                        src={postDetail.posterAvatar}
                        alt=""
                    />
                    <p
                        style={{
                            fontSize: "20px",
                            fontWeight: "600",
                            textTransform: "capitalize",
                        }}
                    >
                        {postDetail.namePoster}
                        <br />
                        <span
                            style={{
                                fontSize: "13px",
                                fontWeight: "normal",
                                color: "#dddddd",
                            }}
                        >
                            {FormatDateTime(postDetail.createdAt)}
                        </span>
                    </p>
                </div>
                <div
                    style={{
                        maxHeight: "35vh",
                        overflow: "auto",
                    }}
                >
                    {postImages?.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt=""
                            style={{
                                width: "100%",
                                height: "150px",
                                objectFit: "cover",
                                marginBottom: "10px",
                            }}
                        />
                    ))}
                </div>
                <p>
                    {postDetail?.content?.length > 200 && !isShowAll ? (
                        <>
                            {TruncateText(postDetail.content, 200)}
                            <span
                                onClick={(e) => {
                                    toggleShowAll();
                                    e.stopPropagation();
                                }}
                                style={{
                                    textDecoration: "underline",
                                    cursor: "pointer",
                                }}
                            >
                                {" "}
                                Xem thêm
                            </span>
                        </>
                    ) : (
                        <>
                            <div
                                style={{
                                    maxHeight: "20vh",
                                    overflow: "auto",
                                }}
                            >
                                {postDetail?.content}
                            </div>
                            {isShowAll && (
                                <span
                                    onClick={(e) => {
                                        toggleShowAll();
                                        e.stopPropagation();
                                    }}
                                    style={{
                                        textDecoration: "underline",
                                        cursor: "pointer",
                                    }}
                                >
                                    {" "}
                                    Rút gọn
                                </span>
                            )}
                        </>
                    )}
                </p>
            </Box>
        </Backdrop>
    );
}

export function CommentBackDrop(props) {
    const commentOpen = props.commentOpen;
    const handleCommentClose = props.handleCommentClose;
    const commentDetail = props.commentDetail;

    return (
        <Backdrop
            sx={{
                color: "#fff",
                zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            open={commentOpen}
            onClick={handleCommentClose}
        >
            <Box sx={style}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "30px",
                    }}
                >
                    <img
                        style={{
                            width: "100px",
                            height: "100px",
                            borderRadius: "50px",
                            objectFit: "cover",
                        }}
                        src={commentDetail.commentorImage}
                        alt=""
                    />
                    <p
                        style={{
                            fontSize: "20px",
                            fontWeight: "600",
                            textTransform: "capitalize",
                        }}
                    >
                        {commentDetail.commentorName}
                        <br />
                        <span
                            style={{
                                fontSize: "13px",
                                fontWeight: "normal",
                                color: "#dddddd",
                            }}
                        >
                            {FormatDateTime(commentDetail.createdAt)}
                        </span>
                    </p>
                </div>
                <div
                    style={{
                        maxHeight: "20vh",
                        overflow: "auto",
                    }}
                >
                    <p>{commentDetail.content}</p>
                </div>
            </Box>
        </Backdrop>
    );
}

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "#121d3c",
    boxShadow: 24,
    p: 4,
};
