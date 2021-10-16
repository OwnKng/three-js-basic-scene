import * as THREE from "three"

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

export { createCamera, updateCameraAspect, updateCameraProjectionMatrix }
