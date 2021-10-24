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
  createRaycaster,
  setRaycasterFromCamera,
  getRaycasterIntersection,
  generatePoints,
  addMaterialsToPoints,
  setScale,
} from "./functions"
import { vertex } from "./shaders/vertex"
import { fragment } from "./shaders/fragment"
import { Vector2 } from "three"

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
  blending: THREE.AdditiveBlending,
  transparent: true,
  uniforms: {
    uSize: { value: 10.0 * renderer.getPixelRatio() },
    uTime: { value: 0 },
    uDistortionFrequency: { value: 3.0 },
    uDistortionStrength: { value: 2.0 },
    uDisplacementFrequency: { value: 6.0 },
    uDisplacementStrength: { value: 0.2 },
    uMouse: { value: new Vector2(0.5, 0.5) },
    uResolution: { value: new Vector2(10.0, 10.0) },
  },
})

const addShaderMaterial = curry(addMaterialsToPoints)(material)
const scalePoints = curry(setScale)({ x: 10, y: 10, z: 10 })

const points = pipe(
  generatePoints,
  addShaderMaterial,
  scalePoints,
  addObjToScene
)(256, 256)

//* create camera
const setPositionOffCenter = curry(setPosition)({ x: 0, y: 10, z: 5 })

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

//_ raycaster
const raycaster = createRaycaster()

const mouse = new THREE.Vector2()

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
}

window.addEventListener("mousemove", onMouseMove, false)

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

  setRaycasterFromCamera(mouse, camera, raycaster)

  const intersects = getRaycasterIntersection(scene.children, raycaster)
  const uv = intersects.length ? intersects[0].uv : new Vector2(0.5, 0.5)
  mutateUniform(material, "uMouse", uv)

  const elapsedTime = getClockTime(clock)
  mutateUniform(material, "uTime", elapsedTime)

  window.requestAnimationFrame(frame)
}

frame()
