import { pipe, curry } from "ramda"
import { setAttribute } from "."
import { createGeometry } from "."
import { createMaterial } from "."
import * as THREE from "three"

const addMaterialsToPoints = (material, geometry) =>
  new THREE.Points(geometry, material)

const generateGrid = (width, length) => {
  const numPoints = width * length
  const positions = new Float32Array(numPoints * 3)

  let k = 0

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < length; j++) {
      const u = i / width
      const v = j / length
      const x = u - 0.5
      const y = 0
      const z = v - 0.5

      positions[3 * k] = x
      positions[3 * k + 1] = y
      positions[3 * k + 2] = z

      k++
    }
  }

  return positions
}

const generateColors = (width, length) => {
  const numPoints = width * length

  const color = new THREE.Color(1, 1, 1)
  const colors = new Float32Array(numPoints * 3)

  for (let i = 0; i < numPoints; i++) {
    colors[3 * i] = color.r
    colors[3 * i + 1] = color.g
    colors[3 * i + 2] = color.b
  }

  return colors
}

const generateScales = (width, length) => {
  const numPoints = width * length

  const scales = new Float32Array(numPoints)

  for (let i = 0; i < numPoints; i++) {
    scales[i] = Math.random()
  }

  return scales
}

const generatePoints = (width, length) => {
  const colors = generateColors(width, length)
  const positions = generateGrid(width, length)
  const scales = generateScales(width, length)

  const setPosition = curry(setAttribute)([
    "position",
    new THREE.BufferAttribute(positions, 3),
  ])

  const setColors = curry(setAttribute)([
    "color",
    new THREE.BufferAttribute(colors, 3),
  ])

  const setScales = curry(setAttribute)([
    "aScale",
    new THREE.BufferAttribute(scales, 1),
  ])

  return pipe(createGeometry, setPosition, setScales)({ geometry: "buffer" })
}

export { addMaterialsToPoints, generatePoints }
