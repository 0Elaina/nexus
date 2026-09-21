package com.nep.user.vo;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

import com.nep.user.entity.SysUser;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserVO implements Serializable {
    @Serial
    private final static long serialVersionUID = 1L;

    private String id;
    private String username;
    private String nickname;
    private String avatar;
    private String email;
    private String role;
    private LocalDateTime createdAt;

    public static UserVO from(SysUser user) {
        return UserVO.builder()
                .id(user.getId().toString())
                .username(user.getUsername())
                .nickname(user.getNickname())
                .avatar(user.getAvatar())
                .email(user.getEmail())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
