import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

//_ controls
const createOrbitControls = (canvas, camera) => {
  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true
  return controls
}

const updateControls = (controls) => controls.update()

export { createOrbitControls, updateControls }
