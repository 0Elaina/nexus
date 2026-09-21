package com.nep.user.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.nep.user.entity.SysUser;

@Mapper
public interface SysUserMapper extends BaseMapper<SysUser> {
    
}
