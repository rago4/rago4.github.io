# Light colors and candle behavior

The screen approximates emitted light; it does not draw a candle. Candle motion
therefore changes the illumination while keeping the controls steady.

## Research and interpretation

- [Flickering candle flames and their collective behavior (Scientific Reports, 2020)](https://www.nature.com/articles/s41598-020-78229-x)
  examines buoyancy, oxygen supply, and candle bundles. A single candle can be
  stable; the regular oscillations of larger bundles are not a universal
  single-candle rhythm. The app uses smooth random fluctuations at several
  timescales and occasional disturbances instead of a repeating sine wave.
- [Understanding LED Color-Tunable Products (US Department of Energy)](https://www.energy.gov/cmei/ssl/understanding-led-color-tunable-products)
  identifies approximately 1800 K with candlelight and 2700–3000 K with
  incandescent-like light. Candle uses 1800 K and Lamp uses 2700 K.
- [Purchasing Energy-Efficient Light Bulbs (US Department of Energy)](https://www.energy.gov/cmei/femp/purchasing-energy-efficient-light-bulbs)
  lists 3500 K as neutral white. Daylight uses this warmer interpretation to
  preserve the requested warm palette, rather than reproduce midday daylight.
- [Wyman, Sloan, Shirley: Simple Analytic Approximations to the CIE XYZ Color Matching Functions (2013)](https://jcgt.org/published/0002/02/01/paper.pdf)
  supplies the equation 4 observer fits. The app integrates a Planck spectrum
  over 380–780 nm at 5 nm intervals, converts XYZ to linear sRGB, normalizes its
  strongest channel, applies brightness in linear light, and then encodes sRGB. Negative
  out-of-gamut channels are clipped. Preset swatches share this calculation.

The warmth slider maps 0 to 3500 K, 65 to 2700 K, and 100 to 1800 K,
with linear interpolation between these anchors. This preserves Lamp's
existing slider position while giving it the 2700 K reference color.

## Animation choices

Slow drift (0.7–2.4 s), flutter (0.09–0.24 s), and a very small tremor
(0.035–0.08 s) use independent, smoothly interpolated random targets. Occasional
disturbances have a fast onset, slower recovery, and a small settling flare.
These timings and amplitudes are aesthetic choices informed by the research,
not experimentally measured parameters for a particular candle. The small
temperature shift accompanying brightness is also an artistic approximation:
the warmth spring targets a Kelvin offset of `(intensity target − 1) × 650`,
making dips slightly warmer. This is not a measured relationship between
flame temperature and brightness.

Intensity stays within 85–108% of the selected brightness, capped at the screen's
maximum. Animation timing uses elapsed time. Brightness follows the random
targets through [Motion for Vue's `useSpring`](https://motion.dev/docs/vue-use-spring)
with stiffness 500, damping 28, and mass 0.5. These values give a quick response
with almost critical damping, allowing momentum with very little bounce.
Warmth uses a slower spring (stiffness 90, damping 18, mass 1), so color settles
more gently than brightness. The tiny tremor bypasses the spring to preserve
fine flicker. Small rest thresholds prevent the spring from snapping changes
that are only a few hundredths in intensity. Springs reset with `jump()` when
motion stops, clearing their velocity and active animations. Candle motion remains
active after adjusting either slider, until another preset is selected. Hidden
tabs and reduced-motion preferences stop animation; resumed animation starts
gently. Browser theme color follows the steady base color.

Actual perceived color and light output depend on the display, its brightness,
calibration, and any operating-system color filters. The Kelvin values are
reference chromaticities, not measurements of the screen's physical output.
