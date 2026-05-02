import './style.css'
import zombieImageUrl from './assets/zombie.png'
import coneheadZombieImageUrl from './assets/heavy-zombie.png'
import bucketheadZombieImageUrl from './assets/buckethead.png'
import tacoTruckImageUrl from './assets/taco-truck.png'
import towerTowerImageUrl from './assets/tower-tower.png'
import towerTowerProjectileImageUrl from './assets/tower-tower-projectile.png'
import towerTowerExplosionImageUrl from './assets/tower-tower-explosion.png'
import tacoImageUrl from './assets/taco.png'
import explosionImageUrl from './assets/explosion-new.png'
import gameBackgroundImageUrl from './assets/game-background-latest.png'

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
  throw new Error('App container not found.')
}

app.innerHTML = `
  <main class="layout">
    <section class="game-shell">
      <div class="hud" aria-label="Game status">
        <div class="hud-stat">
          <span class="hud-label">Lives</span>
          <strong id="lives-value">10</strong>
        </div>
        <div class="hud-stat">
          <span class="hud-label">Gold</span>
          <strong id="gold-value">25</strong>
        </div>
        <div class="hud-stat">
          <span class="hud-label">Wave</span>
          <strong id="wave-value">1</strong>
        </div>
      </div>
      <canvas id="game" width="480" height="389" aria-label="Tower defense game area"></canvas>
      <div class="shop-bar">
        <div id="shop-controls" class="shop-controls">
          <button id="buy-tower-button" class="shop-button buy-tower-button" type="button" aria-label="Buy Taco Truck (5 Gold)">
            <img class="buy-tower-icon" src="${tacoTruckImageUrl}" alt="" aria-hidden="true" />
          </button>
          <button id="buy-spire-button" class="shop-button buy-spire-button" type="button" aria-label="Buy Tower Tower (12 Gold)">
            <img class="buy-spire-icon" src="${towerTowerImageUrl}" alt="" aria-hidden="true" />
          </button>
        </div>
        <div id="upgrade-controls" class="shop-controls hidden">
          <button id="upgrade-damage-button" class="shop-button" type="button">
            Damage +1 (1 Gold)
          </button>
          <button id="upgrade-range-button" class="shop-button" type="button">
            Range +15 (1 Gold)
          </button>
          <button id="upgrade-speed-button" class="shop-button" type="button">
            Speed +1 (1 Gold)
          </button>
          <button id="sell-tower-button" class="shop-button sell-button" type="button">
            Sell Truck
          </button>
        </div>
        <div class="shop-info">
          <p id="shop-message" class="shop-message" aria-live="polite"></p>
          <p id="tower-stats" class="tower-stats" aria-live="polite"></p>
        </div>
      </div>
      <div class="utility-controls">
        <button id="console-toggle-button" class="cheat-button utility-button" type="button">
          Console
        </button>
        <div id="dev-console" class="dev-console hidden" aria-label="Developer console">
          <div class="dev-console-row">
            <input
              id="dev-console-input"
              class="dev-console-input"
              type="text"
              spellcheck="false"
              autocomplete="off"
              placeholder="lives = 50"
            />
            <button id="dev-console-run-button" class="shop-button dev-console-run" type="button">
              Run
            </button>
          </div>
          <p id="dev-console-output" class="dev-console-output"></p>
        </div>
      </div>
    </section>
  </main>
`

const canvasElement = document.querySelector<HTMLCanvasElement>('#game')

if (!canvasElement) {
  throw new Error('Game canvas not found.')
}

const context = canvasElement.getContext('2d')

if (!context) {
  throw new Error('Could not create 2D drawing context.')
}

const canvas = canvasElement
const gameContext: CanvasRenderingContext2D = context
const livesValueElement = document.querySelector<HTMLElement>('#lives-value')
const goldValueElement = document.querySelector<HTMLElement>('#gold-value')
const waveValueElement = document.querySelector<HTMLElement>('#wave-value')
const shopControlsElement = document.querySelector<HTMLElement>('#shop-controls')
const upgradeControlsElement = document.querySelector<HTMLElement>('#upgrade-controls')
const buyTowerButtonElement =
  document.querySelector<HTMLButtonElement>('#buy-tower-button')
const buySpireButtonElement =
  document.querySelector<HTMLButtonElement>('#buy-spire-button')
const upgradeDamageButtonElement =
  document.querySelector<HTMLButtonElement>('#upgrade-damage-button')
const upgradeRangeButtonElement =
  document.querySelector<HTMLButtonElement>('#upgrade-range-button')
const upgradeSpeedButtonElement =
  document.querySelector<HTMLButtonElement>('#upgrade-speed-button')
const sellTowerButtonElement =
  document.querySelector<HTMLButtonElement>('#sell-tower-button')
const consoleToggleButtonElement =
  document.querySelector<HTMLButtonElement>('#console-toggle-button')
const devConsoleElement = document.querySelector<HTMLElement>('#dev-console')
const devConsoleInputElement =
  document.querySelector<HTMLInputElement>('#dev-console-input')
const devConsoleRunButtonElement =
  document.querySelector<HTMLButtonElement>('#dev-console-run-button')
const devConsoleOutputElement =
  document.querySelector<HTMLElement>('#dev-console-output')
const shopMessageElement = document.querySelector<HTMLElement>('#shop-message')
const towerStatsElement = document.querySelector<HTMLElement>('#tower-stats')

if (!livesValueElement) {
  throw new Error('Lives display not found.')
}

if (!goldValueElement) {
  throw new Error('Gold display not found.')
}

if (!waveValueElement) {
  throw new Error('Wave display not found.')
}

if (!buyTowerButtonElement) {
  throw new Error('Buy tower button not found.')
}

if (!buySpireButtonElement) {
  throw new Error('Buy spire button not found.')
}

if (!upgradeDamageButtonElement) {
  throw new Error('Upgrade damage button not found.')
}

if (!upgradeRangeButtonElement) {
  throw new Error('Upgrade range button not found.')
}

if (!upgradeSpeedButtonElement) {
  throw new Error('Upgrade speed button not found.')
}

if (!sellTowerButtonElement) {
  throw new Error('Sell tower button not found.')
}

if (!consoleToggleButtonElement) {
  throw new Error('Console toggle button not found.')
}

if (!devConsoleElement) {
  throw new Error('Developer console not found.')
}

if (!devConsoleInputElement) {
  throw new Error('Developer console input not found.')
}

if (!devConsoleRunButtonElement) {
  throw new Error('Developer console run button not found.')
}

if (!devConsoleOutputElement) {
  throw new Error('Developer console output not found.')
}

if (!shopControlsElement) {
  throw new Error('Shop controls not found.')
}

if (!upgradeControlsElement) {
  throw new Error('Upgrade controls not found.')
}

if (!shopMessageElement) {
  throw new Error('Shop message not found.')
}

if (!towerStatsElement) {
  throw new Error('Tower stats display not found.')
}

const livesDisplay: HTMLElement = livesValueElement
const goldDisplay: HTMLElement = goldValueElement
const waveDisplay: HTMLElement = waveValueElement
const shopControls: HTMLElement = shopControlsElement
const upgradeControls: HTMLElement = upgradeControlsElement
const buyTowerButton: HTMLButtonElement = buyTowerButtonElement
const buySpireButton: HTMLButtonElement = buySpireButtonElement
const upgradeDamageButton: HTMLButtonElement = upgradeDamageButtonElement
const upgradeRangeButton: HTMLButtonElement = upgradeRangeButtonElement
const upgradeSpeedButton: HTMLButtonElement = upgradeSpeedButtonElement
const sellTowerButton: HTMLButtonElement = sellTowerButtonElement
const consoleToggleButton: HTMLButtonElement = consoleToggleButtonElement
const devConsole: HTMLElement = devConsoleElement
const devConsoleInput: HTMLInputElement = devConsoleInputElement
const devConsoleRunButton: HTMLButtonElement = devConsoleRunButtonElement
const devConsoleOutput: HTMLElement = devConsoleOutputElement
const shopMessage: HTMLElement = shopMessageElement
const towerStats: HTMLElement = towerStatsElement

const defaultPathPoints = [
  { x: 286, y: 140 },
  { x: 286, y: 192 },
  { x: 177, y: 192 },
  { x: 177, y: 61 },
  { x: 33, y: 61 },
  { x: 33, y: 204 },
  { x: 91, y: 204 },
  { x: 91, y: 260 },
  { x: 33, y: 260 },
  { x: 33, y: 322 },
  { x: 179, y: 322 },
  { x: 179, y: 256 },
  { x: 348, y: 256 },
  { x: 348, y: 322 },
  { x: 439, y: 322 },
  { x: 439, y: 176 },
  { x: 407, y: 176 },
  { x: 407, y: 96 },
  { x: 480, y: 96 },
]
const savedPathStorageKey = 'tower-defense-saved-path'

function clonePathPoints(points: { x: number; y: number }[]) {
  return points.map((point) => ({ ...point }))
}

function loadSavedPathPoints() {
  const savedPath = window.localStorage.getItem(savedPathStorageKey)

  if (!savedPath) {
    return clonePathPoints(defaultPathPoints)
  }

  try {
    const parsedPath = JSON.parse(savedPath)

    if (
      Array.isArray(parsedPath) &&
      parsedPath.length >= 2 &&
      parsedPath.every(
        (point) =>
          typeof point?.x === 'number' &&
          Number.isFinite(point.x) &&
          typeof point?.y === 'number' &&
          Number.isFinite(point.y),
      )
    ) {
      return clonePathPoints(parsedPath)
    }
  } catch {
    window.localStorage.removeItem(savedPathStorageKey)
  }

  return clonePathPoints(defaultPathPoints)
}

let pathPoints = loadSavedPathPoints()
const enemyImage = new Image()
const coneheadEnemyImage = new Image()
const bucketheadEnemyImage = new Image()
const tacoTruckImage = new Image()
const spireTowerImage = new Image()
const towerTowerProjectileImage = new Image()
const towerTowerExplosionImage = new Image()
const tacoImage = new Image()
const explosionImage = new Image()
const gameBackgroundImage = new Image()
let enemyImageLoaded = false
let coneheadEnemyImageLoaded = false
let bucketheadEnemyImageLoaded = false
let tacoTruckImageLoaded = false
let spireTowerImageLoaded = false
let towerTowerProjectileImageLoaded = false
let towerTowerExplosionImageLoaded = false
let tacoImageLoaded = false
let explosionImageLoaded = false
let gameBackgroundImageLoaded = false
const towerCost = 5
const spireTowerCost = 12
const pathWidth = 26
const towerRange = 77
const towerReloadTime = 0.9
const tacoTruckSpriteWidth = 48.96
const tacoTruckSpriteHeight = 38.88
const spireTowerSpriteWidth = 50
const spireTowerSpriteHeight = 74
const towerPlacementEdgePadding = 8
const minimumTowerSpacing = 40
const tacoDamage = 5
const tacoSpeed = 280
const towerTowerProjectileSpeed = 110
const explosionSplashRadius = 30
const towerTowerExplosionDuration = 1.6
const towerTowerExplosionDrawScale = 3.4
const minimumTowerReloadTime = 0.25
const enemySpeed = 85
const enemyMaxHealth = 40
const coneheadEnemyHealth = enemyMaxHealth * 2
const bucketheadEnemyHealth = 200
const coneheadEnemySpawnChance = 0.2
const bucketheadEnemySpawnChance = 0.05
const enemyGoldReward = 2
const coneheadEnemyGoldReward = 5
const bucketheadEnemyGoldReward = 12
const waveDelay = 2.4
const minimumGameSpeed = 0.5
const maximumGameSpeed = 3
const totalWaveCount = 30

type TowerType = 'tacoTruck' | 'spireTower'

type TowerDefinition = {
  name: string
  cost: number
  damage: number
  range: number
  reloadTime: number
  spriteWidth: number
  spriteHeight: number
  ariaLabel: string
  speedMode: 'reload' | 'shotsPerSecond'
  projectileSpeed: number
  damageUpgradeAmounts: number[]
  damageUpgradeCosts: number[]
  rangeUpgradeAmounts: number[]
  rangeUpgradeCosts: number[]
  speedUpgradeAmounts: number[]
  speedUpgradeCosts: number[]
}

const towerDefinitions: Record<TowerType, TowerDefinition> = {
  tacoTruck: {
    name: 'Taco Truck',
    cost: towerCost,
    damage: tacoDamage,
    range: towerRange,
    reloadTime: towerReloadTime,
    spriteWidth: tacoTruckSpriteWidth,
    spriteHeight: tacoTruckSpriteHeight,
    ariaLabel: `Buy Taco Truck (${towerCost} Gold)`,
    speedMode: 'reload',
    projectileSpeed: tacoSpeed,
    damageUpgradeAmounts: [1, 1, 1, 1, 1],
    damageUpgradeCosts: [1, 3, 5, 7, 9],
    rangeUpgradeAmounts: [8, 8, 8],
    rangeUpgradeCosts: [1, 3, 5],
    speedUpgradeAmounts: [0.08, 0.08, 0.08, 0.08, 0.08],
    speedUpgradeCosts: [1, 3, 5, 7, 9],
  },
  spireTower: {
    name: 'Tower Tower',
    cost: spireTowerCost,
    damage: 15,
    range: 100,
    reloadTime: 1 / 0.35,
    spriteWidth: spireTowerSpriteWidth,
    spriteHeight: spireTowerSpriteHeight,
    ariaLabel: `Buy Tower Tower (${spireTowerCost} Gold)`,
    speedMode: 'shotsPerSecond',
    projectileSpeed: towerTowerProjectileSpeed,
    damageUpgradeAmounts: [3, 5, 7, 10, 15],
    damageUpgradeCosts: [5, 8, 15, 20, 25],
    rangeUpgradeAmounts: [5, 10, 10],
    rangeUpgradeCosts: [5, 10, 15],
    speedUpgradeAmounts: [0.08, 0.08, 0.08, 0.08, 0.08],
    speedUpgradeCosts: [3, 5, 7, 10, 15],
  },
}

function randomWholeNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const waves = Array.from({ length: totalWaveCount }, (_, waveIndex) => {
  const enemyCount = 2 + waveIndex + Math.floor(waveIndex / 2)
  const shortGap = Math.max(0.08, 0.34 - waveIndex * 0.008)
  const mediumGap = Math.max(0.35, 1.25 - waveIndex * 0.02)
  const longGap = Math.max(0.7, 2.2 - waveIndex * 0.03)
  const maxPackSize = Math.min(12, 3 + Math.floor(waveIndex / 3))
  const spawnIntervals: number[] = []
  let remainingEnemies = enemyCount

  while (remainingEnemies > 1) {
    const currentPackSize = Math.min(
      remainingEnemies,
      randomWholeNumber(1, maxPackSize),
    )

    for (let packIndex = 0; packIndex < currentPackSize - 1; packIndex += 1) {
      const gapVariation = randomWholeNumber(0, 2) * 0.025
      spawnIntervals.push(Math.max(0.07, shortGap - gapVariation))
    }

    remainingEnemies -= currentPackSize

    if (remainingEnemies > 0) {
      const packBreakRoll = Math.random()
      const packBreak =
        packBreakRoll < 0.2 ? longGap + randomWholeNumber(0, 10) * 0.12
        : packBreakRoll < 0.55 ? mediumGap + randomWholeNumber(0, 8) * 0.09
        : shortGap + randomWholeNumber(6, 18) * 0.05

      spawnIntervals.push(packBreak)
    }
  }

  return {
    enemyCount,
    spawnIntervals,
  }
})

enemyImage.src = zombieImageUrl
enemyImage.onload = () => {
  enemyImageLoaded = true
}
coneheadEnemyImage.src = coneheadZombieImageUrl
coneheadEnemyImage.onload = () => {
  coneheadEnemyImageLoaded = true
}
bucketheadEnemyImage.src = bucketheadZombieImageUrl
bucketheadEnemyImage.onload = () => {
  bucketheadEnemyImageLoaded = true
}
tacoTruckImage.src = tacoTruckImageUrl
tacoTruckImage.onload = () => {
  tacoTruckImageLoaded = true
}
spireTowerImage.src = towerTowerImageUrl
spireTowerImage.onload = () => {
  spireTowerImageLoaded = true
}
towerTowerProjectileImage.src = towerTowerProjectileImageUrl
towerTowerProjectileImage.onload = () => {
  towerTowerProjectileImageLoaded = true
}
towerTowerExplosionImage.src = towerTowerExplosionImageUrl
towerTowerExplosionImage.onload = () => {
  towerTowerExplosionImageLoaded = true
}
tacoImage.src = tacoImageUrl
tacoImage.onload = () => {
  tacoImageLoaded = true
}
explosionImage.src = explosionImageUrl
explosionImage.onload = () => {
  explosionImageLoaded = true
}
gameBackgroundImage.src = gameBackgroundImageUrl
gameBackgroundImage.onload = () => {
  gameBackgroundImageLoaded = true
}

const player = {
  lives: 10,
  gold: 25,
}
const enemies: {
  id: number
  type: 'browncoat' | 'conehead' | 'buckethead'
  x: number
  y: number
  targetPointIndex: number
  speed: number
  health: number
  maxHealth: number
}[] = []
const towers: {
  type: TowerType
  x: number
  y: number
  radius: number
  range: number
  damage: number
  reloadTime: number
  cooldown: number
  damageLevel: number
  rangeLevel: number
  speedLevel: number
  goldSpent: number
}[] = []
const projectiles: {
  x: number
  y: number
  speed: number
  damage: number
  targetEnemyId: number
  sourceTowerType: TowerType
}[] = []
const explosions: {
  x: number
  y: number
  radius: number
  maxRadius: number
  timeLeft: number
  duration: number
  sourceTowerType: TowerType
}[] = []
let towerPlacementMode = false
let towerPlacementType: TowerType = 'tacoTruck'
let selectedTowerIndex: number | null = null
let nextEnemyId = 1
let currentWaveIndex = 0
let enemiesSpawnedThisWave = 0
let spawnTimer = 0
let waveDelayTimer = 0
let gameSpeedMultiplier = 1
let devConsoleVisible = false
const placementPreview = {
  x: pathPoints[0].x,
  y: pathPoints[0].y,
  isValid: false,
}

function getTowerDefinition(towerType: TowerType) {
  return towerDefinitions[towerType]
}

function getCurrentWave() {
  return waves[Math.min(currentWaveIndex, waves.length - 1)]
}

function createEnemy() {
  const enemyTypeRoll = Math.random()
  const currentWaveNumber = currentWaveIndex + 1
  const coneheadsUnlocked = currentWaveNumber > 3
  const bucketheadsUnlocked = currentWaveNumber > 5
  const enemyType: 'browncoat' | 'conehead' | 'buckethead' =
    bucketheadsUnlocked && enemyTypeRoll < bucketheadEnemySpawnChance ? 'buckethead'
    : coneheadsUnlocked &&
        enemyTypeRoll < bucketheadEnemySpawnChance + coneheadEnemySpawnChance ? 'conehead'
    : 'browncoat'
  const maxHealth =
    enemyType === 'buckethead' ? bucketheadEnemyHealth
    : enemyType === 'conehead' ? coneheadEnemyHealth
    : enemyMaxHealth

  enemies.push({
    id: nextEnemyId,
    type: enemyType,
    x: pathPoints[0].x,
    y: pathPoints[0].y,
    targetPointIndex: 1,
    speed: enemySpeed,
    health: maxHealth,
    maxHealth,
  })
  nextEnemyId += 1
  enemiesSpawnedThisWave += 1
}

function getNextSpawnInterval() {
  const currentWave = getCurrentWave()
  const spawnIntervalIndex = Math.min(
    enemiesSpawnedThisWave - 1,
    currentWave.spawnIntervals.length - 1,
  )

  return currentWave.spawnIntervals[spawnIntervalIndex]
}

function getEnemyById(enemyId: number) {
  return enemies.find((enemy) => enemy.id === enemyId)
}

function damageEnemy(enemyId: number, amount: number) {
  const enemy = getEnemyById(enemyId)

  if (!enemy) {
    return
  }

  enemy.health = Math.max(0, enemy.health - amount)

  if (enemy.health === 0) {
    const enemyIndex = enemies.findIndex((currentEnemy) => currentEnemy.id === enemyId)

    if (enemyIndex >= 0) {
      const goldReward =
        enemy.type === 'buckethead' ? bucketheadEnemyGoldReward
        : enemy.type === 'conehead' ? coneheadEnemyGoldReward
        : enemyGoldReward

      enemies.splice(enemyIndex, 1)
      player.gold += goldReward
      updateGoldDisplay()
      updateShopUi()
    }
  }
}

function applySplashDamage(centerX: number, centerY: number, damage: number, ignoredEnemyId: number) {
  const splashDamage = damage / 5

  for (const enemy of enemies) {
    if (enemy.id === ignoredEnemyId) {
      continue
    }

    const distanceToExplosion = Math.hypot(enemy.x - centerX, enemy.y - centerY)

    if (distanceToExplosion <= explosionSplashRadius) {
      damageEnemy(enemy.id, splashDamage)
    }
  }
}

function updateLivesDisplay() {
  livesDisplay.textContent = String(player.lives)
}

function updateGoldDisplay() {
  goldDisplay.textContent = String(player.gold)
}

function updateWaveDisplay() {
  waveDisplay.textContent = String(currentWaveIndex + 1)
}

function updateGameSpeedButtons() {
}

function getTowerStatsText(towerType: TowerType) {
  const towerDefinition = getTowerDefinition(towerType)
  return `${towerDefinition.name}: damage ${towerDefinition.damage}, range ${towerDefinition.range}, ${(
    1 / towerDefinition.reloadTime
  ).toFixed(2)} shots/sec.`
}

function getUpgradeOption(
  towerDefinition: TowerDefinition,
  track: 'damage' | 'range' | 'speed',
  level: number,
) {
  const amountKey =
    `${track}UpgradeAmounts` as 'damageUpgradeAmounts' | 'rangeUpgradeAmounts' | 'speedUpgradeAmounts'
  const costKey =
    `${track}UpgradeCosts` as 'damageUpgradeCosts' | 'rangeUpgradeCosts' | 'speedUpgradeCosts'

  const amount = towerDefinition[amountKey][level]
  const cost = towerDefinition[costKey][level]

  return { amount, cost }
}

function updateShopUi() {
  const selectedTower =
    selectedTowerIndex === null ? null : towers[selectedTowerIndex]
  const activeTowerDefinition = getTowerDefinition(towerPlacementType)

  shopControls.classList.toggle('hidden', selectedTower !== null)
  upgradeControls.classList.toggle('hidden', selectedTower === null)

  buyTowerButton.disabled =
    player.gold < towerDefinitions.tacoTruck.cost || towerPlacementMode
  buySpireButton.disabled =
    player.gold < towerDefinitions.spireTower.cost || towerPlacementMode

  if (towerPlacementMode) {
    buyTowerButton.setAttribute('aria-label', 'Placing Taco Truck...')
    buyTowerButton.title = 'Placing Taco Truck...'
    buySpireButton.setAttribute('aria-label', 'Placing Tower Tower...')
    buySpireButton.title = 'Placing Tower Tower...'
    upgradeDamageButton.disabled = true
    upgradeRangeButton.disabled = true
    upgradeSpeedButton.disabled = true
    sellTowerButton.disabled = true
    shopMessage.textContent = ''
    towerStats.textContent = `Placing ${activeTowerDefinition.name.toLowerCase()}: damage ${activeTowerDefinition.damage}, range ${activeTowerDefinition.range}, ${(
      1 / activeTowerDefinition.reloadTime
    ).toFixed(2)} shots/sec.`
    return
  }

  if (selectedTower) {
    const selectedTowerDefinition = getTowerDefinition(selectedTower.type)
    const damageUpgrade = getUpgradeOption(
      selectedTowerDefinition,
      'damage',
      selectedTower.damageLevel,
    )
    const rangeUpgrade = getUpgradeOption(
      selectedTowerDefinition,
      'range',
      selectedTower.rangeLevel,
    )
    const speedUpgrade = getUpgradeOption(
      selectedTowerDefinition,
      'speed',
      selectedTower.speedLevel,
    )
    const damageMaxed = damageUpgrade.amount === undefined || damageUpgrade.cost === undefined
    const rangeMaxed = rangeUpgrade.amount === undefined || rangeUpgrade.cost === undefined
    const speedMaxed = speedUpgrade.amount === undefined || speedUpgrade.cost === undefined

    upgradeDamageButton.textContent = damageMaxed
      ? 'Damage Maxed'
      : `Damage +${damageUpgrade.amount} (${damageUpgrade.cost} Gold)`
    upgradeRangeButton.textContent = rangeMaxed
      ? 'Range Maxed'
      : `Range +${rangeUpgrade.amount} (${rangeUpgrade.cost} Gold)`
    upgradeSpeedButton.textContent = speedMaxed
      ? 'Speed Maxed'
      : `Speed +${speedUpgrade.amount.toFixed(2)} (${speedUpgrade.cost} Gold)`
    sellTowerButton.textContent = `Sell Truck (+${Math.floor(selectedTower.goldSpent * 0.5)} Gold)`
    upgradeDamageButton.disabled = damageMaxed || player.gold < damageUpgrade.cost
    upgradeRangeButton.disabled = rangeMaxed || player.gold < rangeUpgrade.cost
    upgradeSpeedButton.disabled =
      speedMaxed ||
      player.gold < speedUpgrade.cost ||
      selectedTower.reloadTime <= minimumTowerReloadTime
    sellTowerButton.disabled = false
    shopMessage.textContent = ''
    towerStats.textContent = `Selected ${selectedTowerDefinition.name.toLowerCase()}: damage ${selectedTower.damage}, range ${selectedTower.range}, ${(1 / selectedTower.reloadTime).toFixed(2)} shots/sec.`
    return
  }

  buyTowerButton.setAttribute('aria-label', towerDefinitions.tacoTruck.ariaLabel)
  buyTowerButton.title = towerDefinitions.tacoTruck.ariaLabel
  buySpireButton.setAttribute('aria-label', towerDefinitions.spireTower.ariaLabel)
  buySpireButton.title = towerDefinitions.spireTower.ariaLabel
  if (player.gold < towerDefinitions.tacoTruck.cost && player.gold < towerDefinitions.spireTower.cost) {
    shopMessage.textContent = ''
    towerStats.textContent = getTowerStatsText('tacoTruck')
    return
  }

  shopMessage.textContent = ''
  towerStats.textContent = towerPlacementMode
    ? getTowerStatsText(towerPlacementType)
    : getTowerStatsText('tacoTruck')
}

function updateDevConsoleUi() {
  devConsole.classList.toggle('hidden', !devConsoleVisible)
  consoleToggleButton.textContent = devConsoleVisible ? 'Close Console' : 'Console'
}

function setConsoleStatus(message: string) {
  devConsoleOutput.textContent = message
}

function applyConsoleCommand(rawCommand: string) {
  const command = rawCommand.trim()

  if (!command) {
    setConsoleStatus('Enter a command like lives = 50, gold = 1000, or game_speed = 1.5.')
    return
  }

  const match = command.match(
    /^(lives|gold|wave|game_speed)\s*=\s*(-?\d+(?:\.\d+)?)$/i,
  )

  if (!match) {
    setConsoleStatus(
      'Unknown command. Use lives = x, gold = x, wave = x, or game_speed = x.',
    )
    return
  }

  const key = match[1].toLowerCase()
  const value = Number(match[2])

  if (!Number.isFinite(value)) {
    setConsoleStatus('That value is not a valid number.')
    return
  }

  if (key === 'lives') {
    player.lives = Math.max(0, Math.floor(value))
    updateLivesDisplay()
    setConsoleStatus(`Lives set to ${player.lives}.`)
    return
  }

  if (key === 'gold') {
    player.gold = Math.max(0, Math.floor(value))
    updateGoldDisplay()
    updateShopUi()
    setConsoleStatus(`Gold set to ${player.gold}.`)
    return
  }

  if (key === 'wave') {
    currentWaveIndex = Math.max(0, Math.min(waves.length - 1, Math.floor(value) - 1))
    enemies.length = 0
    projectiles.length = 0
    explosions.length = 0
    enemiesSpawnedThisWave = 0
    spawnTimer = 0
    waveDelayTimer = waveDelay
    updateWaveDisplay()
    createEnemy()
    setConsoleStatus(`Wave set to ${currentWaveIndex + 1}.`)
    return
  }

  if (key === 'game_speed') {
    gameSpeedMultiplier = Math.min(maximumGameSpeed, Math.max(minimumGameSpeed, value))
    updateGameSpeedButtons()
    setConsoleStatus(`Game speed set to ${gameSpeedMultiplier.toFixed(2)}x.`)
  }
}

function distanceToLineSegment(
  pointX: number,
  pointY: number,
  lineStartX: number,
  lineStartY: number,
  lineEndX: number,
  lineEndY: number,
) {
  const lineX = lineEndX - lineStartX
  const lineY = lineEndY - lineStartY
  const lineLengthSquared = lineX * lineX + lineY * lineY

  if (lineLengthSquared === 0) {
    return Math.hypot(pointX - lineStartX, pointY - lineStartY)
  }

  const projection = Math.max(
    0,
    Math.min(
      1,
      ((pointX - lineStartX) * lineX + (pointY - lineStartY) * lineY) /
        lineLengthSquared,
    ),
  )

  const closestX = lineStartX + projection * lineX
  const closestY = lineStartY + projection * lineY

  return Math.hypot(pointX - closestX, pointY - closestY)
}

function isPointOnPath(pointX: number, pointY: number) {
  for (let index = 0; index < pathPoints.length - 1; index += 1) {
    const startPoint = pathPoints[index]
    const endPoint = pathPoints[index + 1]
    const distance = distanceToLineSegment(
      pointX,
      pointY,
      startPoint.x,
      startPoint.y,
      endPoint.x,
      endPoint.y,
    )

    if (distance < pathWidth / 2 + 10) {
      return true
    }
  }

  return false
}

function isPointInsideBoard(pointX: number, pointY: number) {
  const towerDefinition = getTowerDefinition(towerPlacementType)
  return (
    pointX > towerDefinition.spriteWidth / 2 + towerPlacementEdgePadding &&
    pointX < canvas.width - towerDefinition.spriteWidth / 2 - towerPlacementEdgePadding &&
    pointY > towerDefinition.spriteHeight / 2 + towerPlacementEdgePadding &&
    pointY < canvas.height - towerDefinition.spriteHeight / 2 - towerPlacementEdgePadding
  )
}

function isPointTooCloseToTower(pointX: number, pointY: number) {
  return towers.some(
    (tower) => Math.hypot(pointX - tower.x, pointY - tower.y) < minimumTowerSpacing,
  )
}

function isValidTowerPlacement(pointX: number, pointY: number) {
  return (
    isPointInsideBoard(pointX, pointY) &&
    !isPointOnPath(pointX, pointY) &&
    !isPointTooCloseToTower(pointX, pointY)
  )
}

function getClickedTowerIndex(pointX: number, pointY: number) {
  return towers.findIndex(
    (tower) => {
      const towerDefinition = getTowerDefinition(tower.type)

      return (
        pointX >= tower.x - towerDefinition.spriteWidth / 2 &&
        pointX <= tower.x + towerDefinition.spriteWidth / 2 &&
        pointY >= tower.y - towerDefinition.spriteHeight / 2 &&
        pointY <= tower.y + towerDefinition.spriteHeight / 2
      )
    },
  )
}

function placeTower(pointX: number, pointY: number) {
  const towerDefinition = getTowerDefinition(towerPlacementType)

  if (!isPointInsideBoard(pointX, pointY)) {
    shopMessage.textContent = 'Place the taco truck inside the map.'
    return
  }

  if (isPointOnPath(pointX, pointY)) {
    shopMessage.textContent = 'Taco trucks cannot be placed on the path.'
    return
  }

  if (isPointTooCloseToTower(pointX, pointY)) {
    shopMessage.textContent = 'That spot is too close to another taco truck.'
    return
  }

  towers.push({
    type: towerPlacementType,
    x: pointX,
    y: pointY,
    radius: 20,
    range: towerDefinition.range,
    damage: towerDefinition.damage,
    reloadTime: towerDefinition.reloadTime,
    cooldown: 0,
    damageLevel: 0,
    rangeLevel: 0,
    speedLevel: 0,
    goldSpent: towerDefinition.cost,
  })
  selectedTowerIndex = towers.length - 1
  towerPlacementMode = false
  placementPreview.isValid = false
  updateShopUi()
}

function cancelTowerPlacement() {
  if (!towerPlacementMode) {
    return
  }

  towerPlacementMode = false
  placementPreview.isValid = false
  player.gold += getTowerDefinition(towerPlacementType).cost
  updateGoldDisplay()
  updateShopUi()
}

function startTowerPlacement(towerType: TowerType) {
  const towerDefinition = getTowerDefinition(towerType)

  if (player.gold < towerDefinition.cost || towerPlacementMode) {
    return
  }

  selectedTowerIndex = null
  player.gold -= towerDefinition.cost
  towerPlacementMode = true
  towerPlacementType = towerType
  placementPreview.isValid = false
  updateGoldDisplay()
  updateShopUi()
}

function updateEnemySpawns(deltaTime: number) {
  if (player.lives <= 0) {
    return
  }

  const currentWave = getCurrentWave()

  if (enemiesSpawnedThisWave >= currentWave.enemyCount) {
    if (enemies.length === 0) {
      waveDelayTimer -= deltaTime

      if (waveDelayTimer <= 0) {
        currentWaveIndex += 1
        enemiesSpawnedThisWave = 0
        spawnTimer = 0
        waveDelayTimer = waveDelay
        updateWaveDisplay()
      }
    }

    return
  }

  spawnTimer -= deltaTime

  if (spawnTimer > 0) {
    return
  }

  createEnemy()
  spawnTimer = getNextSpawnInterval()
}

function updateTowers(deltaTime: number) {
  towers.forEach((tower) => {
    const towerDefinition = getTowerDefinition(tower.type)

    if (tower.cooldown > 0) {
      tower.cooldown -= deltaTime
    }

    const targetEnemy = enemies.find(
      (enemy) => Math.hypot(enemy.x - tower.x, enemy.y - tower.y) <= tower.range,
    )

    if (targetEnemy && tower.cooldown <= 0) {
      projectiles.push({
        x: tower.x,
        y: tower.y,
        speed: towerDefinition.projectileSpeed,
        damage: tower.damage,
        targetEnemyId: targetEnemy.id,
        sourceTowerType: tower.type,
      })
      tower.cooldown = tower.reloadTime
    }
  })
}

function updateProjectiles(deltaTime: number) {
  for (let index = projectiles.length - 1; index >= 0; index -= 1) {
    const projectile = projectiles[index]
    const targetEnemy = getEnemyById(projectile.targetEnemyId)

    if (!targetEnemy) {
      projectiles.splice(index, 1)
      continue
    }

    const xDistance = targetEnemy.x - projectile.x
    const yDistance = targetEnemy.y - projectile.y
    const distanceToEnemy = Math.hypot(xDistance, yDistance)
    const movementAmount = projectile.speed * deltaTime

    if (distanceToEnemy <= movementAmount + 12) {
      projectile.x = targetEnemy.x
      projectile.y = targetEnemy.y

      explosions.push({
        x: projectile.x,
        y: projectile.y,
        radius: 30,
        maxRadius: 30,
        timeLeft: projectile.sourceTowerType === 'spireTower' ? towerTowerExplosionDuration : 1,
        duration:
          projectile.sourceTowerType === 'spireTower' ? towerTowerExplosionDuration : 1,
        sourceTowerType: projectile.sourceTowerType,
      })
      damageEnemy(projectile.targetEnemyId, projectile.damage)
      applySplashDamage(
        projectile.x,
        projectile.y,
        projectile.damage,
        projectile.targetEnemyId,
      )
      projectiles.splice(index, 1)
      continue
    }

    projectile.x += (xDistance / distanceToEnemy) * movementAmount
    projectile.y += (yDistance / distanceToEnemy) * movementAmount
  }
}

function updateExplosions(deltaTime: number) {
  for (let index = explosions.length - 1; index >= 0; index -= 1) {
    const explosion = explosions[index]
    explosion.timeLeft -= deltaTime

    if (explosion.timeLeft <= 0) {
      explosions.splice(index, 1)
      continue
    }
  }
}

function moveEnemies(deltaTime: number) {
  if (player.lives <= 0) {
    return
  }

  for (let index = enemies.length - 1; index >= 0; index -= 1) {
    const enemy = enemies[index]
    const targetPoint = pathPoints[enemy.targetPointIndex]
    const xDistance = targetPoint.x - enemy.x
    const yDistance = targetPoint.y - enemy.y
    const distanceToTarget = Math.hypot(xDistance, yDistance)
    const movementAmount = enemy.speed * deltaTime

    if (distanceToTarget <= movementAmount) {
      enemy.x = targetPoint.x
      enemy.y = targetPoint.y

      if (enemy.targetPointIndex === pathPoints.length - 1) {
        const lifePenalty =
          enemy.type === 'buckethead' ? 4
          : enemy.type === 'conehead' ? 2
          : 1

        player.lives -= lifePenalty
        player.gold += enemyGoldReward
        updateLivesDisplay()
        updateGoldDisplay()
        updateShopUi()
        enemies.splice(index, 1)
        continue
      }

      enemy.targetPointIndex += 1
      continue
    }

    enemy.x += (xDistance / distanceToTarget) * movementAmount
    enemy.y += (yDistance / distanceToTarget) * movementAmount
  }
}

function drawBackground() {
  if (!gameBackgroundImageLoaded) {
    gameContext.fillStyle = '#f2efe8'
    gameContext.fillRect(0, 0, canvas.width, canvas.height)
    return
  }

  gameContext.drawImage(
    gameBackgroundImage,
    0,
    0,
    gameBackgroundImage.width,
    gameBackgroundImage.height,
    0,
    0,
    canvas.width,
    canvas.height,
  )
}

function drawScene() {
  gameContext.clearRect(0, 0, canvas.width, canvas.height)

  drawBackground()

  towers.forEach((tower, index) => {
    const towerDefinition = getTowerDefinition(tower.type)
    const towerSprite = tower.type === 'spireTower' ? spireTowerImage : tacoTruckImage
    const towerSpriteLoaded =
      tower.type === 'spireTower' ? spireTowerImageLoaded : tacoTruckImageLoaded

    if (selectedTowerIndex === index) {
      gameContext.strokeStyle = 'rgba(116, 220, 255, 0.45)'
      gameContext.lineWidth = 5
      gameContext.beginPath()
      gameContext.arc(tower.x, tower.y, tower.range, 0, Math.PI * 2)
      gameContext.stroke()
    }

    if (towerSpriteLoaded) {
      gameContext.drawImage(
        towerSprite,
        tower.x - towerDefinition.spriteWidth / 2,
        tower.y - towerDefinition.spriteHeight / 2,
        towerDefinition.spriteWidth,
        towerDefinition.spriteHeight,
      )
    } else {
      gameContext.fillStyle = '#7f5a38'
      gameContext.beginPath()
      gameContext.arc(tower.x, tower.y, tower.radius, 0, Math.PI * 2)
      gameContext.fill()

      gameContext.fillStyle = '#c7d8e8'
      gameContext.beginPath()
      gameContext.arc(tower.x, tower.y, 9, 0, Math.PI * 2)
      gameContext.fill()
    }
  })

  if (towerPlacementMode) {
    gameContext.strokeStyle = placementPreview.isValid
      ? 'rgba(255, 255, 255, 0.9)'
      : 'rgba(236, 67, 67, 0.95)'
    gameContext.lineWidth = 5
    gameContext.beginPath()
    gameContext.arc(
      placementPreview.x,
      placementPreview.y,
      getTowerDefinition(towerPlacementType).range,
      0,
      Math.PI * 2,
    )
    gameContext.stroke()

    gameContext.save()
    gameContext.globalAlpha = placementPreview.isValid ? 1 : 0.45

    const towerDefinition = getTowerDefinition(towerPlacementType)
    const towerSprite =
      towerPlacementType === 'spireTower' ? spireTowerImage : tacoTruckImage
    const towerSpriteLoaded =
      towerPlacementType === 'spireTower' ? spireTowerImageLoaded : tacoTruckImageLoaded

    if (towerSpriteLoaded) {
      gameContext.drawImage(
        towerSprite,
        placementPreview.x - towerDefinition.spriteWidth / 2,
        placementPreview.y - towerDefinition.spriteHeight / 2,
        towerDefinition.spriteWidth,
        towerDefinition.spriteHeight,
      )
    } else {
      gameContext.fillStyle = '#7f5a38'
      gameContext.beginPath()
      gameContext.arc(placementPreview.x, placementPreview.y, 20, 0, Math.PI * 2)
      gameContext.fill()
    }

    gameContext.restore()
  }

  for (const projectile of projectiles) {
    if (projectile.sourceTowerType === 'spireTower' && towerTowerProjectileImageLoaded) {
      gameContext.drawImage(
        towerTowerProjectileImage,
        projectile.x - 18,
        projectile.y - 18,
        36,
        36,
      )
    } else if (tacoImageLoaded) {
      gameContext.drawImage(tacoImage, projectile.x - 20, projectile.y - 14, 40, 28)
    } else {
      gameContext.fillStyle = '#f0c36b'
      gameContext.beginPath()
      gameContext.arc(projectile.x, projectile.y, 8, Math.PI * 0.15, Math.PI * 0.85)
      gameContext.lineTo(projectile.x + 7, projectile.y)
      gameContext.closePath()
      gameContext.fill()

      gameContext.fillStyle = '#b84a3a'
      gameContext.fillRect(projectile.x - 4, projectile.y - 1, 8, 3)

      gameContext.fillStyle = '#6a9e4d'
      gameContext.fillRect(projectile.x - 3, projectile.y - 4, 6, 2)
    }
  }

  for (const enemy of enemies) {
    if (enemy.type === 'buckethead' && bucketheadEnemyImageLoaded) {
      gameContext.drawImage(bucketheadEnemyImage, enemy.x - 22.4, enemy.y - 30.8, 44.8, 61.6)
    } else if (enemy.type === 'conehead' && coneheadEnemyImageLoaded) {
      gameContext.drawImage(coneheadEnemyImage, enemy.x - 21, enemy.y - 30.8, 42, 61.6)
    } else if (enemyImageLoaded) {
      gameContext.drawImage(enemyImage, enemy.x - 18.2, enemy.y - 22.4, 36.4, 44.8)
    } else {
      gameContext.fillStyle = '#ca5b4b'
      gameContext.beginPath()
      gameContext.arc(enemy.x, enemy.y, 18, 0, Math.PI * 2)
      gameContext.fill()
    }

    const healthBarWidth = 34
    const healthBarHeight = 8
    const healthBarX = enemy.x - healthBarWidth / 2
    const healthBarY = enemy.y - 40
    const healthPercent = enemy.health / enemy.maxHealth

    gameContext.fillStyle = '#4b3b32'
    gameContext.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight)

    gameContext.fillStyle = '#57c95d'
    gameContext.fillRect(
      healthBarX,
      healthBarY,
      healthBarWidth * healthPercent,
      healthBarHeight,
    )
  }

  for (const explosion of explosions) {
    const alpha = explosion.timeLeft / explosion.duration

    if (explosion.sourceTowerType === 'spireTower' && towerTowerExplosionImageLoaded) {
      gameContext.save()
      gameContext.globalAlpha = alpha
      gameContext.drawImage(
        towerTowerExplosionImage,
        explosion.x - explosion.radius * towerTowerExplosionDrawScale / 2,
        explosion.y - explosion.radius * towerTowerExplosionDrawScale / 2 - 22,
        explosion.radius * towerTowerExplosionDrawScale,
        explosion.radius * towerTowerExplosionDrawScale,
      )
      gameContext.restore()
    } else if (explosionImageLoaded) {
      gameContext.save()
      gameContext.globalAlpha = alpha
      gameContext.drawImage(
        explosionImage,
        explosion.x - explosion.radius * 1.2,
        explosion.y - explosion.radius * 1.2,
        explosion.radius * 2.4,
        explosion.radius * 2.4,
      )
      gameContext.restore()
    } else {
      gameContext.fillStyle = `rgba(255, 198, 86, ${alpha})`
      gameContext.beginPath()
      gameContext.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2)
      gameContext.fill()

      gameContext.fillStyle = `rgba(255, 118, 53, ${alpha})`
      gameContext.beginPath()
      gameContext.arc(explosion.x, explosion.y, explosion.radius * 0.55, 0, Math.PI * 2)
      gameContext.fill()
    }
  }

  if (player.lives <= 0) {
    gameContext.fillStyle = 'rgba(33, 53, 71, 0.72)'
    gameContext.fillRect(0, 0, canvas.width, canvas.height)

    gameContext.fillStyle = '#fff7e6'
    gameContext.textAlign = 'center'
    gameContext.font = 'bold 46px sans-serif'
    gameContext.fillText('Game Over', canvas.width / 2, 200)
    gameContext.font = '24px sans-serif'
    gameContext.fillText('Refresh after you add towers.', canvas.width / 2, 245)
    gameContext.textAlign = 'start'
  }
}

let previousTime = 0

function gameLoop(currentTime: number) {
  const deltaTime = ((currentTime - previousTime) / 1000) * gameSpeedMultiplier
  previousTime = currentTime

  updateEnemySpawns(deltaTime)
  moveEnemies(deltaTime)
  updateTowers(deltaTime)
  updateProjectiles(deltaTime)
  updateExplosions(deltaTime)
  drawScene()

  requestAnimationFrame(gameLoop)
}

buyTowerButton.addEventListener('click', () => {
  startTowerPlacement('tacoTruck')
})

buySpireButton.addEventListener('click', () => {
  startTowerPlacement('spireTower')
})

upgradeDamageButton.addEventListener('click', () => {
  if (selectedTowerIndex === null) {
    return
  }

  const tower = towers[selectedTowerIndex]
  const towerDefinition = getTowerDefinition(tower?.type ?? 'tacoTruck')
  const upgrade = getUpgradeOption(towerDefinition, 'damage', tower?.damageLevel ?? 0)

  if (!tower || upgrade.amount === undefined || upgrade.cost === undefined || player.gold < upgrade.cost) {
    return
  }

  player.gold -= upgrade.cost
  tower.damage += upgrade.amount
  tower.damageLevel += 1
  tower.goldSpent += upgrade.cost
  updateGoldDisplay()
  updateShopUi()
})

upgradeRangeButton.addEventListener('click', () => {
  if (selectedTowerIndex === null) {
    return
  }

  const tower = towers[selectedTowerIndex]
  const towerDefinition = getTowerDefinition(tower?.type ?? 'tacoTruck')
  const upgrade = getUpgradeOption(towerDefinition, 'range', tower?.rangeLevel ?? 0)

  if (!tower || upgrade.amount === undefined || upgrade.cost === undefined || player.gold < upgrade.cost) {
    return
  }

  player.gold -= upgrade.cost
  tower.range += upgrade.amount
  tower.rangeLevel += 1
  tower.goldSpent += upgrade.cost
  updateGoldDisplay()
  updateShopUi()
})

upgradeSpeedButton.addEventListener('click', () => {
  if (selectedTowerIndex === null) {
    return
  }

  const tower = towers[selectedTowerIndex]
  const towerDefinition = getTowerDefinition(tower?.type ?? 'tacoTruck')
  const upgrade = getUpgradeOption(towerDefinition, 'speed', tower?.speedLevel ?? 0)

  if (
    !tower ||
    upgrade.amount === undefined ||
    upgrade.cost === undefined ||
    player.gold < upgrade.cost
  ) {
    return
  }

  player.gold -= upgrade.cost
  if (towerDefinition.speedMode === 'shotsPerSecond') {
    const currentShotsPerSecond = 1 / tower.reloadTime
    tower.reloadTime = Math.max(
      minimumTowerReloadTime,
      1 / (currentShotsPerSecond + upgrade.amount),
    )
  } else {
    tower.reloadTime = Math.max(
      minimumTowerReloadTime,
      tower.reloadTime - upgrade.amount,
    )
  }
  tower.speedLevel += 1
  tower.goldSpent += upgrade.cost
  updateGoldDisplay()
  updateShopUi()
})

sellTowerButton.addEventListener('click', () => {
  if (selectedTowerIndex === null) {
    return
  }

  const tower = towers[selectedTowerIndex]

  if (!tower) {
    return
  }

  const sellValue = Math.floor(tower.goldSpent * 0.5)

  towers.splice(selectedTowerIndex, 1)
  selectedTowerIndex = null
  player.gold += sellValue
  updateGoldDisplay()
  updateShopUi()
})

consoleToggleButton.addEventListener('click', () => {
  devConsoleVisible = !devConsoleVisible
  updateDevConsoleUi()
  if (devConsoleVisible) {
    devConsoleInput.focus()
  }
})

devConsoleRunButton.addEventListener('click', () => {
  applyConsoleCommand(devConsoleInput.value)
})

devConsoleInput.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter') {
    return
  }

  event.preventDefault()
  applyConsoleCommand(devConsoleInput.value)
})

canvas.addEventListener('click', (event) => {
  if (player.lives <= 0) {
    return
  }

  const canvasBounds = canvas.getBoundingClientRect()
  const scaleX = canvas.width / canvasBounds.width
  const scaleY = canvas.height / canvasBounds.height
  const clickX = (event.clientX - canvasBounds.left) * scaleX
  const clickY = (event.clientY - canvasBounds.top) * scaleY

  if (towerPlacementMode) {
    placeTower(clickX, clickY)
    return
  }

  const clickedTowerIndex = getClickedTowerIndex(clickX, clickY)
  selectedTowerIndex = clickedTowerIndex >= 0 ? clickedTowerIndex : null
  updateShopUi()
})

canvas.addEventListener('mousemove', (event) => {
  if (!towerPlacementMode) {
    return
  }

  const canvasBounds = canvas.getBoundingClientRect()
  const scaleX = canvas.width / canvasBounds.width
  const scaleY = canvas.height / canvasBounds.height
  const hoverX = (event.clientX - canvasBounds.left) * scaleX
  const hoverY = (event.clientY - canvasBounds.top) * scaleY

  placementPreview.x = hoverX
  placementPreview.y = hoverY
  placementPreview.isValid = isValidTowerPlacement(hoverX, hoverY)
})

canvas.addEventListener('contextmenu', (event) => {
  if (!towerPlacementMode) {
    return
  }

  event.preventDefault()
  cancelTowerPlacement()
})

drawScene()
updateLivesDisplay()
updateGoldDisplay()
updateShopUi()
updateGameSpeedButtons()
updateDevConsoleUi()
createEnemy()
requestAnimationFrame(gameLoop)
