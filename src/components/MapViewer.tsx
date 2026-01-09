/**
 * 地图查看器组件
 * 支持图片缩放、拖拽、双击放大等交互功能
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import type { WheelEvent, MouseEvent, TouchEvent } from 'react';
import type { MapData, MapViewerState, ZoomConfig } from '../types/map';
import './MapViewer.css';

interface MapViewerProps {
  /** 当前显示的地图数据 */
  map: MapData;
}

const ZOOM_CONFIG: ZoomConfig = {
  minScale: 0.5,
  maxScale: 3,
  scaleStep: 0.25 // 每次滚轮缩放 25%，更明显的缩放效果
};

export function MapViewer({ map }: MapViewerProps) {
  const [state, setState] = useState<MapViewerState>({
    scale: 1,
    position: { x: 0, y: 0 },
    isDragging: false,
    dragStart: { x: 0, y: 0 }
  });
  const [baseScale, setBaseScale] = useState(1); // 基础缩放比例，让图片适应容器
  const [touchDistance, setTouchDistance] = useState(0); // 双指距离，用于缩放

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  /**
   * 计算合适的初始缩放比例，让图片完整显示在容器内
   * 地图切换时重新计算
   */
  useEffect(() => {
    const container = containerRef.current;
    const image = imageRef.current;

    if (!container || !image) return;

    const updateBaseScale = () => {
      const container = containerRef.current;
      const image = imageRef.current;

      if (container && image && image.complete && image.naturalWidth > 0) {
        const containerRect = container.getBoundingClientRect();
        const imgWidth = image.naturalWidth;
        const imgHeight = image.naturalHeight;

        // 计算缩放比例，使图片完整显示在容器内
        const scaleX = containerRect.width / imgWidth;
        const scaleY = containerRect.height / imgHeight;

        // 选择较小的缩放比例，确保图片完全显示且填满容器
        const scale = Math.min(scaleX, scaleY);

        setBaseScale(scale);

        // 重置位置和缩放
        setState({
          scale: 1,
          position: { x: 0, y: 0 },
          isDragging: false,
          dragStart: { x: 0, y: 0 }
        });
      }
    };

    // 立即计算一次（如果图片已加载）
    updateBaseScale();

    // 监听图片加载完成
    const handleLoad = () => {
      updateBaseScale();
    };

    image.addEventListener('load', handleLoad);

    // 监听窗口大小变化
    window.addEventListener('resize', updateBaseScale);

    return () => {
      image.removeEventListener('load', handleLoad);
      window.removeEventListener('resize', updateBaseScale);
    };
  }, [map.image]); // 监听 map.image 的变化


  /**
   * 处理鼠标滚轮缩放 - 以鼠标位置为中心
   */
  const handleWheel = useCallback((event: WheelEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;

    // 计算新的缩放比例（用户缩放）
    const delta = event.deltaY > 0 ? -ZOOM_CONFIG.scaleStep : ZOOM_CONFIG.scaleStep;
    const newScale = Math.min(
      Math.max(state.scale + delta, ZOOM_CONFIG.minScale),
      ZOOM_CONFIG.maxScale
    );

    // 如果缩放比例没有变化，直接返回
    if (newScale === state.scale) return;

    // 获取容器的尺寸
    const rect = container.getBoundingClientRect();

    // 计算鼠标相对于容器的位置（以容器中心为原点）
    const mouseX = event.clientX - rect.left - rect.width / 2;
    const mouseY = event.clientY - rect.top - rect.height / 2;

    // 当前实际缩放比例
    const currentActualScale = baseScale * state.scale;
    const newActualScale = baseScale * newScale;

    // 计算缩放前鼠标指向的图片内容位置
    const contentX = (mouseX - state.position.x) / currentActualScale;
    const contentY = (mouseY - state.position.y) / currentActualScale;

    // 计算新的平移位置，使得内容点在缩放后仍在鼠标下方
    const newPositionX = mouseX - contentX * newActualScale;
    const newPositionY = mouseY - contentY * newActualScale;

    setState(prev => ({
      ...prev,
      scale: newScale,
      position: { x: newPositionX, y: newPositionY }
    }));
  }, [state.scale, state.position, baseScale]);

  /**
   * 处理鼠标按下 - 开始拖拽
   */
  const handleMouseDown = useCallback((event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (event.button === 0) { // 只响应左键
      setState(prev => ({
        ...prev,
        isDragging: true,
        dragStart: { x: event.clientX - prev.position.x, y: event.clientY - prev.position.y }
      }));
    }
  }, []);

  /**
   * 处理鼠标移动 - 拖拽中
   */
  const handleMouseMove = useCallback((event: MouseEvent<HTMLDivElement>) => {
    if (state.isDragging) {
      const newX = event.clientX - state.dragStart.x;
      const newY = event.clientY - state.dragStart.y;

      setState(prev => ({
        ...prev,
        position: { x: newX, y: newY }
      }));
    }
  }, [state.isDragging, state.dragStart]);

  /**
   * 处理鼠标松开 - 结束拖拽
   */
  const handleMouseUp = useCallback(() => {
    if (state.isDragging) {
      setState(prev => ({ ...prev, isDragging: false }));
    }
  }, [state.isDragging]);

  /**
   * 处理鼠标离开 - 结束拖拽
   */
  const handleMouseLeave = useCallback(() => {
    if (state.isDragging) {
      setState(prev => ({ ...prev, isDragging: false }));
    }
  }, [state.isDragging]);

  /**
   * 计算两点之间的距离
   */
  const getDistance = (touch1: React.Touch, touch2: React.Touch): number => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  /**
   * 计算两点之间的中心点
   */
  const getCenter = (touch1: React.Touch, touch2: React.Touch): { x: number; y: number } => {
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2
    };
  };

  /**
   * 处理触摸开始
   */
  const handleTouchStart = useCallback((event: TouchEvent<HTMLDivElement>) => {
    if (event.touches.length === 1) {
      // 单指触摸 - 准备拖拽
      const touch = event.touches[0];
      setState(prev => ({
        ...prev,
        isDragging: true,
        dragStart: {
          x: touch.clientX - prev.position.x,
          y: touch.clientY - prev.position.y
        }
      }));
    } else if (event.touches.length === 2) {
      // 双指触摸 - 准备缩放
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const distance = getDistance(touch1, touch2);

      setTouchDistance(distance);
    }
  }, []);

  /**
   * 处理触摸移动
   */
  const handleTouchMove = useCallback((event: TouchEvent<HTMLDivElement>) => {
    // CSS 中的 touch-action: none 已经处理了默认行为的阻止

    if (event.touches.length === 1 && state.isDragging) {
      // 单指拖拽
      const touch = event.touches[0];
      const newX = touch.clientX - state.dragStart.x;
      const newY = touch.clientY - state.dragStart.y;

      setState(prev => ({
        ...prev,
        position: { x: newX, y: newY }
      }));
    } else if (event.touches.length === 2 && touchDistance > 0) {
      // 双指缩放
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const newDistance = getDistance(touch1, touch2);
      const newCenter = getCenter(touch1, touch2);

      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();

      // 计算缩放比例变化
      const scaleRatio = newDistance / touchDistance;
      const newScale = Math.min(
        Math.max(state.scale * scaleRatio, ZOOM_CONFIG.minScale),
        ZOOM_CONFIG.maxScale
      );

      // 计算中心点相对于容器的位置
      const centerX = newCenter.x - rect.left - rect.width / 2;
      const centerY = newCenter.y - rect.top - rect.height / 2;

      // 当前实际缩放比例
      const currentActualScale = baseScale * state.scale;
      const newActualScale = baseScale * newScale;

      // 计算缩放前的内容位置
      const contentX = (centerX - state.position.x) / currentActualScale;
      const contentY = (centerY - state.position.y) / currentActualScale;

      // 计算新的平移位置
      const newPositionX = centerX - contentX * newActualScale;
      const newPositionY = centerY - contentY * newActualScale;

      setState(prev => ({
        ...prev,
        scale: newScale,
        position: { x: newPositionX, y: newPositionY }
      }));

      setTouchDistance(newDistance);
    }
  }, [state.isDragging, state.dragStart, state.scale, state.position, touchDistance, baseScale]);

  /**
   * 处理触摸结束
   */
  const handleTouchEnd = useCallback(() => {
    setState(prev => ({ ...prev, isDragging: false }));
    setTouchDistance(0);
  }, []);

  /**
   * 重置视图
   */
  const handleReset = useCallback(() => {
    setState({
      scale: 1,
      position: { x: 0, y: 0 },
      isDragging: false,
      dragStart: { x: 0, y: 0 }
    });
  }, []);

  /**
   * 放大
   */
  const handleZoomIn = useCallback(() => {
    setState(prev => {
      const newScale = Math.min(prev.scale + ZOOM_CONFIG.scaleStep, ZOOM_CONFIG.maxScale);
      return { ...prev, scale: newScale, position: { x: 0, y: 0 } };
    });
  }, []);

  /**
   * 缩小
   */
  const handleZoomOut = useCallback(() => {
    setState(prev => {
      const newScale = Math.max(prev.scale - ZOOM_CONFIG.scaleStep, ZOOM_CONFIG.minScale);
      return { ...prev, scale: newScale, position: { x: 0, y: 0 } };
    });
  }, []);

  // 计算实际的缩放比例
  const actualScale = baseScale * state.scale;

  return (
    <div className="map-viewer">
      <div
        ref={containerRef}
        className="map-viewer__container"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="map-viewer__image-wrapper"
          style={{
            transform: `translate(${state.position.x}px, ${state.position.y}px) scale(${actualScale})`,
            cursor: state.isDragging ? 'grabbing' : 'grab'
          }}
        >
          <img
            ref={imageRef}
            src={map.image}
            alt={map.name}
            className="map-viewer__image"
            draggable={false}
            style={{ maxWidth: 'none', maxHeight: 'none' }} // 覆盖 CSS 的限制
          />
        </div>
      </div>

      {/* 控制面板 */}
      <div className="map-viewer__controls">
        <div className="map-viewer__info">
          <button
            className="map-viewer__zoom-btn"
            onClick={handleZoomOut}
            disabled={state.scale <= ZOOM_CONFIG.minScale}
            title="缩小"
          >
            −
          </button>
          <span className="map-viewer__zoom-level">
            {Math.round(state.scale * 100)}%
          </span>
          <button
            className="map-viewer__zoom-btn"
            onClick={handleZoomIn}
            disabled={state.scale >= ZOOM_CONFIG.maxScale}
            title="放大"
          >
            +
          </button>
          <button
            className="map-viewer__reset-btn"
            onClick={handleReset}
            title="重置视图"
          >
            重置
          </button>
        </div>

        <div className="map-viewer__hint">
          <span className="map-viewer__hint-desktop">🖱️ 滚轮缩放 • 拖拽移动</span>
          <span className="map-viewer__hint-mobile">📱 双指缩放 • 单指拖拽</span>
        </div>
      </div>
    </div>
  );
}
