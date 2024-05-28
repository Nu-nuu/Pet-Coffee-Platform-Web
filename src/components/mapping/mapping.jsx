import { tokens } from "../../theme";
import { useTheme } from "@mui/material";

export const AccRole = (role) => {
    const roleMapping = {
        Customer: "Khách Hàng",
        Manager: "Quản Lý Cửa Hàng",
        Staff: "Nhân Viên Cửa Hàng",
        PlatformStaff: "Nhân Viên Hệ Thống",
    };
    return roleMapping[role] || role;
};

export const TransactionType = (type) => {
    const typeMapping = {
        TopUp: "Nạp Tiền",
        Reserve: "Đặt Chỗ",
        Refund: "Hoàn Tiền",
        Donate: "Ủng Hộ",
        AddProducts: "Đặt Đồ Uống",
        Package: "Mua Gói",
        BuyItem: "Mua Quà Tặng",
        RemoveProducts: "Hủy Đồ Uống",
    };
    return typeMapping[type] || type;
};

export const TransactionStatus = (type) => {
    const typeMapping = {
        Cancel: "Đã Hủy",
        Processing: "Đang Xử Lý",
        Done: "Hoàn Thành",
        Return: "Đã Hoàn Tiền",
    };
    return typeMapping[type] || type;
};

export const PetType = (type) => {
    const typeMapping = {
        Cat: "Cà Phê Mèo",
        Dog: "Cà Phê Chó",
        CatAndDog: "Cà Phê Mèo Và Chó",
    };
    return typeMapping[type] || type;
};

export const ShopStatus = (status) => {
    const statusMapping = {
        Active: "Hoạt Động",
        Processing: "Đang Xử Lý",
        InActive: "Vô Hiệu",
    };
    return statusMapping[status] || status;
};

export const StaffStatus = (status) => {
    const statusMapping = {
        Active: "Hoạt Động",
        Inactive: "Vô Hiệu",
    };
    return statusMapping[status] || status;
};

export const EventStatus = (status, startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (status !== "Opened") {
        return "Đã Hủy";
    } else {
        if (start > now) {
            return "Chưa Diễn Ra";
        } else if (start <= now && now <= end) {
            return "Đang Diễn Ra";
        } else if (end < now) {
            return "Đã Diễn Ra";
        } else {
            return status;
        }
    }
};

export const EventColor = (status, startDate, endDate) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const eventStatus = EventStatus(status, startDate, endDate);

    if (eventStatus === "Đang Diễn Ra") {
        return "#55ab95";
    } else if (eventStatus === "Chưa Diễn Ra") {
        return "#b8b800";
    } else if (eventStatus === "Đã Diễn Ra") {
        return colors.grey[600];
    } else {
        return colors.redAccent[600];
    }
};

export const ReportReason = (reason) => {
    const reasonMapping = {
        Violence: "Bạo lực",
        NudePhotos: "Hình ảnh nhạy cảm",
        Suicidal: "Nguy hiểm",
        AppearTooMuch: "Xuất hiện quá nhiều lần",
        TooPrivate: "Quá riêng tư",
        SensitiveContent: "Nội dung không phù hợp",
        NotSuitable: "Không phù hợp",
        Other: "Khác",
    };
    return reasonMapping[reason] || reason;
};

export const ReportStatus = (status) => {
    const statusMapping = {
        Reject: "Từ Chối",
        Processing: "Đang Xử Lý",
        Accept: "Chấp Nhận",
    };
    return statusMapping[status] || status;
};