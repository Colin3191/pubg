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
      <MapTabs
        selectedMapId={selectedMapId}
        onMapChange={handleMapChange}
      />

      <MapViewer map={selectedMap} />
    </div>
  );
}

export default App;
