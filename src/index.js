import './style/main.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
/**
 * GUI Controls - Debugging
 */
// import * as dat from 'dat.gui'
// const gui = new dat.GUI()

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
const geometry = new THREE.IcosahedronGeometry(20, 1)
const material = new THREE.MeshNormalMaterial()
// Material Props.
material.wireframe = true
// Create Mesh & Add To Scene
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.001,
  5000
)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 40
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enabled = true
controls.autoRotate = true
// controls.enableZoom = false
controls.enablePan = false
controls.dampingFactor = 0.05
controls.maxDistance = 1000
controls.minDistance = 30
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(0x90AACB);

/**
 * Animation GSAP
 */

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.defaults({
  scrub: 3,
  ease: 'none',
})
const sections = document.querySelectorAll('.scroll-section')
gsap.from(mesh.position, {
  y: 1,
  duration: 1,
  ease: 'expo',
})
gsap.to(mesh.rotation, {
  x: Math.PI * 2,
  scrollTrigger: {
    trigger: sections[1],
  },
})
gsap.to(mesh.scale, {
  x: 2,
  y: 2,
  scrollTrigger: {
    trigger: sections[2],
  },
})
gsap.to(mesh.rotation, {
  y: Math.PI * 2,
  scrollTrigger: {
    trigger: sections[3],
  },
})

// Stuff for project presenters
//
// const sceneObjects={
// };
//
// // Pigeon
// const pigeonScene = new THREE.Scene();
// // add grid helper if you want to show grid in the scene
// //pigeonScene.add(new THREE.GridHelper(8,12,0x888888, 0x444444));
// pigeonScene.background = new THREE.Color(0x9999999); // set background color
//
// // CAMERA
// /*/ type of camera with field of view, aspect ratio, nearand far view*/
// const pigeonCamera = new THREE.PerspectiveCamera(
//   30,
//   sizes.width / sizes.height,
//   1,
//   5000
// )
// pigeonCamera.rotation.y = 45/180*Math.PI;
// pigeonCamera.position.set(20*Math.sin(0.2 * Math.PI), 10, 20*Math.cos(0.2 * Math.PI)); // camera placement (x,y,z)
// pigeonCamera.lookAt(0,5,0); // camera is looking at (0,0,0)
// pigeonScene.add(pigeonCamera)
//
// // RENDERER
// const pigeonRenderer = new THREE.WebGLRenderer({antialias:true}); /*/ antialias->true smooths the jagged edges*/
// pigeonRenderer.setPixelRatio(window.devicePixelRatio)
// pigeonRenderer.setSize(sizes.width/4 - sizes.width*.05, sizes.height/2)
//
// //light - makes the model look real
// let pigeonLight = new THREE.AmbientLight(0x404040,100);
// pigeonScene.add(pigeonLight);
//
// // dynamically generate container
// const pigeonContainer = document.createElement('div');
// document.getElementById('presenter-pigeon-container').appendChild(pigeonContainer);
// pigeonContainer.appendChild(pigeonRenderer.domElement);
// pigeonContainer.childNodes[0].className += "position-relative"; // remove fixed
//
// // load model
// let pigeonLoader = new GLTFLoader();
// pigeonLoader.load('/totoro.glb', function(gltf){
//   let pigeon= gltf.scene.children[0];
//   sceneObjects['pigeon'] = pigeon;
//   pigeon.geometry.center;
//   gltf.scene.scale.set(.5,.5,.5);
//   pigeonScene.add(gltf.scene);// add it to your scene
//   console.log( 'Successfully loaded pigeon model!' );
//   tick()
// }, function ( error ) {
// 		console.log( 'Error loading pigeon model' );
// });

/**
 * Animate
 */
const clock = new THREE.Clock()
const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  //mesh.rotation.x += 0.01 * Math.sin(1)
  //mesh.rotation.y += 0.01 * Math.sin(1)
  //mesh.rotation.z += 0.01 * Math.sin(1)

  // Update controls
  controls.update()
  // Render
  renderer.render(scene, camera)

  // Pigeon
  //sceneObjects['pigeon'].rotation.y+=0.1;
  //pigeonRenderer.render(pigeonScene, pigeonCamera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}
/*------------------------------
MouseMove
------------------------------*/
function onMouseMove(e) {
  const x = e.clientX
  const y = e.clientY

  gsap.to(scene.rotation, {
    y: gsap.utils.mapRange(0, window.innerWidth, 1, -1, x),
    x: gsap.utils.mapRange(0, window.innerHeight, 1, -1, y),
  })
}
window.addEventListener('mousemove', onMouseMove)

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // Pigeon update
  // pigeonCamera.aspect = sizes.width/sizes.height;
  // pigeonCamera.updateProjectionMatrix();
  // pigeonRenderer.setSize(sizes.width/2, sizes.height/2);
  // pigeonRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

tick()
