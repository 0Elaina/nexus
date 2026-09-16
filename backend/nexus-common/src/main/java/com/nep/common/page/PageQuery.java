package com.nep.common.page;

import lombok.Data;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

/**
 * 分页查询参数
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageQuery {
    @Positive(message = "页码必须是正整数")
    private Long pageNum = 1L;
    @Positive(message = "每页数量必须是正整数")
    @Max(value = 100, message = "每页数量不能超过100")
    private Long pageSize = 10L;

    public <T> Page<T> toMpPage() {
        return new Page<>(pageNum, pageSize);
    }
}
