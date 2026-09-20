package com.nep.article;

import org.springframework.http.HttpStatus;

import com.nep.common.api.ApiCode;

public final class ArticleApiCode {
    private ArticleApiCode() {
    }

    public static final ApiCode ARTICLE_NOT_FOUND = new ApiCode(
            HttpStatus.NOT_FOUND,
            "ARTICLE_NOT_FOUND",
            "文章不存在");
}
