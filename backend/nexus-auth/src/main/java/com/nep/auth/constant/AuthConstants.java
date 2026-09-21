package com.nep.auth.constant;

public final class AuthConstants {
    private AuthConstants() {
    }

    public static final String BEARER_PREFIX = "Bearer ";

    /**
     * Redis 黑名单 Key 前缀
     */
    public static final String BLACKLIST_KEY = "auth:token:blacklist:";

    /**
     * 登录失败计数 Key 前缀
     */
    public static final String LOGIN_FAIL_KEY = "auth:login:fail:";

    /**
     * 最大连续登录失败允许次数
     */
    public static final int MAX_LOGIN_FAIL_COUNT = 5;

    /**
     * 锁定与失败记录过期时间（分钟）
     */
    public static final long FAIL_EXPIRE_MINUTES = 15;
}
