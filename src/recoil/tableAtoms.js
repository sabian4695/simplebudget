import {atom} from "recoil";
import dayjs from "dayjs";

let budgetArray = [
    {
        recordID: '1',
        creatorID: '123',
        budgetName: 'Main Budget'
    },
    {
        recordID: '2',
        creatorID: '123',
        budgetName: 'Secondary Budget'
    },
];

let sectionsArray = [
    {
        recordID: '1',
        budgetID: '1',
        sectionName: 'Income',
        sectionType: 'income',
        sectionYear: 2022,
        sectionMonth: 'December'
    },
    {
        recordID: '2',
        budgetID: '1',
        sectionName: 'Giving',
        sectionType: 'expense',
        sectionYear: 2022,
        sectionMonth: 'December'
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
        transactionType: 'income',
        creatorID: '123',
    },
    {
        recordID: '2',
        budgetID: '1',
        categoryID: '3',
        amount: 140,
        title: 'N1 Tithe',
        transactionDate: dayjs('11/26/22').valueOf(),
        transactionType: 'expense',
        creatorID: '123',
    },
    {
        recordID: '3',
        budgetID: '1',
        categoryID: '4',
        amount: 20,
        title: 'Giving Away Money',
        transactionDate: dayjs('11/28/22').valueOf(),
        transactionType: 'expense',
        creatorID: '123',
    },
    {
        recordID: '4',
        budgetID: '1',
        categoryID: '2',
        amount: 1200,
        title: 'Counseling Income',
        transactionDate: dayjs('11/28/22').valueOf(),
        transactionType: 'income',
        creatorID: '123',
    },
    {
        recordID: '5',
        budgetID: '1',
        categoryID: '4',
        amount: 49.23,
        title: 'Giving Away Money',
        transactionDate: dayjs('11/28/22').valueOf(),
        transactionType: 'expense',
        creatorID: '123',
    },
];

export const shared = atom({
    key: 'shared',
    default: {
        recordID: '1',
        budgetID: '1',
        sharedToID: '',
    },
})

export const budgets = atom({
    key: 'budgets',
    default: budgetArray,
});

export const currentBudgetAndMonth = atom({
    key: 'currentBudget',
    default: {
        budgetID: '1',
        year: dayjs().format('YYYY'),
        month: dayjs().format('MMMM'),
    },
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