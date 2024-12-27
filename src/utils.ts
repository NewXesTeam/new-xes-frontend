export function checkLoggedIn() {
    return document.cookie.includes('is_login=1;');
}
