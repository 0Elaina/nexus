package com.nep.auth.aspect;

import java.util.Arrays;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import com.nep.common.annotation.RequireRole;
import com.nep.common.api.ApiCode;
import com.nep.common.context.CurrentUser;
import com.nep.common.context.UserContext;
import com.nep.common.exception.BusinessException;

/**
 * 角色权限校验 AOP 切面
 */
@Aspect
@Component
@Order(1)
public class RequireRoleAspect {

    @Before("@annotation(com.nep.common.annotation.RequireRole) || @within(com.nep.common.annotation.RequireRole)")
    public void checkRole(JoinPoint joinPoint) {
        RequireRole requireRole = null;

        // 优先获取方法级别的注解
        if (joinPoint.getSignature() instanceof MethodSignature signature) {
            requireRole = signature.getMethod().getAnnotation(RequireRole.class);
        }
        // 若方法上未标注，则降级获取目标类上的注解
        if (requireRole == null) {
            requireRole = joinPoint.getTarget().getClass().getAnnotation(RequireRole.class);
        }
        if (requireRole == null) {
            return;
        }

        // 1. 验证用户是否已登录 (非匿名)
        CurrentUser currentUser = UserContext.getUser();
        if (currentUser == null) {
            throw new BusinessException(ApiCode.UNAUTHORIZED);
        }

        // 2. 验证角色权限：若 value 为空，代表只需任意已登录角色即可
        String[] allowedRoles = requireRole.value();
        if (allowedRoles.length == 0) {
            return;
        }

        String userRole = currentUser.role();
        boolean hasPermission = Arrays.asList(allowedRoles).contains(userRole);
        if (!hasPermission) {
            throw new BusinessException(ApiCode.ACCESS_DENIED);
        }
    }
}
