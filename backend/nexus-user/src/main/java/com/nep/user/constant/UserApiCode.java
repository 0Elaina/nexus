package com.nep.user.constant;

import org.springframework.http.HttpStatus;

import com.nep.common.api.ApiCode;

public final class UserApiCode {
    private UserApiCode() {
    }

    public static final ApiCode USERNAME_EXISTS = new ApiCode(
            HttpStatus.CONFLICT,
            "USER_USERNAME_EXISTS",
            "用户名已存在");

    public static final ApiCode LOGIN_FAILED = new ApiCode(
            HttpStatus.BAD_REQUEST,
            "USER_LOGIN_FAILED",
            "用户名或密码错误");

    public static final ApiCode USER_DISABLED = new ApiCode(
            HttpStatus.FORBIDDEN,
            "USER_DISABLED",
            "用户已被禁用");

    public static final ApiCode ACCESS_DENIED = new ApiCode(
            HttpStatus.FORBIDDEN,
            "ACCESS_DENIED",
            "无权限访问");

    public static final ApiCode UNAUTHORIZED = new ApiCode(
            HttpStatus.UNAUTHORIZED,
            "UNAUTHORIZED",
            "登录已过期或未登录");
    public static final ApiCode ACCOUNT_LOCKED = new ApiCode(
            HttpStatus.TOO_MANY_REQUESTS,
            "ACCOUNT_LOCKED",
            "密码连续输错次数过多，账号已锁定 15 分钟");

    public static final ApiCode USER_NOT_FOUND = new ApiCode(
            HttpStatus.NOT_FOUND,
            "USER_NOT_FOUND",
            "用户或博主信息不存在");
}
