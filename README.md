# React from Angular
How to use React for Angular Developers

## Introduction

This repo is a step by step guide for developers who want to learn React that come from an Angular background. This is a very simple React site that will compare and contrast how the same might be achieved with Angular.

I am still a new React developer so I am writing this from the perspective of someone who might be intimidated by how to move to React from Angular, or might not have the time to find a barebones to the point tutorial.

Each step in this tutorial will be linked with a specific commit to the repo, so just pull that commit to follow along. Let's get to it!

### Boilerplate

Love it or hate it, build systems and their hundreds of MB `node_modules` folder are the standard so I've included a boilerplate to start from. If you want to build one from scratch, go ahead, but this one's on the house. It includes a lean React starter kit with Gulp, Webpack and Babel handling the heavy lifting (thanks [Dane](https://github.com/danehansen/react-boilerplate)). Just embrace it ok?

The gulpfile is a little forward thinking, but it has what you need to use ES6 and React in older browsers. To get the project started, navigate to the directory and run `npm install`. You'll need to have Node, npm and gulp installed globally. The boilerplate runs dependably on `node v4.2.6` and `npm 2.14.12`. So if you're having problems, start there. Ignore the gulpfile, just know that `gulp dev` fires up a watcher and a server, and `gulp dist` preps the app for production.

Here's the directory structure of your app:

```
|-- app
    |-- images
        |-- react.png
    |-- js
        |-- display
            |-- App.js
        |-- Globals.js
        |-- index.js
    |-- scss
        |-- _App.scss
        |-- _reset.scss
        |-- global.scss
    |-- index.html
```

Let's see how it all works shall we?

The app starts at `/app/js/index.js` as indicated in the webpack configuration in our gulp file. Here's `index.js` in all its glory:

```javascript
import App from 'display/App';
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(<App/>, document.getElementById('App'));
```

`App` is loaded from the file `App.js` in the `display` folder, and `React` and `ReactDOM` are dependencies. The last line of the file is how React gets rendered on the page. Nothing to really 'learn' for this file, just follow this pattern. So, let's follow the tree up and see what `App.js` has in store.

```JSX
import Globals from 'Globals';
import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className='App'>
        <img src='/images/react.png'/>
        <p>React from Angular Boilerplate Success</p>
      </div>
    );
  }
}

export default App;
```

You be saying to yourself 'WTF? I thought JavaScript faked classes?' and 'What the shit is HTML doing in JavaScript?'. Well whatever man, ES6 has classes and that HTML shit is JSX so stop complaining and let's do this. 

`Globals` is just a js file used to track global variables without polluting global scope. `React` is React. The class syntax in React follows the pattern above. Not hard, just do it. Constructor method receives props, then call super with the props argument and voila, you've got `React` methods available in your class.

Then you've got your `render()` method. **This method is the only thing required in a React component.**. That's important. Put a parenthesis around your JSX as a return value and that will be exported as a component. You can put whatever you want in that render method, it doesn't need to start with `return(` but it just normally does for whatever reason.

Then you export the component for `import` in other files with the final line `export default App;`.

That was easy! Sorry, no Angular comparisons yet. We'll get there though.
