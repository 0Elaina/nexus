package com.nep.tag.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.nep.tag.entity.Tag;

@Mapper
public interface TagMapper extends BaseMapper<Tag> {
    
}
