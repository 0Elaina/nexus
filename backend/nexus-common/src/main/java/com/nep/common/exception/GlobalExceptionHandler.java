package com.nep.common.exception;

import org.springframework.context.MessageSourceResolvable;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;

import com.nep.common.api.ApiCode;
import com.nep.common.api.Result;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * 处理业务异常
     * 
     * @param e 业务异常
     * @return 异常结果
     */
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<Result<Void>> handleBusinessException(BusinessException e) {
        ApiCode apiCode = e.getApiCode();
        return ResponseEntity.status(apiCode.getStatus())
                .body(Result.error(apiCode.getCode(), apiCode.getMessage()));
    }

    /**
     * 处理参数校验异常
     * 
     * @param e 参数校验异常
     * @return 异常结果
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Result<Void>> handleValidationException(MethodArgumentNotValidException e) {
        String message = e.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .filter(value -> value != null & !value.isBlank())
                .findFirst()
                .orElse("参数校验失败");
        return ResponseEntity.badRequest()
                .body(Result.error(ApiCode.BAD_REQUEST.getCode(), message));
    }

    /**
     * 处理方法入参校验异常 (Spring Boot 4 / Spring 6.1+ 默认抛出此类)
     * 对应: @RequestParam @NotBlank 校验未通过
     * 
     * @param e 方法入参校验异常
     * @return 异常结果
     */
    @ExceptionHandler(HandlerMethodValidationException.class)
    public ResponseEntity<Result<Void>> handleHandlerMethodValidationException(HandlerMethodValidationException e) {
        String message = e.getAllErrors().stream()
                .map(MessageSourceResolvable::getDefaultMessage)
                .filter(msg -> msg != null && !msg.isBlank())
                .findFirst()
                .orElse("参数校验失败");
        return ResponseEntity.badRequest()
                .body(Result.error(ApiCode.BAD_REQUEST.getCode(), message));
    }

    /**
     * 处理缺少必填请求参数异常
     * 对应: 完全漏传了 ?name= 参数
     * 
     * @param e 缺少必填请求参数异常
     * @return 异常结果
     */
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<Result<Void>> handleMissingServletRequestParameterException(
            MissingServletRequestParameterException e) {
        String message = "缺少必填参数: " + e.getParameterName();
        return ResponseEntity.badRequest()
                .body(Result.error(ApiCode.BAD_REQUEST.getCode(), message));
    }

    /**
     * 兼容处理底层 ConstraintViolationException
     * 
     * @param e 底层 ConstraintViolationException 异常
     * @return 异常结果
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Result<Void>> handleConstraintViolationException(ConstraintViolationException e) {
        String message = e.getConstraintViolations().stream()
                .map(ConstraintViolation::getMessage)
                .filter(msg -> msg != null && !msg.isBlank())
                .findFirst()
                .orElse("参数校验失败");
        return ResponseEntity.badRequest()
                .body(Result.error(ApiCode.BAD_REQUEST.getCode(), message));
    }

    /**
     * 处理请求体格式错误异常
     * 
     * @param e 请求体格式错误异常
     * @return 异常结果
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Result<Void>> handleUnReadableException(HttpMessageNotReadableException e) {
        return ResponseEntity.badRequest()
                .body(Result.error(ApiCode.BAD_REQUEST.getCode(), "请求体格式错误"));
    }

    /**
     * 处理服务器内部错误异常
     * 
     * @param e 服务器内部错误异常
     * @return 异常结果
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Result<Void>> handleException(Exception e) {
        log.error("服务器内部错误", e);
        ApiCode apiCode = ApiCode.INTERNAL_SERVER_ERROR;
        return ResponseEntity.status(apiCode.getStatus())
                .body(Result.error(apiCode.getCode(), apiCode.getMessage()));
    }
}
