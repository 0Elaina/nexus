-- 创建分类表 (category)
CREATE TABLE IF NOT EXISTS category (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '分类主键ID',
    name VARCHAR(50) NOT NULL UNIQUE COMMENT '分类名称（唯一）',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '修改时间'
);

-- 插入初始默认分类（使用 INSERT IGNORE 保证重启幂等）
INSERT IGNORE INTO category (id, name) VALUES 
(1, '技术分享'),
(2, '读书随笔'),
(3, '生活杂谈');