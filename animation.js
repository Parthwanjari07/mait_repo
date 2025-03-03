// Set up Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    alpha: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 50;

// Create a sphere with only horizontal lines
const radius = 20;
const horizontalLines = 12; // Reduced number of horizontal lines

// Create a group to hold all the lines
const sphereGroup = new THREE.Group();

// Create horizontal lines (latitude lines)
for (let i = 0; i < horizontalLines; i++) {
    const phi = Math.PI * i / (horizontalLines - 1);
    const circleRadius = radius * Math.sin(phi);
    const y = radius * Math.cos(phi);
    
    // Calculate opacity (100% at bottom, 80% at top)
    // We reverse the calculation because phi goes from 0 (top) to PI (bottom)
    const opacity = 0.8 + (0.2 * (phi / Math.PI));
    
    // Create a line geometry for the circle
    const points = [];
    const segments = 64;
    for (let j = 0; j <= segments; j++) {
        const theta = (j / segments) * Math.PI * 2;
        const x = circleRadius * Math.cos(theta);
        const z = circleRadius * Math.sin(theta);
        points.push(new THREE.Vector3(x, y, z));
    }
    
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const lineMaterial = new THREE.LineBasicMaterial({ 
        color: 0x777777,  // Grey color
        transparent: true,
        opacity: opacity,
        linewidth: 2      // Thicker lines (note: linewidth may only work in some browsers)
    });
    const line = new THREE.Line(lineGeometry, lineMaterial);
    
    sphereGroup.add(line);
}

// Tilt the sphere's rotation axis to the right
sphereGroup.rotation.z = Math.PI * 0.15; // Angle of about 27 degrees

scene.add(sphereGroup);

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate around the angled axis
    sphereGroup.rotation.x += 0.001;
    sphereGroup.rotation.y += 0.001;
    
    renderer.render(scene, camera);
}

animate();