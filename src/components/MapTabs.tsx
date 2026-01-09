/**
 * 地图标签切换组件
 * 顶部标签页形式展示所有地图
 */

import { useMemo } from 'react';
import { MAPS } from '../data/maps';
import './MapTabs.css';

interface MapTabsProps {
  /** 当前选中的地图ID */
  selectedMapId: string;
  /** 地图切换回调 */
  onMapChange: (mapId: string) => void;
}

export function MapTabs({ selectedMapId, onMapChange }: MapTabsProps) {
  // 计算每个标签的位置，用于指示器动画
  const indicatorStyle = useMemo(() => {
    const tabsContainer = document.querySelector('.map-tabs__list');
    if (!tabsContainer) return {};

    const activeTab = tabsContainer.querySelector(`[data-map-id="${selectedMapId}"]`) as HTMLElement;
    if (!activeTab) return {};

    return {
      left: `${activeTab.offsetLeft}px`,
      width: `${activeTab.offsetWidth}px`
    };
  }, [selectedMapId]);

  return (
    <div className="map-tabs">
      <div className="map-tabs__container">
        <div className="map-tabs__title">
          <span className="map-tabs__title-icon">🗺️</span>
          PUBG 地图查询
        </div>

        <nav className="map-tabs__nav" aria-label="地图选择">
          <ul className="map-tabs__list">
            {MAPS.map((map) => (
              <li key={map.id} className="map-tabs__item">
                <button
                  className={`map-tabs__tab ${map.id === selectedMapId ? 'map-tabs__tab--active' : ''}`}
                  data-map-id={map.id}
                  onClick={() => onMapChange(map.id)}
                  aria-label={`切换到${map.name}地图`}
                  aria-pressed={map.id === selectedMapId}
                >
                  <span className="map-tabs__tab-name">{map.name}</span>
                  <span className="map-tabs__tab-name-en">{map.nameEn}</span>
                </button>
              </li>
            ))}
          </ul>

          {/* 选中指示器 */}
          <div
            className="map-tabs__indicator"
            style={indicatorStyle}
          />
        </nav>
      </div>
    </div>
  );
}
