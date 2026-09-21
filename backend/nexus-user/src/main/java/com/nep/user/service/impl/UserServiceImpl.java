package com.nep.user.service.impl;

import java.time.Duration;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.nep.common.context.CurrentUser;
import com.nep.common.context.UserContext;
import com.nep.common.exception.BusinessException;
import com.nep.user.constant.AuthConstants;
import com.nep.user.constant.UserApiCode;
import com.nep.user.dto.UserLoginDTO;
import com.nep.user.dto.UserRegisterDTO;
import com.nep.user.entity.SysUser;
import com.nep.user.mapper.SysUserMapper;
import com.nep.user.service.UserService;
import com.nep.user.util.JwtUtils;
import com.nep.user.vo.LoginResultVO;
import com.nep.user.vo.UserVO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final PasswordEncoder passwordEncoder;
    private final SysUserMapper sysUserMapper;
    private final JwtUtils jwtUtils;
    private final StringRedisTemplate stringRedisTemplate;

    /**
     * 用户注册
     * 
     * @param dto dto 用户注册DTO
     * @return userVO 用户VO
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
     * 登录
     * 
     * @param dto 登录入参（账号、密码）
     * @return 登录结果VO（Token + 用户基础信息）
     */
    @Override
    public LoginResultVO login(UserLoginDTO dto) {
        // 检验登录失败次数是否超过最大次数
        String failKey = AuthConstants.LOGIN_FAIL_KEY + dto.getUsername();
        String failCountStr = stringRedisTemplate.opsForValue().get(failKey);
        if (failCountStr != null && Integer.parseInt(failCountStr) >= AuthConstants.MAX_LOGIN_FAIL_COUNT) {
            throw new BusinessException(UserApiCode.ACCOUNT_LOCKED);
        }

        SysUser user = sysUserMapper.selectOne(new LambdaQueryWrapper<SysUser>()
                .eq(SysUser::getUsername, dto.getUsername()));
        if (user == null || !passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            Long currentFailCount = stringRedisTemplate.opsForValue().increment(failKey);
            // 首次失败，设置过期时间为 15 分钟
            if (currentFailCount != null && currentFailCount == 1) {
                stringRedisTemplate.expire(failKey, Duration.ofMinutes(AuthConstants.FAIL_EXPIRE_MINUTES));
            }

            // 兜底检查, 补充过期时间, 避免过期时间
            if (currentFailCount != null
                    && (currentFailCount == 1
                            || stringRedisTemplate.getExpire(failKey) < 0)) {
                stringRedisTemplate.expire(failKey, Duration.ofMinutes(AuthConstants.FAIL_EXPIRE_MINUTES));
            }

            // 登录失败次数超过最大次数，锁定账号
            if (currentFailCount >= AuthConstants.MAX_LOGIN_FAIL_COUNT) {
                throw new BusinessException(UserApiCode.ACCOUNT_LOCKED);
            }

            throw new BusinessException(UserApiCode.LOGIN_FAILED);
        }
        if (SysUser.STATUS_DISABLED.equals(user.getStatus())) {
            throw new BusinessException(UserApiCode.USER_DISABLED);
        }

        // 签发 Jwt 令牌
        String token = jwtUtils.generateToken(user.getId(), user.getUsername(), user.getRole());
        // 登录成功，删除登录失败计数
        stringRedisTemplate.delete(failKey);

        return LoginResultVO.from(user, token);
    }

    /**
     * 退出登录（注销 Token）
     */
    @Override
    public void logout() {
        CurrentUser user = UserContext.getUser();
        if (user == null || !StringUtils.hasText(user.token())) {
            return;
        }

        String token = user.token();
        long remainingSeconds = jwtUtils.getRemainingTtlSeconds(token);
        if (remainingSeconds > 0) {
            stringRedisTemplate.opsForValue().set(AuthConstants.BLACKLIST_KEY + token, "1",
                    Duration.ofSeconds(remainingSeconds));
        }
    }

    /**
     * 获取当前登录用户的详细个人信息
     *
     * @return 当前用户脱敏视图 VO
     */
    public UserVO getCurrentUserInfo() {
        CurrentUser currentUser = UserContext.getUser();
        if (currentUser == null) {
            throw new BusinessException(UserApiCode.UNAUTHORIZED);
        }
        SysUser user = sysUserMapper.selectById(currentUser.userId());
        if (user == null || SysUser.STATUS_DISABLED.equals(user.getStatus())) {
            throw new BusinessException(UserApiCode.UNAUTHORIZED);
        }
        return UserVO.from(user);
    }
}
