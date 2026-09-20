package com.nep.category.service.impl;

import java.time.Duration;
import java.util.List;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.fasterxml.jackson.core.type.TypeReference;
import com.nep.category.CategoryApiCode;
import com.nep.category.entity.Category;
import com.nep.category.mapper.CategoryMapper;
import com.nep.category.service.CategoryService;
import com.nep.common.api.ApiCode;
import com.nep.common.exception.BusinessException;
import com.nep.common.page.PageQuery;
import com.nep.common.page.PageResult;
import com.nep.common.util.JsonUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryMapper categoryMapper;
    private final StringRedisTemplate stringRedisTemplate;

    private static final String CACHE_KEY_ALL = "category:all";
    private static final Duration CACHE_TTL = Duration.ofMinutes(30);

    /**
     * 获取所有分类，按排序顺序和ID升序排序
     * 
     * @return 所有分类列表
     */
    @Override
    public List<Category> getAllCategories() {
        String json = stringRedisTemplate.opsForValue().get(CACHE_KEY_ALL);
        if (StringUtils.hasText(json)) {
            return JsonUtils.fromJson(json, new TypeReference<List<Category>>() {
            });
        }
        // 缓存中没有数据，从数据库查询
        List<Category> categories = categoryMapper.selectList(new LambdaQueryWrapper<Category>()
                .orderByAsc(Category::getId));
        // 将查询到的数据写回到 Redis
        stringRedisTemplate.opsForValue().set(CACHE_KEY_ALL, JsonUtils.toJson(categories), CACHE_TTL);
        return categories;
    }

    /**
     * 创建分类
     * 
     * @param name 分类名称
     */
    @Override
    public void createCategory(String name) {
        name = name.strip();
        if (name == null || name.isBlank()) {
            throw new BusinessException(CategoryApiCode.CATEGORY_NAME_EMPTY);
        }
        Category existCategory = categoryMapper.selectOne(
                new LambdaQueryWrapper<Category>()
                        .eq(Category::getName, name));
        if (existCategory != null) {
            throw new BusinessException(CategoryApiCode.CATEGORY_NAME_DUPLICATE);
        }
        Category category = new Category();
        category.setName(name);
        categoryMapper.insert(category);
        // 清理旧缓存
        stringRedisTemplate.delete(CACHE_KEY_ALL);
    }

    /**
     * 更新分类
     * 
     * @param id   分类ID
     * @param name 分类名称
     */
    @Override
    public void updateCategory(Long id, String name) {
        if (name == null || name.strip().isBlank()) {
            throw new BusinessException(CategoryApiCode.CATEGORY_NAME_EMPTY);
        }
        name = name.strip();
        if (id == null) {
            throw new BusinessException(ApiCode.BAD_REQUEST, "分类 id 不能为空");
        }

        // 检查分类是否存在
        Category existCategory = categoryMapper.selectById(id);
        if (existCategory == null) {
            throw new BusinessException(CategoryApiCode.CATEGORY_NOT_FOUND);
        }
        if (name.equals(existCategory.getName())) {
            return;
        }

        // 检查分类名称是否重复
        Category duplicateCategory = categoryMapper.selectOne(new LambdaQueryWrapper<Category>()
                .eq(Category::getName, name)
                .ne(Category::getId, existCategory.getId()));
        if (duplicateCategory != null) {
            throw new BusinessException(CategoryApiCode.CATEGORY_NAME_DUPLICATE);
        }

        // 更新分类
        Category category = new Category();
        category.setId(existCategory.getId());
        category.setName(name);
        categoryMapper.updateById(category);
        // 清理旧缓存
        stringRedisTemplate.delete(CACHE_KEY_ALL);
    }

    /**
     * 删除分类
     * 
     * @param id 分类ID
     */
    @Override
    public void deleteCategory(Long id) {
        if (id == null) {
            throw new BusinessException(ApiCode.BAD_REQUEST, "分类 id 不能为空");
        }
        Category existCategory = categoryMapper.selectById(id);
        if (existCategory == null) {
            throw new BusinessException(CategoryApiCode.CATEGORY_NOT_FOUND);
        }
        categoryMapper.deleteById(id);
        // 清理旧缓存
        stringRedisTemplate.delete(CACHE_KEY_ALL);
    }

    /**
     * 分页查询分类
     * 
     * @param query 分页查询参数
     * @return 分页查询结果
     */
    @Override
    public PageResult<Category> pageQueryCategories(PageQuery query) {
        Page<Category> page = new Page<>(query.getPageNum(), query.getPageSize());
        categoryMapper.selectPage(page, new LambdaQueryWrapper<Category>()
                .orderByAsc(Category::getId));
        return PageResult.fromMpPage(page);
    }

    /**
     * 根据ID查询分类
     * 
     * @param id 分类ID
     * @return 分类实体
     */
    @Override
    public Category getCategoryById(Long id) {
        if (id == null) {
            throw new BusinessException(ApiCode.BAD_REQUEST, "分类 id 不能为空");
        }
        Category category = categoryMapper.selectById(id);
        if (category == null) {
            throw new BusinessException(CategoryApiCode.CATEGORY_NOT_FOUND);
        }
        return category;
    }

}
