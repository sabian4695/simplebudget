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

export const addTransaction = atom({
    key: "addTransaction",
    default: false,
});

export const selectBudget = atom({
    key: "selectBudget",
    default: false,
});

export const addBudget = atom({
    key: "addBudget",
    default: false,
});