import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera ( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );

camera.position.setZ(30);

renderer.render( scene, camera );

const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
const material = new THREE.MeshStandardMaterial( { color: 0xFF6347 } );
const torus = new THREE.Mesh( geometry, material );

scene.add(torus);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshStandardMaterial( { color: 0xffffff } );
    const star = new THREE.Mesh( geometry, material );

    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 100 ) );
    star.position.set(x, y, z);

    scene.add(star);
}

Array(200).fill().forEach(addStar);


const spaceTexture = new THREE.TextureLoader().load('../assets/space.jpeg');
scene.background = spaceTexture;


const profileTexture = new THREE.TextureLoader().load('../assets/profile.JPG');


const profile = new THREE.Mesh(
    new THREE.BoxGeometry(3, 3, 3),
    new THREE.MeshStandardMaterial( { map: profileTexture } )
);


const moonTexture = new THREE.TextureLoader().load('../assets/purple-moon.png');
const normalTexture = new THREE.TextureLoader().load('../assets/normal.jpeg');

const moon = new THREE.Mesh(
    new THREE.SphereGeometry(3, 32, 32),
    new THREE.MeshStandardMaterial( {
        map: moonTexture,
        normalMap: normalTexture
    } )
);

scene.add(profile, moon);

moon.position.x = -10;
moon.position.z = 30;


function animate() {
    requestAnimationFrame( animate );

    torus.rotation.x += 0.01;
    torus.rotation.y += 0.005;
    torus.rotation.z += 0.01;

    controls.update();

    renderer.render( scene, camera );
}

animate();
