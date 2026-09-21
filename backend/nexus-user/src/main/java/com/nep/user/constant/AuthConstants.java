package com.nep.user.constant;

public final class AuthConstants {
    private AuthConstants() {
    }

    public static final String BEARER_PREFIX = "Bearer ";
    public static final String BLACKLIST_KEY = "auth:token:blacklist:";
    // 登录失败计数 Key 前缀 (auth:login:fail:{username})
    public static final String LOGIN_FAIL_KEY = "auth:login:fail:";
    // IP 频控 Key 前缀 (auth:ratelimit:ip:{clientIp})
    public static final String IP_RATELIMIT_KEY = "auth:ratelimit:ip:";
    // 最大登录失败次数
    public static final int MAX_LOGIN_FAIL_COUNT = 5;
    // 登录失败计数过期时间 (分钟)
    public static final int FAIL_EXPIRE_MINUTES = 15;
}
