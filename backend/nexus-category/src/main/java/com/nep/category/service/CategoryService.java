package com.nep.category.service;

import java.util.List;

import com.nep.category.entity.Category;
import com.nep.common.page.PageQuery;
import com.nep.common.page.PageResult;

public interface CategoryService {
    /**
     * 获取所有分类，按ID升序排序
     * 
     * @return 所有分类列表
     */
    List<Category> getAllCategories();

    /**
     * 创建分类
     * 
     * @param name 分类名称
     */
    void createCategory(String name);

    /**
     * 更新分类
     * 
     * @param id 分类ID
     */
    void updateCategory(Long id, String name);

    /**
     * 删除分类
     * 
     * @param id 分类ID
     */
    void deleteCategory(Long id);

    /**
     * 分页查询分类
     * 
     * @param query 分页查询参数
     * @return 分页查询结果
     */
    PageResult<Category> pageQueryCategories(PageQuery query);

    /**
     * 根据ID查询分类
     * 
     * @param id 分类ID
     * @return 分类实体
     */
    Category getCategoryById(Long id);
}
