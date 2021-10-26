import * as THREE from "three"

//_ geometries
const createBox = (props) => new THREE.BoxGeometry(...props)
const createSphere = (props) => new THREE.SphereGeometry(...props)
const createBuffer = (props) => new THREE.BufferGeometry(props)
const createPlane = (props) => new THREE.PlaneGeometry(...props)
const createIcosahedron = (props) => new THREE.IcosahedronGeometry(...props)
const createCone = (props) => new THREE.ConeGeometry(...props)

const geomMap = {
  box: createBox,
  sphere: createSphere,
  buffer: createBuffer,
  plane: createPlane,
  icosahedron: createIcosahedron,
  cone: createCone,
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
