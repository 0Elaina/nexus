package com.nep.auth.controller;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nep.auth.dto.UserLoginDTO;
import com.nep.auth.service.AuthService;
import com.nep.auth.vo.LoginResultVO;
import com.nep.common.annotation.RequireRole;
import com.nep.common.api.Result;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * 认证与授权控制器
 */
@Validated
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * 用户账号密码登录
     */
    @PostMapping("/login")
    public Result<LoginResultVO> login(@Valid @RequestBody UserLoginDTO dto) {
        return Result.success(authService.login(dto));
    }

    /**
     * 用户注销登录 (需要已登录状态)
     */
    @RequireRole
    @PostMapping("/logout")
    public Result<Void> logout() {
        authService.logout();
        return Result.success();
    }
}
