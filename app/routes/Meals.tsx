import axios from "axios";
import type { Route } from "./+types/Meals";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useMeals } from "../state/MealContext";

function generateAlphabet() {
    return [...Array(26)].map((_, i) => String.fromCharCode(i + 97));
}

// ===== Loader =====
export async function clientLoader() {
    const meals: any[] = [];
    await Promise.all(
        generateAlphabet().map(async (letter) => {
            const response = await axios.get(
                `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
            );
            response.data.meals?.forEach((meal: any) => meals.push(meal));
        })
    );
    return { meals: meals.sort((a, b) => a.strMeal.localeCompare(b.strMeal)) };
}

// ===== Component =====
export default function Meals({ loaderData: { meals } }: Route.ComponentProps) {
    const { setMeals } = useMeals();
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<"name" | "category">("name");
    const [order, setOrder] = useState<"asc" | "desc">("asc");
    const [filteredMeals, setFilteredMeals] = useState(meals);

    // Save globally for detail navigation
    useEffect(() => {
        setMeals(meals);
    }, [meals, setMeals]);

    // Filter and sort logic
    useEffect(() => {
        let updated = meals.filter((meal: any) =>
            meal.strMeal.toLowerCase().includes(search.toLowerCase())
        );

        updated.sort((a: any, b: any) => {
            let fieldA = sortBy === "name" ? a.strMeal : a.strCategory;
            let fieldB = sortBy === "name" ? b.strMeal : b.strCategory;
            return order === "asc"
                ? fieldA.localeCompare(fieldB)
                : fieldB.localeCompare(fieldA);
        });

        setFilteredMeals(updated);
    }, [search, sortBy, order, meals]);

    return (
        <div className="meals-container">
            <h1 className="page-title">Meal List</h1>

            {/* 🔍 Search and Sort controls */}
            <div className="control-bar">
                <input
                    type="text"
                    placeholder="Search meals..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                />

                <div className="sort-controls">
                    <label>Sort by:</label>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as "name" | "category")}
                    >
                        <option value="name">Name</option>
                        <option value="category">Category</option>
                    </select>

                    <button
                        className="order-btn icon-btn"
                        onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
                        title={order === "asc" ? "Sort Descending" : "Sort Ascending"}
                    >
                        {order === "asc" ? "↑" : "↓"}
                    </button>
                </div>
            </div>

            {/* 🧾 Meal list */}
            <div className="meal-list">
                {filteredMeals.map((meal: any) => (
                    <div key={meal.idMeal} className="meal-row">
                        <Link to={`/detail/${meal.idMeal}`} className="meal-name">
                            {meal.strMeal}
                        </Link>
                        <span className="meal-category">{meal.strCategory}</span>
                        <span className="meal-area">{meal.strArea}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}