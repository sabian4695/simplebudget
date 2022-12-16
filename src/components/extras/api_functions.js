import {supabase} from "../LoginPage";

export const supaBudgetsByCreator = async (userID) => {
    let {data, error} = await supabase
        .from('budgets')
        .select()
        .eq('creatorID',userID)
    if (error) {
        console.log(error.message)
    }
    return data
}

export const supaBudgetsByID = async (value) => {
    let {data, error} = await supabase
        .from('budgets')
        .select()
        .in('recordID',value)
    if (error) {
        console.log(error.message)
    }
    return {data, error}
}

export const supaCategories = async (sectionIDs) => {
    let {data, error} = await supabase
        .from('categories')
        .select()
        .in('sectionID',sectionIDs)
    if (error) {
        console.log(error.message)
    }
    return data
}

export const supaSections = async (budgetID, month, year) => {
    let {data, error} = await supabase
        .from('sections')
        .select()
        .eq('budgetID',budgetID)
        .eq('sectionMonth',month)
        .eq('sectionYear',year)
    if (error) {
        console.log(error.message)
    }
    return data
}

export const supaTransactionsFromCategories = async (categoryIDs) => {
    let {data, error} = await supabase
        .from('transactions')
        .select()
        .in('categoryID',categoryIDs)
    if (error) {
        console.log(error.message)
    }
    return data
}

export const supaTransactions = async (budgetID) => {
    let {data, error} = await supabase
        .from('transactions')
        .select()
        .eq('budgetID',budgetID)
        .is('categoryID', null)
    if (error) {
        console.log(error.message)
    }
    return data
}

export const supaShared = async (value) => {
    let {data, error} = await supabase
        .from('shared')
        .select('budgetID')
        .eq('sharedToID',value)
    if (error) {
        console.log(error.message)
    }
    return data
}

export const supaUsers = async () => {
    let {data, error} = await supabase
        .from('users')
        .select()
    if (error) {
        console.log(error.message)
    }
    return data
}