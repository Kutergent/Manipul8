import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { SphereBufferGeometry, Texture } from 'three'

// Untuk Loader
const textureLoader = new THREE.TextureLoader()
let texture = textureLoader.load('/texture/texture2.jpg')
const normalTexture = textureLoader.load('/texture/normalmap2.png')

//// Untuk Sphere Modifications
const gui = new dat.GUI()
const world = {
    sp2: {
        radius: 1,
        widthSegments: 75,
        heightSegments: 75,
        phiStart: 0,
        phiLength: 6.283
    },
    sp2: {
        radius: 3,
        widthSegments: 75,
        heightSegments: 75,
        phiStart: 0,
        phiLength: 6.283
    }
}

// ---
const sphere1 = gui.addFolder('Sphere Modifications')
sphere1.add(world.sp2, 'radius', 0.1, 20).step(0.01).onChange(generateSp)
sphere1.add(world.sp2, 'widthSegments', 0.1, 200).step(0.01).onChange(generateSp)
sphere1.add(world.sp2, 'heightSegments', 0.1, 200).step(0.01).onChange(generateSp)
sphere1.add(world.sp2, 'phiStart', 0.1, 7).step(0.01).onChange(generateSp)
sphere1.add(world.sp2, 'phiLength', 0.1, 7).step(0.01).onChange(generateSp)
// ---
function generateSp() {
    sphere.geometry.dispose()
    sphere.geometry = new THREE.SphereBufferGeometry(
        world.sp2.radius, 
        world.sp2.widthSegments, 
        world.sp2.heightSegments,
        world.sp2.phiStart,
        world.sp2.phiLength
    )
}

// Belum Yakin - Start
const param = {
    material: "Standard"
}

const spMat = gui.add(param, 'material', ["Standard", "Basic", "Phong", "Wireframe"]).name('Material Type').listen()
spMat.onChange(function (value) {
    updateSp()
})

// Test Change Material
function updateSp() {
    const newMat = new THREE.MeshStandardMaterial()
    const value = param.material
    if(value == "Standard")
        newMat = new THREE.MeshStandardMaterial()
    else if (value == "Basic")
        newMat = new THREE.MeshBasicMaterial({
            color: 0x000000
        })
    else if (value == "Phong")
        newMat = new THREE.MeshPhongMaterial({
            color: 0x000000
        })
    else newMat = new THREE.MeshBasicMaterial({
        wireframe: true
    })
spMat = newMat
}
// Belum Yakin - End



const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

// Contoh Object
const geometry = new THREE.SphereBufferGeometry(1, 75, 75)

// Object Material
const material = new THREE.MeshStandardMaterial()
material.metalness = 0.75
material.roughness = 0.25
// material.normalMap = normalTexture;
material.map = texture

// NormalMap
material.color = new THREE.Color(0x4169e1)

// Object Mesh
const sphere = new THREE.Mesh(geometry,material)
scene.add(sphere)

//amblight
const ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( ambientLight );



//Light1
const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.set(2, 3, 4)
pointLight.intensity = 1
scene.add(pointLight)

//Light2
const pointLight2 = new THREE.PointLight(0xff0000, 2)
pointLight2.position.set(1, 1, 1)
pointLight2.intensity = 1
scene.add(pointLight2)
//For Seperation in UI
const light1 = gui.addFolder('Light 1')
//For Light2 Control in UI
light1.add(pointLight2.position, 'x').min(-6).max(5).step(0.01)
light1.add(pointLight2.position, 'y').min(-3).max(5).step(0.01)
light1.add(pointLight2.position, 'z').min(-3).max(5).step(0.01)
light1.add(pointLight2, 'intensity').min(0).max(12.5).step(0.01)
//For Light2 Wireframe
const pointLightHelper = new THREE.PointLightHelper(pointLight2, 1)
scene.add(pointLightHelper)

//Light3
const pointLight3 = new THREE.PointLight(0xff0000, 2)
pointLight3.position.set(1, 1, 1)
pointLight3.intensity = 1
scene.add(pointLight3)
//For Seperation in UI
const light2 = gui.addFolder('Light 2')
//For Light3 Control in UI
light2.add(pointLight3.position, 'x').min(-6).max(5).step(0.01)
light2.add(pointLight3.position, 'y').min(-3).max(5).step(0.01)
light2.add(pointLight3.position, 'z').min(-3).max(5).step(0.01)
light2.add(pointLight3, 'intensity').min(0).max(12.5).step(0.01)
//For Light3 Wireframe
const pointLightHelper2 = new THREE.PointLightHelper(pointLight3, 1)
scene.add(pointLightHelper2)

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Adjust Window
window.addEventListener('resize', () =>
{

    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    
})

// Untuk Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Untuk Mouse Control
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Untuk Render
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Untuk Animate
const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()
    sphere.rotation.y = .2 * elapsedTime

    // Update Orbital Controls
    // controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}
tick()