package com.nep.article.vo;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

import com.nep.article.entity.Article;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArticleListItemVO implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    private String id;
    private String title;
    private String summary;
    private String categoryId;
    private Integer status;
    private Long viewCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ArticleListItemVO from(Article article) {
        return ArticleListItemVO.builder()
                .id(article.getId().toString())
                .title(article.getTitle())
                .summary(article.getSummary())
                .categoryId(article.getCategoryId().toString())
                .status(article.getStatus())
                .viewCount(article.getViewCount())
                .createdAt(article.getCreatedAt())
                .updatedAt(article.getUpdatedAt())
                .build();
    }
}
