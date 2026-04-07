# Deep Interview Spec: UI 视觉统一与瑕疵收敛

## Metadata
- Interview ID: deep-interview-ui-unification-2026-04-07
- Rounds: 4
- Final Ambiguity Score: 16%
- Type: brownfield
- Generated: 2026-04-07
- Threshold: 20%
- Status: PASSED

## Clarity Breakdown
| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Goal Clarity | 0.90 | 0.35 | 0.315 |
| Constraint Clarity | 0.82 | 0.25 | 0.205 |
| Success Criteria | 0.86 | 0.25 | 0.215 |
| Context Clarity | 0.72 | 0.15 | 0.108 |
| **Total Clarity** |  |  | **0.843** |
| **Ambiguity** |  |  | **0.157** |

## Goal
在整个 AeroNav 前端中统一 UI 视觉语言，并减少当前明显的视觉瑕疵。统一方向以现有导航页/设置页已经采用的 token 化风格为基准，让全站在颜色、背景、边框、阴影等“颜色与材质”层面收敛一致；必要时允许对局部布局结构做调整，但不以新增功能为目标。

## Constraints
- 作用范围是全站 UI，而不是只修单页。
- 视觉基准以现有导航页和设置页风格为准，不重新定义一整套全新设计系统。
- 优先统一颜色与材质体系：背景、表面层级、边框、阴影、文本颜色映射。
- 允许小到中等规模的组件/布局调整，以支撑统一效果。
- 目标是视觉收敛与瑕疵减少，不扩展业务功能。

## Non-Goals
- 不做新的产品功能设计。
- 不追求一次性重写所有组件抽象。
- 不以交互流程重构为主目标，除非为视觉统一所必需。
- 不另起一套与现有 token 风格完全不同的美术方向。

## Acceptance Criteria
- [ ] 全站主要页面使用一致的颜色/背景/边框/阴影语义，不再混用明显不同的色板风格。
- [ ] 顶部栏、页面壳层、卡片容器等高频结构在浅色/深色模式下呈现统一的材质层级。
- [ ] 现有硬编码颜色或与 token 风格冲突的实现被收敛到统一体系。
- [ ] 用户一眼可见的 UI 瑕疵明显减少，尤其是风格割裂、颜色不协调、表面层级不一致的问题。
- [ ] 修改后整体视觉更接近导航页/设置页当前的风格，而不是出现第三套设计语言。

## Assumptions Exposed & Resolved
| Assumption | Challenge | Resolution |
|------------|-----------|------------|
| “统一 UI” 可能只是局部页面优化 | 追问范围是否只做局部 | 用户明确要求“全部” |
| 统一方向可能需要重做一套新规范 | 追问统一应收敛到什么基准 | 用户选择向现有风格收敛 |
| 验收可能是笼统的“都更好看” | 强制压缩为一个首要验收锚点 | 用户确认首要锚点是“颜色与材质” |
| 为达成统一是否只能改样式 | 追问允许的改动深度 | 用户允许局部布局结构一起调整，只要体验更统一 |

## Technical Context
代码库已是 brownfield 项目，已有一套 token 化基础：
- `src/styles.css` 定义了全局 CSS 变量与明暗主题 token（如 surface、border、text、shadow）。
- `src/lib/theme.ts` 通过 `dark` class 切换主题。
- `src/features/navigation/NavigationPage.tsx` 与 `src/features/settings/SettingsPage.tsx` 基本采用 token 风格，可作为视觉基准。
- `src/components/layout/TopNavBar.tsx` 存在硬编码颜色，属于明显的风格分歧点。
- `src/components/PageShell.tsx` 使用另一套 slate 风格，是页面壳层不一致的风险点。
- `src/features/bookmarks/BookmarksPage.tsx` 为定制化页面，较可能存在排版、颜色或容器风格偏离。
- 共享组件位于 `src/components/*`，但部分页面仍可能有局部自定义样式，后续需要统一梳理。

## Ontology (Key Entities)
| Entity | Type | Fields | Relationships |
|--------|------|--------|---------------|
| Design Tokens | core domain | theme vars, surfaces, borders, text, shadows | 驱动全站颜色与材质表达 |
| TopNavBar | supporting | background, text color, border/shadow | 属于全局高频结构，需要向 token 风格收敛 |
| Page Shell | supporting | page container, spacing, background surface | 承载各功能页，决定整体材质一致性 |
| Feature Pages | core domain | navigation, settings, bookmarks | 应共享同一视觉语言 |
| Visual Baseline | supporting | navigation page style, settings page style | 作为本次统一目标参照 |
| Color & Material | core domain | background, border, elevation, shadow | 是本次首要验收锚点 |

## Ontology Convergence
| Round | Entity Count | New | Changed | Stable | Stability Ratio |
|-------|-------------|-----|---------|--------|----------------|
| 1 | 4 | 4 | - | - | - |
| 2 | 5 | 1 | 0 | 4 | 80% |
| 3 | 6 | 1 | 0 | 5 | 83% |
| 4 | 6 | 0 | 0 | 6 | 100% |

## Interview Transcript
<details>
<summary>Full Q&A (4 rounds)</summary>

### Round 1
**Q:** 这次最想先解决哪一类问题？
**A:** 视觉风格
**Ambiguity:** 55%

### Round 2
**Q:** 这次优先统一的范围是哪一块？
**A:** 全部
**Ambiguity:** 34%

### Round 3
**Q:** 整个产品最终统一到哪种基准？
**A:** 现有风格收敛
**Ambiguity:** 23%

### Round 4
**Q:** 只做视觉统一，还是允许顺手改一些组件结构来支撑统一？
**A:** 允许连局部布局结构一起调整，只要体验更统一
**Ambiguity:** 16%
</details>
