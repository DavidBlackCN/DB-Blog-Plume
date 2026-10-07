// Shared square debris physics from SpaceBackground; default values preserve Home.
export interface PixelDebris {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  life: number
  maxLife: number
  color: string
}

export function spawnPixelDebris(
  particles: PixelDebris[], x: number, y: number, count: number,
  colors: readonly string[], color?: string, scale = 1,
): void {
  for (let index = 0; index < count; index++) {
    const angle = Math.random() * Math.PI * 2
    const speed = (1.4 + Math.random() * 3.4) * scale
    particles.push({
      x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      size: 2 + Math.random() * 2, life: 0,
      maxLife: (34 + Math.random() * 20) * scale,
      color: color || colors[Math.floor(Math.random() * colors.length)],
    })
  }
}

export function drawPixelDebris(
  context: CanvasRenderingContext2D, particles: PixelDebris[], opacity: number, step = 1,
): void {
  for (let index = particles.length - 1; index >= 0; index--) {
    const particle = particles[index]
    particle.x += particle.vx * step
    particle.y += particle.vy * step
    particle.vx *= .94 ** step
    particle.vy *= .94 ** step
    particle.life += step
    context.fillStyle = particle.color
    context.globalAlpha = Math.max(0, 1 - particle.life / particle.maxLife) * opacity
    context.fillRect(Math.round(particle.x), Math.round(particle.y), particle.size, particle.size)
    context.globalAlpha = 1
    if (particle.life >= particle.maxLife) particles.splice(index, 1)
  }
}
