package com.nep.article.entity;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@TableName("article")
public class Article implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    public static final Integer STATUS_DRAFT = 0;
    public static final Integer STATUS_PUBLISHED = 1;

    @TableId(type = IdType.AUTO)
    private Long id;

    private String title;
    private String summary;
    private String content;

    private Long categoryId;
    private Integer status;
    private Long viewCount;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;

}