import "./style.css"
import * as THREE from "three"
import { compose } from "ramda"

import {
  createGeometry,
  createMaterial,
  addMaterial,
  createCamera,
  createScene,
  createRenderer,
  addToScene,
  setPosition,
  setRendererPixelRatio,
  createOrbitControls,
  setRenderSize,
  render,
} from "./helpers"

//_ Select the canvas
const canvas = document.querySelector("canvas.webgl")

//_ Set dimensions
const size = {
  width: window.innerWidth,
  height: window.innerHeight,
}

//_ Functional
const curry = (f) => (x) => (y) => f(x, y)

//* create scene
const curriedAddToScene = curry(addToScene)

const scene = createScene()
const augmentScene = curriedAddToScene(scene)

//* create mesh
const material = createMaterial("basic", { color: "teal" })
const curriedMaterial = curry(addMaterial)
const addBasicMaterial = curriedMaterial(material)

compose(
  augmentScene,
  addBasicMaterial,
  createGeometry
)({ geometry: "box", props: [1, 1, 1] })

//* create camera
const camera = createCamera({
  camera: "perspective",
  props: { width: size.width, height: size.height },
})
const curriedSetPosition = curry(setPosition)
const setPositionOffCenter = curriedSetPosition({ x: 2, y: 2, z: 2 })

compose(augmentScene, setPositionOffCenter)(camera)

const controls = createOrbitControls(canvas, camera)

//_ Create renderer
const curriedSetRendererSize = curry(setRenderSize)
const setRenderWindowDimensions = curriedSetRendererSize(size)

const curriedSetPixelRatio = curry(setRendererPixelRatio)
const setPixelRatioToDevice = curriedSetPixelRatio(
  Math.min(window.devicePixelRatio, 2)
)

const renderer = createRenderer(canvas)
compose(setPixelRatioToDevice, setRenderWindowDimensions)(renderer)

//_ Resize events
window.addEventListener("resize", () => {
  //* Update sizes
  size.width = window.innerWidth
  size.height = window.innerHeight

  //* Update camera
  camera.aspect = size.width / size.height
  camera.updateProjectionMatrix()

  //* Update renderer
  renderer.setSize(size.width, size.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

//_ Frame function
const clock = new THREE.Clock()

const frame = () => {
  const elpasedTime = clock.getElapsedTime()

  controls.update()

  render(scene, camera, renderer)

  window.requestAnimationFrame(frame)
}

frame()
