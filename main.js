const scene = new THREE.Scene()
const loader = new THREE.TextureLoader()

// Создаем сферу для фона
const backgroundGeometry = new THREE.SphereGeometry(50, 32, 32)
const backgroundTexture = loader.load('./hrush.webp')
backgroundTexture.mapping = THREE.EquirectangularReflectionMapping
const backgroundMaterial = new THREE.MeshBasicMaterial({
  map: backgroundTexture,
  side: THREE.BackSide,
})
const backgroundMesh = new THREE.Mesh(
  backgroundGeometry,
  backgroundMaterial
)
scene.add(backgroundMesh)

let backgroundRotation = 0
function animateBackground() {
  backgroundRotation += 0.0006
  backgroundMesh.rotation.y = backgroundRotation
}

const camera = new THREE.PerspectiveCamera(
  100, // Угол обзора увеличен для эффекта рыбьего глаза
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.set(0, 0, 2.9)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
document.body.appendChild(renderer.domElement)

const light = new THREE.PointLight(0xffffff, 2, 15)
light.position.set(-1, 3, 5)
light.castShadow = true
scene.add(light)

const moneyTexture = loader.load('./money.png', (texture) => {
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(8, 8)
})
const pyramidGeometry = new THREE.ConeGeometry(2, 3, 4)
const pyramidMaterial = new THREE.MeshStandardMaterial({
  map: moneyTexture,
})
const pyramid = new THREE.Mesh(pyramidGeometry, pyramidMaterial)
pyramid.castShadow = true
scene.add(pyramid)

const groundGeometry = new THREE.PlaneGeometry(10, 10)
const groundMaterial = new THREE.ShadowMaterial({
  opacity: 1,
})
const ground = new THREE.Mesh(groundGeometry, groundMaterial)
ground.rotation.x = -Math.PI / 3
ground.position.y = -2.8
ground.receiveShadow = true
scene.add(ground)

let baseRotationX = 0.5
let baseRotationZ = 0.3
pyramid.rotation.set(baseRotationX, 0, baseRotationZ)

const moneyTextures = ['./money1.png', './money2.png', './money3.png']
const particles = []

function createMoney() {
  const texture = loader.load(
    moneyTextures[Math.floor(Math.random() * moneyTextures.length)]
  )
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
  })
  const geometry = new THREE.PlaneGeometry(0.6, 0.3)
  const money = new THREE.Mesh(geometry, material)

  money.position.set(
    Math.random() * 10 - 5,
    Math.random() * 5 + 3,
    Math.random() * 10 - 5
  )
  money.velocity = {
    x: (Math.random() - 0.5) * 0.05,
    y: -Math.random() * 0.02,
    z: (Math.random() - 0.5) * 0.05,
  }
  money.rotationSpeed = {
    x: Math.random() * 0.1,
    y: Math.random() * 0.1,
    z: Math.random() * 0.1,
  }

  scene.add(money)
  particles.push(money)
}
setInterval(createMoney, 0)

function animateParticles() {
  particles.forEach((money) => {
    money.position.x += money.velocity.x
    money.position.y += money.velocity.y
    money.position.z += money.velocity.z

    money.rotation.x += money.rotationSpeed.x
    money.rotation.y += money.rotationSpeed.y
    money.rotation.z += money.rotationSpeed.z

    if (money.position.y < -2) {
      money.position.set(
        Math.random() * 10 - 5,
        Math.random() * 5 + 3,
        Math.random() * 10 - 5
      )
    }
  })
}

function animate() {
  requestAnimationFrame(animate)
  pyramid.rotation.y += 0.005
  animateParticles()
  animateBackground()
  renderer.render(scene, camera)
}
animate()

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
