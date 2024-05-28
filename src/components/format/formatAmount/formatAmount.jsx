export function FormatAmount(amount, id, wallet, userData) {
    const thisTransaction = wallet.transactions?.find(
        (transaction) => transaction.id === id
    );
    const check = userData.id === thisTransaction?.creator?.id;
    let formattedAmount = amount;
    if (check) {
        if (thisTransaction.transactionType !== "TopUp") {
            formattedAmount = `- ${amount}`;
        } else {
            formattedAmount = `+ ${amount}`;
        }
    } else {
        formattedAmount = `+ ${amount}`;
    }
    return formattedAmount;
}

export function FormatAmountForShop(
    amount,
    id,
    transactionsFromShop,
    userData
) {
    const thisTransaction = transactionsFromShop?.find(
        (transaction) => transaction.id === id
    );
    const check = userData.id === thisTransaction.creator?.id;
    let formattedAmount = amount;
    if (check) {
        if (thisTransaction.transactionType !== "TopUp") {
            formattedAmount = `- ${amount}`;
        } else {
            formattedAmount = `+ ${amount}`;
        }
    } else {
        formattedAmount = `+ ${amount}`;
    }
    return formattedAmount;
}

export const FormatCurrency = (value) => {
    if (isNaN(value) || value === "") {
        return "";
    }
    const numberValue = parseFloat(value);
    return numberValue?.toLocaleString();
};
