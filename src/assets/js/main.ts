// @ts-ignore
import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
// @ts-ignore
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js';


// Setup

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera ( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );

camera.position.x = -3;
camera.position.z = 30;

renderer.render( scene, camera );


// Add torus object

const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
const material = new THREE.MeshStandardMaterial( { color: 0x91aaff } );
const torus = new THREE.Mesh( geometry, material );

scene.add(torus);


// Add icosahedron object

const icosahedronGeometry = new THREE.IcosahedronGeometry ( 1, 0 );
const icosahedronMaterial = new THREE.MeshStandardMaterial( { color: 0x58f6ff} );
const icosahedron = new THREE.Mesh ( icosahedronGeometry, icosahedronMaterial );

scene.add(icosahedron);

icosahedron.position.x = -4;
icosahedron.position.z = 6;


// Add octahedron object

const octahedronGeometry = new THREE.OctahedronGeometry ( 1, 0 );
const octahedronMaterial = new THREE.MeshStandardMaterial( { color: 0xf268ef} );
const octahedron = new THREE.Mesh ( octahedronGeometry, octahedronMaterial );

scene.add(octahedron);

octahedron.position.x = 8;
octahedron.position.z = 12;


// Add tetrahedron object

const tetrahedronGeometry = new THREE.TetrahedronGeometry ( 1, 0 );
const tetrahedronMaterial = new THREE.MeshStandardMaterial( { color: 0x74f762} );
const tetrahedron = new THREE.Mesh ( tetrahedronGeometry, tetrahedronMaterial );

scene.add(tetrahedron);

tetrahedron.position.x = -12;
tetrahedron.position.z = 18;


/*
// Add text object

const loader = new THREE.FontLoader();

loader.load( '../assets/fonts/Urbanist_Medium_Regular.json', function ( font ) {

    const textGeometry = new THREE.TextGeometry( 'ARS LONGA, VITA BREVIS', {
        font: font,
        size: 1,
        height: 1,
        curveSegments: 12,
        bevelEnabled: false,
        bevelThickness: 10,
        bevelSize: 8,
        bevelOffset: 0,
        bevelSegments: 5
    } );
    const textMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0xffffff } );
    const textObject = new THREE.Mesh(textGeometry, textMaterial);
    scene.add(textObject);
    textObject.position.x = 3;
    textObject.position.z = 40;

    const rotation = setInterval(function(){
        textObject.rotation.y += 0.01;
    }, 10);

} );
*/

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

    renderer.setSize( window.innerWidth, window.innerHeight );

}


// Animation loop

function animate() {
    requestAnimationFrame( animate );

    torus.rotation.x += 0.01;
    torus.rotation.y += 0.005;
    torus.rotation.z += 0.01;

    icosahedron.rotation.x += 0.01;
    icosahedron.rotation.y += 0.005;
    icosahedron.rotation.z += 0.01;

    octahedron.rotation.x += 0.01;
    octahedron.rotation.y += 0.005;
    octahedron.rotation.z += 0.01;

    tetrahedron.rotation.x += 0.01;
    tetrahedron.rotation.y += 0.005;
    tetrahedron.rotation.z += 0.01;

    moon.rotation.x += 0.005;

    // controls.update();

    renderer.render( scene, camera );
}

animate();
