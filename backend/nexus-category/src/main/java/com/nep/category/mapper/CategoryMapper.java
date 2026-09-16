package com.nep.category.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.nep.category.entity.Category;

@Mapper
public interface CategoryMapper extends BaseMapper<Category> {
    
}
