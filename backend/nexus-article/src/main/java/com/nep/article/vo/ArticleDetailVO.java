package com.nep.article.vo;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

import com.nep.article.entity.Article;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 文章详情VO
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArticleDetailVO implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    private String id;
    private String title;
    private String summary;
    private String content;
    private String categoryId;
    private String categoryName;
    private Integer status;
    private Long viewCount;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ArticleDetailVO fromArticle(Article article, String categoryName) {
        return ArticleDetailVO.builder()
                .id(article.getId().toString())
                .title(article.getTitle())
                .summary(article.getSummary())
                .content(article.getContent())
                .categoryId(article.getCategoryId().toString())
                .categoryName(categoryName)
                .status(article.getStatus())
                .viewCount(article.getViewCount())
                .createdAt(article.getCreatedAt())
                .updatedAt(article.getUpdatedAt())
                .build();
    }
}
