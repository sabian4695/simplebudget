import {atom} from "recoil";
import {createTheme} from "@mui/material/styles";

const primaryMain = '#4c809e'
const secondaryMain = '#d68758'

export const themes = {
    darkTheme: createTheme({
        palette: {
            mode: 'dark',
            primary: {
                main: primaryMain
            },
            secondary: {
                main: secondaryMain
            },
        }
    }),
    lightTheme: createTheme({
        palette: {
            mode: 'light',
            primary: {
                main: primaryMain
            },
            secondary: {
                main: secondaryMain
            },
        }
    }),
};

if (localStorage.getItem("userTheme") === null) {
    localStorage.setItem("userTheme", "dark")
}
let initialTheme = localStorage.getItem("userTheme")

export const themeAtom = atom({
    key: "themeAtom",
    default: initialTheme,
});

export const snackBarText = atom({
    key: "snackBarText",
    default: 'message',
});

export const snackBarSeverity = atom({
    key: "snackBarSeverity",
    default: "success",
});

export const snackBarOpen = atom({
    key: "snackBarOpen",
    default: false,
});

if (localStorage.getItem("auth") === null) {
    localStorage.setItem("auth", 'false')
}

export const authAtom = atom({
    key: "authAtom",
    default: localStorage.getItem("auth")
});

export const appName = 'simpleBudget';