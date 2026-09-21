package com.nep.common.context;

/**
 * 线程级用户身份上下文托管容器
 */
public final class UserContext {
    private UserContext() {
    }

    private static final ThreadLocal<CurrentUser> CONTEXT = new ThreadLocal<>();

    /**
     * 写入当前线程的用户上下文
     */
    public static void set(CurrentUser user) {
        CONTEXT.set(user);
    }

    /**
     * 获取当前线程的用户上下文
     *
     * @return 当前登录用户，未登录或游客返回 null
     */
    public static CurrentUser getUser() {
        return CONTEXT.get();
    }

    /**
     * 快捷获取当前登录用户 ID
     */
    public static Long getUserId() {
        CurrentUser user = getUser();
        return user != null ? user.userId() : null;
    }

    /**
     * 快捷获取当前登录用户名
     */
    public static String getUsername() {
        CurrentUser user = getUser();
        return user != null ? user.username() : null;
    }

    /**
     * 快捷获取当前用户角色
     */
    public static String getRole() {
        CurrentUser user = getUser();
        return user != null ? user.role() : null;
    }

    /**
     * 判断当前用户是否具备管理员角色
     */
    public static boolean isAdmin() {
        CurrentUser user = getUser();
        return user != null && user.isAdmin();
    }

    /**
     * 判断当前是否已通过身份认证 (非匿名)
     */
    public static boolean isAuthenticated() {
        return getUser() != null;
    }

    /**
     * 清理当前线程上下文，防止线程池复用污染
     */
    public static void clear() {
        CONTEXT.remove();
    }
}