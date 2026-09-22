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

-- =========================================================================
-- 创建用户表 (sys_user)
-- 权限体系架构说明 (RBAC0 极简三级)：
-- 1. 游客 (Guest)      : 无需账号，无数据库记录，无 Token 纯匿名只读公开接口
-- 2. 普通用户 (User)   : 注册入库，角色为 ROLE_USER，拥有前台互动与个人资料权限
-- 3. 博主管理员 (Admin) : 系统初始账号，角色为 ROLE_ADMIN，拥有全站与后台管理权限
-- =========================================================================
CREATE TABLE IF NOT EXISTS sys_user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '用户主键ID',
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '登录用户名（唯一）',
    password VARCHAR(100) NOT NULL COMMENT 'BCrypt 加密密码',
    nickname VARCHAR(50) NOT NULL DEFAULT '' COMMENT '用户昵称',
    avatar VARCHAR(255) NOT NULL DEFAULT '' COMMENT '头像 URL 地址',
    email VARCHAR(100) NOT NULL DEFAULT '' COMMENT '用户邮箱',
    role VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER' COMMENT '角色: ROLE_ADMIN-博主管理员, ROLE_USER-普通用户',
    status TINYINT NOT NULL DEFAULT 1 COMMENT '账号状态: 0-禁用, 1-正常',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',

-- 索引设计说明：
INDEX idx_username (username), -- 加速用户名登录检索
    INDEX idx_role (role)          -- 加速角色过滤
);

-- 插入默认初始博主管理员账号 (用户名: admin, 初始密码: admin123)
-- BCrypt 密文对应明文 'admin123'
INSERT IGNORE INTO
    sys_user (
        id,
        username,
        password,
        nickname,
        avatar,
        email,
        role,
        status
    )
VALUES (
        1,
        'admin',
        '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2',
        '博主管理员',
        'https://api.dicebear.com/7.x/bottts/svg?seed=nexus-admin',
        'admin@nexus.blog',
        'ROLE_ADMIN',
        1
    );

-- 插入默认普通用户测试账号 (用户名: testuser, 初始密码: admin123)
-- 用于开发阶段直接验证前台普通用户登录、权限隔离与防越权
INSERT IGNORE INTO
    sys_user (
        id,
        username,
        password,
        nickname,
        avatar,
        email,
        role,
        status
    )
VALUES (
        2,
        'testuser',
        '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2',
        '普通测试用户',
        'https://api.dicebear.com/7.x/bottts/svg?seed=nexus-user',
        'user@nexus.blog',
        'ROLE_USER',
        1
    );

-- 创建标签表 (tag)
CREATE TABLE IF NOT EXISTS tag (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '标签主键ID',
    name VARCHAR(50) NOT NULL UNIQUE COMMENT '标签名称（唯一）',
    created_at DATETIME NOT NULL COMMENT '创建时间',
    updated_at DATETIME NOT NULL COMMENT '修改时间'
);

-- 插入默认初始标签（使用 INSERT IGNORE 保证重启幂等，指定时间初始值）
INSERT IGNORE INTO
    tag (id, name, created_at, updated_at)
VALUES (1, 'Java', NOW(), NOW()),
    (2, 'Spring Boot', NOW(), NOW()),
    (3, 'Redis', NOW(), NOW()),
    (4, 'React', NOW(), NOW());

-- 创建文章与标签多对多关联中间表 (article_tag)
CREATE TABLE IF NOT EXISTS article_tag (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '关联主键ID',
    article_id BIGINT NOT NULL COMMENT '关联文章ID',
    tag_id BIGINT NOT NULL COMMENT '关联标签ID',

    -- 复合唯一索引：防止重复绑定，且天然加速以 article_id 为条件的查询
    UNIQUE KEY uk_article_tag (article_id, tag_id),
    -- 单列索引：加速根据 tag_id 反查关联文章
    INDEX idx_tag_id (tag_id)
);

-- 为初始的测试文章 1（欢迎使用 Nexus 博客系统）预挂载两个标签（1: Java, 2: Spring Boot）
INSERT IGNORE INTO
    article_tag (id, article_id, tag_id)
VALUES (1, 1, 1),
    (2, 1, 2);