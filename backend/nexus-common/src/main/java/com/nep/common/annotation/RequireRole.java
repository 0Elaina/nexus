package com.nep.common.annotation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 接口角色权限要求注解
 */
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface RequireRole {
    /**
     * 允许访问的角色名称列表（例如 "ROLE_ADMIN"、"ROLE_USER"）
     * 缺省为空数组，代表任意已登录用户均可访问
     */
    String[] value() default {};
}
