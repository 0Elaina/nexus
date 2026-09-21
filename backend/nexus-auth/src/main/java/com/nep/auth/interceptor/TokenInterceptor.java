package com.nep.auth.interceptor;

import org.jspecify.annotations.Nullable;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.HandlerInterceptor;

import com.nep.auth.constant.AuthConstants;
import com.nep.auth.util.JwtUtils;
import com.nep.common.context.CurrentUser;
import com.nep.common.context.UserContext;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

/**
 * 全局身份识别拦截器 (无侵入解析 Bearer Token 并注入 UserContext)
 */
@Component
@RequiredArgsConstructor
public class TokenInterceptor implements HandlerInterceptor {

    private final JwtUtils jwtUtils;
    private final StringRedisTemplate stringRedisTemplate;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (StringUtils.hasText(authHeader) && authHeader.startsWith(AuthConstants.BEARER_PREFIX)) {
            String token = authHeader.substring(AuthConstants.BEARER_PREFIX.length()).strip();

            // 1. 检查 Redis 黑名单 (主动注销的令牌)
            Boolean isBlacklisted = stringRedisTemplate.hasKey(AuthConstants.BLACKLIST_KEY + token);
            if (!Boolean.TRUE.equals(isBlacklisted)) {
                // 2. 解析 Claims
                Claims claims = jwtUtils.parseToken(token);
                if (claims != null) {
                    Long userId = Long.valueOf(claims.getSubject());
                    String username = claims.get("username", String.class);
                    String role = claims.get("role", String.class);

                    CurrentUser currentUser = new CurrentUser(userId, username, role, token);
                    UserContext.set(currentUser);
                }
            }
        }

        // 无论是否登录均放行，具体方法权限由 @RequireRole 切面裁决
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler,
            @Nullable Exception ex) {
        // 请求结束后必须清理，终极防范线程池复用上下文污染
        UserContext.clear();
    }
}
