import { ICategory } from "../../models/category/category.types";

export interface ICategoriesState {
    root: ICategory[];
    all: ICategory[];
}
