import {atom} from "recoil";
import dayjs from "dayjs";

let budgetArray = [
    {
        recordID: '1',
        creatorID: '123',
        budgetName: 'Default1'
    }
];

let sectionsArray = [
    {
        recordID: '1',
        budgetID: '1',
        sectionName: 'Income',
        sectionType: 'income',
        sectionYear: 2022,
        sectionMonth: 'December'
    }
];

let categoryArray = [
    {
        recordID: '1',
        sectionID: '1',
        categoryName: 'Default',
        amount: 0,
    }
];

let transactionArray = [
    {
        recordID: '1',
        budgetID: '1',
        categoryID: '1',
        amount: 0,
        title: 'D1',
        transactionDate: dayjs('11/22/22').valueOf(),
        transactionType: 'income',
        creatorID: '123',
    }
];

let sharedArray = {
        recordID: '1',
        budgetID: '1',
        sharedToID: '',
}
let currentBudget = {
        budgetID: '1',
        year: Number(dayjs().format('YYYY')),
        month: dayjs().format('MMMM'),
}

let tables = ['budgets', 'shared', 'sections', 'categories', 'transactions', 'currentBudget']
let defaults = [budgetArray, sharedArray, sectionsArray, categoryArray, transactionArray, currentBudget]

for (let i = 0; i < tables.length; i++) {
    if (localStorage.getItem(tables[i]) === null) {
        localStorage.setItem(tables[i], JSON.stringify(defaults[i]))
    }
}

budgetArray = JSON.parse(localStorage.getItem('budgets'))
sharedArray = JSON.parse(localStorage.getItem('shared'))
sectionsArray = JSON.parse(localStorage.getItem('sections'))
categoryArray = JSON.parse(localStorage.getItem('categories'))
transactionArray = JSON.parse(localStorage.getItem('transactions'))
currentBudget = JSON.parse(localStorage.getItem('currentBudget'))

export const shared = atom({
    key: 'shared',
    default: sharedArray
})

export const budgets = atom({
    key: 'budgets',
    default: budgetArray,
});

export const currentBudgetAndMonth = atom({
    key: 'currentBudget',
    default: currentBudget
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