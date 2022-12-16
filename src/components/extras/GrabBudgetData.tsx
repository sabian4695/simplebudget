import {useRecoilState, useSetRecoilState} from "recoil";
import {
    supaCategories,
    supaSections,
    supaTransactions
} from './api_functions'
import {categories, currentBudgetAndMonth, sections, transactions} from "../../recoil/tableAtoms";
import {mainLoading} from "../../recoil/globalItems";

export default function GrabBudgetData() {
    const setSectionArray = useSetRecoilState(sections)
    const [loadingOpen, setLoadingOpen] = useRecoilState(mainLoading)
    const setCategoryArray = useSetRecoilState(categories)
    const setTransactionArray = useSetRecoilState(transactions)
    const [currentBudget, setCurrentBudget] = useRecoilState(currentBudgetAndMonth)
    async function grabBudgetData(budgetID: string) {
        setLoadingOpen(true)
        let allSections = await supaSections(budgetID, currentBudget.month, currentBudget.year)
        if (!allSections) {
            setSectionArray([])
            setCategoryArray([])
            setTransactionArray([])
            setLoadingOpen(false)
            return
        }
        setSectionArray(allSections)
        let allCategories = await supaCategories(allSections.map(x => x.recordID))
        if (!allCategories) {
            setCategoryArray([])
            setTransactionArray([])
            setLoadingOpen(false)
            return
        }
        setCategoryArray(allCategories)
        let allTransactions = await supaTransactions(budgetID)
        if (allTransactions) {
            setTransactionArray(allTransactions)
        } else {
            setTransactionArray([])
        }
        setLoadingOpen(false)
    }
    return (
        {grabBudgetData}
    )
}