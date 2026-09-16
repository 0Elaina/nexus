package com.nep.common.api;

import org.springframework.http.HttpStatus;

import lombok.Getter;

@Getter
public class ApiCode {
    private final HttpStatus status;
    private final String code;
    private final String message;

    public ApiCode(HttpStatus status, String code, String message) {
        this.status = status;
        this.code = code;
        this.message = message;
    }

    public static final ApiCode SUCCESS = new ApiCode(HttpStatus.OK, "SUCCESS", "成功");
    public static final ApiCode BAD_REQUEST = new ApiCode(HttpStatus.BAD_REQUEST, "BAD_REQUEST", "请求参数校验失败");
    public static final ApiCode INTERNAL_SERVER_ERROR = new ApiCode(HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_SERVER_ERROR", "服务器内部错误");
}
