/**
 * 表格表头规范常量
 * 所有产品详情页的表格表头应遵循此处定义的格式规范
 */

interface TableColumnFormat {
  key: string;
  title: {
    zh: string;
    en: string;
  };
  unit?: string;
  width: string;
}

/**
 * 破碎机表头格式规范
 */
export const CRUSHER_TABLE_COLUMNS: TableColumnFormat[] = [
  { key: "model", title: { zh: "型号", en: "Model" }, width: "15%" },
  { key: "feedOpening", title: { zh: "给料口尺寸", en: "Feed Opening" }, unit: "mm", width: "15%" },
  { key: "maxFeedSize", title: { zh: "最大进料尺寸", en: "Max Feed Size" }, unit: "mm", width: "15%" },
  { key: "dischargeRange", title: { zh: "排料口调整范围", en: "Discharge Range" }, unit: "mm", width: "15%" },
  { key: "capacity", title: { zh: "处理能力", en: "Capacity" }, unit: "t/h", width: "20%" },
  { key: "power", title: { zh: "电机功率", en: "Motor Power" }, unit: "kW", width: "10%" },
  { key: "weight", title: { zh: "重量", en: "Weight" }, unit: "t", width: "10%" }
];

/**
 * 固定式振动筛表头格式规范
 */
export const SCREEN_TABLE_COLUMNS: TableColumnFormat[] = [
  { key: "model", title: { zh: "型号", en: "Model" }, width: "15%" },
  { key: "screenSize", title: { zh: "筛面尺寸", en: "Screen Size" }, unit: "m²", width: "15%" },
  { key: "layers", title: { zh: "层数", en: "Layers" }, width: "10%" },
  { key: "aperture", title: { zh: "筛孔尺寸", en: "Aperture Size" }, unit: "mm", width: "15%" },
  { key: "capacity", title: { zh: "处理能力", en: "Capacity" }, unit: "m³/h", width: "15%" },
  { key: "power", title: { zh: "电机功率", en: "Motor Power" }, unit: "kW", width: "15%" },
  { key: "weight", title: { zh: "重量", en: "Weight" }, unit: "t", width: "15%" }
];

/**
 * 给料机表头格式规范
 */
export const FEEDER_TABLE_COLUMNS: TableColumnFormat[] = [
  { key: "model", title: { zh: "型号", en: "Model" }, width: "15%" },
  { key: "trough", title: { zh: "槽宽", en: "Trough Width" }, unit: "mm", width: "15%" },
  { key: "capacity", title: { zh: "处理能力", en: "Capacity" }, unit: "t/h", width: "20%" },
  { key: "speed", title: { zh: "输送速度", en: "Conveying Speed" }, unit: "m/min", width: "15%" },
  { key: "power", title: { zh: "电机功率", en: "Motor Power" }, unit: "kW", width: "15%" },
  { key: "weight", title: { zh: "重量", en: "Weight" }, unit: "t", width: "10%" }
];

/**
 * 磨矿设备表头格式规范
 */
export const GRINDING_TABLE_COLUMNS: TableColumnFormat[] = [
  { key: "model", title: { zh: "型号", en: "Model" }, width: "15%" },
  { key: "size", title: { zh: "规格", en: "Specification" }, unit: "mm", width: "15%" },
  { key: "maxFeedSize", title: { zh: "最大进料尺寸", en: "Max Feed Size" }, unit: "mm", width: "15%" },
  { key: "dischargeSize", title: { zh: "出料粒度", en: "Discharge Size" }, unit: "mm", width: "15%" },
  { key: "capacity", title: { zh: "处理能力", en: "Capacity" }, unit: "t/h", width: "15%" },
  { key: "power", title: { zh: "电机功率", en: "Motor Power" }, unit: "kW", width: "15%" },
  { key: "weight", title: { zh: "重量", en: "Weight" }, unit: "t", width: "10%" }
];

/**
 * 重力选矿设备表头格式规范
 */
export const GRAVITY_SEPARATION_TABLE_COLUMNS: TableColumnFormat[] = [
  { key: "model", title: { zh: "型号", en: "Model" }, width: "9%" },
  { key: "adjustmentRange", title: { zh: "冲程 / 调整范围", en: "Stroke / Adjustment Range" }, unit: "mm", width: "9%" },
  { key: "jiggingChamberNumber", title: { zh: "跳汰室数", en: "Jigging Chamber Number" }, width: "9%" },
  { key: "sectionType", title: { zh: "截面型式", en: "Section Type" }, width: "9%" },
  { key: "jiggingChamberArea", title: { zh: "跳汰室面积", en: "Jigging Chamber Area" }, unit: "m²", width: "9%" },
  { key: "frequencyRange", title: { zh: "冲次范围", en: "Frequency Range" }, unit: "cycles/min", width: "9%" },
  { key: "feedSize", title: { zh: "给矿粒度", en: "Feed Size" }, unit: "mm", width: "9%" },
  { key: "capacity", title: { zh: "处理能力", en: "Processing Capacity" }, unit: "t/h", width: "9%" },
  { key: "motorPower", title: { zh: "电机功率", en: "Motor Power" }, unit: "kW", width: "9%" },
  { key: "waterConsumption", title: { zh: "耗水量", en: "Water Consumption" }, unit: "m³/h", width: "9%" },
  { key: "weight", title: { zh: "重量", en: "Weight" }, unit: "t", width: "10%" }
];

/**
 * 浮选设备表头格式规范
 */
export const FLOTATION_TABLE_COLUMNS: TableColumnFormat[] = [
  { key: "model", title: { zh: "型号", en: "Model" }, width: "10%" },
  { key: "effectiveVolume", title: { zh: "有效容积", en: "Effective Volume" }, unit: "m³", width: "10%" },
  { key: "capacity", title: { zh: "处理能力", en: "Processing Capacity" }, unit: "m³/min", width: "10%" },
  { key: "impellerDiameter", title: { zh: "叶轮直径", en: "Impeller Diameter" }, unit: "mm", width: "10%" },
  { key: "impellerSpeed", title: { zh: "叶轮转速", en: "Impeller Speed" }, unit: "r/min", width: "10%" },
  { key: "airConsumption", title: { zh: "耗气量", en: "Air Consumption" }, unit: "m³/min", width: "10%" },
  { key: "motorPower", title: { zh: "电机功率", en: "Motor Power" }, unit: "kW", width: "10%" },
  { key: "dimensions", title: { zh: "外形尺寸", en: "Dimensions" }, unit: "mm", width: "15%" },
  { key: "weight", title: { zh: "重量", en: "Weight" }, unit: "t", width: "10%" }
];

/**
 * 磁选设备表头格式规范
 */
export const MAGNETIC_SEPARATION_TABLE_COLUMNS: TableColumnFormat[] = [
  { key: "model", title: { zh: "型号", en: "Model" }, width: "10%" },
  { key: "capacity", title: { zh: "处理能力", en: "Processing Capacity" }, unit: "t/h", width: "15%" },
  { key: "magneticIntensity", title: { zh: "磁场强度", en: "Magnetic Intensity" }, unit: "Gs", width: "15%" }, 
  { key: "drumDiameter", title: { zh: "筒体直径", en: "Drum Diameter" }, unit: "mm", width: "10%" },
  { key: "drumSpeed", title: { zh: "筒体转速", en: "Drum Speed" }, unit: "r/min", width: "10%" },
  { key: "motorPower", title: { zh: "电机功率", en: "Motor Power" }, unit: "kW", width: "10%" },
  { key: "dimensions", title: { zh: "外形尺寸", en: "Dimensions" }, unit: "mm", width: "15%" },
  { key: "weight", title: { zh: "重量", en: "Weight" }, unit: "t", width: "15%" }
];

/**
 * 根据产品类型获取对应的表头格式
 */
export function getTableColumnsByProductType(productType: string): TableColumnFormat[] {
  switch (productType) {
    case 'crusher':
      return CRUSHER_TABLE_COLUMNS;
    case 'screen':
      return SCREEN_TABLE_COLUMNS;
    case 'feeder':
      return FEEDER_TABLE_COLUMNS;
    case 'grinding':
      return GRINDING_TABLE_COLUMNS;
    case 'gravity-separation':
    case 'beneficiation':
      return GRAVITY_SEPARATION_TABLE_COLUMNS;
    case 'flotation':
      return FLOTATION_TABLE_COLUMNS;
    case 'magnetic-separation':
      return MAGNETIC_SEPARATION_TABLE_COLUMNS;
    default:
      return [
        { key: "model", title: { zh: "型号", en: "Model" }, width: "15%" },
        { key: "capacity", title: { zh: "处理能力", en: "Capacity" }, unit: "t/h", width: "20%" },
        { key: "power", title: { zh: "电机功率", en: "Motor Power" }, unit: "kW", width: "15%" },
        { key: "weight", title: { zh: "重量", en: "Weight" }, unit: "t", width: "10%" }
      ];
  }
}

// 浮选设备表格配置
export const flotationEquipmentTableConfig = {
  columns: FLOTATION_TABLE_COLUMNS
}; 