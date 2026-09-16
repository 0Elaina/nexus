package com.nep.common.page;

import java.util.List;

import com.baomidou.mybatisplus.core.metadata.IPage;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 分页结果
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PageResult<T> {
    private List<T> records;
    private Long total;
    private Long currentPage;
    private Long pageSize;

    /**
     * 从Mybatis-Plus分页结果创建分页结果对象
     * 
     * @param mpPage Mybatis-Plus分页结果
     * @return 分页结果对象
     */
    public static <T> PageResult<T> fromMpPage(IPage<T> mpPage) {
        return PageResult.<T>builder()
                .records(mpPage.getRecords())
                .total(mpPage.getTotal())
                .currentPage(mpPage.getCurrent())
                .pageSize(mpPage.getSize())
                .build();
    }
}
