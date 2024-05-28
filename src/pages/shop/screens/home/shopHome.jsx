import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "../../../../theme";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import { useDispatch } from "react-redux";
import { getUserDataThunk } from "../../../../store/apiThunk/userThunk";

export default function ShopHome() {
    const [theme, colorMode] = useMode();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [check, setCheck] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [pageEntered, setPageEntered] = useState(false);

    useEffect(() => {
        setPageEntered(true);
    }, [location]);

    useEffect(() => {
        if (pageEntered) {
            const hasToken = localStorage.getItem("accessToken");
            if (!hasToken) {
                setCheck(true);
                navigate("/");
            } else {
                dispatch(getUserDataThunk());
            }
        }
    }, [pageEntered, navigate, dispatch]);

    return (
        <div style={{ display: "flex" }}>
            <ColorModeContext.Provider value={colorMode}>
                {!check && (
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <Sidebar
                            isCollapsed={isCollapsed}
                            setIsCollapsed={setIsCollapsed}
                        />
                        <div
                            className="component"
                            style={{
                                width: isCollapsed === true ? "100%" : "82.3%",
                            }}
                        >
                            <Topbar />
                            <Outlet />
                        </div>
                    </ThemeProvider>
                )}
            </ColorModeContext.Provider>
        </div>
    );
}
