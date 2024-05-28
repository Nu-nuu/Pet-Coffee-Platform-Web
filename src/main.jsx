import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { store } from "./store";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/authorize/login/login";
import Signup from "./pages/authorize/signup/signup";
import ForgotPassword from "./pages/authorize/forgotPassword/forgotPassword";
import VerifyAccount from "./pages/authorize/verifyAccount/verifyAccount";
import NewPassword from "./pages/authorize/newPassword/newPassword";
import TransferStatus from "./pages/authorize/transferStatus/transferStatus";
import Error404 from "./pages/error404/error404";
import CreateShop from "./pages/authorize/createShop/createShop";
import BecomeManager from "./pages/authorize/becomeManager/becomeManager";
import LandingPage from "./pages/authorize/landingPage/landingPage";
import ChangePassword from "./pages/authorize/changePassword/changePassword";
//Admin
import AdminHome from "./pages/admin/screens/home/adminHome";
import AccountTable from "./pages/admin/screens/account/accountTable";
import WalletTableAdmin from "./pages/admin/screens/wallet/walletTable";
import AdminDashboard from "./pages/admin/screens/dashboard/dashboardPage/dashboard";
import AdminDashboardDetail from "./pages/admin/screens/dashboard/dashboardDetail/dashboardDetail";
//Manager
import CreateShopManager from "./pages/manager/screens/shop/createShop/createShop";
import ManagerHome from "./pages/manager/screens/home/managerHome";
import ShopTable from "./pages/manager/screens/shop/shopTable/shopTable";
import UpdateShop from "./pages/manager/screens/shop/updateShop/updateShop";
import ManagerProfile from "./pages/manager/screens/profile/profile";
import WalletTable from "./pages/manager/screens/wallet/walletTable";
import OrderTable from "./pages/manager/screens/order/orderTable";
import ManagerDashboard from "./pages/manager/screens/dashboard/dashboardPage/dashboard";
import DashboardDetail from "./pages/manager/screens/dashboard/dashboardDetail/dashboardDetail";
//Shop
import ShopHome from "./pages/shop/screens/home/shopHome";
import ShopProfile from "./pages/shop/screens/profile/profile";
import PackagePage from "./pages/shop/screens/package/packagePage";
import StaffTable from "./pages/shop/screens/staff/staffTable/staffTable";
import EventTable from "./pages/shop/screens/event/eventTable/eventTable";
import CreateStaff from "./pages/shop/screens/staff/createStaff/createStaff";
import CreateEvent from "./pages/shop/screens/event/createEvent/createEvent";
import CreateEventField from "./pages/shop/screens/event/createEventField/createEventField";
import UpdateEvent from "./pages/shop/screens/event/updateEvent/updateEvent";
import EventDetail from "./pages/shop/screens/event/eventDetail/eventDetail";
import TransactionTable from "./pages/shop/screens/transaction/transactionTable";
import OrderTableShop from "./pages/shop/screens/order/orderTable";
import ShopDashboardDetail from "./pages/shop/screens/dashboard/dashboardDetail/dashboardDetail";
import ShopDashboard from "./pages/shop/screens/dashboard/dashboardPage/dashboard";
import ProductTable from "./pages/shop/screens/product/productTable/productTable";
import CreateProduct from "./pages/shop/screens/product/createProduct/createProduct";
import UpdateProduct from "./pages/shop/screens/product/updateProduct/updateProduct";
import PromotionTable from "./pages/shop/screens/promotion/promotionTable/promotionTable";
import CreatePromotion from "./pages/shop/screens/promotion/createPromotion/createPromotion";
import UpdatePromotion from "./pages/shop/screens/promotion/updatePromotion/updatePromotion";
import ShopReportTable from "./pages/shop/screens/report/reportTable";
import ChangePasswordStaff from "./pages/shop/screens/staff/changePasswordStaff/changePasswordStaff";
//Staff
import StaffHome from "./pages/platformStaff/screens/home/staffHome";
import ShopTableStaff from "./pages/platformStaff/screens/shop/shopTable";
import ReportTable from "./pages/platformStaff/screens/report/reportTable";
import ItemTable from "./pages/platformStaff/screens/item/itemTable/itemTable";
import CreateItem from "./pages/platformStaff/screens/item/createItem/createItem";
import UpdateItem from "./pages/platformStaff/screens/item/updateItem/updateItem";
import CreatePackage from "./pages/platformStaff/screens/package/createPackage/createPackage";
import UpdatePackage from "./pages/platformStaff/screens/package/updatePackage/updatePackage";
import PackageTable from "./pages/platformStaff/screens/package/packageTable/packageTable";

const router = createBrowserRouter([
    {
        path: "",
        element: <LandingPage />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/newPassword",
        element: <NewPassword />,
    },
    {
        path: "/forgotPassword",
        element: <ForgotPassword />,
    },
    {
        path: "/becomeManager",
        element: <BecomeManager />,
    },
    {
        path: "/signup",
        element: <Signup />,
    },
    {
        path: "/verifyAccount",
        element: <VerifyAccount />,
    },
    {
        path: "/error404",
        element: <Error404 />,
    },
    {
        path: "/createShop",
        element: <CreateShop />,
    },
    {
        path: "/transferStatus",
        element: <TransferStatus />,
    },
    //Admin
    {
        path: "/admin",
        element: <AdminHome />,
        errorElement: <Error404 />,
        children: [
            {
                path: "",
                element: <AdminDashboard />,
            },
            {
                path: "dashboardDetail",
                element: <AdminDashboardDetail />,
            },
            {
                path: "account",
                element: <AccountTable />,
            },
            {
                path: "wallet",
                element: <WalletTableAdmin />,
            },
            {
                path: "shop",
                element: <ShopTableStaff />,
            },
            {
                path: "item",
                element: <ItemTable direction="admin" />,
            },
            {
                path: "report",
                element: <ReportTable />,
            },
            {
                path: "package",
                element: <PackageTable direction="admin" />,
            },
            {
                path: "createItem",
                element: <CreateItem />,
            },
            {
                path: "updateItem",
                element: <UpdateItem />,
            },
            {
                path: "updatePackage",
                element: <UpdatePackage />,
            },
            {
                path: "createPackage",
                element: <CreatePackage />,
            },
        ],
    },
    //Staff
    {
        path: "/staff",
        element: <StaffHome />,
        errorElement: <Error404 />,
        children: [
            {
                path: "",
                element: <ShopTableStaff />,
            },
            {
                path: "item",
                element: <ItemTable direction="staff" />,
            },
            {
                path: "report",
                element: <ReportTable />,
            },
            {
                path: "package",
                element: <PackageTable direction="staff" />,
            },
            {
                path: "createItem",
                element: <CreateItem />,
            },
            {
                path: "updateItem",
                element: <UpdateItem />,
            },
            {
                path: "updatePackage",
                element: <UpdatePackage />,
            },
            {
                path: "createPackage",
                element: <CreatePackage />,
            },
        ],
    },
    //Manager
    {
        path: "/manager",
        element: <ManagerHome />,
        errorElement: <Error404 />,
        children: [
            {
                path: "",
                element: <ManagerDashboard />,
            },
            {
                path: "shop",
                element: <ShopTable />,
            },
            {
                path: "dashboardDetail",
                element: <DashboardDetail />,
            },
            {
                path: "profile",
                element: <ManagerProfile />,
            },
            {
                path: "wallet",
                element: <WalletTable />,
            },
            {
                path: "order",
                element: <OrderTable />,
            },
            {
                path: "updateShop",
                element: <UpdateShop />,
            },
            {
                path: "createShopManager",
                element: <CreateShopManager />,
            },
            {
                path: "changePassword",
                element: <ChangePassword />,
            },
        ],
    },
    //Shop
    {
        path: "/shop",
        element: <ShopHome />,
        errorElement: <Error404 />,
        children: [
            {
                path: "",
                element: <ShopDashboard />,
            },
            {
                path: "dashboardDetail",
                element: <ShopDashboardDetail />,
            },
            {
                path: "staff",
                element: <StaffTable />,
            },
            {
                path: "event",
                element: <EventTable />,
            },
            {
                path: "profile",
                element: <ShopProfile />,
            },
            {
                path: "transaction",
                element: <TransactionTable />,
            },
            {
                path: "order",
                element: <OrderTableShop />,
            },
            {
                path: "package",
                element: <PackagePage />,
            },
            {
                path: "createStaff",
                element: <CreateStaff />,
            },
            {
                path: "changePasswordStaff",
                element: <ChangePasswordStaff />,
            },
            {
                path: "createEvent",
                element: <CreateEvent />,
            },
            {
                path: "createEventField",
                element: <CreateEventField />,
            },
            {
                path: "updateEvent",
                element: <UpdateEvent />,
            },
            {
                path: "eventDetail",
                element: <EventDetail />,
            },
            {
                path: "product",
                element: <ProductTable />,
            },
            {
                path: "createProduct",
                element: <CreateProduct />,
            },
            {
                path: "updateProduct",
                element: <UpdateProduct />,
            },
            {
                path: "promotion",
                element: <PromotionTable />,
            },
            {
                path: "createPromotion",
                element: <CreatePromotion />,
            },
            {
                path: "updatePromotion",
                element: <UpdatePromotion />,
            },
            {
                path: "report",
                element: <ShopReportTable />,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>
);
