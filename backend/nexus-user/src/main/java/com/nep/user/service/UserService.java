package com.nep.user.service;

import com.nep.user.dto.UserLoginDTO;
import com.nep.user.dto.UserRegisterDTO;
import com.nep.user.vo.LoginResultVO;
import com.nep.user.vo.UserVO;

public interface UserService {
    /**
     * 用户注册
     * 
     * @param dto dto 用户注册DTO
     * @return userVO 用户VO
     */
    UserVO register(UserRegisterDTO dto);

    /**
     * 登录
     * 
     * @param dto 登录入参（账号、密码）
     * @return 登录结果VO（Token + 用户基础信息）
     */
    LoginResultVO login(UserLoginDTO dto);

    /**
     * 退出登录（注销 Token）
     *
     */
    void logout();

    /**
     * 获取当前登录用户的详细个人信息
     *
     * @return 当前用户脱敏视图 VO
     */
    UserVO getCurrentUserInfo();
}
