package com.nep.article.runner;

import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.nep.article.constant.ArticleRedisConstants;
import com.nep.article.entity.Article;
import com.nep.article.mapper.ArticleMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class ArticleViewCountRunner implements ApplicationRunner {
    private final ArticleMapper articleMapper;
    private final StringRedisTemplate stringRedisTemplate;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        if (Boolean.TRUE.equals(stringRedisTemplate.hasKey(ArticleRedisConstants.KEY_ARTICLE_VIEW_COUNT))) {
            log.info("ArticleViewCountRunner: Redis 已存在文章浏览量 Hash，跳过初始化");
            return;
        }

        // 从数据库查询所有已发布的文章的浏览量
        Map<String, String> dbViewCountMap = articleMapper.selectList(new LambdaQueryWrapper<Article>()
                .select(Article::getId, Article::getViewCount)
                .eq(Article::getStatus, Article.STATUS_PUBLISHED))
                .stream()
                .collect(Collectors.toMap(
                        a -> String.valueOf(a.getId()),
                        a -> String.valueOf(a.getViewCount() == null ? 0L : a.getViewCount())));

        if (dbViewCountMap != null && !dbViewCountMap.isEmpty()) {
            stringRedisTemplate.opsForHash().putAll(ArticleRedisConstants.KEY_ARTICLE_VIEW_COUNT, dbViewCountMap);
            log.info("ArticleViewCountRunner: 文章浏览量启动预热完成，共加载 {} 篇文章至 Redis", dbViewCountMap.size());
        }
    }

}
