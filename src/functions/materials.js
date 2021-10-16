import * as THREE from "three"

const createBasicMaterial = (props) => new THREE.MeshBasicMaterial(props)

const createShaderMaterial = (props) => new THREE.ShaderMaterial(props)

const createPointsMaterial = (props) => new THREE.PointsMaterial(props)

const materialMap = {
  basic: createBasicMaterial,
  shader: createShaderMaterial,
  points: createPointsMaterial,
}

const createMaterial = (material, props) => {
  const action = materialMap[material]

  return action ? action(props) : props
}

const addMaterial = (material, geometry) => new THREE.Mesh(geometry, material)

const mutateUniform = (material, uniform, value) =>
  (material.uniforms[uniform].value = value)

export { createMaterial, addMaterial, mutateUniform }
