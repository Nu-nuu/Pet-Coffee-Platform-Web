import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../../../../theme";

const Header = ({ direction, title, subtitle }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const check = direction === "dashboard" || direction === "dashboardDetail";
    return (
        <div style={{ marginBottom: !check ? "30px" : 0 }}>
            <Typography
                variant="h2"
                color={colors.grey[100]}
                fontWeight="bold"
                sx={{ m: "0 0 5px 0" }}
                textTransform="uppercase"
            >
                {title}
            </Typography>
            <Typography
                variant="h5"
                color={colors.greenAccent[400]}
                textTransform="capitalize"
            >
                {subtitle}
            </Typography>
        </div>
    );
};

export default Header;
