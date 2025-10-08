import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/Meals.tsx"),
    route("gallery", "routes/Gallery.tsx"),
    route("detail/:idMeal", "routes/Detail.tsx"),
] satisfies RouteConfig;
