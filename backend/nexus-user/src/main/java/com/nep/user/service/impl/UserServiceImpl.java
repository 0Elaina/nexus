package com.nep.user.service.impl;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.nep.common.api.ApiCode;
import com.nep.common.context.CurrentUser;
import com.nep.common.context.UserContext;
import com.nep.common.exception.BusinessException;
import com.nep.user.constant.UserApiCode;
import com.nep.user.dto.UserRegisterDTO;
import com.nep.user.entity.SysUser;
import com.nep.user.mapper.SysUserMapper;
import com.nep.user.service.UserService;
import com.nep.user.vo.UserVO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final PasswordEncoder passwordEncoder;
    private final SysUserMapper sysUserMapper;

    /**
     * 用户注册
     * 
     * @param dto 用户注册DTO
     * @return userVO 用户脱敏VO
     */
    @Override
    public UserVO register(UserRegisterDTO dto) {
        // 校验用户名是否存在
        Long count = sysUserMapper.selectCount(new LambdaQueryWrapper<SysUser>()
                .eq(SysUser::getUsername, dto.getUsername()));
        if (count > 0) {
            throw new BusinessException(UserApiCode.USERNAME_EXISTS);
        }

        // 组装用户实体类
        String passwordHash = passwordEncoder.encode(dto.getPassword());
        SysUser user = new SysUser();
        user.setUsername(dto.getUsername());
        user.setPassword(passwordHash);
        user.setEmail(dto.getEmail());
        user.setNickname(StringUtils.hasText(dto.getNickname()) ? dto.getNickname() : dto.getUsername());
        user.setRole(SysUser.ROLE_USER);
        user.setStatus(SysUser.STATUS_NORMAL);

        // 执行插入操作
        sysUserMapper.insert(user);

        return UserVO.from(user);
    }

    /**
     * 获取当前登录用户的详细个人信息
     *
     * @return 当前用户脱敏视图 VO
     */
    @Override
    public UserVO getCurrentUserInfo() {
        CurrentUser currentUser = UserContext.getUser();
        if (currentUser == null) {
            throw new BusinessException(ApiCode.UNAUTHORIZED);
        }
        SysUser user = sysUserMapper.selectById(currentUser.userId());
        if (user == null || SysUser.STATUS_DISABLED.equals(user.getStatus())) {
            throw new BusinessException(ApiCode.UNAUTHORIZED);
        }
        return UserVO.from(user);
    }
}
