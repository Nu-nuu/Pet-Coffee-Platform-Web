import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { userDataSelector } from "../../store/sellectors";

export function FilterComponent(props) {
    const label = props.label;
    const name = props.name;
    const role = props.role;
    const setRole = props.setRole;
    const type = props.type;
    const setType = props.setType;
    const shopType = props.shopType;
    const setShopType = props.setShopType;
    const shopName = props.shopName;
    const setShopName = props.setShopName;
    const [data, setData] = useState([]);
    const userData = useSelector(userDataSelector);
    const shopNameData = userData?.shopResponses?.map((item) => ({
        label: item.name,
        value: item.id,
    }));

    useEffect(() => {
        switch (name) {
            case "role":
                setData(accountData);
                break;
            case "type":
                setData(typeData);
                break;
            case "shopType":
                setData(shopTypeData);
                break;
            case "shopName":
                setData(shopNameData);
                break;
            default:
                break;
        }
    }, [name]);

    const handleChange = (e) => {
        if (name === "role") {
            setRole(e.target.value);
        } else if (name === "type") {
            setType(e.target.value);
        } else if (name === "shopType") {
            setShopType(e.target.value);
        } else if (name === "shopName") {
            setShopName(e.target.value);
        }
    };

    return (
        <FormControl style={{ width: "13%", marginBottom: "20px" }}>
            <InputLabel id={name} color="secondary">
                <span>{label}</span>
            </InputLabel>
            <Select
                id={name}
                name={name}
                value={role || type || shopType || shopName}
                label={label}
                onChange={handleChange}
                color="secondary"
            >
                <MenuItem value={"all"}>Tất Cả</MenuItem>
                {data?.map((item, index) => (
                    <MenuItem value={item?.value} key={index}>
                        {item?.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

const shopTypeData = [
    {
        value: "Cat",
        label: "Cà Phê Mèo",
    },
    {
        value: "Dog",
        label: "Cà Phê Chó",
    },
    {
        value: "CatAndDog",
        label: "Cà Phê Mèo Và Chó",
    },
];

const accountData = [
    {
        value: "Customer",
        label: "Khách Hàng",
    },
    {
        value: "Manager",
        label: "Quản Lý Cửa Hàng",
    },
    {
        value: "Staff",
        label: "Nhân Viên Cửa Hàng",
    },
    {
        value: "PlatformStaff",
        label: "Nhân Viên Hệ Thống",
    },
];

const typeData = [
    {
        value: "AddProducts",
        label: "Đặt Đồ Uống",
    },
    {
        value: "TopUp",
        label: "Nạp Tiền",
    },
    {
        value: "Reserve",
        label: "Đặt Chỗ",
    },
    {
        value: "Refund",
        label: "Hoàn Tiền",
    },
    {
        value: "Donate",
        label: "Ủng Hộ",
    },
    {
        value: "RemoveProducts",
        label: "Hủy Đồ Uống",
    },
    {
        value: "Package",
        label: "Mua Gói",
    },
];
