import {useRecoilValue} from "recoil";
import {transactions} from "../../recoil/tableAtoms";
import React from 'react';

export default function GlobalJS() {
    const transactionsArray = useRecoilValue(transactions)
    function grabCategorySum(catID: string) {
        let expenses = transactionsArray.filter(x => x.categoryID === catID && x.transactionType === "expense").reduce((accumulator, object) => {
            return accumulator + object.amount;
        }, 0)
        let incomes = transactionsArray.filter(x => x.categoryID === catID && x.transactionType === "income").reduce((accumulator, object) => {
            return accumulator + object.amount;
        }, 0)
        return Math.round((incomes-expenses + Number.EPSILON) * 100) / 100
    }
    return (
        {grabCategorySum}
    )
}