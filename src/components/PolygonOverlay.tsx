"use client";

import React, { useState } from 'react';
import { Vertex } from '@/data/propertyUnits';

interface PolygonOverlayProps {
  vertices: Vertex[];
  polygonIndex: number;
  developerMode: boolean;
  isVisible: boolean;
  isDraggingVertex: {
    polygonIndex: number;
    vertexIndex: number;
    offsetX?: number;
    offsetY?: number;
  } | null;
  isDraggingPolygon: {
    polygonIndex: number;
    offsetX?: number;
    offsetY?: number;
  } | null;
  polygonStyle: {
    borderColor: string;
    borderWidth: number;
    showVertexNumbers: boolean;
  };
  status?: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  isMobile?: boolean;
  isHighlighted?: boolean;
  onVertexMouseDown: (e: React.MouseEvent | React.TouchEvent, vertexIndex: number, polygonIndex: number) => void;
  onPolygonMouseDown: (e: React.MouseEvent | React.TouchEvent, polygonIndex: number) => void;
  onAddVertex?: (polygonIndex: number, afterVertexIndex: number) => void;
}

const PolygonOverlay: React.FC<PolygonOverlayProps> = ({
  vertices,
  polygonIndex,
  developerMode,
  isVisible,
  isDraggingVertex,
  isDraggingPolygon,
  polygonStyle,
  status = 'available',
  onMouseEnter,
  onMouseLeave,
  onClick,
  onVertexMouseDown,
  onPolygonMouseDown,
  onAddVertex,
  isMobile = false,
  isHighlighted = false
}) => {
  // Stan dla efektu hover
  const [isHovered, setIsHovered] = useState(false);
  
  // Jeśli wielokąt nie powinien być widoczny, nie renderuj go
  if (!isVisible) return null;

  // Przygotowanie punktów wielokąta
  const points = vertices.map(v => `${v.x},${v.y}`).join(' ');
  
  // Obliczenie środka wielokąta
  const centerX = vertices.reduce((sum, v) => sum + v.x, 0) / vertices.length;
  const centerY = vertices.reduce((sum, v) => sum + v.y, 0) / vertices.length;

  // Określenie stylu wielokąta na podstawie statusu
  let fillColor = 'rgba(34, 197, 94, 0.01)'; // Praktycznie niewidoczny bez hover
  let hoverFillColor = 'rgba(34, 197, 94, 0.7)'; // Mocny kolor po najechaniu
  let strokeColor = isHovered ? 'rgba(255, 255, 255, 0.3)' : 'transparent'; // Lekkie białe obramowanie po hover
  let hoverStrokeColor = 'rgba(255, 255, 255, 0.3)'; // Lekka biała linia
  let filter = '';

  switch(status) {
    case 'available':
      fillColor = 'rgba(34, 197, 94, 0.01)'; // Zielony - praktycznie niewidoczny
      hoverFillColor = 'rgba(34, 197, 94, 0.7)'; // Mocny zielony po hover
      hoverStrokeColor = 'rgba(34, 197, 94, 0.6)'; // Grubsza zielona linia
      filter = 'url(#greenGlow)';
      break;
    case 'reserved':
      fillColor = 'rgba(249, 115, 22, 0.01)'; // Pomarańczowy - praktycznie niewidoczny
      hoverFillColor = 'rgba(249, 115, 22, 0.7)'; // Mocny pomarańczowy po hover
      hoverStrokeColor = 'rgba(249, 115, 22, 0.6)'; // Grubsza pomarańczowa linia
      filter = 'url(#orangeGlow)';
      break;
    case 'sold-transferred':
    case 'sold-not-transferred':
      fillColor = 'rgba(239, 68, 68, 0.01)'; // Czerwony - praktycznie niewidoczny
      hoverFillColor = 'rgba(239, 68, 68, 0.7)'; // Mocny czerwony po hover
      hoverStrokeColor = 'rgba(239, 68, 68, 0.6)'; // Grubsza czerwona linia
      filter = 'url(#redGlow)';
      break;
    case 'unavailable':
      fillColor = 'rgba(107, 114, 128, 0.01)'; // Szary - praktycznie niewidoczny
      hoverFillColor = 'rgba(107, 114, 128, 0.7)'; // Mocny szary po hover
      hoverStrokeColor = 'rgba(107, 114, 128, 0.6)'; // Grubsza szara linia
      filter = 'url(#grayGlow)';
      break;
    default:
      fillColor = 'rgba(215, 194, 141, 0.01)'; // Złoty - praktycznie niewidoczny
      hoverFillColor = 'rgba(215, 194, 141, 0.7)'; // Mocny złoty po hover
      hoverStrokeColor = 'rgba(215, 194, 141, 0.6)'; // Grubsza złota linia
      filter = 'url(#goldGlow)';
  }

  return (
    <g>
      {/* Główny wielokąt z wypełnieniem */}
      <polygon
        points={points}
        fill={isHovered ? hoverFillColor : fillColor}
        stroke="transparent"
        strokeWidth={0}
        filter={developerMode ? '' : 'url(#doubleFeather)'}
        style={{ 
          cursor: developerMode ? 'default' : 'pointer',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={!isMobile ? () => {
          setIsHovered(true);
          onMouseEnter();
        } : undefined}
        onMouseLeave={!isMobile ? () => {
          setIsHovered(false);
          onMouseLeave();
        } : undefined}
        onClick={!isMobile ? onClick : undefined}
        onTouchStart={isMobile ? () => {
          // Na mobile krótki visual feedback na dotyk
          setIsHovered(true);
          setTimeout(() => setIsHovered(false), 200); // Krótkie podświetlenie
        } : undefined}
        onTouchEnd={isMobile ? onClick : undefined}
      />
      
      {/* Grube rozmyte obramowanie po hover (desktop), dotyku (mobile) lub gdy podświetlony */}
      {(isHovered || isHighlighted) && (
        <polygon
          points={points}
          fill="transparent"
          stroke={hoverStrokeColor}
          strokeWidth={8}
          filter="url(#blurredStroke)"
          style={{ 
            pointerEvents: 'none',
            transition: 'all 0.3s ease'
          }}
        />
      )}
      
      {/* Linie między wierzchołkami - widoczne tylko w trybie deweloperskim */}
      {developerMode && vertices.map((vertex, vIndex) => {
        const nextVertex = vertices[(vIndex + 1) % vertices.length];
        
        return (
          <line
            key={`line-${vIndex}`}
            x1={vertex.x}
            y1={vertex.y}
            x2={nextVertex.x}
            y2={nextVertex.y}
            stroke="#d7c28d"
            strokeWidth={2}
            strokeDasharray="5,5"
            opacity={0.7}
            style={{ pointerEvents: 'none' }}
          />
        );
      })}
      
      {/* Środek wielokąta - widoczny tylko w trybie deweloperskim */}
      {developerMode && (
        <circle
          cx={centerX}
          cy={centerY}
          r={8}
          fill={isDraggingPolygon && isDraggingPolygon.polygonIndex === polygonIndex ? "#ff0000" : "#4a90e2"}
          stroke="#fff"
          strokeWidth={2}
          style={{ cursor: 'move' }}
          onMouseDown={(e) => onPolygonMouseDown(e, polygonIndex)}
          onTouchStart={(e) => onPolygonMouseDown(e, polygonIndex)}
        />
      )}
      
      {/* Wierzchołki wielokąta - widoczne tylko w trybie deweloperskim */}
      {developerMode && vertices.map((vertex, vIndex) => {
        const nextVertex = vertices[(vIndex + 1) % vertices.length];
        const midX = (vertex.x + nextVertex.x) / 2;
        const midY = (vertex.y + nextVertex.y) / 2;
        
        return (
          <g key={vIndex}>
            {/* Istniejący wierzchołek */}
            <circle
              cx={vertex.x}
              cy={vertex.y}
              r={6}
              fill={isDraggingVertex && isDraggingVertex.polygonIndex === polygonIndex && isDraggingVertex.vertexIndex === vIndex ? "#ff0000" : "#d7c28d"}
              stroke="#000"
              strokeWidth={1}
              style={{ cursor: 'pointer' }}
              onMouseDown={(e) => onVertexMouseDown(e, vIndex, polygonIndex)}
              onTouchStart={(e) => onVertexMouseDown(e, vIndex, polygonIndex)}
            />
            
            {/* Przycisk dodawania nowego punktu między tym a następnym wierzchołkiem */}
            {onAddVertex && (
              <g>
                <circle
                  cx={midX}
                  cy={midY}
                  r={4}
                  fill="#22c55e"
                  stroke="#fff"
                  strokeWidth={2}
                  style={{ cursor: 'pointer', opacity: 0.7 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddVertex(polygonIndex, vIndex);
                  }}
                  onMouseEnter={(e) => {
                    (e.target as SVGElement).style.opacity = '1';
                    (e.target as SVGElement).style.transform = 'scale(1.2)';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as SVGElement).style.opacity = '0.7';
                    (e.target as SVGElement).style.transform = 'scale(1)';
                  }}
                />
                          {/* Ikona + w środku */}
                <text
                  x={midX}
                  y={midY + 1}
                  textAnchor="middle"
                  fontSize="8"
                  fill="#fff"
                  style={{ pointerEvents: 'none', fontWeight: 'bold' }}
                >
                  +
                </text>
              </g>
            )}
            
            {polygonStyle.showVertexNumbers && (
              <text
                x={vertex.x}
                y={vertex.y - 10}
                textAnchor="middle"
                fontSize="12"
                fill="#000"
              >
                {vIndex}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
};

export default PolygonOverlay;
