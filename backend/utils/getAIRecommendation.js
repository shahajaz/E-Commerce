// export async function getAIrecommendation(req, res, userPrompt, products) {
//     const API_KEY = process.env.GEMINI_API_KEY;
//     const URL = `https://generativelanguage.googleapis.com/v1beta2/models/gemini-1.5-pro:generateContent?key=${API_KEY}`;

//     try{
//         const geminiPrompt = `
//         Here is a list of products with their details:
//         ${JSON.stringify(products, null, 2)}

//         Based on the above products, please provide a recommendation for the user based on their prompt: "${userPrompt}"

//         Only return the matching products in JSON format.
//         `;

//         const response = await fetch(URL, {
//             method: 'POST',
//             headers: {"Content-Type": "application/json"},
//             body: JSON.stringify({
//                 contents: [{
//                     parts: [
//                         { text: geminiPrompt }]}],
//             }),
//         });

//         const data = await response.json();

//         const aiResponseText = data?.candidates?.[0]?.content?.parts?.text?.trime() || "";

//         const cleanedText = aiResponseText.replace(/```json```/g, '').trim();

//         if(!cleanedText) {
//             return res.status(500).json({success: false, message: "AI response is empty or invalid."});
//         }

//         let parseProducts;
//         try{
//             parseProducts = JSON.parse(cleanedText);
//         }
//         catch (error) {
//             return res.status(500).json({success: false, message: "Failed to parse AI response as JSON.",});
//         }
//         return {success: true, products: parseProducts};

//     }
//     catch (error) {
//         res.status(500).json({success: false, message: "Internal server error."})
//     }
// }


export async function getAIrecommendation(
    req,
    res,
    userPrompt,
    products
) {
    const API_KEY = process.env.GEMINI_API_KEY;

    const URL =
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${API_KEY}`;

    try {

        const geminiPrompt = `
        Here is a list of products with their details:

        ${JSON.stringify(products, null, 2)}

        Based on the above products,
        recommend products according to this user prompt:

        "${userPrompt}"

        IMPORTANT:
        - Return ONLY valid JSON
        - Do not return markdown
        - Do not use \`\`\`json
        - Return an array of matching products
        `;

        const response = await fetch(URL, {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: geminiPrompt,
                            },
                        ],
                    },
                ],
            }),
        });

        const data = await response.json();

        // ✅ Correct Response Access
        const aiResponseText =
            data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

        // ✅ Remove markdown if exists
        const cleanedText = aiResponseText
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        if (!cleanedText) {
            return {
                success: false,
                products: [],
            };
        }

        let parsedProducts;

        try {
            parsedProducts = JSON.parse(cleanedText);
        }

        catch (error) {
            console.log("JSON Parse Error:", error);

            return {
                success: false,
                products: [],
            };
        }

        return {
            success: true,
            products: parsedProducts,
        };

    }

    catch (error) {

        console.log("Gemini Error:", error);

        return {
            success: false,
            products: [],
        };
    }
}