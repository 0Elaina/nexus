package com.nep.category.controller;

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

import com.nep.category.entity.Category;
import com.nep.category.service.CategoryService;
import com.nep.common.api.Result;
import com.nep.common.page.PageQuery;
import com.nep.common.page.PageResult;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;

@Validated
@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    /**
     * 获取所有分类，按排序顺序和ID升序排序
     * 
     * @return 所有分类列表
     */
    @GetMapping
    public Result<List<Category>> getAllCategories() {
        return Result.success(categoryService.getAllCategories());
    }

    /**
     * 创建分类
     * 
     * @param name 分类名称
     */
    @PostMapping
    public Result<Void> createCategory(
            @RequestParam @NotBlank(message = "分类名称不能为空") @Size(max = 50, message = "分类名称最多50个字符") String name) {
        categoryService.createCategory(name);
        return Result.success();
    }

    /**
     * 更新分类
     * 
     * @param id   分类ID
     * @param name 分类名称
     */
    @PutMapping("/{id}")
    public Result<Void> updateCategory(
            @PathVariable Long id,
            @RequestParam @NotBlank(message = "分类名称不能为空") @Size(max = 50, message = "分类名称最多50个字符") String name) {
        categoryService.updateCategory(id, name);
        return Result.success();
    }

    /**
     * 删除分类
     * 
     * @param id 分类ID
     */
    @DeleteMapping("/{id}")
    public Result<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return Result.success();
    }

    /**
     * 分页查询分类
     * 
     * @param query 分页查询参数
     * @return 分页查询结果
     */
    @GetMapping("/page")
    public Result<PageResult<Category>> pageQueryCategories(@Valid PageQuery query) {
        return Result.success(categoryService.pageQueryCategories(query));
    }

}
