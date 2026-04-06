import { useTableStore } from "../../store/tableStore";
import { useGlobalStore } from "../../store/globalStore";
import {
    supaCategories,
    supaSections,
    supaTransactions,
    supaTransactionsFromCategories
} from './api_functions';
import { supabase } from "../../lib/supabase";

export default function useGrabBudgetData() {
    const setSections = useTableStore(s => s.setSections);
    const setLoadingOpen = useGlobalStore(s => s.setMainLoading);
    const setCategories = useTableStore(s => s.setCategories);
    const setTransactions = useTableStore(s => s.setTransactions);
    const currentUserData = useGlobalStore(s => s.currentUser);
    const setCurrentUser = useGlobalStore(s => s.setCurrentUser);

    async function refreshUserProfile() {
        try {
            const { data, error } = await supabase
                .from('users')
                .select()
                .eq('recordID', currentUserData.recordID)
                .single();
            if (error) {
                console.error('Error fetching user profile:', error.message);
                return;
            }
            if (data) {
                setCurrentUser({
                    recordID: currentUserData.recordID,
                    fullName: data.fullName,
                    userType: data.userType,
                });
            }
        } catch (err) {
            console.error('Error fetching user profile:', err);
        }
    }

    async function grabBudgetData(budgetID: string, year: number, month: string) {
        setLoadingOpen(true);
        try {
            // Refresh user profile
            await refreshUserProfile();

            // Fetch sections
            const allSections = await supaSections(budgetID, month, year);
            if (!allSections || allSections.length === 0) {
                setSections([]);
                setCategories([]);
                setTransactions([]);
                return;
            }
            setSections(allSections);

            // Fetch categories
            const allCategories = await supaCategories(allSections.map(x => x.recordID));
            if (!allCategories || allCategories.length === 0) {
                setCategories([]);
                setTransactions([]);
                return;
            }
            setCategories(allCategories);

            // Fetch transactions — both categorized and uncategorized
            const [noCategoryTransactions, categorizedTransactions] = await Promise.all([
                supaTransactions(budgetID),
                supaTransactionsFromCategories(allCategories.map(x => x.recordID)),
            ]);

            const allTransactions = [
                ...(categorizedTransactions || []),
                ...(noCategoryTransactions || []),
            ];
            setTransactions(allTransactions);
        } catch (error) {
            console.error('Error fetching budget data:', error);
        } finally {
            setLoadingOpen(false);
        }
    }

    return { grabBudgetData, refreshUserProfile };
}
