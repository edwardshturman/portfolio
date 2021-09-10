// @ts-ignore
import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
// @ts-ignore
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js';
// @ts-ignore
import { EffectComposer } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/postprocessing/EffectComposer.js';
// @ts-ignore
 import { BloomPass } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/postprocessing/BloomPass.js';
// @ts-ignore
import { RenderPass } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/postprocessing/RenderPass.js';
// @ts-ignore
import { Clock } from 'https://cdn.skypack.dev/three@0.132.2';


// Setup

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera ( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    powerPreference: 'high-performance',
    antialias: true,
    stencil: false,
    depth: true
});

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloomPass = new BloomPass(
    1,    // strength
    25,   // kernel size
    4,    // sigma ?
    256,  // blur render target resolution
);
bloomPass.renderToScreen = true;
composer.addPass(bloomPass);

function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}

let then = 0;
function render(now) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;

    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        composer.setSize(canvas.width, canvas.height);
    }

    composer.render(deltaTime);

    requestAnimationFrame(render);
}

requestAnimationFrame(render);


const clock = new Clock();

requestAnimationFrame(function render() {

    requestAnimationFrame(render);
    composer.render(clock.getDelta());

});

composer.setPixelRatio( window.devicePixelRatio );
composer.setSize( window.innerWidth, window.innerHeight );

camera.position.x = -3;
camera.position.z = 30;

composer.render( scene, camera );


// Add torus object

const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
const material = new THREE.MeshStandardMaterial( { color: 0xff6347 } );
const torus = new THREE.Mesh( geometry, material );

scene.add(torus);


// Lighting

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);


/*
// Lighting helpers

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);


// Orbit controls

const controls = new OrbitControls(camera, renderer.domElement);
*/


// Stars

function addStar() {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshStandardMaterial( { color: 0xffffff } );
    const star = new THREE.Mesh( geometry, material );

    // @ts-ignore
    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 100 ) );
    star.position.set(x, y, z);

    scene.add(star);
}

// @ts-ignore
Array(200).fill().forEach(addStar);


// Space background

const spaceTexture = new THREE.TextureLoader().load('../assets/img/space.jpeg');
scene.background = spaceTexture;


// Profile

const profileTexture = new THREE.TextureLoader().load('../assets/img/profile.JPG');


const profile = new THREE.Mesh(
    new THREE.BoxGeometry(3, 3, 3),
    new THREE.MeshStandardMaterial( { map: profileTexture } )
);

scene.add(profile);

profile.position.x = 2;
profile.position.z = -5;


// Moon

const moonTexture = new THREE.TextureLoader().load('../assets/img/purple-moon.png');
// const normalTexture = new THREE.TextureLoader().load('../assets/img/normal.jpeg');

const moon = new THREE.Mesh(
    new THREE.SphereGeometry(3, 32, 32),
    new THREE.MeshStandardMaterial( {
        map: moonTexture,
        // normalMap: normalTexture
    } )
);

scene.add(moon);

moon.position.x = -10;
moon.position.z = 30;


// Scroll animation

function moveCamera() {
    const t = document.body.getBoundingClientRect().top;
    moon.rotation.x += 0.01;
    moon.rotation.y += 0.025;
    moon.rotation.z += 0.01;

    profile.rotation.y += 0.01;
    profile.rotation.z += 0.01;

    camera.position.x = t * -0.0002;
    camera.position.y = t * -0.0002;
    camera.position.z = t * -0.01;
}

document.body.onscroll = moveCamera;
moveCamera(); // Initialize camera movement to prevent first load glitch


// Window resize listener

window.addEventListener( 'resize', onWindowResize );

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    composer.setSize( window.innerWidth, window.innerHeight );

}


// Animation loop

function animate() {
    requestAnimationFrame( animate );

    torus.rotation.x += 0.01;
    torus.rotation.y += 0.005;
    torus.rotation.z += 0.01;

    moon.rotation.x += 0.005;

    // controls.update();

    composer.render( scene, camera );
}

animate();
