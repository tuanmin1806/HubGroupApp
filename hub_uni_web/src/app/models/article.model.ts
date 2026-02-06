import { CategoryResponse } from "./category.model";

export interface ArticleResponse {
    Id: string;
    Title: string;
    Seo: string;
    Summary: string;
    Content: string;
    Keywords: string;
    AvatarUrl: string;
    AvatarFullUrl: string;
    CategoryIds: string[];
    Categories: CategoryResponse[]
    CreatedAt: string;
    CreatedBy: string;
}

export interface ArticleDetailResponse {
    MainArticle: ArticleResponse;
    NewestArticles: ArticleResponse[];
    SameCategoryArticles: ArticleResponse[];
}

export interface ArticleFilterParams {
    page?: number;
    size?: number;
    searchValue?: string;
}