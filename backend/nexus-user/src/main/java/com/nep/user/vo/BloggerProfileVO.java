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
public class BloggerProfileVO implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    private String nickname;
    private String avatar;
    private String email;

    public static BloggerProfileVO from(SysUser user) {
        if (user == null)
            return null;
        return BloggerProfileVO.builder()
                .nickname(user.getNickname())
                .avatar(user.getAvatar())
                .email(user.getEmail())
                .build();
    }
}
