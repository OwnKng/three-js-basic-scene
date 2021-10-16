import * as THREE from "three"

const createClock = () => new THREE.Clock()

const getClockTime = (clock) => clock.getElapsedTime()

export { createClock, getClockTime }
