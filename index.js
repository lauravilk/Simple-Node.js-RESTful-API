const express = require('express');
const exphbs = require('express-handlebars');

// database
let recepies = [
    {
        name: 'Spaghetti',
        servings: 4,
        difficulty: 'easy',
        time: 30
    },
    {
        name: 'Chicken Soup',
        servings: 2,
        difficulty: 'hard',
        time: 45
    },
    {
        name: 'fish tacos',
        servings: 3,
        difficulty: 'medium',
        time: 20
    }
]

const app = express()

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));