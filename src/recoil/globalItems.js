import {atom} from "recoil";
import {createTheme} from "@mui/material/styles";

export const primaryMain = '#4c809e'
export const secondaryMain = '#d68758'

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
        },
        overrides: {
            MuiAutocomplete: {
                popup: { zIndex: 1500 },
            },
        },
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
        },
        overrides: {
            MuiAutocomplete: {
                popup: { zIndex: 1500 },
            },
        },
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

let user
if (localStorage.getItem('sb-psdmjjcvaxejxktqwdcm-auth-token') === null) {
    user = '1'
} else {
    user = JSON.parse(localStorage.getItem('sb-psdmjjcvaxejxktqwdcm-auth-token')).user
}

let auth
if (user.aud === 'authenticated') {
    auth = 'true'
} else {
    auth = 'false'
}

export const authAtom = atom({
    key: "authAtom",
    default: auth
});

export const currentUser = atom({
    key: "currentUser",
    default: {
        recordID: user.id,
        fullName: localStorage.getItem('fullName'),
        userType: 'free'
    }
});

export const mainLoading = atom( {
    key: "mainLoading",
    default: false,
});

export const areYouSureTitle = atom({
    key: "areYouSureTitle",
    default: 'Title',
});

export const areYouSureDetails = atom({
    key: "areYouSureDetails",
    default: 'Details',
});

export const areYouSureAccept = atom({
    key: "areYouSureAccept",
    default: false,
});

export const appName = 'simpleBudget';

export const dialogPaperStyles = {
    style: {
        bgColor: 'background.paper',
        borderRadius: 10,
        borderColor: '#424242',
        borderStyle: 'solid',
        borderWidth: 1.4,
        borderLeftWidth: 4,
        borderRightWidth: 4,
    },
}