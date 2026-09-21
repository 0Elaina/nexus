package com.nep.common.context;

/**
 * 当前登录用户信息载体 (不可变 Record)
 */
public record CurrentUser(
        Long userId,
        String username,
        String role,
        String token) {

    /**
     * 便捷判断当前用户是否为管理员
     */
    public boolean isAdmin() {
        return "ROLE_ADMIN".equals(role);
    }
}
