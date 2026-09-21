package com.nep.article.task;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.nep.article.constant.ArticleRedisConstants;
import com.nep.article.entity.Article;
import com.nep.article.mapper.ArticleMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class ArticleViewCountSync {
    private final ArticleMapper articleMapper;
    private final StringRedisTemplate stringRedisTemplate;

    private static final long dirtyBatchSize = 500L;

    @Scheduled(cron = "${nexus.article.view-count-sync-cron:0 */5 * * * ?}")
    public void syncArticleViewCount() {
        List<String> dirtyIds = stringRedisTemplate.opsForSet().pop(ArticleRedisConstants.KEY_ARTICLE_VIEW_DIRTY,
                dirtyBatchSize);
        if (dirtyIds == null || dirtyIds.isEmpty()) {
            return;
        }
        List<Object> dirtyIdObjs = dirtyIds.stream().map(id -> (Object) id).toList();
        List<Object> latestViewCountObjs = stringRedisTemplate.opsForHash()
                .multiGet(ArticleRedisConstants.KEY_ARTICLE_VIEW_COUNT, dirtyIdObjs);

        // 构建更新列表
        List<Article> updateList = new ArrayList<>();
        for (int i = 0; i < dirtyIds.size(); i++) {
            String idStr = dirtyIds.get(i);
            Object countObj = latestViewCountObjs.get(i);
            if (countObj != null) {
                Article article = new Article();
                article.setId(Long.parseLong(idStr));
                article.setViewCount(Long.parseLong(countObj.toString()));
                updateList.add(article);
            }
        }

        // 批量更新数据库
        if (updateList != null && !updateList.isEmpty()) {
            int rows = articleMapper.batchUpdateViewCount(updateList);
            log.info("ArticleViewCountSyncTask: 文章浏览量定时削峰落库完成，本次成功批量同步 {} 篇文章至数据库", rows);
        }

    }
}
