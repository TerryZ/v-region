import Vue from 'vue'

/**
 * 区域元素基本模型
 */
export declare interface RegionItem {
  key: string
  value: string
}

export declare interface RegionModel {
    /** 省份模型 */
    province: RegionItem
    /** 城市模型 */
    city: RegionItem
    /** 区域模型 */
    area: RegionItem
    /** 村镇模型 */
    town: RegionItem
}

/**
 * 用户输入模型
 */
export declare interface RegionInputModel {
  /** 省份编码 */
  province: string
  /** 城市编码 */
  city: string
  /** 区域编码 */
  area: string
  /** 村镇编码 */
  town: string
}

export declare class RegionComponent extends Vue {
  /** 输入区域模型 */
  value: RegionInputModel
  /** 内容修改后的响应事件 */
  $emit(eventName:'change', event: RegionModel): this
}
