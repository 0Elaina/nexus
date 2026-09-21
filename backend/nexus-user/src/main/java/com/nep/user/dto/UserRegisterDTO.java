package com.nep.user.dto;

import java.io.Serial;
import java.io.Serializable;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserRegisterDTO implements Serializable {
    @Serial
    private final static long serialVersionUID = 1L;

    @NotBlank(message = "用户名不能为空")
    @Size(min = 3, max = 30, message = "用户名长度为 3-30 个字符")
    private String username;

    @NotBlank(message = "密码不能为空")
    @Size(min = 6, max = 32, message = "密码长度为 6-32 个字符")
    private String password;

    @Size(max = 30, message = "昵称长度最多为 30 个字符")
    private String nickname;

    @Email(message = "邮箱格式错误")
    @Size(max = 100, message = "邮箱长度最多为 100 个字符")
    private String email;
}
