import * as THREE from 'three';

function main() {
	const canvas = document.querySelector('#c');
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );

	const fov = 75;
	const aspect = 2;
	const near = 0.1;
	const far = 5;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far);
	camera.position.z = 2;

	const scene = new THREE.Scene();
	{
		const color = 0xFFFFFF;
		const intensity = 3;
		const light = new THREE.DirectionalLight(color, intensity);
		light.position.set(-1, 2, 4);
		scene.add(light)
	}

	// Create a geometry
	const geometry = new THREE.BoxGeometry();

	// Your material definitions
	const material = new THREE.MeshPhongMaterial();
	material.color.setHSL(0, 1, 0.5);  // Red
	material.flatShading = true;

	// material.color.set(0x00FFFF);
	// material.color.set(cssString); 
                                
                                 
	// material.color.set(someColor);  
	// material.color.setHSL(h, s, l);
	// material.color.setRGB(r, g, b);   


	const m1 = new THREE.MeshBasicMaterial({color: 0xFF0000});         // red
	const m2 = new THREE.MeshBasicMaterial({color: 'red'});            // red
	const m3 = new THREE.MeshBasicMaterial({color: '#F00'});           // red
	const m4 = new THREE.MeshBasicMaterial({color: 'rgb(255,0,0)'});   // red
	const m5 = new THREE.MeshBasicMaterial({color: 'hsl(0,100%,50%)'}); // red


	const cube = new THREE.Mesh(geometry, m1); // You can swap m1 with m2, m3, etc.
	scene.add(cube);


}
main();

// // Create a scene
// const scene = new THREE.Scene();

// // Create a camera
// const camera = new THREE.PerspectiveCamera(
//   75, window.innerWidth / window.innerHeight, 0.1, 1000
// );
// camera.position.z = 5;

// // Create a renderer
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// // Create a light (required for Phong material)
// const light = new THREE.DirectionalLight(0xffffff, 1);
// light.position.set(5, 5, 5).normalize();
// scene.add(light);

// // Create a geometry
// const geometry = new THREE.BoxGeometry();

// // Your material definitions
// const material = new THREE.MeshPhongMaterial();
// material.color.setHSL(0, 1, 0.5);  // Red
// material.flatShading = true;

// const m1 = new THREE.MeshBasicMaterial({ color: 0xFF0000 });         // Red
// const m2 = new THREE.MeshBasicMaterial({ color: 'red' });            // Red
// const m3 = new THREE.MeshBasicMaterial({ color: '#F00' });           // Red
// const m4 = new THREE.MeshBasicMaterial({ color: 'rgb(255,0,0)' });   // Red
// const m5 = new THREE.MeshBasicMaterial({ color: 'hsl(0,100%,50%)' }); // Red

// // Apply one of your materials to a mesh
// const cube = new THREE.Mesh(geometry, m1); // You can swap m1 with m2, m3, etc.
// scene.add(cube);

// // Render loop
// function animate() {
//   requestAnimationFrame(animate);
//   cube.rotation.x += 0.01;
//   cube.rotation.y += 0.01;
//   renderer.render(scene, camera);
// }

// animate();