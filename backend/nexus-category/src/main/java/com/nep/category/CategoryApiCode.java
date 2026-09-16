package com.nep.category;

import org.springframework.http.HttpStatus;

import com.nep.common.api.ApiCode;

public final class CategoryApiCode {
    private CategoryApiCode() {
    }

    public static final ApiCode CATEGORY_NAME_DUPLICATE = new ApiCode(HttpStatus.CONFLICT, "CATEGORY_NAME_DUPLICATE",
            "分类名称已存在");
    public static final ApiCode CATEGORY_NAME_EMPTY = new ApiCode(HttpStatus.BAD_REQUEST, "CATEGORY_NAME_EMPTY",
            "分类名称不能为空");
    public static final ApiCode CATEGORY_NOT_FOUND = new ApiCode(
            HttpStatus.NOT_FOUND,
            "CATEGORY_NOT_FOUND",
            "分类不存在");
}
