package com.nep.article.constant;

import org.springframework.http.HttpStatus;

import com.nep.common.api.ApiCode;

public final class ArticleApiCode {
    private ArticleApiCode() {
    }

    public static final ApiCode ARTICLE_NOT_FOUND = new ApiCode(
            HttpStatus.NOT_FOUND,
            "ARTICLE_NOT_FOUND",
            "文章不存在");
    public static final ApiCode ARTICLE_ID_EMPTY = new ApiCode(
            HttpStatus.BAD_REQUEST,
            "ARTICLE_ID_EMPTY",
            "文章 ID不能为空");
}
