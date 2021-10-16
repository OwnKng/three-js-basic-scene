import * as THREE from "three"

const createPoints = (material, geometry) =>
  new THREE.Points(geometry, material)

export { createPoints }
