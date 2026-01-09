/**
 * PUBG 地图查询工具 - 主应用
 */

import { useState } from 'react';
import { MapTabs } from './components/MapTabs';
import { MapViewer } from './components/MapViewer';
import { MAPS } from './data/maps';
import './App.css';

function App() {
  const [selectedMapId, setSelectedMapId] = useState(MAPS[0].id);

  // 获取当前选中的地图数据
  const selectedMap = MAPS.find(map => map.id === selectedMapId) || MAPS[0];

  // 处理地图切换
  const handleMapChange = (mapId: string) => {
    setSelectedMapId(mapId);
  };

  return (
    <div className="app">
      <a
        href="https://github.com/Colin3191/pubg"
        target="_blank"
        rel="noopener noreferrer"
        className="github-link"
        aria-label="View source on GitHub"
      >
        <svg
          height="32"
          viewBox="0 0 16 16"
          version="1.1"
          width="32"
          aria-hidden="true"
        >
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
        </svg>
      </a>
      <MapTabs
        selectedMapId={selectedMapId}
        onMapChange={handleMapChange}
      />

      <MapViewer map={selectedMap} />
    </div>
  );
}

export default App;
