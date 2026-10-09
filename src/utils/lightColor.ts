function gaussian(wavelength: number, center: number, left: number, right: number) {
  const distance = (wavelength - center) * (wavelength < center ? left : right);
  return Math.exp(-0.5 * distance * distance);
}

const observer = Array.from({ length: 81 }, (_, index) => {
  const wavelength = 380 + index * 5;
  return {
    wavelength: wavelength * 1e-9,
    x: 1.056 * gaussian(wavelength, 599.8, 0.0264, 0.0323)
      + 0.362 * gaussian(wavelength, 442, 0.0624, 0.0374)
      - 0.065 * gaussian(wavelength, 501.1, 0.049, 0.0382),
    y: 0.821 * gaussian(wavelength, 568.8, 0.0213, 0.0247)
      + 0.286 * gaussian(wavelength, 530.9, 0.0613, 0.0322),
    z: 1.217 * gaussian(wavelength, 437, 0.0845, 0.0278)
      + 0.681 * gaussian(wavelength, 459, 0.0385, 0.0725),
  };
});

export function warmthToKelvin(warmth: number) {
  const amount = Math.min(100, Math.max(0, warmth));
  return amount <= 65 ? 3500 - 800 * amount / 65 : 2700 - 900 * (amount - 65) / 35;
}

export function lightColor(kelvin: number, brightness = 100) {
  let x = 0;
  let y = 0;
  let z = 0;
  for (const sample of observer) {
    const radiance = 1 / (sample.wavelength ** 5 * Math.expm1(0.01438776877 / (sample.wavelength * kelvin)));
    x += radiance * sample.x;
    y += radiance * sample.y;
    z += radiance * sample.z;
  }
  const rgb = [
    3.2406 * x - 1.5372 * y - 0.4986 * z,
    -0.9689 * x + 1.8758 * y + 0.0415 * z,
    0.0557 * x - 0.204 * y + 1.057 * z,
  ];
  const peak = Math.max(...rgb);
  const intensity = Math.min(100, Math.max(0, brightness)) / 100;
  return '#' + rgb.map(channel => {
    const linear = Math.max(0, channel / peak) * intensity;
    const encoded = linear <= 0.0031308 ? 12.92 * linear : 1.055 * linear ** (1 / 2.4) - 0.055;
    return Math.round(encoded * 255).toString(16).padStart(2, '0');
  }).join('');
}
