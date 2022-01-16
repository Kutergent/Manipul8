//halo
import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { SphereBufferGeometry, Texture } from 'three'

// 
// Untuk Loader
const textureLoader = new THREE.TextureLoader()




let camera, renderer, controls, canvas, scene, gui, world

let sphere, cube

let sphereGui, cubeGui

let switcher

let isSphere = true

let pointLight, pointLight2, pointLight3, ambientLight


function initialize(){

    //scene & Canvas
    canvas = document.querySelector('canvas.webgl')
    scene = new THREE.Scene()

    // Untuk Camera
    camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    camera.position.set(0,0,2)
    scene.add(camera)

    // Untuk Mouse Control
    controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true

    // Untuk Render
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true
    })
    renderer.setClearColor(0x808080)
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    gui = new dat.GUI()
    world = {
        sp: {
            radius: 1,
            widthSegments: 75,
            heightSegments: 75,
            phiStart: 0,
            phiLength: 6.283
        },
        cb:{
            width: 1,
            height: 1,
            depth: 1,
            widthSegments: 15,
            heightSegments: 15,
            depthSegments: 15,
        }
    }

}



//// Untuk Sphere Modifications


// ---









function createLight(){
    //amblight
    // const ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
    ambientLight = new THREE.AmbientLight( 0x404040, 2 ); // soft white light
    scene.add( ambientLight );

    // const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 0.5 );
    // scene.add( light );

    //Light1
    pointLight = new THREE.PointLight(0x404040, 2)
    pointLight.position.set(2, 3, 4)
    pointLight.intensity = 0.5
    pointLight.castShadow = true
    scene.add(pointLight)

    //Light2
    pointLight2 = new THREE.PointLight(0x404040, 2)
    pointLight2.position.set(-1, 1, -1)
    pointLight2.intensity = 1
    pointLight2.castShadow = true
    scene.add(pointLight2)

    //Light3
    pointLight3 = new THREE.PointLight(0x404040, 2)
    pointLight3.position.set(1, 1, 1)
    pointLight3.intensity = 1
    pointLight3.castShadow = true
    scene.add(pointLight3)
}


function createGround() {
    let geo = new THREE.PlaneGeometry(20, 20)
    let texture = textureLoader.load('/texture/texture3.png', function (texture){
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping
        texture.offset.set( 0, 0 )
        texture.repeat.set( 10, 10 )
    })
    let mat = new THREE.MeshPhongMaterial({map: texture, side: THREE.DoubleSide})

    let plane = new THREE.Mesh(geo, mat)

    plane.rotation.x = Math.PI/2
    plane.position.y -= 5
    plane.receiveShadow = true


    scene.add(plane)
}

function createSphere (){
    // Contoh Object
    let geo = new THREE.SphereBufferGeometry(1, 75, 75)

    //getTExture
    let texture = textureLoader.load('/texture/texture6.jpg')
    let normalTexture = textureLoader.load('/texture/normalmap6.jpg')
    let roughTexture = textureLoader.load('/texture/rough6.jpg')
    let metalTexture = textureLoader.load('/texture/metal6.jpg')

    // Object Material
    let mat = new THREE.MeshStandardMaterial()
    mat.metalness = 1
    mat.roughness = 0.8
    mat.normalMap = normalTexture
    mat.map = texture
    mat.roughnessMap = roughTexture
    mat.metalnessMap = metalTexture

    // NormalMap
    // mat.color = new THREE.Color(0x4169e1)

    // Object Mesh
    sphere = new THREE.Mesh(geo,mat)
    sphere.castShadow = true
    scene.add(sphere)
}

function createCube (){
    // Contoh Object
    let geo = new THREE.BoxGeometry( 1, 1, 1 )


    //getTExture
    let texture = textureLoader.load('/texture/texture5.jpg')
    let normalTexture = textureLoader.load('/texture/normalmap5.jpg')
    let roughTexture = textureLoader.load('/texture/rough5.jpg')
    let metalTexture = textureLoader.load('/texture/metal5.jpg')

    // Object Material
    let mat = new THREE.MeshStandardMaterial()
    mat.metalness = 0.75
    mat.roughness = 0.25
    mat.normalMap = normalTexture
    mat.map = texture
    mat.roughnessMap = roughTexture
    mat.metalnessMap = metalTexture

    // NormalMap
    // mat.color = new THREE.Color(0x4169e1)

    // Object Mesh
    cube = new THREE.Mesh(geo,mat)
    cube.castShadow = true
    scene.add(cube)
}

let parameter = {
    c: function() { 
        if (isSphere) {
            gui.removeFolder(sphereGui)
            sphere.geometry.dispose()
            sphere.material.dispose()
            scene.remove(sphere)
            createCube()
            cubeGUI()
            switcher.name("Switch to Sphere")
            isSphere = false
        }else{
            gui.removeFolder(cubeGui)
            cube.geometry.dispose()
            cube.material.dispose()
            scene.remove(cube)
            createSphere()
            sphereGUI()
            switcher.name("Switch to Cube")
            isSphere = true
        }
    }
}

// 


function switcherGUI(){
        switcher = gui.add( parameter, 'c').name("Switch to Cube")
}



function lightGUI(){
    //For Seperation in UI
    const light1 = gui.addFolder('Light 1')
    //For Light2 Control in UI
    light1.add(pointLight2.position, 'x').min(-6).max(5).step(0.01)
    light1.add(pointLight2.position, 'y').min(-3).max(5).step(0.01)
    light1.add(pointLight2.position, 'z').min(-3).max(5).step(0.01)
    light1.add(pointLight2, 'intensity').min(0).max(12.5).step(0.01)
    //For Light2 Wireframe
    const pointLightHelper = new THREE.PointLightHelper(pointLight2, 0.2)
    scene.add(pointLightHelper)

    
    //For Seperation in UI
    const light2 = gui.addFolder('Light 2')
    //For Light3 Control in UI
    light2.add(pointLight3.position, 'x').min(-6).max(5).step(0.01)
    light2.add(pointLight3.position, 'y').min(-3).max(5).step(0.01)
    light2.add(pointLight3.position, 'z').min(-3).max(5).step(0.01)
    light2.add(pointLight3, 'intensity').min(0).max(12.5).step(0.01)
    //For Light3 Wireframe
    const pointLightHelper2 = new THREE.PointLightHelper(pointLight3, 0.2)
    scene.add(pointLightHelper2)
}


function sphereGUI(){
    sphereGui = gui.addFolder('Sphere Modifications')
    sphereGui.add(world.sp, 'radius', 0.1, 20).step(0.01).onChange(generateSp)
    sphereGui.add(world.sp, 'widthSegments', 0.1, 200).step(0.01).onChange(generateSp)
    sphereGui.add(world.sp, 'heightSegments', 0.1, 200).step(0.01).onChange(generateSp)
    sphereGui.add(world.sp, 'phiStart', 0.1, 7).step(0.01).onChange(generateSp)
    sphereGui.add(world.sp, 'phiLength', 0.1, 7).step(0.01).onChange(generateSp)
}

// ---
function generateSp() {
    sphere.geometry.dispose()
    sphere.geometry = new THREE.SphereBufferGeometry(
        world.sp.radius, 
        world.sp.widthSegments, 
        world.sp.heightSegments,
        world.sp.phiStart,
        world.sp.phiLength
    )
}

function cubeGUI(){
    cubeGui = gui.addFolder('Cube Modifications')
    cubeGui.add(world.cb, 'width', 0.1, 50).step(0.01).onChange(generateCb)
    cubeGui.add(world.cb, 'height', 0.1, 50).step(0.01).onChange(generateCb)
    cubeGui.add(world.cb, 'depth', 0.1, 50).step(0.01).onChange(generateCb)
    cubeGui.add(world.cb, 'heightSegments', 0.1, 50).step(0.01).onChange(generateCb)
    cubeGui.add(world.cb, 'widthSegments', 0.1, 50).step(0.01).onChange(generateCb)
    cubeGui.add(world.cb, 'depthSegments', 0.1, 50).step(0.01).onChange(generateCb)
}

// ---
function generateCb() {
    cube.geometry.dispose()
    cube.geometry = new THREE.BoxGeometry(
        world.cb.width,
        world.cb.height,
        world.cb.depth,
        world.cb.widthSegments,
        world.cb.heightSegments,
        world.cb.depthSegments
    )
}



let sizes = {
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


initialize()

createSphere()
createGround()
createLight()

switcherGUI()
lightGUI()
sphereGUI()



// Untuk Animate
const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()
    if (isSphere) {
        sphere.rotation.y = .2 * elapsedTime
    }else{
        cube.rotation.y = .2 * elapsedTime
    }

    // Update Orbital Controls
    // controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}
tick()



