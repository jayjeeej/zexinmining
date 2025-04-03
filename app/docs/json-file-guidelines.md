# 产品JSON文件规范指南

本文档提供了创建产品JSON数据文件的详细规范，确保所有产品数据遵循统一的结构和格式。

## 一、基本结构

所有产品数据JSON文件应存储在 `public/data/products/` 目录下，以产品ID命名，例如：`fiberglass-spiral-chute.json`。

每个产品JSON文件必须包含以下基本结构：

```json
{
  "id": "product-id",
  "category": "产品类别，如beneficiation",
  "subcategory": "产品子类别，如gravity-separation",
  "model": "型号，如JT4-1",
  "series": {
    "zh": "产品系列中文名称",
    "en": "Product Series Name"
  },
  "image": "/images/products/sub-category/product-id.jpg",
  "capacity": {
    "zh": "处理能力范围，如1-5 t/h",
    "en": "Capacity range, e.g. 1-5 t/h"
  },
  "feedSize": {
    "zh": "进料粒度，如0.2-2 mm",
    "en": "Feed size, e.g. 0.2-2 mm"
  },
  "motorPower": {
    "zh": "电机功率，如1.5 kW",
    "en": "Motor power, e.g. 1.5 kW"
  },
  "overview": {
    "zh": "产品详细介绍（中文）...",
    "en": "Product detailed introduction (English)..."
  },
  "specifications": {
    "title": {
      "zh": "技术参数",
      "en": "Technical Parameters"
    },
    "note": {
      "zh": "可按照客户需求进行定制",
      "en": "Can be customized according to customer requirements"
    },
    "tableHeaders": [
      {
        "zh": "型号",
        "en": "Model",
        "unit": ""
      },
      {
        "zh": "处理能力",
        "en": "Capacity",
        "unit": "t/h"
      },
      // 其他表头...
    ],
    "tableData": [
      ["JT4-1", "1-5", "0.2-2", "1.5"],
      ["JT5-2", "3-8", "0.2-2", "2.2"],
      // 其他数据行...
    ]
  },
  "features": {
    "zh": [
      "特点1（中文）",
      "特点2（中文）",
      // 更多特点...
    ],
    "en": [
      "Feature 1 (English)",
      "Feature 2 (English)",
      // More features...
    ]
  },
  "applications": {
    "title": {
      "zh": "应用领域",
      "en": "Application Areas"
    },
    "items": [
      {
        "icon": "🏭",
        "title": {
          "zh": "应用领域1",
          "en": "Application Area 1"
        },
        "description": {
          "zh": "应用领域1描述",
          "en": "Description of application area 1"
        }
      },
      // 更多应用领域...
    ]
  },
  "relatedProducts": [
    "related-product-id-1",
    "related-product-id-2",
    // 更多相关产品...
  ]
}
```

## 二、参数提取逻辑

当技术参数表中包含多个型号/规格时，必须按照以下规则提取顶级参数值：

### 1. 参数范围计算规则

| 参数 | 提取逻辑 | 格式示例 | 适用性 |
|------|---------|---------|------|
| **处理能力(capacity)** | 取所有型号中的最小值和最大值组成范围 | "0-80 t/h" | 所有产品必需 |
| **进料尺寸(feedSize)** | 取所有型号中的最小值和最大值组成范围；如为单一最大值，使用"≤"格式 | "0-2 mm"或"≤60 mm" | 大多数产品必需 |
| **电机功率(motorPower)** | 取所有型号中的最小值和最大值组成范围；如为单一值，直接使用该值；如无电机，标记为"无动力" | "0.55-1.5 kW"或"1.1 kW"或"无动力" | 视产品类型而定 |

### 2. 参数名称标准化

技术参数表中同一参数可能使用不同表述，必须按照以下标准化名称映射到JSON字段：

| JSON标准字段 | 可能的表述变体 | 标准化中文名称 | 标准化英文名称 |
|-------------|---------------|--------------|--------------|
| `capacity` | 处理能力、产量、生产能力、生产率 | 处理能力 | Processing Capacity |
| `feedSize` | 进料尺寸、进料粒度、给矿粒度、最大给矿粒度、给料粒度 | 进料尺寸 | Feed Size |
| `motorPower` | 电机功率、马达功率、动力、总装机功率 | 电机功率 | Motor Power |
| `maxFeedSize` | 最大进料尺寸、最大进料粒度、最大给矿尺寸 | 最大进料尺寸 | Max Feed Size |
| `dischargeSize` | 出料粒度、排料粒度、产品粒度 | 出料粒度 | Discharge Size |
| `screenArea` | 筛分面积、有效筛分面积、筛板面积 | 筛分面积 | Screen Area |
| `waterConsumption` | 耗水量、用水量、水量消耗、冲洗水量 | 耗水量 | Water Consumption |

无论技术参数表使用哪种表述，在JSON文件中必须统一使用标准字段名称，并在表头中使用标准化的中文和英文名称。

### 3. 产品类型特定参数

不同产品类别必须包含的特定参数：

| 产品类别 | 必需参数 | 可选/特定参数 | 处理方式 |
|---------|---------|--------------|---------|
| **破碎设备** | capacity, feedSize, motorPower | maxFeedSize, dischargeSize | 最大进料尺寸从技术参数表中提取 |
| **筛分设备** | capacity, feedSize, motorPower | screenArea, layerNumber | 筛分面积和层数从技术参数表中提取 |
| **磨矿设备** | capacity, feedSize, motorPower | ballCharge, dischargeSize | 钢球装载量和出料粒度从技术参数表中提取 |
| **重选设备** | capacity, feedSize | motorPower | 某些重选设备(如溜槽)可能无动力，标记为"无动力" |
| **浮选设备** | capacity, feedSize, motorPower | tankVolume, airVolume | 槽容积和充气量从技术参数表中提取 |
| **脱水设备** | capacity, feedSize, motorPower | filterArea, moisture | 过滤面积和水分从技术参数表中提取 |

### 4. 参数缺失处理

当产品缺少某些参数时，按以下规则处理：

- **必需参数缺失**：必须补充相关数据，不得省略必需参数
- **无电机设备**：将motorPower设置为`{"zh": "无动力", "en": "No Power"}`
- **进料尺寸不适用**：如对某类设备不适用，可省略该字段
- **特定参数存在**：如某产品有特殊参数，应按技术参数表格式提取并添加

### 5. 数据提取示例

如技术参数表中有三个型号数据：
```
型号A: 处理能力1-3 t/h, 进料尺寸0.05-0.5 mm, 电机功率0.55 kW
型号B: 处理能力2-5 t/h, 进料尺寸0.1-1.0 mm, 电机功率0.75 kW
型号C: 处理能力3-8 t/h, 进料尺寸0.2-2.0 mm, 电机功率1.1 kW
```

正确提取的参数应为：
```
处理能力: "1-8 t/h"
进料尺寸: "0.05-2.0 mm"
电机功率: "0.55-1.1 kW"
```

无动力设备示例：
```
型号X: 处理能力1.5-3 t/h, 进料尺寸0.3-2.0 mm, 无电机
型号Y: 处理能力3-5 t/h, 进料尺寸0.3-2.0 mm, 无电机
型号Z: 处理能力5-10 t/h, 进料尺寸0.3-2.0 mm, 无电机
```

正确提取的参数应为：
```
处理能力: "1.5-10 t/h"
进料尺寸: "0.3-2.0 mm"
电机功率: "无动力"
```

### 6. 数据一致性要求

产品数据必须在以下两个位置保持一致：
1. **产品详情JSON文件** (`public/data/products/[product-id].json`)
2. **产品列表JSON文件** (`public/data/products/[category]-products.json`)

当更新技术参数表时，必须同时更新这两个文件中的参数数据。

## 三、字段详细说明

### 基本信息字段

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `id` | 字符串 | 是 | 产品唯一标识，使用连字符分隔的小写英文，例如：`fiberglass-spiral-chute` |
| `category` | 字符串 | 是 | 一级分类，例如：`crushing`、`screening`、`beneficiation` |
| `subcategory` | 字符串 | 是 | 二级分类，例如：`gravity-separation`、`flotation` |
| `model` | 字符串 | 是 | 产品型号或型号范围，例如：`JT4-1` 或 `JT4-1 - JT5-2` |
| `series` | 对象 | 是 | 包含中英文的产品系列名称 |
| `image` | 字符串 | 是 | 产品主图路径，必须遵循 `/images/products/子类别/产品id.jpg` 格式 |

### 技术参数字段

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `capacity` | 对象 | 是 | 包含中英文的处理能力范围，所有产品必需 |
| `feedSize` | 对象 | 大多数产品 | 包含中英文的进料粒度，大多数产品必需 |
| `motorPower` | 对象 | 视产品类型 | 包含中英文的电机功率，某些产品可能无电机（标记为"无动力"） |

不同产品类型必需和可选的技术参数：

#### 破碎设备

| 参数 | 必填 | 说明 |
|------|------|------|
| `capacity` | 是 | 处理能力范围 |
| `feedSize` | 是 | 进料粒度范围 |
| `motorPower` | 是 | 电机功率 |
| `maxFeedSize` | 是 | 最大进料尺寸 |
| `dischargeSize` | 视型号 | 出料粒度或排料口范围 |

#### 筛分设备

| 参数 | 必填 | 说明 |
|------|------|------|
| `capacity` | 是 | 处理能力范围 |
| `feedSize` | 是 | 进料粒度范围 |
| `motorPower` | 是 | 电机功率 |
| `screenArea` | 是 | 筛分面积 |
| `layerNumber` | 视型号 | 筛分层数 |

#### 磨矿设备

| 参数 | 必填 | 说明 |
|------|------|------|
| `capacity` | 是 | 处理能力范围 |
| `feedSize` | 是 | 进料粒度范围 |
| `motorPower` | 是 | 电机功率 |
| `dischargeSize` | 视型号 | 出料粒度 |
| `ballCharge` | 视型号 | 钢球装载量 |

#### 重选设备

| 参数 | 必填 | 说明 |
|------|------|------|
| `capacity` | 是 | 处理能力范围 |
| `feedSize` | 是 | 进料粒度范围 |
| `motorPower` | 视设备 | 电机功率，无动力设备标记为"无动力" |
| `waterConsumption` | 视设备 | 耗水量 |

#### 浮选设备

| 参数 | 必填 | 说明 |
|------|------|------|
| `capacity` | 是 | 处理能力范围 |
| `feedSize` | 是 | 进料粒度范围 |
| `motorPower` | 是 | 电机功率 |
| `tankVolume` | 视型号 | 槽容积 |
| `airVolume` | 视型号 | 充气量 |

#### 脱水设备

| 参数 | 必填 | 说明 |
|------|------|------|
| `capacity` | 是 | 处理能力范围 |
| `feedSize` | 视设备 | 进料粒度范围 |
| `motorPower` | 是 | 电机功率 |
| `filterArea` | 视设备 | 过滤面积 |
| `moisture` | 视设备 | 产品水分 |

### 内容字段

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `overview` | 对象 | 是 | 包含中英文的产品详细介绍，字数应不少于100字 |
| `specifications` | 对象 | 是 | 包含产品技术参数表格数据 |
| `features` | 对象 | 是 | 包含中英文的产品特点列表，数量应在4-8条之间 |
| `applications` | 对象 | 是 | 包含产品应用领域信息 |
| `relatedProducts` | 数组 | 是 | 相关产品ID列表，应包含3-4个相关产品 |

### 相关产品显示规则

根据产品类型，`relatedProducts` 数组的内容应遵循以下规则：

1. **一般产品**：包含3-4个相关产品ID，优先选择同类别或功能互补的产品。

2. **同系列产品组**：对于属于同一系列的产品组（如重选设备），应在每个产品的JSON文件中列出**除自身外的所有同系列产品**。例如，重选设备系列包含7个产品（玻璃钢螺旋溜槽、摇床、地毯式钩机、离心选矿机、同步反向跳汰机、小型同步反向跳汰机、锯齿波跳汰机），则每个产品的`relatedProducts`数组应包含其他6个产品的ID。

```json
// 以玻璃钢螺旋溜槽为例
"relatedProducts": [
  "shaking-table",
  "carpet-hooking-machine",
  "centrifugal-separator",
  "synchronous-counter-directional-jig",
  "synchronous-counter-directional-jig-small",
  "sawtooth-wave-jig"
]
```

3. **数据完整性要求**：
   - 所有列出的产品ID必须对应实际存在的产品JSON文件
   - 产品ID必须准确无误，与对应产品的JSON文件名（不含后缀）一致
   - 不要包含产品自身的ID在`relatedProducts`数组中

4. **影响**：`relatedProducts`数组直接影响产品详情页中的相关产品轮播卡的数量和内容，确保正确配置可使用户看到完整的相关产品展示。

## 四、格式规范

### 1. 命名规范

- **ID命名**：使用小写英文单词，多个单词间用连字符（-）连接，例如：`fiberglass-spiral-chute`
- **字段命名**：使用驼峰命名法（camelCase），例如：`feedSize`、`motorPower`
- **文件命名**：使用与产品ID相同的名称，例如：`fiberglass-spiral-chute.json`

### 2. 内容规范

- **双语内容**：所有用户可见的文本内容必须同时提供中文和英文两种语言版本
- **图标使用**：应用领域图标应使用统一的Emoji或图标系统，确保风格一致
- **单位标记**：所有技术参数必须明确标注单位，单位应遵循国际标准
- **数值格式**：数值范围使用连字符（-）连接，例如：`1-5 t/h`
- **特点描述**：每条特点应简洁明了，中英文描述应一一对应
- **表格数据**：表头和数据行必须严格对应，确保每列数据类型一致

### 3. 图片规范

- **图片路径**：必须遵循 `/images/products/子类别/产品id.jpg` 格式
- **图片质量**：产品图片应为高质量图片，建议分辨率不低于1200x800像素
- **图片格式**：首选JPG格式，对于需要透明背景的图片可使用PNG格式
- **图片比例**：首选16:9或4:3比例，确保所有产品图片比例一致
- **文件大小**：单张图片大小应控制在300KB以内，以提高加载速度

## 五、示例

### 破碎机JSON示例

```json
{
  "id": "jaw-crusher",
  "category": "crushing",
  "subcategory": "crushers",
  "model": "PE-600×900",
  "series": {
    "zh": "颚式破碎机",
    "en": "Jaw Crusher"
  },
  "image": "/images/products/crushers/jaw-crusher.jpg",
  "capacity": {
    "zh": "50-180 t/h",
    "en": "50-180 t/h"
  },
  "feedSize": {
    "zh": "≤500 mm",
    "en": "≤500 mm"
  },
  "maxFeedSize": {
    "zh": "500 mm",
    "en": "500 mm"
  },
  "motorPower": {
    "zh": "75 kW",
    "en": "75 kW"
  },
  "overview": {
    "zh": "颚式破碎机是一种常见的初级破碎设备，广泛应用于矿山、建筑、冶金等行业。该设备结构简单、工作可靠、制造成本低、维护方便。适用于进料粒度不大于500mm，抗压强度不超过320兆帕的各种矿石和岩石的破碎。",
    "en": "Jaw crusher is a common primary crushing equipment widely used in mining, construction, metallurgy and other industries. This equipment has simple structure, reliable operation, low manufacturing cost and convenient maintenance. It is suitable for crushing various ores and rocks with feed size not exceeding 500mm and compressive strength not exceeding 320MPa."
  },
  "specifications": {
    "title": {
      "zh": "技术参数",
      "en": "Technical Parameters"
    },
    "note": {
      "zh": "可按照客户需求进行定制",
      "en": "Can be customized according to customer requirements"
    },
    "tableHeaders": [
      {
        "zh": "型号",
        "en": "Model",
        "unit": ""
      },
      {
        "zh": "进料口尺寸",
        "en": "Feed Opening Size",
        "unit": "mm"
      },
      {
        "zh": "最大进料粒度",
        "en": "Max Feed Size",
        "unit": "mm"
      },
      {
        "zh": "排料口调整范围",
        "en": "Discharge Opening Range",
        "unit": "mm"
      },
      {
        "zh": "处理能力",
        "en": "Capacity",
        "unit": "t/h"
      },
      {
        "zh": "电机功率",
        "en": "Motor Power",
        "unit": "kW"
      },
      {
        "zh": "外形尺寸",
        "en": "Dimensions",
        "unit": "mm"
      },
      {
        "zh": "重量",
        "en": "Weight",
        "unit": "t"
      }
    ],
    "tableData": [
      ["PE-500×750", "500×750", "425", "50-100", "45-100", "55", "2035×1921×2000", "10.3"],
      ["PE-600×900", "600×900", "500", "65-160", "50-180", "75", "2290×2206×2370", "16.5"],
      ["PE-750×1060", "750×1060", "630", "80-140", "110-320", "110", "2620×2302×3110", "29"]
    ]
  },
  "features": {
    "zh": [
      "破碎比大，产品粒度均匀",
      "结构简单，工作可靠，运营成本低",
      "维修方便，运行费用低",
      "排料口调整范围大，适应性强",
      "密封性好，粉尘污染少，环保效果好"
    ],
    "en": [
      "Large crushing ratio, uniform product size",
      "Simple structure, reliable operation, low operating cost",
      "Easy maintenance, low running costs",
      "Wide discharge opening adjustment range, strong adaptability",
      "Good sealing performance, less dust pollution, good environmental protection effect"
    ]
  },
  "applications": {
    "title": {
      "zh": "应用领域",
      "en": "Application Areas"
    },
    "items": [
      {
        "icon": "⛏️",
        "title": {
          "zh": "矿山开采",
          "en": "Mining"
        },
        "description": {
          "zh": "用于各类矿石的初级破碎，如铁矿、铜矿、金矿等",
          "en": "Used for primary crushing of various ores, such as iron, copper, gold, etc."
        }
      },
      {
        "icon": "🏗️",
        "title": {
          "zh": "建筑骨料",
          "en": "Construction Aggregates"
        },
        "description": {
          "zh": "生产建筑用砂石骨料，如公路、铁路、水利工程等",
          "en": "Production of sand and gravel aggregates for construction, such as highways, railways, water conservancy projects, etc."
        }
      },
      {
        "icon": "🏭",
        "title": {
          "zh": "冶金工业",
          "en": "Metallurgical Industry"
        },
        "description": {
          "zh": "用于冶金原料的破碎处理",
          "en": "Used for crushing and processing of metallurgical raw materials"
        }
      },
      {
        "icon": "🧱",
        "title": {
          "zh": "建材行业",
          "en": "Building Materials"
        },
        "description": {
          "zh": "用于水泥、玻璃等建材原料的破碎",
          "en": "Used for crushing raw materials for cement, glass and other building materials"
        }
      }
    ]
  },
  "relatedProducts": [
    "impact-crusher",
    "cone-crusher",
    "hammer-crusher"
  ]
}
```

### 选矿设备JSON示例

```json
{
  "id": "fiberglass-spiral-chute",
  "category": "beneficiation",
  "subcategory": "gravity-separation",
  "model": "5LL-1200",
  "series": {
    "zh": "玻璃钢螺旋溜槽",
    "en": "Fiberglass Spiral Chute"
  },
  "image": "/images/products/gravity-separation/fiberglass-spiral-chute.jpg",
  "capacity": {
    "zh": "3-5 t/h",
    "en": "3-5 t/h"
  },
  "feedSize": {
    "zh": "0.3-0.02 mm",
    "en": "0.3-0.02 mm"
  },
  "motorPower": {
    "zh": "1.1 kW",
    "en": "1.1 kW"
  },
  "overview": {
    "zh": "玻璃钢螺旋溜槽是一种重力选矿设备，主要用于分选比重为0.3-0.02毫米的细粒赤铁矿、黄铁矿、锰矿、钛铁矿、铬矿、锡石、钽铌矿、海滨砂矿等金属矿物和煤矿。设备采用玻璃钢材质，具有耐腐蚀、重量轻、强度高、使用寿命长等特点。",
    "en": "The fiberglass spiral chute is a gravity separation equipment mainly used for separating fine-grained hematite, pyrite, manganese ore, titanium iron ore, chromite, cassiterite, tantalum-niobium ore, coastal sand ore and other metal minerals and coal with a specific gravity of 0.3-0.02 mm. The equipment is made of fiberglass material, which has the characteristics of corrosion resistance, light weight, high strength and long service life."
  },
  "specifications": {
    "title": {
      "zh": "技术参数",
      "en": "Technical Parameters"
    },
    "note": {
      "zh": "可按照客户需求进行定制",
      "en": "Can be customized according to customer requirements"
    },
    "tableHeaders": [
      {
        "zh": "型号",
        "en": "Model",
        "unit": ""
      },
      {
        "zh": "螺旋槽直径",
        "en": "Spiral Diameter",
        "unit": "mm"
      },
      {
        "zh": "螺旋圈数",
        "en": "Number of Turns",
        "unit": ""
      },
      {
        "zh": "进料粒度",
        "en": "Feed Size",
        "unit": "mm"
      },
      {
        "zh": "处理能力",
        "en": "Capacity",
        "unit": "t/h"
      },
      {
        "zh": "电机功率",
        "en": "Motor Power",
        "unit": "kW"
      },
      {
        "zh": "重量",
        "en": "Weight",
        "unit": "kg"
      }
    ],
    "tableData": [
      ["5LL-900", "900", "5", "0.3-0.02", "1.5-3", "0.75", "200"],
      ["5LL-1200", "1200", "5", "0.3-0.02", "3-5", "1.1", "280"],
      ["5LL-1500", "1500", "5", "0.3-0.02", "5-10", "1.5", "350"]
    ]
  },
  "features": {
    "zh": [
      "结构简单，操作方便，维护成本低",
      "分选效率高，回收率高",
      "能耗低，水耗低，运行成本经济",
      "采用玻璃钢材质，耐腐蚀，使用寿命长",
      "占地面积小，安装简便",
      "适应性强，可处理多种类型的矿物"
    ],
    "en": [
      "Simple structure, easy operation, low maintenance cost",
      "High separation efficiency and recovery rate",
      "Low energy consumption, low water consumption, economical operating cost",
      "Made of fiberglass material, corrosion resistant, long service life",
      "Small footprint, easy installation",
      "Strong adaptability, can process multiple types of minerals"
    ]
  },
  "applications": {
    "title": {
      "zh": "应用领域",
      "en": "Application Areas"
    },
    "items": [
      {
        "icon": "⛏️",
        "title": {
          "zh": "黑色金属矿",
          "en": "Ferrous Metal Ores"
        },
        "description": {
          "zh": "适用于赤铁矿、褐铁矿、钛铁矿等黑色金属矿的分选",
          "en": "Suitable for separation of ferrous metal ores such as hematite, limonite, titanium iron ore, etc."
        }
      },
      {
        "icon": "💎",
        "title": {
          "zh": "有色金属矿",
          "en": "Non-ferrous Metal Ores"
        },
        "description": {
          "zh": "适用于锡石、钽铌矿等有色金属矿的分选",
          "en": "Suitable for separation of non-ferrous metal ores such as cassiterite, tantalum-niobium ore, etc."
        }
      },
      {
        "icon": "🏝️",
        "title": {
          "zh": "海滨砂矿",
          "en": "Coastal Sand Ores"
        },
        "description": {
          "zh": "适用于海滨砂矿的分选",
          "en": "Suitable for separation of coastal sand ores"
        }
      },
      {
        "icon": "⚡",
        "title": {
          "zh": "煤炭洗选",
          "en": "Coal Washing"
        },
        "description": {
          "zh": "适用于煤炭的洗选加工",
          "en": "Suitable for coal washing and processing"
        }
      }
    ]
  },
  "relatedProducts": [
    "shaking-table",
    "jig-machine",
    "centrifugal-separator"
  ]
}
```

## 六、数据维护与更新流程

### 1. 更新技术参数表时的操作步骤

1. 更新产品详情JSON文件中的技术参数表(`specifications.tableData`)
2. 按照参数名称标准化表格，识别技术参数表中各字段对应的标准字段
3. 根据参数提取逻辑，计算新的参数范围值
4. 更新产品详情JSON文件顶级参数字段(`capacity`、`feedSize`、`motorPower`等)
   - 对于标准参数，按照参数提取逻辑计算范围值
   - 对于特殊参数，参考产品类型特定参数表进行提取
   - 对于无电机设备，确保正确标注为"无动力"
5. 同步更新产品列表JSON文件(`[category]-products.json`)中对应产品的参数值
6. 检查并统一所有参数的字段名和表头名称，确保符合标准化要求

### 2. 不同产品类型的特殊处理

针对不同类型的产品，更新时需要特别注意：

| 产品类型 | 特殊处理 | 示例 |
|---------|---------|------|
| **无动力设备** | 如螺旋溜槽，明确标记motorPower为"无动力" | `"motorPower": {"zh": "无动力", "en": "No Power"}` |
| **多参数设备** | 确保所有特定参数都正确提取并更新 | 破碎机需更新maxFeedSize、dischargeSize等 |
| **单一规格设备** | 单一值不使用范围格式 | `"motorPower": {"zh": "1.1 kW", "en": "1.1 kW"}` |
| **自定义单位设备** | 保持单位一致性 | 对于处理能力，保持t/h或t/d的单位一致 |

### 3. 数据验证检查项

在完成数据更新后，必须验证：
- 参数提取是否符合规定逻辑
- 产品详情页和产品列表页显示的参数是否一致
- 所有相关字段的格式是否正确
- 特殊产品的特定参数是否正确提取
- 无动力设备是否正确标记
- 单位是否统一规范
- 参数名称是否符合标准化要求，不同表述是否正确映射到统一字段

### 4. 自动化工具建议

建议开发或使用以下工具辅助数据维护：
- 参数范围自动提取工具，支持不同产品类型特定参数
- 数据一致性验证工具，检查详情页和列表页数据一致性
- JSON格式检查工具，确保格式正确
- 参数验证工具，确保必填参数完整，可选参数正确

## 七、注意事项

1. **确保数据完整性**：所有必填字段必须提供，且数据类型必须正确
2. **保持双语一致性**：中英文内容要保持一致，避免信息不对称
3. **维护图片规范**：所有产品图片必须按规定路径存放，并确保质量达标
4. **参数单位统一**：同类参数应使用统一的单位，例如所有重量都用吨或公斤
5. **定期更新维护**：产品数据应定期检查更新，确保信息的准确性和时效性
6. **避免硬编码数据**：尽量将所有产品数据存储在JSON文件中，避免在代码中硬编码
7. **注意值格式一致性**：表格数据中的值格式应保持一致，如数值范围的表示方式
8. **相关产品完整性**：确保相关产品ID正确无误且对应实际存在的产品，特别是对于同系列产品组，必须严格按照指定规则配置`relatedProducts`数组，以确保轮播卡正确显示

遵循以上规范创建的JSON文件将确保产品数据的一致性和完整性，简化前端开发工作，提高用户体验。

## 八、常见问题与解决方案

### 1. 参数提取常见错误

| 错误 | 正确做法 |
|------|---------|
| 仅使用某一型号的数据 | 必须从所有型号中提取最小值和最大值 |
| 不同文件使用不同的参数值 | 产品详情页和产品列表页必须使用相同的参数值 |
| 手动计算参数范围导致错误 | 使用自动化工具或严格按照提取逻辑计算 |
| 忽略产品类型的特殊参数 | 根据产品类型参考特定参数表，确保提取必要参数 |
| 错误处理无电机设备 | 将无电机设备的motorPower标记为"无动力" |
| 不一致的参数单位 | 统一同类参数的单位表示方式 |
| 参数名称不统一 | 按照参数名称标准化表格将不同表述映射为标准字段 |

### 2. 数据更新注意事项

- 更新参数表后，必须重新计算并更新所有相关参数值
- 更新一个文件后，必须检查并同步更新相关文件
- 参数格式必须保持一致，特别是单位表示方式
- 特殊产品类型需根据特定参数表处理对应参数
- 确保参数名称标准化，将不同表述统一为标准字段

### 3. 特殊产品类型常见问题

#### Q: 如何处理无动力设备(如螺旋溜槽)的电机功率字段？
A: 将motorPower设置为`{"zh": "无动力", "en": "No Power"}`，而不是省略该字段。

#### Q: 产品有自定义参数时如何处理？
A: 可以在产品JSON中添加自定义字段，但必须同时更新对应的产品列表JSON文件。自定义参数应遵循统一的命名规范和格式要求。

#### Q: 处理能力单位不统一(有些用t/h，有些用t/d)如何处理？
A: 应根据产品类型标准化单位。如重选设备一般使用t/h，而某些连续作业设备可能使用t/d。选择一种单位后应在所有相关文件中保持一致。

#### Q: 不同产品类型的必要参数如何判断？
A: 参考"产品类型特定参数"表，确保相应产品类型包含所有必需参数。

#### Q: 技术参数表中参数名称与标准不一致怎么办？
A: 参考"参数名称标准化"表格，将技术参数表中的各种表述映射到标准化的JSON字段。例如表格中的"给矿粒度"和"进料粒度"都应映射为JSON中的`feedSize`字段。

#### Q: 同一类设备的参数在不同文件中名称不一致如何处理？
A: 使用标准化的参数名称进行统一，确保所有产品使用相同的参数命名规则。这不仅适用于JSON字段，也适用于表头的中英文名称。 