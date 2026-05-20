import { CategoryResponse } from "./category.model";

export interface ArticleResponse {
    Id: string;
    Title: string;
    SeoUrl: string;
    Summary: string;
    Content: string;
    Keywords: string;
    AvatarUrl: string;
    AvatarFullUrl: string;
    CategoryIds: string[];
    Categories: CategoryResponse[]
    CreatedAt: string;
    CreatedBy: string;
    IsBookmarked: boolean;
    BookmarkId: string;
}

export interface ArticleDetailResponse {
    MainArticle: ArticleResponse;
    NewestArticles: ArticleResponse[];
    SameCategoryArticles: ArticleResponse[];
}

export interface ArticleFilterParams {
    page?: number;
    size?: number;
    categoryId?: string;
    searchValue?: string;
}