/**
 * 地图数据类型定义
 */

export interface MapData {
  /** 地图唯一标识 */
  id: string;
  /** 地图名称（中文） */
  name: string;
  /** 地图名称（英文） */
  nameEn: string;
  /** 地图尺寸（如 "8km x 8km"） */
  size: string;
  /** 地图图片路径 */
  image: string;
}

/**
 * 地图查看器状态
 */
export interface MapViewerState {
  /** 当前缩放比例 */
  scale: number;
  /** 当前平移位置 */
  position: {
    x: number;
    y: number;
  };
  /** 是否正在拖拽 */
  isDragging: boolean;
  /** 拖拽起始点 */
  dragStart: {
    x: number;
    y: number;
  };
}

/**
 * 缩放限制配置
 */
export interface ZoomConfig {
  /** 最小缩放比例 */
  minScale: number;
  /** 最大缩放比例 */
  maxScale: number;
  /** 缩放步长 */
  scaleStep: number;
  /** 双击放大的倍数 */
  doubleClickScale?: number;
}
