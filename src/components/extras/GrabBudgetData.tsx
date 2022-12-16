import {useRecoilState, useSetRecoilState} from "recoil";
import {
    supaCategories,
    supaSections,
    supaTransactions, supaTransactionsFromCategories
} from './api_functions'
import {categories, currentBudgetAndMonth, sections, transactions} from "../../recoil/tableAtoms";
import {currentUser, mainLoading} from "../../recoil/globalItems";
import {supabase} from "../LoginPage";

export default function GrabBudgetData() {
    const setSectionArray = useSetRecoilState(sections)
    const setLoadingOpen = useSetRecoilState(mainLoading)
    const setCategoryArray = useSetRecoilState(categories)
    const setTransactionArray = useSetRecoilState(transactions)
    const [currentUserData, setCurrentUser] = useRecoilState(currentUser)
    async function grabBudgetData(budgetID: string, year: number, month: string) {
        setLoadingOpen(true)
        let {data, error} = await supabase
            .from('users')
            .select()
            .eq('recordID',currentUserData.recordID)
        if (error) {
            console.log(error.message)
        }
        if (data) {
            setCurrentUser({
                recordID: currentUserData.recordID,
                fullName: data[0].fullName,
                userType: data[0].userType,
            })
        }
        let allSections = await supaSections(budgetID, month, year)
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
        let noCategoryTransactions = await supaTransactions(budgetID)
        let categorizedTransactions = await supaTransactionsFromCategories(allCategories.map(x => x.recordID))
        let allTransactions

        if (categorizedTransactions) {
            allTransactions = categorizedTransactions.concat(noCategoryTransactions)
        } else if (noCategoryTransactions) {
            allTransactions = noCategoryTransactions.concat(categorizedTransactions)
        }

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