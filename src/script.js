import "./style.css"
import { pipe, curry } from "ramda"

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
  updateControls,
} from "./functions"

//_ Select the canvas
const canvas = document.querySelector("canvas.webgl")

//_ Set dimensions
const size = {
  width: window.innerWidth,
  height: window.innerHeight,
}

//_ ------------- Functional (mostly....) --------------

//* create scene
const scene = createScene()
const addObjToScene = curry(addToScene)(scene)

//* create mesh
const material = createMaterial("basic", { color: "teal" })
const addBasicMaterial = curry(addMaterial)(material)

const mesh = pipe(
  createGeometry,
  addBasicMaterial,
  addObjToScene
)({ geometry: "box", props: [1, 1, 1] })

//* create camera
const setPositionOffCenter = curry(setPosition)({ x: 2, y: 2, z: 2 })

const camera = pipe(
  createCamera,
  setPositionOffCenter,
  addObjToScene
)({
  camera: "perspective",
  props: { width: size.width, height: size.height },
})

//* create controls
const controls = createOrbitControls(canvas, camera)

//* create renderer
const setRenderWindowDimensions = curry(setRenderSize)(size)
const setPixelRatioToDevice = curry(setRendererPixelRatio)(
  Math.min(window.devicePixelRatio, 2)
)

const renderer = pipe(
  createRenderer,
  setRenderWindowDimensions,
  setPixelRatioToDevice
)(canvas)

//_ Resize events
window.addEventListener("resize", () => {
  //* Update sizes
  size.width = window.innerWidth
  size.height = window.innerHeight

  //* Update camera
  updateCameraAspect(camera, size.width / size.height)
  updateCameraProjectionMatrix(camera)

  //* Update renderer
  setRenderWindowDimensions(renderer)
  setPixelRatioToDevice(renderer)
})

//_ Frame function
const frame = () => {
  updateControls(controls)
  render(scene, camera, renderer)

  window.requestAnimationFrame(frame)
}

frame()
