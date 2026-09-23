package com.nep.article.dto;

import java.io.Serial;
import java.util.List;

import com.nep.common.page.PageQuery;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)
public class ArticlePageQuery extends PageQuery {
    @Serial
    private static final long serialVersionUID = 1L;

    @Size(max = 50, message = "搜索关键词长度不能超过50个字符")
    private String keyword;

    @Positive(message = "分类ID必须为正整数")
    private Long categoryId;

    @Min(value = 0, message = "文章状态取值不合法")
    @Max(value = 1, message = "文章状态取值不合法")
    private Integer status;

    @Size(max = 20, message = "排序字段名称过长")
    private String sortBy;

    private List<@Positive(message = "标签ID必须为正整数") Long> tagIds;
    private Boolean matchAllTags = false;

    private Boolean isAsc = false;
}
