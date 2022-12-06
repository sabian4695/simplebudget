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
    },
    {
        recordID: '2',
        budgetID: '1',
        sectionName: 'Giving',
    }
];

let categoryArray = [
    {
        recordID: '1',
        sectionID: '1',
        categoryName: 'Nifco',
        amount: 4000,
        categoryType: 'income'
    },
    {
        recordID: '2',
        sectionID: '1',
        categoryName: 'Mikayla Brown Counseling LLC',
        amount: 2000,
        categoryType: 'income'
    },
    {
        recordID: '3',
        sectionID: '2',
        categoryName: 'Tithe',
        amount: 600,
        categoryType: 'expense'
    },
    {
        recordID: '4',
        sectionID: '2',
        categoryName: 'Giving General',
        amount: 50,
        categoryType: 'expense'
    },
];

let transactionArray = [
    {
        recordID: '1',
        budgetID: '1',
        categoryID: '1',
        amount: 1400,
        title: 'N1',
        transactionTime: dayjs('11/22/22'),
        expenseType: 'income'
    },
    {
        recordID: '2',
        budgetID: '1',
        categoryID: '3',
        amount: 140,
        title: 'N1 Tithe',
        transactionTime: dayjs('11/26/22'),
        expenseType: 'expense'
    },
    {
        recordID: '3',
        budgetID: '1',
        categoryID: '4',
        amount: 20,
        title: 'Giving Away Money',
        transactionTime: dayjs('11/28/22'),
        expenseType: 'expense'
    },
    {
        recordID: '4',
        budgetID: '1',
        categoryID: '2',
        amount: 1200,
        title: 'Counseling Income',
        transactionTime: dayjs('11/28/22'),
        expenseType: 'income'
    },
    {
        recordID: '5',
        budgetID: '1',
        categoryID: '4',
        amount: 49.23,
        title: 'Giving Away Money',
        transactionTime: dayjs('11/28/22'),
        expenseType: 'expense'
    },
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