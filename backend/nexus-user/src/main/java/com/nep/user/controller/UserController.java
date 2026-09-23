package com.nep.user.controller;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nep.common.annotation.RequireRole;
import com.nep.common.api.Result;
import com.nep.user.service.UserService;
import com.nep.user.vo.UserVO;

import lombok.RequiredArgsConstructor;

/**
 * 用户领域控制器 (注册与个人资料管理)
 */
@Validated
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * 用户注册
     * 
     * @param dto 用户注册DTO
     * @return 用户VO
     */
/*     @PostMapping("/register")
    public Result<UserVO> register(@Valid @RequestBody UserRegisterDTO dto) {
        return Result.success(userService.register(dto));
    } */

    /**
     * 获取当前登录用户信息
     * 
     * @return 用户VO
     */
    @RequireRole
    @GetMapping("/me")
    public Result<UserVO> getCurrentUser() {
        return Result.success(userService.getCurrentUserInfo());
    }
}
