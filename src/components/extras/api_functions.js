import {supabase} from "../LoginPage";

export const supaBudgets = async (userID) => {
    let {data, error} = await supabase
        .from('budgets')
        .select()
        .eq('creatorID',userID)
    return data
}

export const supaCategories = async (sectionIDs) => {
    let {data, error} = await supabase
        .from('categories')
        .select()
        .in('sectionID',sectionIDs)
    return data
}

export const supaSections = async (budgetID, month, year) => {
    let {data, error} = await supabase
        .from('sections')
        .select()
        .eq('budgetID',budgetID)
        .eq('sectionMonth',month)
        .eq('sectionYear',year)
    return data
}

export const supaTransactions = async (budgetID) => {
    let {data, error} = await supabase
        .from('transactions')
        .select()
        .eq('budgetID',budgetID)
    return data
}

export const supaShared = async (value) => {
    let {data, error} = await supabase
        .from('shared')
        .select('budgetID')
        .eq('sharedToID',value)
    return data
}

export const supaUsers = async () => {
    let {data, error} = await supabase
        .from('users')
        .select()
    return data
}