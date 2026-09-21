package com.nep.user.vo;

import java.io.Serial;
import java.io.Serializable;

import com.nep.user.entity.SysUser;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResultVO implements Serializable {
    @Serial
    private final static long serialVersionUID = 1L;

    private String token;
    private String id;
    private String username;
    private String nickname;
    private String avatar;
    private String role;

    public static LoginResultVO from(SysUser user, String token) {
        return LoginResultVO.builder()
                .token(token)
                .id(user.getId().toString())
                .username(user.getUsername())
                .nickname(user.getNickname())
                .avatar(user.getAvatar())
                .role(user.getRole())
                .build();
    }
}
