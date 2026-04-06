import { create } from "zustand";
import dayjs from "dayjs";

let currentBudget = {
    budgetID: '1',
    year: Number(dayjs().format('YYYY')),
    month: dayjs().format('MMMM'),
};

if (localStorage.getItem('currentBudget')) {
    currentBudget = JSON.parse(localStorage.getItem('currentBudget')!);
    if ((currentBudget as any).year === undefined) {
        currentBudget.year = Number(dayjs().format('YYYY'));
        currentBudget.month = dayjs().format('MMMM');
        localStorage.setItem('currentBudget', JSON.stringify(currentBudget));
    }
}

interface TableState {
    shared: any;
    setShared: (val: any) => void;
    budgets: any[];
    setBudgets: (val: any[] | ((prev: any[]) => any[])) => void;
    currentBudgetAndMonth: any;
    setCurrentBudgetAndMonth: (val: any) => void;
    transactions: any[];
    setTransactions: (val: any[] | ((prev: any[]) => any[])) => void;
    categories: any[];
    setCategories: (val: any[] | ((prev: any[]) => any[])) => void;
    sections: any[];
    setSections: (val: any[] | ((prev: any[]) => any[])) => void;
}

export const useTableStore = create<TableState>((set) => ({
    shared: { recordID: '1', budgetID: '1', sharedToID: '' },
    setShared: (val) => set({ shared: val }),
    budgets: [{ recordID: '1', creatorID: '123', budgetName: 'Default1' }],
    setBudgets: (val) => set((state) => ({
        budgets: typeof val === 'function' ? val(state.budgets) : val,
    })),
    currentBudgetAndMonth: currentBudget,
    setCurrentBudgetAndMonth: (val) => set({ currentBudgetAndMonth: val }),
    transactions: [{ recordID: '1', budgetID: '1', categoryID: '1', amount: 0, title: 'D1', transactionDate: dayjs('11/22/22').valueOf(), transactionType: 'income', creatorID: '123' }],
    setTransactions: (val) => set((state) => ({
        transactions: typeof val === 'function' ? val(state.transactions) : val,
    })),
    categories: [{ recordID: '1', sectionID: '1', categoryName: 'Default', amount: 0 }],
    setCategories: (val) => set((state) => ({
        categories: typeof val === 'function' ? val(state.categories) : val,
    })),
    sections: [{ recordID: '1', budgetID: '1', sectionName: 'Income', sectionType: 'income', sectionYear: 2022, sectionMonth: 'December' }],
    setSections: (val) => set((state) => ({
        sections: typeof val === 'function' ? val(state.sections) : val,
    })),
}));
