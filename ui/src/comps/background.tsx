import Grainient from '@/components/Grainient';

export default function Bg() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
      }}
    >
      <Grainient
        color1='#403a40'
        color2='#3d3348'
        color3='#272627'
        timeSpeed={0}
        colorBalance={0.58}
        warpStrength={0.85}
        warpFrequency={5}
        warpSpeed={2}
        warpAmplitude={21}
        blendAngle={0}
        blendSoftness={0.34}
        rotationAmount={400}
        noiseScale={0.65}
        grainAmount={0.13}
        grainScale={2}
        grainAnimated={false}
        contrast={1.5}
        gamma={1}
        saturation={2}
        centerX={0}
        centerY={0}
        zoom={0.9}
      />
    </div>
  );
}
