import * as THREE from "three"

//_ geometries
const createBox = (props) => new THREE.BoxGeometry(...props)
const createSphere = (props) => new THREE.SphereGeometry(...props)
const createIcosahedron = (props) => new THREE.IcosahedronGeometry(...props)
const createIcosahedronBuffer = (props) =>
  new THREE.IcosahedronBufferGeometry(...props)

const createBuffer = (props) => new THREE.BufferGeometry(props)

const geomMap = {
  box: createBox,
  sphere: createSphere,
  buffer: createBuffer,
  icosahedron: createIcosahedron,
  icosahedronBuffer: createIcosahedronBuffer,
}

const createGeometry = ({ geometry, props = {} }) => {
  const action = geomMap[geometry]

  return action ? action(props) : props
}

const setAttribute = (props, geometry) => {
  geometry.setAttribute(...props)
  return geometry
}

export { createGeometry, setAttribute }
