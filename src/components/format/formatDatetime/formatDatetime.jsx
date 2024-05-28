import { DateTime } from "luxon";

export function FormatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    const offsetHours = 7;
    const localHours = date.getUTCHours() + offsetHours;
    let day = date.getUTCDate();
    let month = date.getUTCMonth() + 1;
    let year = date.getUTCFullYear();
    if (localHours >= 24) {
        day += 1;
        if (day > new Date(year, month, 0).getDate()) {
            day = 1;
            month += 1;
            if (month > 12) {
                month = 1;
                year += 1;
            }
        }
    }
    const hours = String(localHours % 24).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    day = String(day).padStart(2, "0");
    month = String(month).padStart(2, "0");
    return `${hours}:${minutes} ${day}/${month}/${year}`;
}

export const FormatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `ngày ${day} tháng ${month} năm ${year}`;
};

export const FormatVietnamTime = (dateString) => {
    const date = DateTime.fromISO(dateString).minus({ hours: 7 });
    const vietnamTime = date.toFormat("HH:mm");
    return vietnamTime;
};

export const FormatVietnamHour = (dateString) => {
    const date = DateTime.fromISO(dateString).minus({ hours: 7 });
    const vietnamTime = date.toFormat("HH");
    return vietnamTime;
};

export function FormatTime(timeString) {
    const [hours, minutes] = timeString?.split(":") || "";
    return `${hours}:${minutes}`;
}

export function FormatTimeDifference(timestamp) {
    const currentTime = new Date();
    const targetTime = new Date(timestamp);
    const timeDifference = targetTime - currentTime;

    const secondsDifference = Math.floor(timeDifference / 1000);
    const minutesDifference = Math.floor(secondsDifference / 60);
    const hoursDifference = Math.floor(minutesDifference / 60);
    const daysDifference = Math.floor(hoursDifference / 24);
    const monthsDifference = Math.floor(daysDifference / 30);
    const yearsDifference = Math.floor(daysDifference / 365);

    let remainingYears = 0;
    let remainingMonths = 0;
    let remainingDays = 0;

    if (yearsDifference > 0) {
        remainingYears = yearsDifference;
        remainingMonths = Math.floor((daysDifference % 365) / 30);
        remainingDays = (daysDifference % 365) % 30;
    } else if (monthsDifference > 0) {
        remainingMonths = monthsDifference;
        remainingDays = daysDifference % 30;
    } else if (daysDifference > 0) {
        remainingDays = daysDifference;
    }

    let result = "";
    if (remainingYears > 0) {
        result += `${remainingYears} năm `;
    }
    if (remainingMonths > 0) {
        result += `${remainingMonths} tháng `;
    }
    if (remainingDays > 0) {
        result += `${remainingDays} ngày`;
    }
    return result?.trim();
}

export const FormatDateTimeNoti = (dayTime) => {
    const postDate = new Date(dayTime);
    const now = new Date();
    const diffTime = now.getTime() - postDate.getTime();

    const seconds = Math.floor(diffTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return days === 1 ? "1 ngày trước" : ` ${days} ngày trước`;
    } else if (hours > 0) {
        return hours === 1 ? "1 giờ trước" : `${hours} giờ trước`;
    } else {
        return minutes <= 1 ? "1 phút trước" : `${minutes} phút trước`;
    }
};
