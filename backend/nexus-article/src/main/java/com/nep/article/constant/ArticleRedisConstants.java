package com.nep.article.constant;

import java.time.Duration;

/**
 * 文章模块 Redis 缓存与高频计数键常量
 */
public final class ArticleRedisConstants {

    private ArticleRedisConstants() {
        // 工具常量类禁止实例化
    }

    /**
     * 存储所有文章绝对浏览量的全局 Hash
     * @param articleId 文章ID
     * @param viewCount 浏览量
     */
    public static final String KEY_ARTICLE_VIEW_COUNT = "article:view_count";

    /**
     * 记录发生过自增的文章 ID 集合（Set），供定时任务削峰落库
     * @param articleId 文章ID
     */
    public static final String KEY_ARTICLE_VIEW_DIRTY = "article:view_count:dirty";

    /**
     * 防刷冷却键前缀
     * @param articleId 文章ID
     * @param clientIp 客户端IP地址
     */
    public static final String KEY_PREFIX_UV = "article:uv:";

    /**
     * 访客防刷冷却窗口时长（10 分钟）
     */
    public static final Duration UV_COOLDOWN = Duration.ofMinutes(10);
}
