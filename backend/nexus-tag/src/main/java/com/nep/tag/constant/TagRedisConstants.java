package com.nep.tag.constant;

import java.time.Duration;

public final class TagRedisConstants {
    private TagRedisConstants() {

    }

    public static final String TAG_ALL_KEY = "tag:all";
    public static final Duration TAG_ALL_TTL = Duration.ofMinutes(30);
}
