package com.nep.common.context;

public record CurrentUser(
        Long userId,
        String role,
        String token) {
}
