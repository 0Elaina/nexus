-- 创建分类表 (category)
CREATE TABLE IF NOT EXISTS category (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '分类主键ID',
    name VARCHAR(50) NOT NULL UNIQUE COMMENT '分类名称（唯一）',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '修改时间'
);

-- 插入初始默认分类（使用 INSERT IGNORE 保证重启幂等）
INSERT IGNORE INTO
    category (id, name)
VALUES (1, '技术分享'),
    (2, '读书随笔'),
    (3, '生活杂谈');

-- 创建文章表 (article)
CREATE TABLE IF NOT EXISTS article (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '文章主键ID',
    title VARCHAR(150) NOT NULL COMMENT '文章标题',
    summary VARCHAR(300) NOT NULL DEFAULT '' COMMENT '文章摘要（列表展示，隔离大字段）',
    content LONGTEXT NOT NULL COMMENT 'Markdown 源码正文',
    category_id BIGINT NOT NULL COMMENT '关联分类ID',
    status TINYINT NOT NULL DEFAULT 0 COMMENT '状态: 0-草稿(Draft), 1-已发布(Published)',
    view_count BIGINT NOT NULL DEFAULT 0 COMMENT '阅读浏览量',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',

-- 索引设计说明：
INDEX idx_category_id (category_id), -- 加速“按分类检索文章”
    INDEX idx_status (status),           -- 加速“前台仅查已发布文章（status=1）”
    INDEX idx_created_at (created_at)    -- 加速“按时间倒序翻页”
);

-- 插入一条初始种子数据（绑定到分类 1：技术分享）
INSERT IGNORE INTO
    article (
        id,
        title,
        summary,
        content,
        category_id,
        status,
        view_count
    )
VALUES (
        1,
        '欢迎使用 Nexus 博客系统',
        '这是系统初始化的第一篇测试文章摘要...',
        '# 欢迎来到 Nexus\n\n这是一个基于 Vue3 与 Spring Boot 构建的现代化个人博客系统Demo。',
        1,
        1,
        0
    );