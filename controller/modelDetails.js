export const models = [
    { id: "gpt-3.5-turbo", name: "GPT-3.5" }, 
    { id: "gpt-4-1106-preview", name: "GPT-4 Turbo"}
]

export const defaultModel = 'gpt-4-1106-preview'

export const getModelNameById = (id) => {
    const found = models.find(model => model.id === id)
    if (!found) return false
    return found.name
}

export const getModelById = (id) => {
    const found = models.find(model => model.id === id)
    if (!found) return false
    return found
}