import "./style.css"
import * as THREE from "three"

import { pipe, curry, map } from "ramda"

import {
  generatePoints,
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
  setScale,
  addMaterialsToPoints,
  createMaterial,
} from "./functions"
import { vertex } from "./shaders/vertex"
import { fragment } from "./shaders/fragment"

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

//* create points
const material = createMaterial("shader", {
  vertexShader: vertex,
  fragmentShader: fragment,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  vertexColors: true,
  uniforms: {
    uSize: { value: 3.0 * renderer.getPixelRatio() },
    uTime: { value: 0 },
  },
})

const addShaderMaterial = curry(addMaterialsToPoints)(material)
const scalePoints = curry(setScale)({ x: 5, y: 10, z: 10 })

const points = pipe(
  generatePoints,
  addShaderMaterial,
  scalePoints,
  addObjToScene
)(120, 120)

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
