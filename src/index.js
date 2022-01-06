import './style/main.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
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
})

// Scroll effects

const projectContainers = document.querySelectorAll('.project-container');

projectContainers.forEach((projectContainer, idx) => {
  const projectNum = idx + 1;
  projectContainer.classList.remove('speech-bubble-animation');
  projectContainer.classList.add('project-' + projectNum);
  projectContainer.childNodes[0].childNodes.forEach(child => {
    if(child.tagName=='P'){
        child.classList.remove('fade-in-animation');
    }
  });
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
          projectContainer.classList.add('speech-bubble-animation');
          projectContainer.childNodes[0].childNodes.forEach((child, idx) => {
            if(child.tagName=='P')
              if(idx > 1)
                child.classList.add('fade-in-animation-delay');
              else
                child.classList.add('fade-in-animation');
          });
          projectContainer.classList.remove('out-of-view');
          return;
      }
      projectContainer.classList.remove('speech-bubble-animation');
      projectContainer.childNodes[0].childNodes.forEach((child, idx) => {
        if(child.tagName=='P'){
            child.classList.remove('fade-in-animation');
            child.classList.remove('fade-in-animation-delay');
        }
      });
      projectContainer.classList.add('out-of-view');
    })
  });
  observer.observe(document.querySelector('.grid-row-' + projectNum));
});

// Copy email to clipboard
function copyMailFunction() {
  if (navigator.clipboard && window.isSecureContext) {
      // navigator clipboard api method'
      navigator.clipboard.writeText("michael.ma@nyu.edu").then(function() {
        var tooltip = document.getElementById("myTooltip");
        tooltip.innerHTML = "Copied to clipboard!";
      }, function() {
        tooltip.innerHTML = "Unable to copy to clipboard :(";
        console.log("Error copying to clipboard");
      });
  } else {
      // text area method
      let textArea = document.createElement("textarea");
      textArea.value = "michael.ma@nyu.edu";
      // make the textarea out of viewport
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      return new Promise((res, rej) => {
          // here the magic happens
          document.execCommand('copy') ? res() : rej();
          textArea.remove();
          var tooltip = document.getElementById("myTooltip");
          tooltip.innerHTML = "Copied to clipboard!";
      });
  }
}

function copyOutFunc() {
  var tooltip = document.getElementById("myTooltip");
  tooltip.innerHTML = "Copy to clipboard?";
}

window.copyMailFunction = copyMailFunction;
window.copyOutFunc = copyOutFunc;

tick()
