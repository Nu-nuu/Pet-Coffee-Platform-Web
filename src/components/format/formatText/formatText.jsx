export const TruncateText = (text, maxLength) => {
    if (text?.length > maxLength) {
        return text?.substring(0, maxLength) + "...";
    } else {
        return text;
    }
};

export function FormatPhoneNumber(phoneNumber) {
    const digitsOnly = phoneNumber?.replace(/\D/g, "");
    const formattedNumber = digitsOnly?.replace(
        /(\d{4})(\d{3})(\d{3})/,
        "$1.$2.$3"
    );
    return formattedNumber;
}
