import * as THREE from "three"

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

export { createRenderer, setRenderSize, setRendererPixelRatio, render }
