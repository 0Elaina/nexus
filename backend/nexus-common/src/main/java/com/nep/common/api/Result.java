package com.nep.common.api;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * 响应结果
 * 
 * @param <T> 数据类型
 */
@Data
@AllArgsConstructor
public class Result<T> {
    private String code;
    private String message;
    private T data;

    public static <T> Result<T> success(T data) {
        return new Result<>(ApiCode.SUCCESS.getCode(), ApiCode.SUCCESS.getMessage(), data);
    }

    public static <T> Result<T> success() {
        return Result.success(null);
    }

    public static <T> Result<T> error(String code, String message) {
        return new Result<>(code, message, null);
    }
}
