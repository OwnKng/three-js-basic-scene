import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

//_ general helpers
const setPosition = ({ x, y, z }, obj) => {
  obj.position.set(x, y, z)
  return obj
}

//_ geometries
const createBox = (props) => new THREE.BoxGeometry(...props)

const createSphere = (props) => new THREE.SphereGeometry(...props)

const geomMap = {
  box: createBox,
  sphere: createSphere,
}

const createGeometry = ({ geometry, props }) => {
  const action = geomMap[geometry]

  return action ? action(props) : props
}

//_ materials
const createBasicMaterial = (props) => new THREE.MeshBasicMaterial(props)

const createShaderMaterial = (props) => new THREE.ShaderMaterial(props)

const materialMap = {
  basic: createBasicMaterial,
  shader: createShaderMaterial,
}

const createMaterial = (material, props) => {
  const action = materialMap[material]

  return action ? action(props) : props
}

//_ mesh
const addMaterial = (material, geometry) => new THREE.Mesh(geometry, material)

//_ cameras
const createPerspectiveCamera = (props) =>
  new THREE.PerspectiveCamera(75, props.width / props.height, 0.01, 1000)

const cameraMap = {
  perspective: createPerspectiveCamera,
}

const createCamera = ({ camera, props }) => {
  const action = cameraMap[camera]

  return action ? action(props) : props
}

const updateCameraAspect = (camera, aspect) => camera.aspect(aspect)
const updateCameraProjectionMatrix = (camera) => camera.updateProjectionMatrix()

//_ controls
const createOrbitControls = (canvas, camera) => {
  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true
  return controls
}

const updateControls = (controls) => controls.update()

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
  updateCameraAspect,
  updateCameraProjectionMatrix,
  updateControls,
  addToScene,
  setPosition,
  setRenderSize,
  setRendererPixelRatio,
  render,
}
