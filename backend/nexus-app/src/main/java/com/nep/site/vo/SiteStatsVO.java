package com.nep.site.vo;

import java.io.Serial;
import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 全站宏观数据统计视图对象
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SiteStatsVO implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 已发布文章总数
     */
    private Long articleCount;

    /**
     * 分类总数
     */
    private Long categoryCount;

    /**
     * 标签总数
     */
    private Long tagCount;

    /**
     * 全站总阅读量 (PV)
     */
    private Long totalViewCount;
}
