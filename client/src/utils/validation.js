export function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password) {
    // 8-20 תווים, אותיות גדולות/קטנות, מספר, סימן
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/.test(password);
}

export function validatePhone(phone) {
    // ישראלי פשוט: 10 ספרות, מתחיל ב-05
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