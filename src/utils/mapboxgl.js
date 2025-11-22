import mapboxgl from 'mapbox-gl';

// Use Webpack 5's built-in worker support
mapboxgl.workerClass = class extends Worker {
  constructor() {
    super(new URL('mapbox-gl/dist/mapbox-gl-csp-worker', import.meta.url), {
      type: 'module',
    });
  }
};
