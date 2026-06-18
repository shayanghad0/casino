import React from 'react';
import { Link } from 'react-router-dom';

interface GameCardProps {
  path: string;
  name: string;
  icon: string;
  badge?: string;
  badgeClass?: string;
}

export default function GameCard({ path, name, icon, badge, badgeClass }: GameCardProps) {
  return (
    <Link to={path} className="game-card card-3d">
      <div className="card-3d-inner">
        <div className="game-card-image">{icon}</div>
        <div className="game-card-info">
          <span className="game-card-name">{name}</span>
          {badge && (
            <span className={`game-card-badge ${badgeClass || ''}`}>{badge}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
