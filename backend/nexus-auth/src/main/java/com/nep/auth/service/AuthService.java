package com.nep.auth.service;

import com.nep.auth.dto.UserLoginDTO;
import com.nep.auth.vo.LoginResultVO;

public interface AuthService {
    /**
     * 用户账号密码登录并签发 JWT
     *
     * @param dto 登录入参
     * @return 登录结果 (Token + 基础信息)
     */
    LoginResultVO login(UserLoginDTO dto);

    /**
     * 用户退出登录并将 Token 加入 Redis 黑名单
     */
    void logout();
}
