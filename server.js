import express from 'express'
import Openai from 'openai'
import * as dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
dotenv.config()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// PORT
const PORT = process.env.PORT || 5000
// authenticate with OpenAI
const openai = new Openai({
    apiKey:process.env.OPENAI_API_KEY
})

//Pass incoming data & serve static assets
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

//Route: Generate app idea
app.post('/generate', async(req, res) => {
    try {
        //Extract the custom prompt from the request body
        const {customPrompt} = req.body
        //validations
        //we want to make sure that the user isn't providing an empty prompt
        if(!customPrompt || !customPrompt.trim()){
            // return 400
            return res.status(400).json({
                success:false,
                error:'Please provide a prompt'
            })
        }
        // Build the complete prompt by adding structure instructions to user's input 
        const prompt = `${customPrompt}
        Please provide a comprehensive app idea with the following detail
        1. App Name (creative and catchy)
        2. One-line Description 
        3. Target Audience
        4. Core Features (list 3-5 key features)
        5. Unique Value Proposition
        6. Monetization Strategy
        7. Technology Stack Suggestions

        Format the response in a clear, structured way.
                    `
        // Call OpenAI API to generate the app idea
        const response = await openai.chat.completions.create({
            model:'gpt-4o-mini',
            messages:[{
                role:'system',
                content: 'You are a creative product manager and entrepreneur who generates innovative, practical, and unique app ideas. Your ideas are well-thought-out and consider market viability. Always provide detailed, structured response.',
            },{
                role:'user',
                content:prompt
            }],
            temperature:0.9,
            max_tokens:1000
        })
        const idea = response.choices[0].message.content
        res.json({
            success:true,
            idea,
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            error:error.message
        })
    }
})

// start the server 
app.listen(PORT, () => {
    console.log(`App idea generator is running at http://localhost:${PORT}`)
})