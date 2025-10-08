import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router";

interface Meal {
    idMeal: string;
    strMeal: string;
    strMealThumb: string;
    strCategory: string;
}

export default function Gallery() {
    const [meals, setMeals] = useState<Meal[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [loading, setLoading] = useState(true);

    // Fetch all categories on mount
    useEffect(() => {
        axios
            .get("https://www.themealdb.com/api/json/v1/1/list.php?c=list")
            .then((res) => {
                const cats = res.data.meals.map((m: any) => m.strCategory);
                setCategories(["All", ...cats]);
            });
    }, []);


    useEffect(() => {
        setLoading(true);
        const url =
            selectedCategory === "All"
                ? "https://www.themealdb.com/api/json/v1/1/search.php?s="
                : `https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`;
        axios
            .get(url)
            .then((res) => {
                setMeals(res.data.meals || []);
            })
            .finally(() => setLoading(false));
    }, [selectedCategory]);

    return (
        <div className="gallery-container">
            <h1 className="page-title">Meal Gallery</h1>

            {/* Filter bar */}
            <div className="filter-bar">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`filter-btn ${selectedCategory === cat ? "active" : ""
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Gallery grid */}
            {loading ? (
                <p className="loading">Loading meals...</p>
            ) : (
                <div className="gallery-grid">
                    {meals.map((meal) => (
                        <Link
                            to={`/detail/${meal.idMeal}`}
                            key={meal.idMeal}
                            className="gallery-card"
                        >
                            <img
                                src={meal.strMealThumb}
                                alt={meal.strMeal}
                                className="gallery-img"
                            />
                            <div className="overlay">{meal.strMeal}</div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}