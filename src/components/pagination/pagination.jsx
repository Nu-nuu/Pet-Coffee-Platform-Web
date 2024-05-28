import { Box, IconButton, FormControl, Select, MenuItem } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useEffect } from "react";

export default function Pagination(props) {
    const data = props.data;
    const pageSize = props.pageSize;
    const setPageSize = props.setPageSize;
    const pageNumber = props.pageNumber;
    const setPageNumber = props.setPageNumber;

    useEffect(() => {
        if (data?.items?.length === 0 && pageNumber > 1) {
            setPageNumber(1);
        }
    }, [data?.items?.length, pageNumber, setPageNumber]);

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="30%"
            gap="30px"
        >
            <FormControl style={{ width: "20%" }} size="small">
                <Select
                    id="pageSize"
                    name="pageSize"
                    value={pageSize}
                    onChange={(e) => setPageSize(e.target.value)}
                    color="secondary"
                >
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={30}>30</MenuItem>
                </Select>
            </FormControl>
            <Box display="flex" justifyContent="center" alignItems="center">
                <IconButton
                    disabled={!data.hasPrevious}
                    onClick={() => setPageNumber(pageNumber - 1)}
                >
                    <ArrowBackIcon fontSize="medium" />
                </IconButton>
                <span style={{ margin: "0 10px" }}>
                    Trang {pageNumber} của{" "}
                    {data.totalPages !== 0 ? data.totalPages : 1}
                </span>
                <IconButton
                    disabled={!data.hasNext}
                    onClick={() => setPageNumber(pageNumber + 1)}
                >
                    <ArrowForwardIcon fontSize="medium" />
                </IconButton>
            </Box>
        </Box>
    );
}
