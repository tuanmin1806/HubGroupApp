import { CategoryResponse } from "./category.model";

export interface CreateBookmarkRequest {
    CustomerId: string;
    ArticleId: string;
}

export interface ArticleInBookmark {
    Title: string;
    Seo: string;
    SeoUrl: string;
    Summary: string;
    Keywords: string;
    SeoDescription: string;
    AvatarFullUrl: string | null;
    CategoryIds: string[];
    Categories: CategoryResponse[];
    CreatedBy: string;
    CreatedAt: string;
    UpdatedAt: string;
    Status: string;
    Id: string;
    Code: number;
}

export interface BookmarkResponse {
    Id: string;
    Code: number;
    CustomerId: string;
    ArticleId: string;
    Article: ArticleInBookmark;
    CreatedAt: string;
    UpdatedAt: string;
    CreatedBy: string;
    UpdatedBy: string | null;
    Status: string;
}

export interface BookmarkFilterParams {
    customerId?: string;
    articleId?: string;
    page?: number;
    size?: number;
}