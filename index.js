const express = require('express');
const exphbs = require('express-handlebars');

// database
let recipes = [
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

// Route to update a recipe

// route to delete a recipe




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));