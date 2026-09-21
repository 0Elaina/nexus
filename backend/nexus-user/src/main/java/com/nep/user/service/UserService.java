package com.nep.user.service;

import com.nep.user.dto.UserRegisterDTO;
import com.nep.user.vo.UserVO;

public interface UserService {
    /**
     * 用户注册
     * 
     * @param dto 用户注册DTO
     * @return userVO 用户脱敏VO
     */
    UserVO register(UserRegisterDTO dto);

    /**
     * 获取当前登录用户的详细个人信息
     *
     * @return 当前用户脱敏视图 VO
     */
    UserVO getCurrentUserInfo();
}
