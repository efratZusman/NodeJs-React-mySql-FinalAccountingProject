export function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/.test(password);
}

export function validatePhone(phone) {
    return /^05\d{8}$/.test(phone);
}

export function validateNotEmpty(str) {
    return str && str.trim().length > 0;
}

export function validateTitle(title) {
    return validateNotEmpty(title) && title.length <= 255;
}

export function validateFileType(file, allowedTypes) {
    if (!file) return false;
    return allowedTypes.includes(file.type);
}

export function validateDate(date) {
    return /^\d{4}-\d{2}-\d{2}$/.test(date);
}


export function validateFullName(name) {
    return /^[\p{L}\s.]{2,100}$/u.test(name);
}

export function validateTextLength(text, min = 1, max = 1000) {
    const length = text ? text.trim().length : 0;
    return length >= min && length <= max;
}

export function validateNumeric(value) {
    return /^\d+$/.test(value);
}

export function validateFileName(fileName) {
    return /^[\w\-. ]+$/.test(fileName);
}

export function validateFileSize(file, maxSizeInMB) {
    if (!file) return false;
    return file.size <= maxSizeInMB * 1024 * 1024;
}

export function validateComment(comment) {
    return validateTextLength(comment, 1, 1000) && 
           !/<[a-z][\s\S]*>/i.test(comment); 
}

export const VALIDATION_MESSAGES = {
    EMAIL: 'כתובת אימייל לא תקינה',
    PASSWORD: 'הסיסמה חייבת להכיל 8-20 תווים, אותיות גדולות וקטנות, מספר וסימן',
    PHONE: 'מספר טלפון לא תקין (10 ספרות, מתחיל ב-05)',
    REQUIRED: 'שדה חובה',
    TITLE: 'כותרת חייבת להכיל עד 255 תווים',
    FULL_NAME: 'שם מלא חייב להכיל אותיות ורווחים בלבד (2-100 תווים)',
    COMMENT: 'תגובה חייבת להכיל בין 1 ל-1000 תווים ולא יכולה להכיל קוד HTML',
    FILE_TYPE: 'סוג קובץ לא תקין',
    FILE_SIZE: 'גודל הקובץ חורג מהמותר',
    FILE_NAME: 'שם הקובץ מכיל תווים לא חוקיים',
    DATE: 'תאריך לא תקין (שנה-חודש-יום)',
    NUMERIC: 'יש להזין מספרים בלבד'
};