const form = document.getElementById('ideaForm')
const promptInput = document.getElementById('customPrompt')
const resultEl = document.getElementById('result')
const resultCard = document.getElementById('resultCard')
const generateBtn = document.getElementById('generateBtn')
const inspireBtn = document.getElementById('inspireBtn')
const btnLabel = generateBtn.querySelector('.btn-label')
const btnLoader = generateBtn.querySelector('.btn-loader')

const samplePrompts = [
  'A playful financial planning companion for first-time founders that gamifies cashflow discipline.',
  'A community-driven wellness app for remote product teams blending async rituals with mood analytics.',
  'A local discovery app for eco-conscious travelers seeking regenerative tourism experiences.',
  'A productivity co-pilot that pairs ADHD-friendly workflows with ambient focus soundscapes.',
  'An AI mentor that guides indie hackers from idea validation to first 100 paying users.'
]

function setLoading(isLoading) {
  generateBtn.disabled = isLoading
  btnLabel.textContent = isLoading ? 'Generating...' : 'Generate Masterplan'
  btnLoader.classList.toggle('visible', isLoading)
}

function formatIdeaText(raw) {
  if (!raw) return ''
  return raw
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      if (/^\d+\./.test(line) || /^[-•]/.test(line)) {
        return `<li>${line.replace(/^\d+\.\s*|^[-•]\s*/, '')}</li>`
      }
      if (/^App Name/i.test(line)) {
        return `<h3>${line}</h3>`
      }
      return `<p>${line}</p>`
    })
    .join('')
    .replace(/(<li>.*?<\/li>)+/gs, match => `<ul>${match}</ul>`)
}

function showResult(content) {
  resultCard.classList.add('active')
  resultEl.innerHTML = content
}

async function generateIdea(event) {
  event.preventDefault()
  const customPrompt = promptInput.value.trim()

  if (!customPrompt) {
    promptInput.focus()
    resultEl.innerHTML = '<p class="error">Please describe the app idea first.</p>'
    resultCard.classList.add('active')
    return
  }

  try {
    setLoading(true)
    resultEl.innerHTML = '<p class="muted">Hang tight, crafting your idea...</p>'
    const response = await fetch('/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customPrompt })
    })

    const data = await response.json()
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Unexpected error occurred.')
    }

    showResult(formatIdeaText(data.idea))
  } catch (error) {
    showResult(`<p class="error">${error.message}</p>`)
  } finally {
    setLoading(false)
  }
}

function fillRandomPrompt() {
  const random = samplePrompts[Math.floor(Math.random() * samplePrompts.length)]
  promptInput.value = random
  promptInput.focus()
}

form.addEventListener('submit', generateIdea)
inspireBtn.addEventListener('click', fillRandomPrompt)

