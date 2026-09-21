package com.nep.common.util;

import org.springframework.util.StringUtils;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import jakarta.servlet.http.HttpServletRequest;

public final class IpUtils {
    private IpUtils() {
    }

    private static final String UNKNOWN = "unknown";
    private static final String LOCALHOST_IPV6 = "0:0:0:0:0:0:0:1";
    private static final String LOCALHOST_IPV4 = "127.0.0.1";

    // 常见的代理请求头候选列表（优先级从高到低）
    private static final String[] IP_HEADER_CANDIDATES = {
            "X-Forwarded-For",
            "X-Real-IP",
            "Proxy-Client-IP",
            "WL-Proxy-Client-IP",
            "HTTP_CLIENT_IP",
            "HTTP_X_FORWARDED_FOR"
    };

    /**
     * 获取客户端IP地址
     * 
     * @param request HttpServletRequest对象
     * @return 客户端IP地址
     */
    public static String getClientIp() {
        RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();

        if (requestAttributes instanceof ServletRequestAttributes attributes) {
            HttpServletRequest request = attributes.getRequest();
            return getClientIp(request);
        }
        return LOCALHOST_IPV4;

    }

    /**
     * 获取客户端IP地址
     * @param request HttpServletRequest对象
     * @return 客户端IP地址
     */
    public static String getClientIp(HttpServletRequest request) {
        if (request == null) {
            return LOCALHOST_IPV4;
        }

        String ip = null;
        for (String header : IP_HEADER_CANDIDATES) {
            String value = request.getHeader(header);
            if (isValidIp(value)) {
                ip = value;
                break;
            }
        }

        // 如果所有 Header 都没有命中，使用 Servlet 原生 socket 对端 IP 兜底
        if (!isValidIp(ip)) {
            ip = request.getRemoteAddr();
        }

        // 如果有多个IP，取第一个有效IP
        if (StringUtils.hasText(ip) && ip.contains(",")) {
            String[] parts = ip.split(",");
            for (String part : parts) {
                String normalizePart = part.strip();
                if (isValidIp(normalizePart)) {
                    ip = normalizePart;
                    break;
                }
            }
        }

        if (LOCALHOST_IPV6.equals(ip) || "::1".equals(ip)) {
            ip = LOCALHOST_IPV4;
        }
        return ip;
    }

    /**
     * 检查IP地址是否有效
     * 
     * @param ip IP地址
     * @return 是否有效
     */
    private static boolean isValidIp(String ip) {
        return StringUtils.hasText(ip) && !UNKNOWN.equalsIgnoreCase(ip.strip());
    }

}
