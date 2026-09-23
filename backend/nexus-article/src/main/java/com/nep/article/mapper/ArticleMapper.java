package com.nep.article.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.nep.article.entity.Article;

@Mapper
public interface ArticleMapper extends BaseMapper<Article> {
    int batchUpdateViewCount(@Param("articles") List<Article> articles);

    /**
     * 统计所有已发布文章的总阅读量
     */
    @Select("SELECT COALESCE(SUM(view_count), 0) FROM article WHERE status = 1")
    Long selectTotalViewCount();
}
