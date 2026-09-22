package com.nep.tag.constant;

import org.springframework.http.HttpStatus;

import com.nep.common.api.ApiCode;

public final class TagApiCode {
    private TagApiCode() {

    }

    public static final ApiCode TAG_NAME_DUPLICATE = new ApiCode(
            HttpStatus.CONFLICT,
            "TAG_NAME_DUPLICATE",
            "标签名称已存在");
    public static final ApiCode TAG_NAME_EMPTY = new ApiCode(
            HttpStatus.BAD_REQUEST,
            "TAG_NAME_EMPTY",
            "标签名称不能为空");
    public static final ApiCode TAG_NOT_FOUND = new ApiCode(
            HttpStatus.NOT_FOUND,
            "TAG_NOT_FOUND",
            "标签不存在");
    public static final ApiCode TAG_ID_EMPTY = new ApiCode(
            HttpStatus.BAD_REQUEST,
            "TAG_ID_EMPTY",
            "标签 ID不能为空");
}
