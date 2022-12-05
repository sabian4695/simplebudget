import {atom} from "recoil";

export const addSection = atom({
    key: "addSection",
    default: false,
});

export const addCategory = atom({
    key: "addCategory",
    default: false,
});

export const currentCategory = atom({
    key: "currentCategory",
    default: '',
});

export const addTransaction = atom({
    key: "addTransaction",
    default: false,
});