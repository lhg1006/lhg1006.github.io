'use client';

import Spline from '@splinetool/react-spline';

interface SplineSceneProps {
  scene: string;
  className?: string;
}

export default function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <div className={className}>
      <Spline scene={scene} />
    </div>
  );
}
