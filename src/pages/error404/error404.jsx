import React from "react";
import Button from "@mui/material/Button";
import "./error404.css";
import { useNavigate } from "react-router-dom";

export default function Error404() {
    const navigate = useNavigate();

    return (
        <div className="error404">
            <div className="header">Ôi không! Có gì đó bị sai!</div>
            <section className="error__container">
                <span className="four">
                    <span className="screen__reader__text">4</span>
                </span>
                <span className="zero">
                    <span className="screen__reader__text">0</span>
                </span>
                <span className="four">
                    <span className="screen__reader__text">4</span>
                </span>
            </section>
            <div
                style={{ textAlign: "left", width: "100%", marginLeft: "40px" }}
            >
                <Button
                    className="back_btn"
                    variant="contained"
                    onClick={() => navigate(-1)}
                >
                    Quay Lại
                </Button>
            </div>
        </div>
    );
}
