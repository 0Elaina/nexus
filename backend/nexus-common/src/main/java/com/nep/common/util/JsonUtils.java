package com.nep.common.util;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class JsonUtils {
    private static ObjectMapper objectMapper;

    // 构造器注入 ObjectMapper
    public JsonUtils(ObjectMapper objectMapper) {
        JsonUtils.objectMapper = objectMapper;
    }

    /**
     * 将对象转换为 JSON 字符串
     * 
     * @param obj 要转换的对象
     * @return JSON 字符串
     */
    public static String toJson(Object obj) {
        if (obj == null) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("JSON 序列化失败", e);
        }
    }

    /**
     * 将 JSON 字符串转换为对象
     * 
     * @param json JSON 字符串
     * @param type 目标对象类型
     * @param <T>  目标对象类型
     * @return 转换后的对象
     */
    public static <T> T fromJson(String json, Class<T> type) {
        if (!StringUtils.hasText(json)) {
            return null;
        }

        try {
            return objectMapper.readValue(json, type);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("JSON 反序列化失败", e);
        }
    }

    /**
     * 将 JSON 字符串转换为对象，支持泛型类型
     * 
     * @param json          JSON 字符串
     * @param typeReference 目标对象类型引用
     * @param <T>           目标对象类型
     * @return 转换后的对象
     */
    public static <T> T fromJson(String json, TypeReference<T> typeReference) {
        if (!StringUtils.hasText(json)) {
            return null;
        }
        try {
            return objectMapper.readValue(json, typeReference);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("JSON 反序列化失败", e);
        }
    }
}
