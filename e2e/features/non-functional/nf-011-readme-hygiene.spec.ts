import { test, expect } from '@playwright/test'
import { promises as fs } from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * TC-NF-011 — Instalación limpia desde cero en una máquina nueva
 *
 * Verificación estática de que los READMEs (FE y BE) contienen las
 * secciones mínimas y que existen los archivos .env.example.
 */
test.describe('No funcional: Higiene del README', () => {
  test('El README raíz lista los prerrequisitos y comandos básicos', async () => {
    const repoRoot = path.resolve(__dirname, '..', '..', '..', '..')
    const feReadme = await fs.readFile(path.join(repoRoot, 'frontend', 'README.md'), 'utf-8')
    const beReadme = await fs.readFile(path.join(repoRoot, 'backend', 'README.md'), 'utf-8')
    const readme = feReadme + '\n' + beReadme

    // Prerrequisitos de stack (Node.js mención; JDK 21 ya está en el BE).
    expect(readme).toMatch(/Node\.?js?/i)
    expect(readme).toMatch(/JDK\s*21|Java\s*21/i)
    // Comandos de arranque
    expect(readme).toMatch(/npm\s+(install|i)\b/)
    expect(readme).toMatch(/npm\s+run\s+dev/)
    expect(readme).toMatch(/mvnw|spring-boot:run/i)
    // Variables de entorno
    expect(readme).toMatch(/\.env\.example|\.env\b/i)
    // Motores de BD
    expect(readme).toMatch(/MySQL|H2/i)
  })

  test('Existen archivos .env.example en frontend y backend', async () => {
    const repoRoot = path.resolve(__dirname, '..', '..', '..', '..')
    const fe = path.join(repoRoot, 'frontend', '.env.example')
    const be = path.join(repoRoot, 'backend', '.env.example')
    await expect(fs.access(fe)).resolves.toBeUndefined()
    await expect(fs.access(be)).resolves.toBeUndefined()
  })
})
