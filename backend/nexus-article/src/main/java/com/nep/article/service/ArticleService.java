package com.nep.article.service;

import com.nep.article.dto.ArticlePageQuery;
import com.nep.article.vo.ArticleListItemVO;
import com.nep.common.page.PageResult;

public interface ArticleService {
    /**
     * 分页查询文章列表
     * 
     * @param query 分页查询参数
     * @return 文章列表VO列表
     */
    PageResult<ArticleListItemVO> pageArticles(ArticlePageQuery query);
}
