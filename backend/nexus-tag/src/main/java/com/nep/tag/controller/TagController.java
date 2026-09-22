package com.nep.tag.controller;

import java.util.List;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nep.common.annotation.RequireRole;
import com.nep.common.api.Result;
import com.nep.common.constant.RoleConstants;
import com.nep.common.page.PageQuery;
import com.nep.common.page.PageResult;
import com.nep.tag.entity.Tag;
import com.nep.tag.service.TagService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;

@Validated
@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
public class TagController {
    private final TagService tagService;

    /**
     * 获取所有标签
     *
     * @return 所有标签
     */
    @GetMapping
    public Result<List<Tag>> getAllTags() {
        return Result.success(tagService.getAllTags());
    }

    /**
     * 创建新标签
     *
     * @param name 标签名称
     */
    @RequireRole(RoleConstants.ROLE_ADMIN)
    @PostMapping
    public Result<Void> createTag(
            @RequestParam @NotBlank(message = "标签名称不能为空") @Size(max = 50, message = "标签名称最多 50 个字符") String name) {
        tagService.createTag(name);
        return Result.success();
    }

    /**
     * 更新标签名称
     *
     * @param id   标签 ID
     * @param name 新标签名称
     */
    @RequireRole(RoleConstants.ROLE_ADMIN)
    @PutMapping("/{id}")
    public Result<Void> updateTag(
            @PathVariable Long id,
            @RequestParam @NotBlank(message = "标签名称不能为空") @Size(max = 50, message = "标签名称最多 50 个字符") String name) {
        tagService.updateTag(id, name);
        return Result.success();
    }

    /**
     * 删除标签
     *
     * @param id 标签 ID
     */
    @RequireRole(RoleConstants.ROLE_ADMIN)
    @DeleteMapping("/{id}")
    public Result<Void> deleteTag(@PathVariable Long id) {
        tagService.deleteTag(id);
        return Result.success();
    }

    /**
     * 管理端分页查询标签列表
     *
     * @param query 分页查询参数
     * @return 分页查询结果
     */
    @RequireRole(RoleConstants.ROLE_ADMIN)
    @GetMapping("/page")
    public Result<PageResult<Tag>> pageQueryTags(
            @Valid PageQuery query) {
        return Result.success(tagService.pageQueryTags(query));
    }
}
