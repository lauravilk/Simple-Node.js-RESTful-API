const express = require('express');
const exphbs = require('express-handlebars');
const crypto = require('crypto');

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// database
let recipes = [
    {  
        id: 1,
        name: 'Spaghetti',
        servings: 4,
        difficulty: 'easy',
        time: 30,
        ingredients: ['spaghetti', 'tomato sauce', 'ground beef', 'onion']
    },
    {
        id: 2,
        name: 'Chicken Soup',
        servings: 2,
        difficulty: 'hard',
        time: 45,
        ingredients: ['chicken', 'carrots', 'onion']
    },
    {
        id: 3,
        name: 'Fish tacos',
        servings: 3,
        difficulty: 'medium',
        time: 20,
        ingredients: ['fish', 'tortillas', 'cabbage', 'lime']
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
        const newID = recipes[recipes.length-1].id +1;
        //console.log(newID);

        const newRecipe = {
            id: newID,
            name: req.body.name,
            servings: req.body.servings,
            difficulty: req.body.difficulty,
            time: req.body.time,
            ingredients: req.body.ingredients
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

// Route to update a recipe
app.patch('/api/recipes/:id', (req, res) => {
    const id = Number(req.params.id);

    const recipe = recipes.find(recipe => recipe.id === id);

    if (recipe) {
        recipes.forEach(recipe => {
            if (recipe.id === id) {
                recipe.name = req.body.name;
                recipe.servings = req.body.servings;
                recipe.difficulty = req.body.difficulty;
                recipe.time = req.body.time;
                recipe.ingredients = req.body.ingredients;
            }
        });

        const updatedRecipe = {
            id,
            name: req.body.name,
            servings: req.body.servings,
            difficulty: req.body.difficulty,
            time: req.body.time,
            ingredients: req.body.ingredients
        }

        res.status(200).json(updatedRecipe)
    }   
    else
    {
        res.status(404).json({
            msg: 'Could not update the recipe'
        })
    }
});

// route to delete a recipe
app.delete('/api/recipes/:id', (req, res) => {
    const idToRemove = Number(req.params.id);
    const recipe = recipes.find(recipe => recipe.id === idToRemove);

    if (recipe) {
        recipes = recipes.filter(recipe => recipe.id !== idToRemove);
        res.status(200).json({
            id: idToRemove,
            msg: 'Recipe deleted'
        });
    }
    else {
        res.status(404).json({
            msg: 'Not found'
        });
    }
});

app.use((req, res, next) => {
    res.status(404).send("Page not found");
});




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));