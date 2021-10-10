import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

//_ geometries
const createBox = (props) => new THREE.BoxGeometry(...props)

const createSphere = (props) => new THREE.SphereGeometry(...props)

const createGeometry = ({ geometry, props }) => {
  let geom

  switch (geometry) {
    case "box":
      geom = createBox(props)
      break
    case "sphere":
      geom = createSphere(props)
      break
    default:
      geom = createBox(props)
  }

  return geom
}

//_ materials
const createBasicMaterial = (props) => new THREE.MeshBasicMaterial(props)

const createMaterial = (material, props) => {
  let mat

  switch (material) {
    case "basic":
      mat = createBasicMaterial(props)
      break
  }

  return mat
}

//_ mesh
const addMaterial = (material, geometry) => new THREE.Mesh(geometry, material)

//_ cameras
const createPerspectiveCamera = (props) =>
  new THREE.PerspectiveCamera(75, props.width / props.height, 0.01, 1000)

const setPosition = ({ x, y, z }, obj) => {
  obj.position.set(x, y, z)
  return obj
}

const createCamera = ({ camera, props }) => {
  let cmr

  switch (camera) {
    case "perspective":
      cmr = createPerspectiveCamera(props)
      break
  }

  return cmr
}

//_ controls
const createOrbitControls = (canvas, camera) => {
  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true
  return controls
}

//_ render
const createRenderer = (canvas) =>
  new THREE.WebGLRenderer({
    canvas: canvas,
  })

const setRenderSize = (dimensions, renderer) => {
  renderer.setSize(dimensions.width, dimensions.height)
  return renderer
}

const setRendererPixelRatio = (ratio, renderer) => {
  renderer.setPixelRatio(ratio)
  return renderer
}

const render = (scene, camera, renderer) => renderer.render(scene, camera)

//_ scene
const createScene = () => new THREE.Scene()

const addToScene = (scene, obj) => {
  scene.add(obj)
  return obj
}

export {
  createGeometry,
  createMaterial,
  addMaterial,
  createCamera,
  createScene,
  createRenderer,
  createOrbitControls,
  addToScene,
  setPosition,
  setRenderSize,
  setRendererPixelRatio,
  render,
}
