package com.nep.common.context;

public final class UserContext {
    private UserContext() {

    }

    private static final ThreadLocal<CurrentUser> CONTEXT = new ThreadLocal<>();

    public static void set(CurrentUser user) {
        CONTEXT.set(user);
    }

    public static CurrentUser getUser() {
        return CONTEXT.get();
    }

    public static void clear() {
        CONTEXT.remove();
    }
}