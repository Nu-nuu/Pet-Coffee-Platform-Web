import { configureStore } from "@reduxjs/toolkit";

import { userDetailSlice } from "./features/user.slice/userDetail.slice";
import { userDataSlice } from "./features/user.slice/userData.slice";
import { staffsSlice } from "./features/user.slice/staffs.slice";
import { allAccountsSlice } from "./features/user.slice/allAccounts.slice";

import { petDetailSlice } from "./features/pet.slice/petDetail.slice";
import { petsFromShopSlice } from "./features/pet.slice/petsFromShop.slice";
import { petsFromAreaSlice } from "./features/pet.slice/petsFromArea.slice";

import { areasFromShopSlice } from "./features/area.slice/areasFromShop.slice";
import { areaDetailSlice } from "./features/area.slice/areaDetail.slice";

import { eventDetailSlice } from "./features/event.slice/eventDetail.slice";
import { eventsFromShopSlice } from "./features/event.slice/eventsFromShop.slice";
import { eventDetailForCustomerSlice } from "./features/event.slice/eventDetailForCustomer.slice";
import { joinEventsSlice } from "./features/event.slice/joinEvents.slice";
import { allEventSubmitsSlice } from "./features/event.slice/allEventSubmits.slice";

import { momentsFromPetSlice } from "./features/moment.slice/momentsFromPet.slice";
import { momentDetailSlice } from "./features/moment.slice/momentDetail.slice";

import { commentSlice } from "./features/comment.slice/comment.slice";
import { replySlice } from "./features/comment.slice/reply.slice";
import { commentDetailSlice } from "./features/comment.slice/commentDetail.slice";
import { postCategorySlice } from "./features/postCategory.slice/postCategory.slice";

import { vaccinationsFromPetSlice } from "./features/vaccination.slice/vaccinationsFromPet.slice";
import { vaccinationDetailSlice } from "./features/vaccination.slice/vaccinationDetail";

import { petCoffeeShopDetailSlice } from "./features/petCoffeeShop.slice/petCoffeeShopDetail.slice";
import { allPetCoffeeShopsSlice } from "./features/petCoffeeShop.slice/allPetCoffeeShops.slice";
import { petCoffeeShopsSlice } from "./features/petCoffeeShop.slice/petCoffeeShops.slice";
import { petCoffeeShopTaxCodeSlice } from "./features/petCoffeeShop.slice/petCoffeeShopTaxCode.slice";
import { popularPetCoffeeShopsSlice } from "./features/petCoffeeShop.slice/popularPetCoffeeShops.slice";
import { randomPetCoffeeShopsSlice } from "./features/petCoffeeShop.slice/randomPetCoffeeShops.slice";

import { postDetailSlice } from "./features/post.slice/postDetail.slice";
import { postSlice } from "./features/post.slice/post.slice";

import { allFollowShopsSlice } from "./features/followPetCoffeeShop.slice/allFollowShops.slice";

import { allItemsSlice } from "./features/item.slice/allItems.slice";
import { itemDetailSlice } from "./features/item.slice/itemDetail.slice";
import { itemsFromUserSlice } from "./features/item.slice/itemsFromUser.slice";

import { walletSlice } from "./features/wallet.slice/wallet.slice";
import { managerIncomeSlice } from "./features/wallet.slice/managerIncome.slice";
import { managerOutcomeSlice } from "./features/wallet.slice/managerOutcome.slice";
import { managerMonthIncomeSlice } from "./features/wallet.slice/managerMonthIncome.slice";
import { managerMonthOutcomeSlice } from "./features/wallet.slice/managerMonthOutcome.slice";
import { shopMonthIncomeSlice } from "./features/wallet.slice/shopMonthIncome.slice";
import { shopMonthOutcomeSlice } from "./features/wallet.slice/shopMonthOutcome.slice";
import { shopOutcomeSlice } from "./features/wallet.slice/shopOutcome.slice";
import { shopIncomeSlice } from "./features/wallet.slice/shopIncome.slice";
import { platformIncomeSlice } from "./features/wallet.slice/platformIncome.slice";
import { platformMonthIncomeSlice } from "./features/wallet.slice/platformMonthIncome.slice";

import { packagesSlice } from "./features/package.slice/packages.slice";
import { packageDetailSlice } from "./features/package.slice/packageDetail.slice";

import { allReportsSlice } from "./features/report.slice/allReports.slice";
import { shopReportsSlice } from "./features/report.slice/shopReports.slice";

import { transactionDetailSlice } from "./features/transaction.slice/transactionDetail.slice";
import { transactionsFromShopSlice } from "./features/transaction.slice/transactionsFromShop.slice";

import { allOrdersSlice } from "./features/order.slice/allOrders.slice";
import { ordersFromShopSlice } from "./features/order.slice/ordersFromShop.slice";
import { orderDetailSlice } from "./features/order.slice/orderDetail.slice";

import { allNotificationsSlice } from "./features/notification.slice/allNotifications.slice";
import { unreadNotificationsSlice } from "./features/notification.slice/unreadNotifications.slice";

import { promotionDetailSlice } from "./features/promotion.slice/promotionDetail.slice";
import { promotionsFromShopSlice } from "./features/promotion.slice/promotionsFromShop.slice";

import { productDetailSlice } from "./features/product.slice/productDetail.slice";
import { productsFromShopSlice } from "./features/product.slice/productsFromShop.slice";

export const store = configureStore({
    reducer: {
        userDetail: userDetailSlice.reducer,
        userData: userDataSlice.reducer,
        staffs: staffsSlice.reducer,
        allAccounts: allAccountsSlice.reducer,

        petDetail: petDetailSlice.reducer,
        petsFromShop: petsFromShopSlice.reducer,
        petsFromArea: petsFromAreaSlice.reducer,

        petCoffeeShopDetail: petCoffeeShopDetailSlice.reducer,
        allPetCoffeeShops: allPetCoffeeShopsSlice.reducer,
        petCoffeeShops: petCoffeeShopsSlice.reducer,
        petCoffeeShopTaxCode: petCoffeeShopTaxCodeSlice.reducer,
        popularPetCoffeeShops: popularPetCoffeeShopsSlice.reducer,
        randomPetCoffeeShops: randomPetCoffeeShopsSlice.reducer,

        allFollowShops: allFollowShopsSlice.reducer,

        reply: replySlice.reducer,
        comment: commentSlice.reducer,
        commentDetail: commentDetailSlice.reducer,

        postCategory: postCategorySlice.reducer,

        areasFromShop: areasFromShopSlice.reducer,
        areaDetail: areaDetailSlice.reducer,

        eventDetail: eventDetailSlice.reducer,
        eventsFromShop: eventsFromShopSlice.reducer,
        eventDetailForCustomer: eventDetailForCustomerSlice.reducer,
        joinEvents: joinEventsSlice.reducer,
        allEventSubmits: allEventSubmitsSlice.reducer,

        momentsFromPet: momentsFromPetSlice.reducer,
        momentDetail: momentDetailSlice.reducer,

        vaccinationsFromPet: vaccinationsFromPetSlice.reducer,
        vaccinationDetail: vaccinationDetailSlice.reducer,

        postDetail: postDetailSlice.reducer,
        post: postSlice.reducer,

        allItems: allItemsSlice.reducer,
        itemDetail: itemDetailSlice.reducer,
        itemsFromUser: itemsFromUserSlice.reducer,

        wallet: walletSlice.reducer,
        shopMonthIncome: shopMonthIncomeSlice.reducer,
        managerMonthIncome: managerMonthIncomeSlice.reducer,
        managerMonthOutcome: managerMonthOutcomeSlice.reducer,
        shopMonthOutcome: shopMonthOutcomeSlice.reducer,
        managerIncome: managerIncomeSlice.reducer,
        managerOutcome: managerOutcomeSlice.reducer,
        shopOutcome: shopOutcomeSlice.reducer,
        shopIncome: shopIncomeSlice.reducer,
        platformIncome: platformIncomeSlice.reducer,
        platformMonthIncome: platformMonthIncomeSlice.reducer,

        packages: packagesSlice.reducer,
        packageDetail: packageDetailSlice.reducer,

        allReports: allReportsSlice.reducer,
        shopReports: shopReportsSlice.reducer,

        transactionDetail: transactionDetailSlice.reducer,
        transactionsFromShop: transactionsFromShopSlice.reducer,

        allOrders: allOrdersSlice.reducer,
        ordersFromShop: ordersFromShopSlice.reducer,
        orderDetail: orderDetailSlice.reducer,

        allNotifications: allNotificationsSlice.reducer,
        unreadNotifications: unreadNotificationsSlice.reducer,

        promotionDetail: promotionDetailSlice.reducer,
        promotionsFromShop: promotionsFromShopSlice.reducer,

        productDetail: productDetailSlice.reducer,
        productsFromShop: productsFromShopSlice.reducer,
    },
});
