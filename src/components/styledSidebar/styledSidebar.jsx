import { useTheme } from "@mui/material";
import { tokens } from "../../theme";

export const StyledSidebar = () => {
    const theme = useTheme();

    const colors = tokens(theme.palette.mode);
    return {
        "& .pro-sidebar-inner": {
            background: `${colors.primary[500]} !important`,
        },
        "& .pro-icon-wrapper": {
            backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
            padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
            color: "#70d8bd !important",
        },
        "& .pro-menu-item.active": {
            color: "#70d8bd !important",
        },
    };
};
