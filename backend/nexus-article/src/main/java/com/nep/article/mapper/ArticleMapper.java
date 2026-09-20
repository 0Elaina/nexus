package com.nep.article.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.nep.article.entity.Article;

@Mapper
public interface ArticleMapper extends BaseMapper<Article> {
    
}
