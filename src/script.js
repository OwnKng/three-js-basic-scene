import "./style.css"
import * as THREE from "three"
import * as dat from "dat.gui"

import { pipe, curry } from "ramda"

import {
  createGeometry,
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
  setRotation,
  createMaterial,
  mutateUniform,
  createClock,
  getClockTime,
  addMaterial,
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
scene.background = new THREE.Color("#08121C")

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
  transparent: true,
  uniforms: {
    uSize: { value: 1.0 * renderer.getPixelRatio() },
    uTime: { value: 0 },
    uDistortionFrequency: { value: 2.0 },
    uDistortionStrength: { value: 4.0 },
    uDisplacementFrequency: { value: 1.0 },
    uDisplacementStrength: { value: 0.2 },
  },
})

const addShaderMaterial = curry(addMaterial)(material)
const rotatePlane = curry(setRotation)({ x: 0.5 * Math.PI, y: 0, z: 0 })

const plane = pipe(
  createGeometry,
  addShaderMaterial,
  rotatePlane,
  addObjToScene
)({
  geometry: "plane",
  props: [20, 10, 1024, 1024],
})

//* create camera
const setPositionOffCenter = curry(setPosition)({ x: 0, y: 0, z: 10 })

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

//_ dat gui
const gui = new dat.GUI()

gui
  .add(material.uniforms.uDistortionFrequency, "value")
  .name("uDistortionFrequency")
  .min(1)
  .max(10)
  .step(0.5)

gui
  .add(material.uniforms.uDistortionStrength, "value")
  .min(1)
  .max(10)
  .step(0.5)
  .name("uDistortionStrength")

gui
  .add(material.uniforms.uDisplacementFrequency, "value")
  .min(0)
  .max(10)
  .step(0.5)
  .name("uDisplacementFrequency")

gui
  .add(material.uniforms.uDisplacementStrength, "value")
  .min(0)
  .max(1)
  .step(0.1)
  .name("uDisplacementStrength")

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
const clock = createClock()

const frame = () => {
  updateControls(controls)
  render(scene, camera, renderer)

  const elapsedTime = getClockTime(clock)
  mutateUniform(material, "uTime", elapsedTime)

  window.requestAnimationFrame(frame)
}

frame()
