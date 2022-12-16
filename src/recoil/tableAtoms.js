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

if (JSON.parse(localStorage.getItem('currentBudget'))) {
    currentBudget = JSON.parse(localStorage.getItem('currentBudget'))
}

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