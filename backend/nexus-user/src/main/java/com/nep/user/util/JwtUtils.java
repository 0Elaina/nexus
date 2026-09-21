package com.nep.user.util;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtils {
    @Value("${nexus.jwt.secret}")
    private String secret;
    // 默认 7 天
    @Value("${nexus.jwt.expire-ms:604800000}")
    private Long expireMs;

    /**
     * 生成 JWT 令牌
     * 
     * @param userId   用户 ID
     * @param username 用户名
     * @param role     角色
     * @return JWT 令牌
     */
    public String generateToken(Long userId, String username, String role) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + expireMs);
        return Jwts.builder()
                .subject(userId.toString())
                .claim("username", username)
                .claim("role", role)
                .issuedAt(now)
                .expiration(expiration)
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * 解析 JWT 令牌
     * 
     * @param token JWT 令牌
     * @return 解析后的 JWT 令牌
     */
    public Claims parseToken(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (JwtException | IllegalArgumentException e) {
            return null;
        }
    }

    /**
     * 获取 JWT 令牌剩余的 TTL 秒数
     * 
     * @param token JWT 令牌
     * @return 剩余的 TTL 秒数
     */
    public long getRemainingTtlSeconds(String token) {
        Claims claims = parseToken(token);
        if (claims == null) {
            return 0L;
        }
        Date expiration = claims.getExpiration();
        long diff = expiration.getTime() - System.currentTimeMillis();
        long seconds = diff / 1000;
        return seconds > 0 ? seconds : 0L;
    }

    /**
     * 验证 JWT 令牌是否有效
     * 
     * @param token JWT 令牌
     * @return 是否有效
     */
    public boolean validateToken(String token) {
        return parseToken(token) != null;
    }

    /**
     * 将 application.yml 中的长字符串转成 UTF-8 字节数组
     * 再转成 HMAC-SHA 安全密钥对象
     * 
     * @return HMAC-SHA 安全密钥对象
     */
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }
}
