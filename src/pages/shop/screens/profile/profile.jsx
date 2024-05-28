import React, { useEffect } from "react";
import "./profile.css";
import { useDispatch, useSelector } from "react-redux";
import { petCoffeeShopDetailSelector } from "../../../../store/sellectors";
import { getPetCoffeeShopDetailThunk } from "../../../../store/apiThunk/petCoffeeShopThunk";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
    FormatTime,
    FormatTimeDifference,
} from "../../../../components/format/formatDatetime/formatDatetime";
import { FormatPhoneNumber } from "../../../../components/format/formatText/formatText";
import { PetType } from "../../../../components/mapping/mapping";
import LoadingModal from "../../../../components/modal/loadingModal/loadingModal";

export default function ShopProfile() {
    const location = useLocation();
    const shopId = location.state?.shopId;
    const thisShop = useSelector(petCoffeeShopDetailSelector);
    const dispatch = useDispatch();

    const [showLoadingModal, setShowLoadingModal] = useState(false);

    useEffect(() => {
        setShowLoadingModal(true);
        dispatch(
            getPetCoffeeShopDetailThunk({
                id: shopId,
                longitude: 1,
                latitude: 1,
            })
        ).then(() => setShowLoadingModal(false));
    }, [shopId]);

    return !showLoadingModal ? (
        <div className="shopProfile">
            <div style={{ position: "relative" }}>
                <img src={thisShop.avatarUrl} alt="" className="avatar" />
                <img
                    src={thisShop.backgroundUrl}
                    alt=""
                    className="background"
                />
            </div>
            <div className="role">
                {thisShop.status === "Active" ? "Hoạt Động" : "Vô Hiệu"}
            </div>
            <div className="flex-column">
                <div className="field">
                    <span className="span">Thời Gian Còn Lại: </span>
                    {FormatTimeDifference(thisShop.endTimePackage)}
                </div>
                <div className="field">
                    <span className="span">Tên Cửa Hàng: </span>
                    {thisShop.name}
                </div>
                <div className="field">
                    <span className="span">Email: </span>
                    {thisShop.email}
                </div>
                <div className="field">
                    <span className="span">Số Điện Thoại: </span>
                    {FormatPhoneNumber(thisShop.phone) || ""}
                </div>
                <div className="field">
                    <span className="span">Địa Chỉ: </span>
                    <span>{thisShop.location}</span>
                </div>
                <div className="field">
                    <span className="span">Loại Cửa Hàng: </span>
                    {PetType(thisShop.type)}
                </div>
                <div className="field">
                    <span className="span">Giờ Mở Cửa: </span>
                    {FormatTime(thisShop.startTime) || ""}
                </div>
                <div className="field">
                    <span className="span">Giờ Đóng Cửa: </span>
                    {FormatTime(thisShop.endTime) || ""}
                </div>
                <div className="field">
                    <span className="span">Mã Số Thuế: </span>
                    {thisShop.taxCode}
                </div>
                <div className="field">
                    <span className="span">Số Người Theo Dõi: </span>
                    {thisShop.totalFollow}
                </div>
                <div className="field">
                    <span className="span">Facebook: </span>
                    <Link to={thisShop.fbUrl} target="_blank" className="link">
                        {thisShop.fbUrl}
                    </Link>
                </div>
                <div className="field">
                    <span className="span">Instagram: </span>
                    <Link
                        to={thisShop.instagramUrl}
                        target="_blank"
                        className="link"
                    >
                        {thisShop.instagramUrl}
                    </Link>
                </div>
                <div className="field">
                    <span className="span">Trang Chủ: </span>
                    <Link
                        to={thisShop.websiteUrl}
                        target="_blank"
                        className="link"
                    >
                        {thisShop.websiteUrl}
                    </Link>
                </div>
            </div>
        </div>
    ) : (
        <LoadingModal />
    );
}
