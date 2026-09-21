package com.nep.user.controller;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nep.common.api.Result;
import com.nep.user.dto.UserLoginDTO;
import com.nep.user.dto.UserRegisterDTO;
import com.nep.user.service.UserService;
import com.nep.user.vo.LoginResultVO;
import com.nep.user.vo.UserVO;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

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
    @PostMapping("/register")
    public Result<UserVO> register(@Valid @RequestBody UserRegisterDTO dto) {
        return Result.success(userService.register(dto));
    }

    /**
     * 用户登录
     * 
     * @param dto 登录参数
     * @return 登录结果VO
     */
    @PostMapping("/login")
    public Result<LoginResultVO> login(@Valid @RequestBody UserLoginDTO dto) {
        return Result.success(userService.login(dto));
    }

    /**
     * 用户注销
     * 
     * @return 空结果
     */
    @PostMapping("/logout")
    public Result<Void> logout() {
        userService.logout();
        return Result.success();
    }

    /**
     * 获取当前用户信息
     * 
     * @return 用户VO
     */
    @GetMapping("/me")
    public Result<UserVO> getCurrentUser() {
        return Result.success(userService.getCurrentUserInfo());
    }

}
