package com.nep.auth.service.impl;

import java.time.Duration;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.nep.auth.constant.AuthConstants;
import com.nep.auth.dto.UserLoginDTO;
import com.nep.auth.service.AuthService;
import com.nep.auth.util.JwtUtils;
import com.nep.auth.vo.LoginResultVO;
import com.nep.common.context.CurrentUser;
import com.nep.common.context.UserContext;
import com.nep.common.exception.BusinessException;
import com.nep.user.constant.UserApiCode;
import com.nep.user.entity.SysUser;
import com.nep.user.mapper.SysUserMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final PasswordEncoder passwordEncoder;
    private final SysUserMapper sysUserMapper;
    private final JwtUtils jwtUtils;
    private final StringRedisTemplate stringRedisTemplate;

    @Override
    public LoginResultVO login(UserLoginDTO dto) {
        // 1. 检验登录失败次数是否超限
        String failKey = AuthConstants.LOGIN_FAIL_KEY + dto.getUsername();
        String failCountStr = stringRedisTemplate.opsForValue().get(failKey);
        if (failCountStr != null && Integer.parseInt(failCountStr) >= AuthConstants.MAX_LOGIN_FAIL_COUNT) {
            throw new BusinessException(UserApiCode.ACCOUNT_LOCKED);
        }

        // 2. 查询用户并核验密码
        SysUser user = sysUserMapper.selectOne(new LambdaQueryWrapper<SysUser>()
                .eq(SysUser::getUsername, dto.getUsername()));
        if (user == null || !passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            Long currentFailCount = stringRedisTemplate.opsForValue().increment(failKey);
            if (currentFailCount != null && (currentFailCount == 1 || stringRedisTemplate.getExpire(failKey) < 0)) {
                stringRedisTemplate.expire(failKey, Duration.ofMinutes(AuthConstants.FAIL_EXPIRE_MINUTES));
            }

            if (currentFailCount != null && currentFailCount >= AuthConstants.MAX_LOGIN_FAIL_COUNT) {
                throw new BusinessException(UserApiCode.ACCOUNT_LOCKED);
            }

            throw new BusinessException(UserApiCode.LOGIN_FAILED);
        }

        // 3. 校验账号状态
        if (SysUser.STATUS_DISABLED.equals(user.getStatus())) {
            throw new BusinessException(UserApiCode.USER_DISABLED);
        }

        // 4. 签发 JWT 令牌
        String token = jwtUtils.generateToken(user.getId(), user.getUsername(), user.getRole());

        // 5. 登录成功清除失败计数
        stringRedisTemplate.delete(failKey);

        return LoginResultVO.from(user, token);
    }

    @Override
    public void logout() {
        CurrentUser user = UserContext.getUser();
        if (user == null || !StringUtils.hasText(user.token())) {
            return;
        }

        String token = user.token();
        long remainingSeconds = jwtUtils.getRemainingTtlSeconds(token);
        if (remainingSeconds > 0) {
            stringRedisTemplate.opsForValue().set(
                    AuthConstants.BLACKLIST_KEY + token,
                    "1",
                    Duration.ofSeconds(remainingSeconds)
            );
        }
    }
}
