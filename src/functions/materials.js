import * as THREE from "three"

//_ materials
const createBasicMaterial = (props) => new THREE.MeshBasicMaterial(props)

const createShaderMaterial = (props) => new THREE.ShaderMaterial(props)

const materialMap = {
  basic: createBasicMaterial,
  shader: createShaderMaterial,
}

const createMaterial = (material, props) => {
  const action = materialMap[material]

  return action ? action(props) : props
}

//_ mesh
const addMaterial = (material, geometry) => new THREE.Mesh(geometry, material)

export { createMaterial, addMaterial }
