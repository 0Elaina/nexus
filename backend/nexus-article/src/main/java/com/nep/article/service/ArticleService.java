package com.nep.article.service;

import com.nep.article.dto.ArticlePageQuery;
import com.nep.article.dto.ArticleSaveDTO;
import com.nep.article.vo.ArticleDetailVO;
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

    /**
     * 创建文章
     * 
     * @param dto 文章保存DTO
     * @return 创建的文章ID
     */
    Long createArticle(ArticleSaveDTO dto);

    /**
     * 获取文章详情
     * 
     * @param id 文章ID
     * @return 文章详情VO
     * @throws BusinessException 如果文章不存在
     */
    ArticleDetailVO getArticleDetail(Long id);

    /**
     * 修改文章
     *
     * @param id  文章主键 ID
     * @param dto 文章保存DTO
     */
    void updateArticle(Long id, ArticleSaveDTO dto);

    /**
     * 删除文章
     *
     * @param id 文章主键 ID
     */
    void deleteArticle(Long id);

    /**
     * 获取已发布文章总数
     *
     * @return 已发布文章总数
     */
    Long getPublishedArticleCount();

    /**
     * 获取全站文章总浏览量
     *
     * @return 全站文章总浏览量
     */
    Long getTotalViewCount();
}
