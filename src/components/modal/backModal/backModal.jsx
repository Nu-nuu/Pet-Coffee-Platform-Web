import React from "react";
import Button from "@mui/material/Button";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./backModal.css";
import {
    CANCELADD,
    CANCELTEXT,
    CANCELUPDATE,
    CLOSETEXT,
    CONFIRMTEXT,
} from "../../text/notiText/notiText";

export function BackButton(props) {
    const navigate = useNavigate();
    const toggleUpdate = props.toggleUpdate;
    const type = props.type;

    const handleBack = () => {
        Swal.fire({
            icon: "warning",
            title: `${type !== "update" ? CANCELADD : CANCELUPDATE}`,
            text: CONFIRMTEXT,
            showDenyButton: true,
            showCancelButton: true,
            showConfirmButton: false,
            denyButtonText: CANCELTEXT,
            cancelButtonText: CLOSETEXT,
            denyButtonColor: "#af3f3b",
        }).then((result) => {
            if (result.isDenied) {
                !toggleUpdate ? navigate(-1) : toggleUpdate();
            }
        });
    };

    return (
        <div className="backModal">
            <Button
                className="back_btn"
                variant="contained"
                onClick={handleBack}
            >
                Quay Lại
            </Button>
        </div>
    );
}
