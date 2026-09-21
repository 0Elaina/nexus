package com.nep.user.interceptor;

import org.jspecify.annotations.Nullable;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.nep.common.context.CurrentUser;
import com.nep.common.context.UserContext;
import com.nep.common.exception.BusinessException;
import com.nep.user.constant.AuthConstants;
import com.nep.user.constant.UserApiCode;
import com.nep.user.entity.SysUser;
import com.nep.user.util.JwtUtils;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthInterceptor implements HandlerInterceptor {
    private final StringRedisTemplate stringRedisTemplate;
    private final JwtUtils jwtUtils;


    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler,
            @Nullable Exception ex) throws Exception {
        UserContext.clear();
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith(AuthConstants.BEARER_PREFIX)) {
            throw new BusinessException(UserApiCode.UNAUTHORIZED);
        }
        String token = authHeader.substring(AuthConstants.BEARER_PREFIX.length());
        Boolean isBlacklisted = stringRedisTemplate.hasKey(AuthConstants.BLACKLIST_KEY + token);
        if (Boolean.TRUE.equals(isBlacklisted)) {
            throw new BusinessException(UserApiCode.UNAUTHORIZED);
        }

        // 提取 Claims 载荷信息
        Claims claims = jwtUtils.parseToken(token);
        if (claims == null) {
            throw new BusinessException(UserApiCode.UNAUTHORIZED);
        }

        // 从token中获取用户信息
        Long userId = Long.valueOf(claims.getSubject());
        String role = claims.get("role", String.class);
        CurrentUser currentUser = new CurrentUser(userId, role, token);

        // 检查用户是否有访问权限
        String uri = request.getRequestURI();
        if (uri.startsWith("/api/admin") && !SysUser.ROLE_ADMIN.equals(role)) {
            throw new BusinessException(UserApiCode.ACCESS_DENIED);
        }

        UserContext.set(currentUser);
        return true;
    }

}
