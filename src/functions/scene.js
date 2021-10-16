import * as THREE from "three"

//_ scene
const createScene = () => new THREE.Scene()

const addToScene = (scene, obj) => {
  scene.add(obj)
  return obj
}

//_ general helpers
const setPosition = ({ x, y, z }, obj) => {
  obj.position.set(x, y, z)
  return obj
}

export { setPosition, createScene, addToScene }