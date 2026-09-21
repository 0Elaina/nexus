package com.nep.article.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.nep.article.entity.Article;

@Mapper
public interface ArticleMapper extends BaseMapper<Article> {
    int batchUpdateViewCount(@Param("articles") List<Article> articles);
}
