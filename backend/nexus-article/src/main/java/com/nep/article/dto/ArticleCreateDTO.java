package com.nep.article.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArticleCreateDTO {
    @NotBlank(message = "文章标题不能为空")
    @Size(max = 150, message = "文章标题最多150个字符")
    private String title;

    @NotBlank(message = "文章内容不能为空")
    private String content;

    @NotNull(message = "文章分类不能为 null")
    @Positive(message = "文章分类必须为正整数")
    private Long categoryId;

    @Size(max = 300, message = "文章摘要最多300个字符")
    private String summary;

    @NotNull(message = "文章状态不能为 null")
    @Min(value = 0, message = "文章状态必须大于等于0")
    @Max(value = 1, message = "文章状态必须小于等于1")
    private Integer status;
}
