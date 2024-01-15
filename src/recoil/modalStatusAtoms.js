import {atom} from "recoil";

export const addSection = atom({
    key: "addSection",
    default: false,
});

export const addCategory = atom({
    key: "addCategory",
    default: false,
});

export const currentSection = atom({
    key: "currentSection",
    default: '',
});

export const currentCategory = atom({
    key: "currentCategory",
    default: '',
});

export const editCategory = atom({
    key: "editCategory",
    default: false,
});

export const editTransaction = atom({
    key: "editTransaction",
    default: false,
});

export const editSection = atom({
    key: "editSection",
    default: false,
});

export const currentTransaction = atom({
    key: "currentTransaction",
    default: '',
});

export const addTransaction = atom({
    key: "addTransaction",
    default: false,
});

export const selectBudget = atom({
    key: "selectBudget",
    default: false,
});

export const copyBudget = atom({
    key: "copyBudget",
    default: false,
});

export const addBudget = atom({
    key: "addBudget",
    default: false,
});

export const shareBudget = atom({
    key: "shareBudget",
    default: false,
});

export const areYouSure = atom({
    key: "areYouSure",
    default: false,
});

export const openViewCategory = atom({
    key: "openViewCategory",
    default: false,
});

export const openChangePassword = atom({
    key: "openChangePassword",
    default: false,
});

export const exportToCSV = atom({
    key: "exportToCSV",
    default: false,
});