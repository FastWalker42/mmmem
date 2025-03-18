const scene = new THREE.Scene()
const loader = new THREE.TextureLoader()

// Фон (вращающийся)
const backgroundGeometry = new THREE.SphereGeometry(50, 32, 32)
const backgroundTexture = loader.load('/hrush.webp')
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

// Камера
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.set(0, 0, 3)

// Рендерер
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
document.body.appendChild(renderer.domElement)

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x080820, 1.2) // Дополнительный свет
scene.add(hemiLight)

// Загружаем текстуру пирамиды
const moneyTexture = loader.load('/money.png', (texture) => {
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(2, 2) // Два повторения текстуры
})

// Пирамида (ФИКСИМ отображение)
const pyramidGeometry = new THREE.ConeGeometry(2, 3, 4)
const pyramidMaterial = new THREE.MeshLambertMaterial({
  // Меняем на Lambert
  map: moneyTexture,
})
const pyramid = new THREE.Mesh(pyramidGeometry, pyramidMaterial)
scene.add(pyramid)

// Пол для теней
const groundGeometry = new THREE.PlaneGeometry(10, 10)
const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.3 })
const ground = new THREE.Mesh(groundGeometry, groundMaterial)
ground.rotation.x = -Math.PI / 3
ground.position.y = -2.8
ground.receiveShadow = true
scene.add(ground)

// Вращение пирамиды
pyramid.rotation.set(0.5, 0, 0.3)

// Основной цикл анимации
function animate() {
  requestAnimationFrame(animate)
  pyramid.rotation.y += 0.005
  animateBackground()
  renderer.render(scene, camera)
}
animate()

// Адаптация под изменение размеров экрана
window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
