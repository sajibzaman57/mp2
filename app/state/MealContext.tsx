import { createContext, useContext, useState } from "react";

interface MealListContext {
    meals: any[];
    setMeals: (m: any[]) => void;
}

const MealContext = createContext<MealListContext | undefined>(undefined);

export function MealProvider({ children }: { children: React.ReactNode }) {
    const [meals, setMeals] = useState<any[]>([]);
    return (
        <MealContext.Provider value={{ meals, setMeals }}>
            {children}
        </MealContext.Provider>
    );
}

export function useMeals() {
    const context = useContext(MealContext);
    if (!context) {
        throw new Error("useMeals must be used inside a MealProvider");
    }
    return context;
}