package com.nep.article.vo;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

import com.nep.article.entity.Article;
import com.nep.tag.entity.Tag;

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
    @Builder.Default
    private List<Tag> tags = List.of();
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
                .tags(List.of())
                .createdAt(article.getCreatedAt())
                .updatedAt(article.getUpdatedAt())
                .build();
    }

    public static ArticleListItemVO from(Article article, List<Tag> tags) {
        return ArticleListItemVO.builder()
                .id(article.getId().toString())
                .title(article.getTitle())
                .summary(article.getSummary())
                .categoryId(article.getCategoryId().toString())
                .status(article.getStatus())
                .viewCount(article.getViewCount())
                .tags(tags)
                .createdAt(article.getCreatedAt())
                .updatedAt(article.getUpdatedAt())
                .build();
    }
}
