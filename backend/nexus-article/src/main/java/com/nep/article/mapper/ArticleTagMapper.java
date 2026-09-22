package com.nep.article.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.nep.article.entity.ArticleTag;

@Mapper
public interface ArticleTagMapper extends BaseMapper<ArticleTag> {
    
}
