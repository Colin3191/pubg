/**
 * 地图信息展示组件
 * 显示当前地图的详细信息
 */

import type { MapData } from '../types/map';
import './MapInfo.css';

interface MapInfoProps {
  /** 当前地图数据 */
  map: MapData;
}

export function MapInfo({ map }: MapInfoProps) {
  return (
    <div className="map-info">
      <div className="map-info__header">
        <h2 className="map-info__title">{map.name}</h2>
        <span className="map-info__title-en">{map.nameEn}</span>
      </div>

      <div className="map-info__details">
        <div className="map-info__detail-item">
          <span className="map-info__detail-label">地图尺寸</span>
          <span className="map-info__detail-value">{map.size}</span>
        </div>

        {map.description && (
          <div className="map-info__detail-item map-info__detail-item--full">
            <span className="map-info__detail-label">地图介绍</span>
            <p className="map-info__detail-description">{map.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
