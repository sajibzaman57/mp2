import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { useMeals } from "../state/MealContext";

export default function Detail() {
    const { idMeal } = useParams();
    const [meal, setMeal] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { meals, setMeals } = useMeals();


    useEffect(() => {
        if (meals.length === 0) {
            const fetchAllMeals = async () => {
                const letters = [...Array(26)].map((_, i) => String.fromCharCode(i + 97));
                const fetched: any[] = [];
                await Promise.all(
                    letters.map(async (letter) => {
                        const res = await axios.get(
                            `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
                        );
                        res.data.meals?.forEach((m: any) => fetched.push(m));
                    })
                );
                setMeals(fetched.sort((a, b) => a.strMeal.localeCompare(b.strMeal)));
            };
            fetchAllMeals();
        }
    }, [meals, setMeals]);


    useEffect(() => {
        if (!idMeal) return;
        setLoading(true);

        axios
            .get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`)
            .then((response) => {
                const mealData = response.data?.meals?.[0] || null;
                setMeal(mealData);
            })
            .catch((error) => console.error("Error fetching meal details:", error))
            .finally(() => setLoading(false));
    }, [idMeal]);


    if (meals.length === 0 || loading) {
        return <div>Loading meal details...</div>;
    }


    if (!meal || !meal.strMeal) {
        return <div>Meal not found or still loading...</div>;
    }


    const totalMeals = meals.length;
    const index = meals.findIndex((m) => m.idMeal === idMeal);
    const prevMeal = index >= 0 ? meals[(index - 1 + totalMeals) % totalMeals] : null;
    const nextMeal = index >= 0 ? meals[(index + 1) % totalMeals] : null;

    return (
        <div className="detail-container fade">
            <div className="nav-buttons">
                {prevMeal ? (
                    <Link to={`/detail/${prevMeal.idMeal}`} className="btn-nav">
                        ← Prev
                    </Link>
                ) : (
                    <span className="btn-disabled">← Prev</span>
                )}

                <Link to="/" className="btn-back">Back to Meals</Link>

                {nextMeal ? (
                    <Link to={`/detail/${nextMeal.idMeal}`} className="btn-nav">
                        Next →
                    </Link>
                ) : (
                    <span className="btn-disabled">Next →</span>
                )}
            </div>

            <h1>{meal.strMeal}</h1>

            <img
                src={meal.strMealThumb}
                alt={meal.strMeal}
                className="detail-image"
            />

            <div className="meal-info">
                <p><strong>Category:</strong> {meal.strCategory}</p>
                <p><strong>Area:</strong> {meal.strArea}</p>
            </div>

            <div className="instructions">
                <h2>Instructions</h2>
                <p>{meal.strInstructions}</p>
            </div>
        </div>
    );
}