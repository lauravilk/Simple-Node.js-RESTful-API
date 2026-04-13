const express = require('express');
const exphbs = require('express-handlebars');
const crypto = require('crypto');

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// database
let recipes = [
    {  
        id: crypto.randomUUID(),
        name: 'Spaghetti',
        servings: 4,
        difficulty: 'easy',
        time: 30
    },
    {
        id: crypto.randomUUID(),
        name: 'Chicken Soup',
        servings: 2,
        difficulty: 'hard',
        time: 45
    },
    {
        id: crypto.randomUUID(),
        name: 'fish tacos',
        servings: 3,
        difficulty: 'medium',
        time: 20
    }
]

// default layout
app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

// static files
app.use(express.static('public'));

// home root
app.get('/', (req,res) => {
    res.render('index', {
        title: "My recipes",
        recipes
    })
})


// Route to get all recipes
app.get('/api/recipes', (req, res) => {
    res.status(200).json({
        status: 'success',
        results: recipes.length,
        data: recipes
    });
});

// Route to get one recipe
app.get('/api/recipes/:name', (req, res) => {
    const name = req.params.name;
    const recipe = recipes.find(recipe => recipe.name === name);

    if (recipe) {
        res.json(recipe);
    }
    else
    {
        res.status(404).json({
            msg: 'Not found'
        })
    }
})

// Route to create a recipe
app.post('/api/recipes', (req, res) => {

    if (req.body.name && req.body.servings) {
        const newID = crypto.randomUUID();
        //console.log(newID);

        const newRecipe = {
            id: newID,
            name: req.body.name,
            servings: req.body.servings,
            difficulty: req.body.difficulty,
            time: req.body.time
        }

        recipes.push(newRecipe);
        const url = `${req.protocol}://${req.get('host')}${req.originalUrl}${newID}`;

        res.location(url);
        res.status(201).json(newRecipe)
    }
    else
    {
        res.status(400).json({
            msg: 'name and servings are required'
        })
    }
});






const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));