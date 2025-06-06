# 新闻JSON格式规范

## 基本结构
```json
{
  "id": "唯一标识符",
  "title": "新闻标题",
  "slug": "URL友好的标识符",
  "date": "发布日期，格式：YYYY-MM-DD",
  "author": "作者名称",
  "category": "分类名称",
  "summary": "简短描述",
  "image": "封面图片URL",
  "content": "正文内容（按照下方格式要求）"
}
```

> **注意**: 语言通过文件路径区分，例如 `/public/data/zh/news/` 和 `/public/data/en/news/`

## 中英文一致性要求

**重要规定：** 同一新闻的中英文版本必须保持以下字段完全一致：

1. **id**: 必须相同，以保证系统能关联同一篇文章的不同语言版本
2. **slug**: 必须完全相同，确保URL路径一致
3. **date**: 发布日期必须一致
4. **image**: 图片路径必须完全一致
5. **category**: 分类必须对应一致

不同语言版本的标题、作者、摘要和内容可以根据语言特点进行本地化调整。

## 正文格式规范

### 标签使用规则
- 正文段落使用`<p>`标签
- 主要章节标题使用`<h3>`标签
- 小节使用`<strong>`标签加数字标注，如`<strong>1. 洗矿技术</strong>`
- 列表项使用`-`符号加`<strong>`标签突出关键词
- 段落间无需使用`<br>`，使用多个`<p>`标签分隔

### 转义字符规则
- 当在正文内容中使用双引号`"`时，必须使用反斜杠`\`进行转义，如`\"`
- 在HTML标签属性中使用的双引号无需转义，如`<p class="intro">`
- 所有反斜杠`\`本身也需要使用反斜杠转义，如`\\`

### 文章结构
文章结构通常包含：
1. 引言段落
2. 多个主要章节(`<h3>`标签)
3. 每个章节下的小节(`<strong>`+数字标注)
4. 结论

## 示例

```json
{
  "id": "mn-ore-processing-2023",
  "title": "锰矿石加工技术的最新进展",
  "slug": "manganese-ore-processing-advances",
  "date": "2023-06-15",
  "author": "技术部",
  "category": "technology",
  "summary": "泽鑫矿山近期在锰矿石加工技术方面取得重大突破，提高了回收率并降低了能耗。",
  "image": "/images/news/mn-processing.jpg",
  "content": "<p>锰矿石作为重要的工业原料，其加工技术的进步对整个采矿业具有重要意义。泽鑫矿山通过持续创新和技术改进，在锰矿石加工领域取得了显著成果。</p><h3>创新加工技术</h3><p>面对日益复杂的矿石成分和环保要求的提高，传统加工方法已难以满足现代工业的需求。</p><strong>1. 预处理技术革新</strong><p>针对高杂质锰矿，我们开发了新型预处理流程：</p><p>- <strong>机械活化预处理</strong>：通过特殊设计的机械活化设备，增强矿物表面活性，提高后续选别效率</p><p>- <strong>梯级粉碎系统</strong>：采用多级粉碎结合筛分技术，实现精确粒度控制，减少能源消耗</p><strong>2. 分选工艺优化</strong><p>在分选环节，引入了智能化控制系统：</p><p>- <strong>光电分选技术</strong>：结合计算机视觉和深度学习算法，精确识别和分选不同品位矿石</p><p>- <strong>重介质分选改进</strong>：优化重介质配方和流程参数，提高分选精度达15%</p><h3>环保与可持续发展</h3><p>绿色矿山建设是泽鑫矿山的核心战略之一。</p><strong>1. 废水处理循环利用</strong><p>通过先进的废水处理工艺，实现了90%以上的水资源循环利用：</p><p>- <strong>多级沉淀技术</strong>：结合高效絮凝剂应用，加速固液分离</p><p>- <strong>膜分离技术</strong>：采用新型纳滤膜，有效去除水中溶解重金属</p><strong>2. 尾矿资源化利用</strong><p>变废为宝，将尾矿转化为有价值的建材产品：</p><p>- <strong>尾矿制砖</strong>：研发出尾矿含量达70%的高强度建筑砖</p><p>- <strong>道路材料</strong>：将处理后的尾矿用于道路基础设施建设</p><h3>未来发展方向</h3><p>泽鑫矿山将继续在以下领域进行技术突破：</p><p>- <strong>智能化生产</strong>：推进工业互联网和人工智能技术在选矿车间的全面应用</p><p>- <strong>低品位矿石利用</strong>：开发经济可行的低品位锰矿加工方案，提高资源利用率</p><p>- <strong>能源效率优化</strong>：通过工艺改进和设备更新，进一步降低单位产量能耗</p><p>随着这些技术的不断成熟和应用，泽鑫矿山在锰矿加工领域的竞争力将进一步增强，为客户提供更高品质、更环保的产品。</p>"
}
``` 

## 双引号使用示例

下面是在content字段中正确使用转义双引号的例子：

```json
{
  "content": "<p>专家表示：\"高效选矿技术可以显著提高回收率\"，这一观点得到了广泛认同。</p><p>研究报告中指出：\"通过优化工艺参数，精矿品位提高了8个百分点\"，这一结果令人鼓舞。</p>"
}
```

正确的JSON格式应该是：

```json
{
  "content": "<p>专家表示：\\\"高效选矿技术可以显著提高回收率\\\"，这一观点得到了广泛认同。</p><p>研究报告中指出：\\\"通过优化工艺参数，精矿品位提高了8个百分点\\\"，这一结果令人鼓舞。</p>"
}
``` 