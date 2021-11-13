import "./style.css"
import * as THREE from "three"

import { pipe, curry, median } from "ramda"

import {
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
  createMaterial,
  mutateUniform,
  createClock,
  getClockTime,
  createGeometry,
  addMaterial,
} from "./functions"
import { vertex } from "./shaders/vertex"
import { fragment } from "./shaders/fragment"
import { fragmentInner } from "./shaders/fragmentInner"

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

const wireframeMaterial = createMaterial("shader", {
  vertexShader: vertex,
  fragmentShader: fragment,
  uniforms: {
    uSize: { value: 1.0 * renderer.getPixelRatio() },
    uTime: { value: 0 },
  },
})

const material = createMaterial("shader", {
  vertexShader: vertex,
  fragmentShader: fragmentInner,
  uniforms: {
    uSize: { value: 1.0 * renderer.getPixelRatio() },
    uTime: { value: 0 },
  },
})

const addWireframeMaterial = curry(addMaterial)(wireframeMaterial)
const addShaderMaterial = curry(addMaterial)(material)

const createWireframe = (props) => {
  const wireframe = createGeometry({
    geometry: "icosahedronBuffer",
    props: props,
  })

  let length = wireframe.attributes.position.array.length

  let bary = []

  for (let i = 0; i < length; i++) {
    bary.push(0, 0, 1, 0, 1, 0, 1, 0, 0)
  }

  const aBary = new Float32Array(bary)
  wireframe.setAttribute("aBary", new THREE.BufferAttribute(aBary, 3))

  return wireframe
}

const outer = pipe(
  createWireframe,
  addWireframeMaterial,
  addObjToScene
)([5.005, 1])

const inner = pipe(
  createGeometry,
  addShaderMaterial,
  addObjToScene
)({ geometry: "icosahedronBuffer", props: [5, 1] })

//* create camera
const setPositionOffCenter = curry(setPosition)({ x: 0, y: 0, z: -13 })

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
const clock = createClock()

const frame = () => {
  updateControls(controls)
  render(scene, camera, renderer)

  const elapsedTime = getClockTime(clock)
  mutateUniform(material, "uTime", elapsedTime)

  inner.rotation.x += 0.005
  inner.rotation.y += 0.005

  outer.rotation.x += 0.005
  outer.rotation.y += 0.005

  window.requestAnimationFrame(frame)
}

frame()
