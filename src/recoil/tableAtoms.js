import {atom} from "recoil";
import {supabase} from "../components/Login";
import dayjs from "dayjs";

let budgetArray = [
    {
        recordID: '1',
        creatorID: '123',
        sharedToID: '',
        year: 2022,
        month: 'December',
    },
];

let transactionArray = [
    {
        recordID: '1',
        budgetID: '123',
        categoryID: 1,
        amount: 2022,
        title: 'December',
        transactionTime: 0,
        expenseType: 'income'
    },
];

let categoryArray = [
    {
        recordID: '1',
        sectionID: '1',
        categoryName: 'Nifco',
        amount: 100,
        categoryType: 'income'
    }
];

let sectionsArray = [
    {
        recordID: '1',
        sectionName: 'Income',
    },
    {
        recordID: '2',
        sectionName: 'Giving',
    }
];

export const budgetDetails = atom({
    key: 'budgetDetails',
    default: budgetArray,
});

export const transactions = atom({
    key: 'transactions',
    default: transactionArray,
});

export const categories = atom({
    key: 'categories',
    default: categoryArray,
});

export const sections = atom({
    key: 'sections',
    default: sectionsArray,
});