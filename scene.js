import * as THREE from 'three';

function main() {

	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );

	const fov = 40;
	const aspect = 2; // the canvas default
	const near = 0.1;
	const far = 1000;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.set( 0, 150, 0 );
	camera.up.set( 0, 0, 1 );
	camera.lookAt( 0, 0, 0 );

	const scene = new THREE.Scene();

	{

		const color = 0xFFFFFF;
		const intensity = 500;
		const light = new THREE.PointLight( color, intensity );
		scene.add( light );

	}

	// an array of objects who's rotation to update
	const objects = [];

	const radius = 1;
	const widthSegments = 7;
	const heightSegments = 7;
	const sphereGeometry = new THREE.SphereGeometry(
		radius, widthSegments, heightSegments );
	
	//for Solar system
	const solarsystem = new THREE.Object3D();
	scene.add(solarsystem);
	objects.push(solarsystem);



	const sunMaterial = new THREE.MeshPhongMaterial( { emissive: 0xFFFF00 } );
	const sunMesh = new THREE.Mesh( sphereGeometry, sunMaterial );
	sunMesh.scale.set( 5, 5, 5 );
	solarsystem.add(sunMesh);
	objects.push( sunMesh );



	const earthOrbit = new THREE.Object3D();
	earthOrbit.position.x = 10;
	solarsystem.add(earthOrbit);
	objects.push(earthOrbit);

	// for Earth 
	const earthMaterial = new THREE.MeshPhongMaterial({color: 0x2233FF, emissive: 0x112244});
	const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
	earthOrbit.add(earthMesh)
	objects.push( earthMesh );


	const moonOrbit = new THREE.Object3D();
	moonOrbit.position.x = 2;
	earthOrbit.add(moonOrbit)

	const moonMaterial = new THREE.MeshPhongMaterial({color: 0x888888, emissive: 0x222222})
	const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
	moonMesh.scale.set(.5, .5, .5);
	moonOrbit.add(moonMesh);
	objects.push(moonMesh)


	function makeAxisGrid(node, label, units) {
		const helper = new AxisGridHelper(node, units);
		gui.add(helper, 'visible').name(label);
	}

	makeAxisGrid(solarsystem, 'solarSystem', 25);
	makeAxisGrid(sunMesh, 'sunMesh');
	makeAxisGrid(earthOrbit, 'earthOrbit');
	makeAxisGrid(earthMesh, 'earthMesh');
	makeAxisGrid(moonOrbit, 'moonOrbit');
	makeAxisGrid(moonMesh, 'moonMesh');



	//	Turns both axes and grid visible on/off
	//	lil-gui requires a property that returns a bool
	//	To decide to make a checkbox so we make a setter
	//	and getter for visible which we can tell lil-gui
	//	to look at.

	function resizeRendererToDisplaySize( renderer ) {

		const canvas = renderer.domElement;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		const needResize = canvas.width !== width || canvas.height !== height;
		if ( needResize ) {

			renderer.setSize( width, height, false );

		}

		return needResize;

	}

	function render( time ) {

		time *= 0.001;

		if ( resizeRendererToDisplaySize( renderer ) ) {

			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();

		}

		objects.forEach( ( obj ) => {

			obj.rotation.y = time;

		} );

		renderer.render( scene, camera );

		requestAnimationFrame( render );

	}

	requestAnimationFrame( render );

}

main();
