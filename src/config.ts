export const CONFIG = {
    apiUrl: import.meta.env.VITE_API_URL,
    appName: import.meta.env.VITE_APP_NAME,
    accountPageBottomText: import.meta.env.VITE_MOBILE_APP_BOTTOM_TEXT,
    desktopFooterText: import.meta.env.VITE_DESKTOP_FOOTER_TEXT,
    animalList: (import.meta.env.VITE_ANIMAL_LIST).split(";")
}