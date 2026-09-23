package com.nep.site.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nep.common.api.Result;
import com.nep.site.service.SiteStatsService;
import com.nep.site.vo.SiteStatsVO;

import lombok.RequiredArgsConstructor;

/**
 * 全站数据统计控制器
 */
@RestController
@RequestMapping("/api/site")
@RequiredArgsConstructor
public class SiteStatsController {

    private final SiteStatsService siteStatsService;

    /**
     * 获取全站宏观数据统计
     *
     * @return 全站数据统计 VO
     */
    @GetMapping("/stats")
    public Result<SiteStatsVO> getSiteStats() {
        return Result.success(siteStatsService.getSiteStats());
    }
}
