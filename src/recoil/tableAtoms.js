import {atom} from "recoil";
import dayjs from "dayjs";

let budgetArray = [
    {
        recordID: '1',
        creatorID: '123',
        sharedToID: [''],
        year: 2022,
        month: 'December',
    },
    {
        recordID: '1',
        creatorID: '123',
        sharedToID: [''],
        year: 2022,
        month: 'November',
    },
];

let sectionsArray = [
    {
        recordID: '1',
        budgetID: '1',
        sectionName: 'Income',
        sectionType: 'income',
    },
    {
        recordID: '2',
        budgetID: '1',
        sectionName: 'Giving',
        sectionType: 'expense',
    }
];

let categoryArray = [
    {
        recordID: '1',
        sectionID: '1',
        categoryName: 'Nifco',
        amount: 4000,
    },
    {
        recordID: '2',
        sectionID: '1',
        categoryName: 'Mikayla Brown Counseling LLC',
        amount: 2000,
    },
    {
        recordID: '3',
        sectionID: '2',
        categoryName: 'Tithe',
        amount: 600,
    },
    {
        recordID: '4',
        sectionID: '2',
        categoryName: 'Giving General',
        amount: 50,
    },
];

let transactionArray = [
    {
        recordID: '1',
        budgetID: '1',
        categoryID: '1',
        amount: 1400,
        title: 'N1',
        transactionDate: dayjs('11/22/22').valueOf(),
        transactionType: 'income'
    },
    {
        recordID: '2',
        budgetID: '1',
        categoryID: '3',
        amount: 140,
        title: 'N1 Tithe',
        transactionDate: dayjs('11/26/22').valueOf(),
        transactionType: 'expense'
    },
    {
        recordID: '3',
        budgetID: '1',
        categoryID: '4',
        amount: 20,
        title: 'Giving Away Money',
        transactionDate: dayjs('11/28/22').valueOf(),
        transactionType: 'expense'
    },
    {
        recordID: '4',
        budgetID: '1',
        categoryID: '2',
        amount: 1200,
        title: 'Counseling Income',
        transactionDate: dayjs('11/28/22').valueOf(),
        transactionType: 'income'
    },
    {
        recordID: '5',
        budgetID: '1',
        categoryID: '4',
        amount: 49.23,
        title: 'Giving Away Money',
        transactionDate: dayjs('11/28/22').valueOf(),
        transactionType: 'expense'
    },
];

export const budgetDetails = atom({
    key: 'budgetDetails',
    default: budgetArray,
});

export const currentBudget = atom({
    key: 'currentBudget',
    default: '1',
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